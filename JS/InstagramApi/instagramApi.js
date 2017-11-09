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
		this.present = HtmlElement.createNode(this.html);
	}

	addPost(post) {
		this.present.append(post);
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
		document.body.append(this.app.view.getPresent());
	}

	showPosts(instagram) {
		var app = this.app,
			model = app.model,
			view = app.view;

		var params = model.parseInstagramData(instagram);

		// console.log(params);
		while (true) {
			let param = params.shift();

			if (!param) {
				break;
			}

			let post = new HtmlElementPost(param);

			view.addPost(post.getNode());
		}
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

		while (true) {
			let data = datas.shift(),
				post = {};

			if (!data) {
				break
			}

			post.logo = data.user.profile_picture;
			post.author = data.user.username;
			post.location = !data.location? '' : data.location.name;
			post.date = this.getDifferentTime(now, data.caption? +data.caption.created_time: +data.created_time);
			post.img = data.images.standard_resolution.url;
			post.likes = data.likes.count;
			post.msg =  data.caption? data.caption.text : '';

			console.log(post);

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

class HtmlElementPost extends HtmlElement {
	constructor(params) {
		super();

		this.html = `<div class="post">
			<div class="head">
				<div class="logo"><a href="https://www.instagram.com/${params.author}/">
					<img src="${params.logo}">
				</a></div>
				<div class="info">
					<div class="author">${params.author}</div>
					<div class="location">${params.location}</div>
				</div>	
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

		this.element = HtmlElement.createNode(this.html);
	}
}