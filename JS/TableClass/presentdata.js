supportedTypes = {
	'json' : DataJson
}

class PresentData {
	constructor(type = 'json') {
		if ( type in supportedTypes ) {
			this.type = type;
		}

		this.table = document.createElement(`<table></table>`);
	}

	seatHeader(titles) {
		this.head = titles;
	}

	getHead() {
		return this.head;
	}

	setData(data) {
		this.data = new supportedTypes[this.type](data);
		this.data.sortByHead(this.head);

		for (var i = 0; i < this.data.length; i++) {
			let row = (this.data[i].map((val) => `<td>${val}<td>`).join('');

			this.table.appendChild(document.createElement(row));
		}
	}

	render() { 
		
		document.body.appendChild(this.table);
	}


}

class Data {
	constructor(data) {
		this.data = data;
	}
}

class DataJson extends Data {
	constructor() {
		super();
	}
}