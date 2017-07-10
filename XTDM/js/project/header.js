$(document).ready(function() {

});

var app = new Vue({
	el: '#dropdown1',
	data: {
		menus: ['人文', '物语', '风景', '社区', '音乐']
	},
	methods: {
		menuClick: function(event,index) {
			
			let text = $('#dropdown1 div').eq(index).text();
			let breadcrumbs = document.getElementById("breadcrumbs");
			breadcrumbs.innerText = "内容管理   > " + text;
			
		}
	}
})