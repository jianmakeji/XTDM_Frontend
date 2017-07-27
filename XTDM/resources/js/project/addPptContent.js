var thumbImgUrl = "";
var bgImgUrl = "";
var categoryId = 1;
var insertOrUpdate = 0;

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
		$("#managePanel").empty();
		$("#managePanel").load("contentManage.html");
	});
});