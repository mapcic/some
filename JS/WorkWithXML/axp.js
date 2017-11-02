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
		// this.watchEvents();
	}

	render() {
		var view = this.app.getView(),
			doc = new AXPDocumentsHtml(window.document);

		doc.append(view.getComponent('status').getElement());
		doc.append(view.getComponent('response').getElement());
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

	analyze() {
		var view = this.app.get('View');
		// task 1

		// task 2

		// task 3
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

class AXPDocumentsXml extends AXPDocuments{
	constructor(doc) {
		var xml;

		super(doc);

		if (window.XMLHttpRequest) {  
			xml = new window.XMLHttpRequest();  
			xml.open("GET", this.doc, false).send("");  
			this.doc = xml.responseXML;  
		} else {
			xml = new ActiveXObject("Microsoft.XMLDOM");  
			xml.async = false;  
			xml.load(this.doc);  
			this.doc = xml;  
		}  
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