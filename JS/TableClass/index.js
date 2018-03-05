import './style.css';
import PresentData from './presentdata.js';

var data = require('./test_data.json'),
	pd = new PresentData();

pd.setData(data);
pd.setHead(['device', 'id']);
pd.render();