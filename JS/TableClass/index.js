import './style.css';
import PresentData from './presentdata.js';

var data = require('./test_data.json'),
	pd = new PresentData();

pd.setData(data);
pd.setHead(['reg_number', 'device', 'ignition', 'speed', 'fuel_level', 'mileage']);
pd.render();