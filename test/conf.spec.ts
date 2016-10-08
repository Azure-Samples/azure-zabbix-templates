import { Conf } from "../lib/conf";

describe("Conf load", function () {
    it("test1", function () {
        let conf = {
            "virtualMachines": {
                "test1": {
                    "resourceId": "r1",
                    "diagnosticConfig": "diag1"
                },
                "test2": {
                    "resourceId": "r2",
                    "diagnosticConfig": "diag1"
                }
            },
            "connectionStrings": {
                "diag1": "d2"
            }
        };

        let list = Conf.Parse(conf).vms;
        expect(list["test1"].resourceId).toBe("r1");
        let test2 = list["test2"];
        expect(test2.resourceId).toBe("r2");
    });

    it("test invalid", function () {
        let conf = {
            "virtualMachines": {
                "test1": {
                    "resourceId": "r1",
                    "diagnosticConfig": "diag8"
                },
            },
            "connectionStrings": {
                "diag1": "d2"
            }
        };
        expect(function () { Conf.Parse(conf); }).toThrow("Error: diag8 not found.");
    });
});
