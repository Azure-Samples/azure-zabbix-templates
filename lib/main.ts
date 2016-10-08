import { MdConf, Conf } from './conf';
import { Util } from './util';
import { Diag } from './diag';

const argv = require('minimist')(process.argv.slice(2));
const confPath = argv['c'] || __dirname + '/conf.json';

const conf = Conf.Load(confPath);
let action = 'help';
if (argv['_'].length > 0) {
    action = argv['_'][0];
}

switch (action) {
    case 'discovery':
        console.log(JSON.stringify(Util.GetDiscoveryFromConf(conf)));
        break;
    case 'query':
        const vmName = argv['s'];
        const vm = conf.vms[vmName];
        if (!vm) {
            throw `${vmName} not in supported list`;
        }

        const diag = new Diag(vm);
        diag.query().catch(function(err){
            console.log("err:" + err);
        });

        break;
    case 'help':
    default:
        console.log("node run.js <help|discovery|query> [-c conf.json] [-s vmName]");
}
