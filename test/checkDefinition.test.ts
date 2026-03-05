import {Zcl} from "@willieee802/zigbee-herdsman";
import {describe, it} from "vitest";
import * as fz from "../src/converters/fromZigbee";
import {fzLocal} from "../src/devices/smartthings";
import {repInterval} from "../src/lib/constants";
import {assertDefinition, mockDevice, reportingItem} from "./utils";

describe("Check definition", () => {
    it("IM6001-MPP01", async () => {
        await assertDefinition({
            device: mockDevice({
                modelID: "multi",
                // manuSpecificSamsungAccelerometer 自定义簇已经从 zigbee-herdsman 移到本项目，
                // 这里直接使用簇 ID，避免通过 zigbee-herdsman 的 Clusters 查找它。
                endpoints: [{ID: 1, inputClusterIDs: [0x0402, 0x0001, 0xfc02, 0x0020]}],
            }),
            meta: undefined,
            fromZigbee: [fz.temperature, fz.battery, fz.ias_contact_alarm_1, fzLocal.acceleration],
            toZigbee: [],
            exposes: ["battery", "battery_low", "contact", "moving", "tamper", "temperature", "x_axis", "y_axis", "z_axis"],
            bind: {1: ["msTemperatureMeasurement", "genPowerCfg", "manuSpecificSamsungAccelerometer"]},
            read: {1: [["genPowerCfg", ["batteryPercentageRemaining"]]]},
            write: {
                1: [
                    ["manuSpecificSamsungAccelerometer", {0: {value: 0x14, type: 0x20}}, {manufacturerCode: Zcl.ManufacturerCode.SAMJIN_CO_LTD}],
                    ["genPollCtrl", {checkinInterval: 14400}],
                ],
            },
            configureReporting: {
                1: [
                    ["msTemperatureMeasurement", [reportingItem("measuredValue", 10, repInterval.HOUR, 100)]],
                    ["genPowerCfg", [reportingItem("batteryPercentageRemaining", repInterval.HOUR, repInterval.MAX, 0)]],
                    [
                        "manuSpecificSamsungAccelerometer",
                        [reportingItem("acceleration", 10, repInterval.HOUR, 5)],
                        {manufacturerCode: Zcl.ManufacturerCode.SAMJIN_CO_LTD},
                    ],
                    [
                        "manuSpecificSamsungAccelerometer",
                        [reportingItem("xAxis", 10, repInterval.HOUR, 5)],
                        {manufacturerCode: Zcl.ManufacturerCode.SAMJIN_CO_LTD},
                    ],
                    [
                        "manuSpecificSamsungAccelerometer",
                        [reportingItem("yAxis", 10, repInterval.HOUR, 5)],
                        {manufacturerCode: Zcl.ManufacturerCode.SAMJIN_CO_LTD},
                    ],
                    [
                        "manuSpecificSamsungAccelerometer",
                        [reportingItem("zAxis", 10, repInterval.HOUR, 5)],
                        {manufacturerCode: Zcl.ManufacturerCode.SAMJIN_CO_LTD},
                    ],
                ],
            },
        });
    });
});
