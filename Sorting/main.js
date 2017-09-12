function swap(items, left, right) {
	if (left !== right) {
		var temp = items[left];
		items[left] = items[right];
		items[right] = temp; 
	}

	return;
}

class Sort {
	constructor( set ) { 
		this.set = set;
	}

	swap(items, left, right) {
		if (left !== right) {
			var temp = items[left];
			items[left] = items[right];
			items[right] = temp; 
		}

		return;
	}

	buble() {
		var swaped = true;
		while (swaped) {
			swaped = false;
			for (var i = 0; i < this.set.length - 1; i++) {
				if ( this.set[i] > this.set[i+1]) {
					this.swap(this.set, i, i+1);
					swaped = true;
				}
			}
		}
	}
}