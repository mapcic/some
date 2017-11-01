export class AXPApp {
	constructor(config) {
		this.config = config;
	}
}

export class AXPFactory {
	getApp(config) {
		return new AXPApp;
	}
}

export class AXPView {
	constructor() {
		this.html = '';
		this.components = {};
	}

	getHtml() {
		return html;
	}
}

export class AXPHtml {
	constructor() {
		this.html = '';
	}
}

let _statusbar_count = 0;
export class AXPHtmlStatusbar extends AXPHtml {
	constructor() {
		super();
		this.id = _statusbar_count++;
		this.name = this.constructor.name;
	}
}

let _table_count = 0;
export class AXPHtmlTable extends AXPHtml {
	constructor() {
		super();
		this.id = _table_count++;
		this.name = this.constructor.name;
	}
}

class AXPController {
	constructor() {}
}

class AXPModel {
	constructor() {}
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
	constructor() {}
}

class AXPDocumentsXml extends AXPDocuments{
	constructor() {
		super();
	}
}

class AXPDocumentsHtml extends AXPDocuments{
	constructor() {
		super();
	}
}