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
}
