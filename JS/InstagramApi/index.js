import './style.css';
import * as ia from './instagramApi.js';
var data = require('./instagram_data.json');

console.log(data);

var app = new ia.App();

app.controller.render();
app.controller.showPosts(data);
