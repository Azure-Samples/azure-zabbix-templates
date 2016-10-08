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
}