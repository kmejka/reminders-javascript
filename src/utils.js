function findFirst(array) {
	console.log(array);
	if (array.length > 0) {
		console.log(array[0]);
		return array[0];
	} else {
		return;
	}
}

exports.findFirst = findFirst;
