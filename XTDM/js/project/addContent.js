$(document).ready(function() {
	$(".header").load("header.html");

	$('.chips-initial').material_chip({
		data: [{
			tag: '新通道',
		}],
	});
});