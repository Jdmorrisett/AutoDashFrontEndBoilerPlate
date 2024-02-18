"use strict";
import { DATA_MAP, WARNING_KEYS } from "./js/common/dataMap";
import tachometer from "./js/tachometer";
const dataWorker = new Worker(
    new URL("./js/comms/drawDataWorker.js",
        import.meta.url)
);

let updateData = []; // TODO: make this a typed array?  try transfer data in worker?
let readyForData = true;
let isCommError = false; // True if there is an issue communicating with ECU server 

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
    tachometer.update(updateData[DATA_MAP.RPM.id], isCommError);

    //update the info with RPM data
    let info = document.getElementById("info");
    info.innerHTML = `RPM: ${updateData[DATA_MAP.RPM.id]}`;
    // info.innerHTML += `<br>Speed: ${updateData[DATA_MAP.SPEED.id]}`;
    info.innerHTML += `<br>Throttle: ${updateData[DATA_MAP.PEDAL_POSITION.id]}`;
    info.innerHTML += `<br>Engine Temp: ${updateData[DATA_MAP.CTS.id]}`;
    info.innerHTML += `<br>Oil Pressure: ${updateData[DATA_MAP.OIL_PRESSURE.id]}`;
    info.innerHTML += `<br>Fuel Level: ${updateData[DATA_MAP.FUEL_LEVEL.id]}`;
    info.innerHTML += `<br>Volts: ${updateData[DATA_MAP.BATT_VOLTAGE.id]}`;
    info.innerHTML += `<br>Warnings: ${updateData[DATA_MAP.WARNINGS.id]}`;


    // request another update frame
    requestAnimationFrame(tick);
};

const initializeApp = () => {
    // start worker thread! (this lil thing gets the data that is sent from the AutoDashBackEnd)
    dataWorker.postMessage({ msg: "start" });

    // start up our tach
    tachometer.initialize();

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