$(document).ready(function() {
	$("#addContentSign").html('');
	$("#categoryId").hide();
	
	$("#addContent").click(function(){
		let categoryId = $("#categoryId").html();
		$("#managePanel").empty();
		$("#managePanel").load("addContent.html");
		$("#addContentSign").html("1");
	});
});