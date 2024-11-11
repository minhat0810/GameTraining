let a = 4;

function mystery1(a) {
	let b = a * -8;
	return (a - b) / a;
}

function mystery2(a, b) {
	let c = mystery1(b);
	b = a;
	a = mystery1(a);
	return a + b + c;
}

console.log(mystery2(mystery1(3),2));