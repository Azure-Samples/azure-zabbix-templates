import fs = require("fs");

export interface MdState {
    lastUpdate?: number;
}

export class State {
    private static stateDir: string = ".state";
    private basePath: string;

    constructor(path: string) {
        this.basePath = path + "/" + State.stateDir;
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath);
        }
    }

    LoadState(vmName: string): MdState {
        let conf: MdState;
        let path = this.basePath + "/" + vmName + ".json";

        if (fs.existsSync(path)) {
            try {
                conf = require(path);
            } catch (ex) {
                console.error("Warning: invalid state file.");
                console.error(ex);
            }
        }
        if (!conf) {
            let st = new Date();
            // st.setDate(st.getDate() - 1);
            st.setMinutes(st.getMinutes() - 2);
            conf = { lastUpdate: st.getTime() };
        }

        return conf;
    }

    SaveState(vmName: string, state: MdState): void {
        let path = this.basePath + "/" + vmName + ".json";
        fs.writeFileSync(path, JSON.stringify(state));
    }
}

/*
class StateService {
    private static loadDayRange: number = 1;
    private path: string;
    private state: MdState;

    constructor(path: string) {
        this.path = path;
        this.state = Conf.LoadState(path);
    }

    private get(vmName: string): number{
        let ret = 0;
        if (this.state[vmName]){
            ret = this.state[vmName];
        } else {
            let st = new Date();
            st.setDate(st.getDate() - 1);
            ret = st.getTime();

            this.state[vmName] = ret;
            this.save();
        }

        return ret;
    }

    private save() {
        Conf.SaveState(this.path, this.state);
    }
}
*/