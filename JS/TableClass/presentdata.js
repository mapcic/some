supportedTypes = {
	'json' : DataJson
}

class PresentData {
	constructor(type = 'json') {
		if ( type in supportedTypes ) {
			this.type = type;
		}

		this.view = document.createElement(`<div></div>`);
		this.table = document.createElement(`<table></table>`);
		this.search = document.createElement(`<input type="text"`);

		this.keyTimeout = 0;

		this.view.appendChild(search);
		this.view.appendChild(table);

		this.rows = [];
		this.columns = [];
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
			let row = (this.data[i].map((val) => `<td>${val}<td>`)).join('');
			row = `<tr>${row}</tr>`;

			this.rows.pop(document.createElement(row));
			this.table.appendChild(this.rows[this.rows.length-1]);
		}
	}

	render(info) {
		document.body.appendChild(this.table);
		this.enableEvents();
	}

	enableEvents() {
		this.rows.forEach((val, ind)=>{
			val.addEventListener('click', event => {
				this.highlightingRow(event);
			});
		}, this);

		this.search.addEventListener('keydown', event => {
			this.filterRow(event);
		});
	}

	highlightingRow(event) {
		var row = event.currentTarget;

		row.classList.toggle('highlightingRow');
	}

	filterRow(event) {
		clearTimeout(this.keyTimeout);

		this.keyTimeout = setTimeout(()=>{
			console.log(this);
		});
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