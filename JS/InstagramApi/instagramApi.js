var app,
	session;	

export class Factory {
	static getApp(config) {
		app = new App();
		session = new Session();

		if (config.json) {
			session.set('posts', app.model.parseInstagramData(config.json));
		}
		
		return app;
	}
}

class Session {
	constructor() {}

	set(name, val) {
		this[name] = val;
	}

	get(name) {
		return this[name]? this[name] : null;
	}
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
		this.columns = [];

		this.html = `<div class="InstagramApi"></div>`;
		this.present = HtmlElement.createNode(this.html);
	}

	addColumn(column) {
		this.columns.push(column);
		this.present.appendChild(column);
	}

	removeColumns() {
		while (true) {
			let column = this.columns.pop();
			if (!column) {
				break;
			}
			column.remove();
		}
	}

	getPresent() {
		return this.present;
	}

}

export class Controller {
	constructor(app) {
		this.app = app;
	}

	render() {
		var width = document.body.clientWidth,
			widthColumn = HtmlElementColumn.getWidth(),
			ratio = Math.floor(width/widthColumn),
			isMob = ratio < 2,
			view = this.app.view,
			posts = session.get('posts');

		view.removeColumns();

		if ( !document.body.querySelector('.InstagramApi') ) {
			document.body.appendChild(this.app.view.getPresent());
		}

		if (isMob) {
			this.app.view.getPresent().classList.add('mob');
			ratio = 1;
		} else {
			this.app.view.getPresent().classList.remove('mob');
		}

		var number = Math.floor(posts.length/ratio),
			remain = posts.length%ratio,
			start = number*0,
			end = start + number - 1 + (remain--? 0 : 1);

		for (let i = 0; i < ratio; i++) {
			let partOfPosts = posts.slice(start, end),
				column = new HtmlElementColumn(partOfPosts);

			start = start + number;
			end = start + number - 1;

			view.addColumn(column.getNode());
		}
	}

	start() {
		window.addEventListener('resize', event => {
			this.onResize();
		});

		var likes = [...document.querySelectorAll('.likes')];
		for (var i = likes.length - 1; i >= 0; i--) {
			likes[i].addEventListener('click', this.onClick);
		}

	}

	onResize(event) {
		var timer = session.get('timer');
		
		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(()=>{
			this.render();
		}, 500);

		session.set('timer', timer);
	}

	onClick(event) {
		alert(this.id);
	}
}

export class Model {
	constructor(app) {
		this.app = app;
	}

	parseInstagramData(json) {
		var datas = json.data,
			now = (new Date()).getTime(),
			posts = [];

		for (var i = 0; i < datas.length; i++) {
			let post = {};

			post.logo = datas[i].user.profile_picture;
			post.author = datas[i].user.username;
			post.location = !datas[i].location? '' : datas[i].location.name;
			post.date = this.getDifferentTime(now, datas[i].caption? +datas[i].caption.created_time: +datas[i].created_time);
			post.img = datas[i].images.low_resolution.url;
			post.likes = datas[i].likes.count;
			post.msg =  datas[i].caption? datas[i].caption.text : '';
			post.id = datas[i].id;

			posts.push(post);
		}

		return posts;
	}

	getDifferentTime(now, then) {
		var dt = new Date(now - then*1000),
			scnds = dt.getSeconds(),
			mnts = dt.getMinutes(),
			hrs = dt.getHours(),
			ds = dt.getDate(),
			mnths = dt.getMonth()+1,
			yrs = dt.getYear() - 70;

		var rsp = `${scnds}s`;

		if (mnts > 0) {
			rsp = `${mnts}m`;
		}

		if (hrs > 0) {
			rsp = `${hrs}h`;
		}

		if (ds > 0) {
			rsp = `${ds}d`;
		}

		if (mnths > 0) {
			rsp = `${mnths}M`;
		}

		if (yrs > 0) {
			rsp = `${yrs}y`;
		}

		return rsp;
	} 
}

class HtmlElement {
	constructor() {
		this.html = '';
	}

    static createNode(html) {
        var div = document.createElement('div');
        
        div.innerHTML = html;
        
        return div.firstChild;
    }

	getNode() {
		return this.element;
	}
}

class HtmlElementColumn extends HtmlElement {
	constructor(posts) {
		super();

		this.width = HtmlElementColumn.getWidth();

		this.html = `<div class="column" style="width: ${this.width}px"></div>`;
		this.element = HtmlElement.createNode(this.html);
		this.posts = posts;

		for (var i = 0; i < this.posts.length; i++) {
			let post = new HtmlElementPost(this.posts[i]);
			this.element.appendChild(post.getNode());
		}
	}

	static getWidth() {
		var width = 350;

		return width;
	}
}

class HtmlElementPost extends HtmlElement {
	constructor(params) {
		super();

		this.html = `<div class="post">
			<div class="head">
				<div class="logo"><a href="https://www.instagram.com/${params.author}/">
					<img src="${params.logo}">
				</a></div>
				<div class="info">
					<div class="about">
						<div class="author"><span>${params.author}</span></div>
						<div class="location"><span>${params.location}</span></div>
					</div>	
					<div class="date">${params.date}</div>
				</div>	
			</div>
			<div class="img">
				<img src="${params.img}">
			</div>
			<div class="desc">
				<div id="${params.id}" class="likes">&#9825;${params.likes}</div>
				<div class="msg">${params.msg}</div>
			</div>
		</div>`;

		this.element = HtmlElement.createNode(this.html);
	}
}