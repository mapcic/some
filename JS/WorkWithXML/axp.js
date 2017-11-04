class AXPApp {
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

class AXPView {
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

class AXPHtml {
	constructor() {
		this.html = '';
		this.element = '';
	}

	getElement() {
		return this.element;
	}
}

let _status_count = 0;
class AXPHtmlStatus extends AXPHtml {
	constructor() {
		super();
		this.id = _status_count++;
		this.name = this.constructor.name;

		this.html = `<div class="${this.name}" id="${this.name+this.id}">` +
				'<h2>XML file:</h2>' +
				'<input>' +
				'<button>analyze</button>'+
			'</div>';
		this.element = AXPDocumentsHtml.createNode(this.html);
 	}

 	set(value) {
 		var input = this.element.getElementsByTagName('input')[0];
 		input.value = value;
 	}

 	val( value = null ) {
 		var input = this.element.getElementsByTagName('input')[0];

 		if ( value == null ) { 
 			return input.value;
 		}


 		input.value = value;
 	}

 	onclick(func) {
 		var button = this.element.getElementsByTagName('button')[0];

 		button.addEventListener('click', func);
 	}
}

let _response_count = 0;
class AXPHtmlResponse extends AXPHtml {
	constructor() {
		super();
		this.id = _response_count++;
		this.name = this.constructor.name;

		this.html = `<div id="${this.name}${this.id}" class="${this.name}">`+
				'<h2>XML file info:</h2>' +
				'<div class="title"></div>'+
				'<div class="responses"></div>'+
			'</div>';
		this.element = AXPDocumentsHtml.createNode(this.html);
	}

	add(str) {
		var resps = this.element.getElementsByClassName('responses')[0],
			resp = `<div class="response">${str}</div>`;

		(new AXPDocumentsHtml(resps)).append(AXPDocumentsHtml.createNode(resp));
	} 
}

class AXPController {
	constructor(app = null) {
		this.app = app;
	}

	run() {
		this.render();
		this.init();
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

		view.getComponent('status').val(xml);
		view.getComponent('status').onclick(()=>{this.task()});
	}

	task() {
		var model = this.app.getModel(),
			resp = this.app.getView().getComponent('response'),
			xml = this.app.getView().getComponent('status').val();

		AXPDocumentsXml.loadXML(xml)
			.then( response => {
				return new Promise( (resolve, reject) => {
					var data = model.task1(response);
					console.log(`Inside href count is ${data}`);
					resp.add(`Inside href count is ${data}`)
					resolve(response);
				},
				response => {
					console.log(123);	
				})
			}).then( response => {
				return new Promise( (resolve, reject) => {
					var data = model.task2(response);
					console.log(`Count chapters in ALL XML (include body and another) is ${data}`);
					resp.add(`Count chapters in ALL XML (include body and another) is ${data}`);
					resolve(response);
				})
			}).then( response => {
				return new Promise( (resolve, reject) => {
					var data = model.task3(response);
					console.log(`Number of broken links is ${data}`);
					resp.add(`Number of broken links is ${data}`);
					resolve(response);
				})
			})
	}
}

class AXPModel {
	constructor(app = null) {
		this.app = app;
	}

	task1(xml) {
		var numHref = 0;

		numHref = xml.find('a[href^="#"]').length;

		return numHref;
	}

	task2(xml) {
		var elements = [...xml.find('*')], 
			numLetters = 0;

		while (true) {
			let elem = elements.pop();

			if (!elem) {
				break;
			}

			numLetters += elem.textContent.length;
		}

		return numLetters;
	}

	task3(xml) {
		var hrefs = [...xml.find('a[href^="#"]')], 
			numBroken = 0;

		while (true) {
			let href = hrefs.pop();

			if (!href) {
				break;
			}

			if ( !xml.find(href.getAttribute('href')).length ) {
				numBroken++;
			}
		}

		return numBroken;
	}
}

class AXPDocuments {
	constructor(doc) {
		this.doc = doc;
	}
}

class AXPDocumentsXml extends AXPDocuments{
	constructor(doc) {
		var parser = new DOMParser(),
			xml = parser.parseFromString(doc, "text/xml");
		
		super(doc);
		this.xml = xml;
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
					console.log('xml loaded');
					resolve(new AXPDocumentsXml(this.response));
				} else {
					console.log('xml not found');
					reject('xml not found');
				}
			};

			xhr.onerror = function() {
				reject('xml not found');
			};

			xhr.send();
		});
	}

	find(selector) {
		return [...this.xml.querySelectorAll(selector)];
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

	static createNode(html) {
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