import { MdConf } from "./conf";

export interface IDiscoveryResult {
  data: Array<any>;
}

export class Util {
  static GetDiscoveryFromConf(conf: MdConf): IDiscoveryResult {
    let list: any = [];
    for (let vmName in conf.vms) {
      list.push({
        "{#VMNAME}": vmName,
      });
    }

    return { data: list };
  }

  static GetRowKeyTick(time: Date): string {
    const dt = 253402300799999 - time.getTime();
    let result = dt.toString() + "9999";
    while (result.length < 19) {
      result = "0" + result;
    }

    return result;
  }
}