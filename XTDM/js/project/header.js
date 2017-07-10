$(document).ready(function() {
	$("#managePanel").empty();
	$("#managePanel").load("contentManage.html");
});

var app = new Vue({
	el: '#dropdown1',
	data: {
		menus:[
			{'id':'1','name':'人文'},{'id':'2','name':'物语'},{'id':'3','name':'风景'},{'id':'4','name':'社区'},{'id':'5','name':'音乐'}
		]
	},
	methods: {
		menuClick: function(event,index) {
			let clickObj = $('#dropdown1 div').eq(index);
			let text = clickObj.text();
			let id = clickObj.attr('id');
			//let breadcrumbs = document.getElementById("breadcrumbs");
			//breadcrumbs.innerText = "内容管理   > " + text;
			
			
			$("#breadcrumbs").html("内容管理   > " + text);
			$("#categoryId").html(id);
		}
	}
})