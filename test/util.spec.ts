import { Util } from "../lib/util";

describe("Util test", function () {
    it("test convert", function () {
      expect(Util.GetRowKeyTick(new Date("2016-10-11T05:49:00.000Z"))).toBe("2519261358599999999");
      expect(Util.GetRowKeyTick(new Date("2016-10-11T05:50:00.000Z"))).toBe("2519261357999999999");
      expect(Util.GetRowKeyTick(new Date("2016-10-11T07:33:00.000Z"))).toBe("2519261296199999999");
    });
});
