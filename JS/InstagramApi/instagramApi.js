export class Factory {
}

export class App {
	constructor() {
		this.controller = new Controller(this);
		this.view = new View(this);
		this.model = new Model(this); 
	}
}

export class View {
	constructor(app) {
		this.app = app;
		this.elements = [];

		this.html = `<div class="InstagramApi"></div>`;
		this.element = HtmlElement.createNode(this.html);
	}

	addPost(post) {
	}
}

export class Controller {
	constructor(app) {
		this.app = app;
	}
}

export class Model {
	constructor(app) {
		this.app = app;
	}
}

class HtmlElement {
	constructor() {
		this.html = '';
	}

	static createNode(html) {

	}

	getNode() {

	}
}

class HtmlElementPost {
	constructor(params) {
		super();

		this.html = `<div class="post">
			<div class="head">
				<div class="logo">
					<img src="${params.logo}">
				</div>
				<div class="author">${params.author}</div>
				<div class="location">${params.location}</div>
				<div class="date">${params.date}</div>
			</div>
			<div class="img">
				<img src="${params.img}">
			</div>
			<div class="desc">
				<div class="likes"><i></i>${params.likes}</div>
				<div class="msg">${params.msg}</div>
			</div>
		</div>`;
	}
}