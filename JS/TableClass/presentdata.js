export default class PresentData {
	constructor(type = 'json') {
		this.type = type;

		this.view = document.createElement(`div`);
		this.table = document.createElement(`table`);
		this.tHead = document.createElement(`thead`);
		this.tBody = document.createElement(`tbody`);
		this.search = document.createElement(`input`);

		this.keyTimeout = 0;

		this.view.appendChild(this.search);
		this.view.appendChild(this.table);

		this.table.appendChild(this.tHead);
		this.table.appendChild(this.tBody);

		this.hRow = [];
		this.rows = [];
		this.columns = [];

		this.content = [];
	}

	setHead(head = null) {
		this.head = head instanceof Array? head : [head];

		if (head == null) {
			this.head = this.data.getHead();
		}

		this.data.setHead(this.head);
		this._insertData();
	}

	setData(data) {
		this.data = Data.getContainer(this.type, data);
		this._insertData();
		this.setHead();
	}

	render(info) {
		document.body.appendChild(this.view);
		this.enableEvents();
	}

	enableEvents() {
		this.rows.forEach((val, ind)=>{
			val.addEventListener('click', event => {
				this._highlightingRow(event);
			});
		}, this);

		this.search.addEventListener('keydown', event => {
			clearTimeout(this.keyTimeout);
			
			if (event.which == 13) {
				this._filterRow(event);
			} else {
				this.keyTimeout = setTimeout(()=>{
					this._filterRow(event);
				}, 1000);
			}
		});
	}

	_insertData() {
		var data = this.data.getData(),
			head = this.data.getHead();

		this._clearData();

		this.content = data;

		head = head.map(title => `<td>${title}</td>`).join('');
		head = `<tr>${head}</tr>`;

		this.hRow.push(this._createRow(head));		
		this.tHead.append(this.hRow[this.hRow.length-1]);

		for (let i = 0; i < data.length; i++) {
			let row = (data[i].map((val) => `<td>${val}</td>`)).join('');
			row = `<tr>${row}</tr>`;

			this.rows.push(this._createRow(row));		
			this.tBody.append(this.rows[this.rows.length-1]);
		}
	}

	_clearData() {
		while (true) {
			let row = this.rows.pop();

			if (!row) {
				break;
			}

			row.remove();
		}

		while (true) {
			let row = this.hRow.pop();

			if (!row) {
				break;
			}

			row.remove();
		}
	}

	_createRow(html) {
        var table = document.createElement('table');
        
        table.innerHTML = html;
        
        return table.firstChild.firstChild;
	}

	_highlightingRow(event) {
		var row = event.currentTarget;

		row.classList.toggle('highlightingRow');
	}

	_filterRow(event) {
		// clearTimeout(this.keyTimeout);

		// this.keyTimeout = setTimeout(()=>{
			var flag = true,
				regex = new RegExp(this.search.value);			

			this.content.forEach((val, ind) => {
				var hidden = val.every(val => {
					val = val == null? '' : val + '';
					
					return val.search(regex) == -1;
				});

				this.rows[ind].classList.remove('hide');
				if (hidden) {
					this.rows[ind].classList.add('hide');
				}
			});

			if (this.rows.every(val => val.classList.contains('hide'))) {
				this.rows.forEach(val => {
					val.classList.remove('hide');
				});
			}
		// }, 1000);
	}
}

class Data {
	constructor(data) {
		this.data = [];
		this._data = data;

		this.head = [];
		this._head = [];
	}

	getHead() {
		var head = this.head.length == 0? this._head : this.head;

		return head;
	}

	getData() {
 		return this.data;
 	}

	static getContainer(type, data) {
		var data;

		if (type == 'json') {
			data = new DataJson(data);
		}

		return data;
	}

	setHead() {}

	_setHead() {}

	_sort() {}
}

class DataJson extends Data {
	constructor(data = {}) {
		super(data);

		this._setHead();
		this._sort();	
	}

	setHead(head) {
		head = head instanceof Array? head : [head]; 

		this.head = head.filter((val) => {
			return this._head.indexOf(val) >= 0;
		});

		this._sort();
 	}

	_setHead() {
		var data = this._data instanceof Array? this._data[0] : this._data;

		for (let key in data) {
			this._head.push(key);
		}
	}

 	_sort() {
 		var head = this.head.length? this.head : this._head;

 		this.data = this._data.map( val => {
 			var out = [];

 			head.forEach((title) => {
 				out.push(val[title]);
 			})

 			return out;
 		});
 	}
}