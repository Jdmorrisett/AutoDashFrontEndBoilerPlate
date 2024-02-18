export default function createGauge(container, name, range, warning, critical) {
    const gaugeContainer = document.createElement('div');
    gaugeContainer.classList.add('gauge');
    container.appendChild(gaugeContainer);

    const gaugeValue = document.createElement('div');
    // set an initial value
    gaugeValue.innerText = "0.0";
    gaugeValue.classList.add('value');
    gaugeContainer.appendChild(gaugeValue);

    const gaugeLabel = document.createElement('div');
    gaugeLabel.classList.add('label');
    gaugeLabel.innerText = name;
    gaugeContainer.appendChild(gaugeLabel);

    function updateValue(value, precision = 0) {
        const roundedValue = Number(value.toFixed(precision)).toString();
        gaugeValue.innerText = roundedValue;
        updateColor(roundedValue);
    }

    function updateColor(value) {
        if (critical && (value >= critical.lower && value <= critical.upper)) {
            gaugeContainer.style.color = 'red';
        } else if (warning && (value >= warning.lower && value <= warning.upper)) {
            gaugeContainer.style.color = 'orange';
        } else {
            gaugeContainer.style.color = 'white';
        }
    }

    return {
        updateValue: updateValue
    };
}


// // Reusable gauge module
// function createGauge(containerId, name, range, warning, critical) {
//     const gaugeContainer = document.getElementById(containerId);
//     const gaugeValue = gaugeContainer.querySelector('.value');
//     const gaugeLabel = gaugeContainer.querySelector('.label');

//     function updateValue(value) {
//         gaugeValue.innerText = value;
//         updateColor(value);
//     }

//     function updateColor(value) {
//         if (critical && (value >= critical.lower && value <= critical.higher)) {
//             gaugeContainer.style.color = 'red';
//         } else if (warning && (value >= warning.lower && value <= warning.upper)) {
//             gaugeContainer.style.color = 'orange';
//         } else {
//             gaugeContainer.style.color = 'white';
//         }
//     }

//     // Initialization
//     gaugeLabel.innerText = name;

//     return {
//         updateValue: updateValue
//     };
// }

// // Example usage
// const mphGauge = createGauge('mphGauge', 'MPH', { lower: 0, upper: 120 });
// const tachGauge = createGauge('tachGauge', 'Tach', { lower: 0, upper: 8000 }, { lower: 6000, upper: 7000 }, { lower: 7000, upper: 8000 });
// const oilPressureGauge = createGauge('oilPressureGauge', 'Oil Pressure', { lower: 0, upper: 100 }, { lower: 30, upper: 60 }, { lower: 10, upper: 100 });
// const engineTempGauge = createGauge('engineTempGauge', 'Engine Temp', { lower: 0, upper: 250 }, { lower: 200, upper: 250 }, { lower: 220, upper: 250 });
// const fuelPressureGauge = createGauge('fuelPressureGauge', 'Fuel Pressure', { lower: 0, upper: 60 }, { lower: 20, upper: 40 }, { lower: 10, upper: 60 });

// // Update values (use real-time data or simulated data)
// mphGauge.updateValue(65);
// tachGauge.updateValue(4000);
// oilPressureGauge.updateValue(45);
// engineTempGauge.updateValue(220);
// fuelPressureGauge.updateValue(30);