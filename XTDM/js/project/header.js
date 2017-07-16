$(document).ready(function() {
	$("a[name='article']").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("contentManage.html");
	});

	$("a[name='music']").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("musicManage.html");
	});

	$("a[name='manage']").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("categorySetting.html");
	});
});