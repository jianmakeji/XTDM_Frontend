var app = new Vue({
	el: '#dropdown',
	data: {
		menus: [{
			'id': '1',
			'name': '人文'
		}, {
			'id': '2',
			'name': '物语'
		}, {
			'id': '3',
			'name': '风景'
		}, {
			'id': '4',
			'name': '社区'
		}]
	},
	methods: {
		menuClick: function(event, index) {

			$("#breadcrumbs").html("内容管理   > " + text);
			$("#categoryId").html(id);

		}
	}
})

var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: "",
		pageNum: "",
		activeNumber: 1,
		pageCount: 10
	},
	methods: {
		showData: function() {
			$.getJSON("../resources/table.json", function(data) {
				vum.datas = data;
			});
		}
	}
});

(function() {
	$('select').material_select();

	var currentPage = 0;

	$.getJSON("../resources/table.json", function(data) {
		var pageNum = data.length / 10;
		if(data.length % 10 != 0) {
			pageNum = pageNum + 1;
		}
		vum.datas = data.slice(currentPage * 10, currentPage * 10 + 10);
		vum.pageNum = pageNum;
	});

	$("#addArticleContent").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("addArticleContent.html");
	});

	$("#addPptContent").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("addPptContent.html");
	});

	$("#addContentSign").html('');
	$("#categoryId").hide();

	$("#addContent").click(function() {
		let categoryId = $("#categoryId").html();
		$("#managePanel").empty();
		$("#managePanel").load("addContent.html");
		$("#addContentSign").html("1");
	});

})();