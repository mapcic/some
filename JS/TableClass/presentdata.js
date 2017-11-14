export default class PresentData {
	constructor(type = 'json') {
		this.type = type;

		this.view = document.createElement(`div`);
		this.table = document.createElement(`table`);
		this.search = document.createElement(`input`);

		this.keyTimeout = 0;

		this.view.appendChild(this.search);
		this.view.appendChild(this.table);

		this.rows = [];
		this.columns = [];
	}

	seatHead(head) {
		this.head = head instanceof Array? head : [...head];
	}

	getHead() {
		return this.head;
	}

	setData(data) {
		this.data = Data.getContainer(this.type, data);
		this.data.setHead(this.head);

		var data = this.data.getData();

		console.log(data);

		for (var i = 0; i < this.data.length; i++) {
			let row = (this.data[i].map((val) => `<td>${val}<td>`)).join('');
			row = `<tr>${row}</tr>`;

			this.rows.pop(this.createNode(row));
			this.table.appendChild(this.rows[this.rows.length-1]);
		}

		console.log(this.table);
	}

	createNode(html) {
		var div = document.createElement('div');

		div.innerHTML = html;

		return div.firstChild;
	}

	render(info) {
		document.body.appendChild(this.view);
		// this.enableEvents();
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
		}, 1000);
	}
}

class Data {
	constructor(data) {
		this.data = [];
		this._data = data;

		this.head = [];
		this._head = [];
	}

	static getContainer(type, data) {
		var data;

		if (type == 'json') {
			data = new DataJson(data);
		}

		return data;
	}

	_getHead() {}
}

class DataJson extends Data {
	constructor(data = {}) {
		super(data);

		this._getHead();
		this._sort(this._head);	
	}

	_getHead() {
		var data = this._data instanceof Array? this._data[0] : this._data;

		console.log(data);

		for (let key in data) {
			this._head.push(key);
		}
	}

	setHead(head) {
		head = head instanceof Array? head : [head]; 

		this.head = head.filter((val) => {
			return this._head.indexOf(val) >= 0;
		});

		this._sort();
 	}

 	_sort() {
 		var head = this.head.length? this.head : this._head;

 		if (head.length) {
 			this.data = [];
 		}

 		this.data = this._data.map( val => {
 			var out = [];

 			this.head.forEach((title) => {
 				out.push(val[title]);
 			})

 			return out;
 		});
 	}

 	getData() {
 		return this.data;
 	}

}