import fs = require("fs");

interface Connection {
    connectionString: string;
}

export interface Vm {
    name: string;
    resourceId: string;
    connection: Connection;
}

interface VmDic {
    [name: string]: Vm;
}

export interface MdConf {
    vms: VmDic;
}

export class Conf {
    static Parse(conf: any): MdConf {
        let vms: VmDic = {};
        let conDic: any = {};
        let connectionStrings = conf.connectionStrings;
        for (let key in connectionStrings) {
            const con = { connectionString: connectionStrings[key] };
            conDic[key] = con;
        }

        let vmm = conf.virtualMachines;
        for (let key in vmm) {
            let vm = vmm[key];
            let connectionId = vm.diagnosticConfig;
            if (!conDic.hasOwnProperty(connectionId)) {
                throw `Error: ${connectionId} not found.`;
            }

            const vm1: Vm = { name: key, resourceId: vm.resourceId, connection: conDic[connectionId] };
            vms[key] = vm1;
        }

        return { vms: vms };
    }

    static Load(path: string): MdConf {
        fs.statSync(path);
        return Conf.Parse(require(path));
    }
}