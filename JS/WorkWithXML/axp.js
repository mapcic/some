export class AXPApp {
	constructor(config = {}) {
		this.config = config;

		this.controller = new AXPController(this);
		this.model = new AXPModel(this);
		this.view = new AXPView(this);
	}

	run() {
		this.getController().run();
	}

	getController() {
		return this.controller;
	}

	getModel() {
		return this.model;
	}

	getView() {
		return this.view;
	}
}

export class AXPFactory {
	static getApp(config) {
		var app = new AXPApp;

		return app;
	}
}

export class AXPView {
	constructor(app) {
		this.html = '';
		this.components = ['status', 'response'];

		this.app = app;

		this.status = new AXPHtmlStatus();
		this.response = new AXPHtmlResponse();
 	}

 	getComponent(component) {
 		if ( this.components.indexOf(component) != -1 ){
	 		return this[component];
	 	}

	 	return component;
 	}
}

export class AXPHtml {
	constructor() {
		this.html = '';
		this.element = '';
	}

	getElement() {
		return this.element;
	}
}

let _status_count = 0;
export class AXPHtmlStatus extends AXPHtml {
	constructor() {
		super();
		this.id = _status_count++;
		this.name = this.constructor.name;

		this.html = `<div class="${this.name}" id="${this.name+this.id}">` +
				'<input>' +
				'<button>analyze</button>'+
			'</div>';
		this.element = (new AXPDocumentsHtml()).createNode(this.html);
 	}

 	set(value) {
 		var input = this.element.getElementsByTagName('input');
 		input[0].value = value;
 	}

 	onclick(func) {
 		var button = this.element.getElementsByTagName('button')[0];

 		button.addEventListener('click', func);
 	}
}

let _response_count = 0;
export class AXPHtmlResponse extends AXPHtml {
	constructor() {
		super();
		this.id = _response_count++;
		this.name = this.constructor.name;

		this.html = `<div id="${this.name}${this.id}" class="${this.name}">`+
				'<div class="title"></div>'+
				'<div class="response"></div>'+
			'</div>';
		this.element = (new AXPDocumentsHtml()).createNode(this.html);
	}
}

class AXPController {
	constructor(app = null) {
		this.app = app;
	}

	run() {
		this.render();
		this.init();
		// this.watchEvents();
	}

	render() {
		var view = this.app.getView(),
			doc = new AXPDocumentsHtml(window.document);

		doc.append(view.getComponent('status').getElement());
		doc.append(view.getComponent('response').getElement());
	}

	init() {
		var request = window.location.search,
			pattern = /[\?\&]+xml=([^&]+)/g,
			xml = '',
			view = this.app.getView();

		xml = pattern.exec(request);
		xml = xml? xml[1] : xml;

		view.getComponent('status').set(xml);
		view.getComponent('status').onclick(()=>{this.task()});
	}

	task() {
		var model = this.app.getModel();

		AXPDocumentsXml.loadXML('/test.xml')
			.then( response => {
				return new Promise( (resolve, reject) => {
					var data = model.task1(response.doc);
					console.log(data);
					resolve(response);
				})
			}).then( response => {
				return new Promise( (resolve, reject) => {
					var data = model.task2(response.doc);
					console.log(data);
					resolve(response);
				})
			}).then( response => {
				return new Promise( (resolve, reject) => {
					var data = model.task3(response.doc);
					console.log(data);
					resolve(response);
				})
			})
	}

	watchEvents() {
		var view = this.app.get('View');

		view.get('status').on('click', this.analyze);
	}

	analyze() {
		var pr = new Promise,
			model = this.app.get('Model');
	}
}

class AXPModel {
	constructor(app = null) {
		this.app = app;
	}

	task1(xml) {
		var parser = new DOMParser(), 
			xmlDoc = parser.parseFromString(xml, "text/xml"),
			numHref = 0;

		numHref = xmlDoc.querySelectorAll('a[href^="#"]').length;

		return numHref;
	}

	task2(xml) {
		var parser = new DOMParser(), 
			xmlDoc = parser.parseFromString(xml, "text/xml"),
			numChapter = 0;

		numChapter = xmlDoc.wholeText;

		return numChapter;
	}

	task3(xml) {
		return 3;
	}
}

class AXPParse {
	constructor() {}
}

class AXPParseXml extends AXPParse {
	constructor() {
		super();
	}
}

class AXPDocuments {
	constructor(doc) {
		this.doc = doc;
	}
}

export class AXPDocumentsXml extends AXPDocuments{
	constructor(doc) {
		var xml;

		super(doc);

		// if (window.XMLHttpRequest) {  
		// 	xml = new window.XMLHttpRequest();  
		// 	xml.open("GET", this.doc, false).send("");  
		// 	this.doc = xml.responseXML;  
		// } else {
		// 	xml = new ActiveXObject("Microsoft.XMLDOM");  
		// 	xml.async = false;  
		// 	xml.load(this.doc);  
		// 	this.doc = xml;  
		// }  
	}

	static loadXML(doc = null) {
		if (!doc) {
			doc = this.doc;
		}

		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			
			xhr.open('GET', doc, true);

			xhr.onload = function() {
				if (this.status == 200) {
					console.log('good');
					resolve(new AXPDocumentsXml(this.response));
				} else {
					let error = new Error(this.statusText);
					error.code = this.status;
					reject(error);
				}
			};

			xhr.onerror = function() {
				reject(new Error("Network Error"));
			};

			xhr.send();
		});
	}

}

class AXPDocumentsHtml extends AXPDocuments{
	constructor(doc = window.document) {
		super(doc);

		if ( doc instanceof String ) {
			this.doc = window.document.querySelectorAll(this.doc);
		}

		if ( doc instanceof Node ) {
			this.doc = doc;
		}
	}

	createNode(html) {
        var div = document.createElement('div');
        
        div.innerHTML = html;
        
        return div.firstChild;
    }

	append(data) {
		var node = data instanceof Node? data : createNode(data);
		if (this.doc == window.document) {
			this.doc.body.appendChild(node);
		} else {
			this.doc.appendChild(node);
		}

	}
}