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

$(document).ready(function() {
	$('select').material_select();

	$('.chips-initial').material_chip({
		data: [{
			tag: '新通道',
		}],
	});

	var ue = UE.getEditor('myEditor');

	//对编辑器的操作最好在编辑器ready之后再做
	ue.ready(function() {
		//设置编辑器的内容
		ue.setContent('hello');
		//获取html内容，返回: <p>hello</p>
		var html = ue.getContent();
		//获取纯文本内容，返回: hello
		var txt = ue.getContentTxt();
	});

	$("#submitBtn").click(function(){
		
	});
	
	$("#browserBtn").click(function(){
		
	});
	
	$("#cancelBtn").click(function(){
		$("#managePanel").empty();
		$("#managePanel").load("contentManage.html");
	});
});