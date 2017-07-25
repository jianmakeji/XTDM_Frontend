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

var uploader = new plupload.Uploader({
	runtimes: 'html5,flash,silverlight,html4',
	browse_button: 'selectfiles1,selectfiles2',
	//multi_selection: false,
	//container: document.getElementById('container'),
	flash_swf_url: '../resources/js/plupload-2.3.1/Moxie.swf',
	silverlight_xap_url: '../resources/js/plupload-2.3.1/Moxie.xap',
	url: 'http://oss.aliyuncs.com',

	filters: {
		mime_types: [ //只允许上传图片和zip,rar文件
			{
				title: "Image files",
				extensions: "jpg,jpeg,png",
				mimeTypes: 'image/jpg,image/jpeg,image/png'
			}
		],
		max_file_size: '10mb', //最大只能上传10mb的文件
		prevent_duplicates: true
		//不允许选取重复文件
	},

	init: {
		PostInit: function() {
			$("#console").html('');
			serverUrl = '../uploadKey/2';
		},

		FilesAdded: function(up, files) {
			$(".progress").show();
			plupload.each(files,
				function(file) {
					$("#fileDescribe").append(file.name + ' (' + plupload.formatSize(file.size) + ') ');
				});

			set_upload_param(uploader, '', false);
		},

		BeforeUpload: function(up, file) {

			set_upload_param(up, file.name, true);
		},

		UploadProgress: function(up, file) {
			$("#fileCompletePersent").html(file.percent + '% ,');
			$(".determinate").width(file.percent + '%');
		},

		FileUploaded: function(up, file, info) {
			if(info.status == 200) {
				$("#fileDescribe").innerHTML = '，上传成功！';
				picUrl = host + "/" + get_uploaded_object_name(file.name) + "?x-oss-process=style/thumb-150";
				$("#uploadThumb").attr('src', picUrl);

			} else {
				$("#fileDescribe").innerHTML = info.response;
			}
		},

		Error: function(up, err) {
			if(err.code == -600) {
				$("#console").html('选择的文件太大了，不能超过10M!');

			} else if(err.code == -601) {
				$("#console").html('选择的文件后缀不对!');

			} else if(err.code == -602) {
				$("#console").html("这个文件已经上传过一遍了");
			} else {
				$("#console").html("上传出错！");
			}
		}
	}
});

uploader.init();

$(document).ready(function() {
	
	(function ($) {
        $.getUrlParam = function (name) {
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
          var r = window.location.search.substr(1).match(reg);
          if (r != null) return unescape(r[2]); return null;
        }
      })(jQuery);
 
      
	var id = $.getUrlParam('id');
	
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