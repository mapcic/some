import * as axp from './axp';

var app = axp.AXPFactory.getApp();

// console.log(app);

console.log(axp.AXPDocumentsXml.loadXML('test.xml'));

app.run();