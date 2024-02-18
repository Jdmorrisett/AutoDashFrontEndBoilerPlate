// Example usage
const dashboardContainer = document.getElementById('dashboardContainer');

// Create gauges dynamically
const mphGauge = createGauge(dashboardContainer, 'MPH', { lower: 0, upper: 120 }, { lower: 70, upper: 180 });
const tachGauge = createGauge(dashboardContainer, 'Tach', { lower: 0, upper: 8000 }, { lower: 4800, upper: 5800 }, { lower: 5801, upper: 8000 });
const oilPressureGauge = createGauge(dashboardContainer, 'Oil Pressure', { lower: 0, upper: 100 }, { lower: 55, upper: 64 }, { lower: 65, upper: 150 });
const engineTempGauge = createGauge(dashboardContainer, 'Engine Temp', { lower: 0, upper: 280 }, { lower: 0, upper: 120 }, { lower: 220, upper: 280 });
const fuelPressureGauge = createGauge(dashboardContainer, 'Fuel Pressure', { lower: 0, upper: 120 }, { lower: 0, upper: 48 }, { lower: 70, upper: 120 });
const voltageGauge = createGauge(dashboardContainer, 'Voltage', { lower: 0, upper: 18 }, { lower: 0, upper: 11 }, { lower: 15, upper: 18 });

// Update values (use real-time data or simulated data)
mphGauge.updateValue(75);
tachGauge.updateValue(5000);
oilPressureGauge.updateValue(45);
engineTempGauge.updateValue(220);
fuelPressureGauge.updateValue(30.0);
voltageGauge.updateValue(14.4);