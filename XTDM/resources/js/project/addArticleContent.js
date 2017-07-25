/**
 * 初始化下拉列表框
 */
$.getJSON("../category/getCategoryByPage",{offset:0,limit:1000}, function(data) {
	var categoryVue = new Vue({
		el: '#dropdown',
		data: {
			selected: '',
			menus: data.object.list
		},
		mounted: function() {
			$('#dropdown select').material_select();
			$('#categorySelect').change(function() {
				categoryVue.selected = $('#categorySelect').val();
			});
		},
		watch: {
			selected: function(value) {
				searchOrSelect = 0;
				categoryId = value;
				getDataList(0);
			}
		}
	})
});


$(document).ready(function() {
	
	(function ($) {
        $.getUrlParam = function (name) {
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
          var r = window.location.search.substr(1).match(reg);
          if (r != null) return unescape(r[2]); return null;
        }
      })(jQuery);
 
      
	var id = $.getUrlParam('id');
	
	alert(id);
	if (id > 0){ //编辑操作
		
	}

	$('.chips-initial').material_chip({
		data: [{
			tag: '新通道',
		}],
	});

	var ue = UE.getEditor('myEditor');

	//对编辑器的操作最好在编辑器ready之后再做
	ue.ready(function() {
		//设置编辑器的内容
		//ue.setContent('hello');
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