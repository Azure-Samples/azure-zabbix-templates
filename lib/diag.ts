import { Vm } from './conf';
import { State } from './state';
// import { TableService, TableQuery } from "azure-storage";
import { Promise } from 'es6-promise';
const azure = require('azure-storage');

interface TableService {
  listTablesSegmentedWithPrefix: any;
  queryEntities: any;
}

interface TableQuery {
  top: any;
}

interface SVal {
  _: any;
}

interface Entry {
  CounterName: SVal;
  Last: SVal;
  TIMESTAMP: SVal;
}

export class Diag {
  private vm: Vm;
  private ts: TableService;
  private st: State;

  constructor(vm: Vm) {
    this.vm = vm;
    this.ts = azure.createTableService(this.vm.connection.connectionString);
    this.st = new State(__dirname);
  }

  query(): Promise<void> {
    const _this = this;
    return this.getTableNames()
      .then(function (tables) {
        let list = [];
        for (let table of tables) {
          list.push(Diag.queryTable(_this.ts, table, _this.vm, _this.st));
        }
        return Promise.all(list);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  private static queryTable(ts: TableService, tableName: string, vm: Vm, st: State): Promise<any> {
    let s1 = st.LoadState(vm.name);
    let dt = new Date(s1.lastUpdate).toISOString();

    const partitionKey: string = Diag.getEscapedString(vm.resourceId);
    const query: TableQuery = new azure.TableQuery();
    query
      .top(768)
      .where('PartitionKey eq ? and Timestamp gt datetime?', partitionKey, dt);

    return Diag.queryTableOne(ts, tableName, query, null).then(function (list) {
      console.error(list.length);
      let el: Entry[] = list;
      el.map(function (entry) {
        return Diag.item2str(vm.name, entry);
      }).map(function (d) { console.log(d); });
    });
  }

  private static item2str(vmName: string, entry: Entry) {
    let value = entry.Last._;
    if (typeof value === 'string') {
      value = `"${value}"`;
    }
    let ts = entry.TIMESTAMP._.getTime() / 1000;
    let counter: string = entry.CounterName._;
    counter = counter.replace(/\\/g, "_");

    return `- azure.monitoring.vm.${counter}[${vmName}] ${ts} ${value}`;
  }

  private static queryTableOne(ts: TableService, tableName: string, query: TableQuery, token: any): Promise<any[]> {
    return new Promise<any[]>(function (resolve, reject) {
      ts.queryEntities(tableName, query, token, function (err, result) {
        if (err) {
          reject(err);
          return;
        }

        console.error("In one, get:" + result.entries.length);
        if (result.continuationToken == null) {
          resolve(result.entries);
        } else {
          console.error("Continued-");
          resolve(Diag.queryTableOne(ts, tableName, query, result.continuationToken)
            .then<any[]>(function (list) {
              return result.entries.concat(list);
            }));
        }
      });
    });
  }

  private static showEntity(entity: any) {
    console.log(JSON.stringify(entity));
    console.log(`${entity.Timestamp._}, ${entity.CounterName._}`);
    console.log(typeof (entity.Timestamp._));
  }

  private static getEscapedString(input: string): string {
    return input.replace(/\//g, ":002F").replace(/-/g, ":002D").replace(/\./g, ":002E");
  }

  private getTableNames(): Promise<string[]> {
    const prefix = "WADMetricsPT1MP10DV2S";
    const ts = this.ts;
    return new Promise<string[]>(function (resolve, reject) {
      ts.listTablesSegmentedWithPrefix(prefix, null, function (err, result) {
        if (err) {
          reject(err);
          return;
        }

        resolve(result.entries);
      });
    });
  }
}