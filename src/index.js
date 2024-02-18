"use strict";
import { DATA_MAP, WARNING_KEYS } from "./js/common/dataMap";
// import tachometer from "./js/tachometer";
import createGauge from "./gauge"; // Assuming you have the createGauge function in the gauge.js file

console.log("Hello from index.js");

const dataWorker = new Worker(
    new URL("./js/comms/drawDataWorker.js",
        import.meta.url)
);

let updateData = []; // TODO: make this a typed array?  try transfer data in worker?
let readyForData = true;
let isCommError = false; // True if there is an issue communicating with ECU server 

const dashboardContainer = document.getElementById('dashboardContainer');
console.log(`This is it! ${dashboardContainer}`);

// Create gauges dynamically
const mphGauge = createGauge(dashboardContainer, 'MPH', { lower: 0, upper: 220 }, { lower: 0, upper: 120 }, { lower: 70, upper: 180 });
const tachGauge = createGauge(dashboardContainer, 'Tach', { lower: 0, upper: 8000 }, { lower: 4800, upper: 5800 }, { lower: 5801, upper: 8000 });
const oilPressureGauge = createGauge(dashboardContainer, 'Oil Pressure', { lower: 0, upper: 100 }, { lower: 55, upper: 64 }, { lower: 65, upper: 150 });
const engineTempGauge = createGauge(dashboardContainer, 'Engine Temp', { lower: 0, upper: 280 }, { lower: 0, upper: 120 }, { lower: 220, upper: 280 });
const fuelPressureGauge = createGauge(dashboardContainer, 'Fuel Pressure', { lower: 0, upper: 120 }, { lower: 0, upper: 48 }, { lower: 70, upper: 120 });
const voltageGauge = createGauge(dashboardContainer, 'Voltage', { lower: 0, upper: 18 }, { lower: 0, upper: 11 }, { lower: 15, upper: 18 });
// Add more gauges as needed

const tick = () => {
    if (readyForData) {
        dataWorker.postMessage({
            msg: "process_update_data",
            updateData: updateData,
        });
        readyForData = false;
    }

    // determine if we are still in communication with our server
    isCommError = getWarningLight(WARNING_KEYS.COMM_ERROR);

    // update stuff
    // tachometer.update(updateData[DATA_MAP.RPM.id], isCommError);

    // Update gauges
    tachGauge.updateValue(updateData[DATA_MAP.RPM.id], 0);
    oilPressureGauge.updateValue(updateData[DATA_MAP.OIL_PRESSURE.id], 1);
    engineTempGauge.updateValue(updateData[DATA_MAP.CTS.id], 0);
    fuelPressureGauge.updateValue(updateData[DATA_MAP.FUEL_LEVEL.id], 1);
    voltageGauge.updateValue(updateData[DATA_MAP.BATT_VOLTAGE.id], 1);

    // //update the info with RPM data
    // let info = document.getElementById("info");
    // info.innerHTML = `RPM: ${updateData[DATA_MAP.RPM.id]}`;
    // // info.innerHTML += `<br>Speed: ${updateData[DATA_MAP.SPEED.id]}`;
    // info.innerHTML += `<br>Throttle: ${updateData[DATA_MAP.PEDAL_POSITION.id]}`;
    // info.innerHTML += `<br>Engine Temp: ${updateData[DATA_MAP.CTS.id]}`;
    // info.innerHTML += `<br>Oil Pressure: ${updateData[DATA_MAP.OIL_PRESSURE.id]}`;
    // info.innerHTML += `<br>Fuel Level: ${updateData[DATA_MAP.FUEL_LEVEL.id]}`;
    // info.innerHTML += `<br>Volts: ${updateData[DATA_MAP.BATT_VOLTAGE.id]}`;
    // info.innerHTML += `<br>Warnings: ${updateData[DATA_MAP.WARNINGS.id]}`;


    // request another update frame
    requestAnimationFrame(tick);
};

const initializeApp = () => {
    // start worker thread! (this lil thing gets the data that is sent from the AutoDashBackEnd)
    dataWorker.postMessage({ msg: "start" });

    // start up our tach
    // tachometer.initialize();

    // start up update loop (responsible for updating the graphic positions!)
    tick();
};

const getWarningLight = (warningKey) => {
    return !!(updateData[DATA_MAP.WARNINGS.id] & (128 >> warningKey % 8))
}

dataWorker.onmessage = (event) => {
    switch (event.data.msg) {
        case "update_data_ready":
            try {
                // data is ready, do the animation and request another update frame
                updateData = event.data.updateData;
                readyForData = true;
            } catch (error) {
                console.error(error);
            }

            break;
        case "error":
            // if you want some error handling
            break;
    }
};

initializeApp();

module.exports = {};