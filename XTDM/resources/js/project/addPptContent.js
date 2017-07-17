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

		}
	}
});

var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: ""
	},
	methods: {
		showData: function() {
			$.getJSON("../resources/ppt.json", function(data) {
				vum.datas = data;
			});
		}
	}
});

$(document).ready(function() {
	$('select').material_select();

	$('.chips-initial').material_chip({
		data: [{
			tag: '新通道',
		}],
	});

	$("#submitBtn").click(function() {

	});

	$("#browserBtn").click(function() {

	});

	$("#cancelBtn").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("contentManage.html");
	});

	$.getJSON("../resources/ppt.json", function(data) {

		vum.datas = data;
	});

	var showCategory = 0;
	$("#addFile").click(function() {
		if(showCategory == 0) {
			showCategory = 1;
			$("#addPanel").show('slow');
		} else {
			showCategory = 0;
			$("#addPanel").hide();
		}
	});

	$("#cancel").click(function() {
		showCategory = 0;
		$("#addPanel").hide();
	});
});