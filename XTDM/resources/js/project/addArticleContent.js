var thumbImgUrl = "";
var bgImgUrl = "";
var categoryId = 1;
var insertOrUpdate = 0;
var categoryVue;
/**
 * 初始化下拉列表框
 */
$.getJSON("../category/getCategoryByPage", {
	offset: 0,
	limit: 1000
}, function(data) {
	categoryVue = new Vue({
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

var thumbUploader = new plupload.Uploader({
	runtimes: 'html5,flash,silverlight,html4',
	browse_button: 'uploadThumb',
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
		max_file_size: '1mb', //最大只能上传10mb的文件
		prevent_duplicates: true
		//不允许选取重复文件
	},

	init: {
		PostInit: function() {
			$("#console").html('');
			serverUrl = '../uploadKey/3';
		},

		FilesAdded: function(up, files) {
			$("#ossThumbProgress").show();
			plupload.each(files,
				function(file) {
					$("#thumbFileDescribe").append(file.name + ' (' + plupload.formatSize(file.size) + ') ');
				});
			$("#ossBgfile .determinate").show();
			set_upload_param(thumbUploader, '', false);
		},

		BeforeUpload: function(up, file) {

			set_upload_param(up, file.name, true);
		},

		UploadProgress: function(up, file) {
			$("#thumbFileCompletePersent").html(file.percent + '% ,');
			$("#ossThumbfile .determinate").width(file.percent + '%');
		},

		FileUploaded: function(up, file, info) {
			if(info.status == 200) {
				$("#thumbFileDescribe").innerHTML = '，上传成功！';
				thumbImgUrl = host + "/" + get_uploaded_object_name(file.name) + "?x-oss-process=style/thumb-300";
				$("#uploadThumb").attr('src', thumbImgUrl);

			} else {
				$("#thumbFileDescribe").innerHTML = info.response;
			}
		},

		Error: function(up, err) {
			if(err.code == -600) {
				$("#thumbConsole").html('选择的文件太大了，不能超过1M!');

			} else if(err.code == -601) {
				$("#thumbConsole").html('选择的文件后缀不对!');

			} else if(err.code == -602) {
				$("#thumbConsole").html("这个文件已经上传过一遍了");
			} else {
				$("#thumbConsole").html("上传出错！");
			}
		}
	}
});

thumbUploader.init();

var bgUploader = new plupload.Uploader({
	runtimes: 'html5,flash,silverlight,html4',
	browse_button: 'uploadBg',
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
			serverUrl = '../uploadKey/3';
		},

		FilesAdded: function(up, files) {
			$("#ossBgfile .progress").show();
			plupload.each(files,
				function(file) {
					$("#bgFileDescribe").append(file.name + ' (' + plupload.formatSize(file.size) + ') ');
				});
			$("#ossBgProgress").show();
			set_upload_param(bgUploader, '', false);
		},

		BeforeUpload: function(up, file) {

			set_upload_param(up, file.name, true);
		},

		UploadProgress: function(up, file) {
			$("#bgFileCompletePersent").html(file.percent + '% ,');
			$("#ossBgfile .determinate").width(file.percent + '%');
		},

		FileUploaded: function(up, file, info) {
			if(info.status == 200) {
				$("#bgFileDescribe").innerHTML = '，上传成功！';
				bgImgUrl = host + "/" + get_uploaded_object_name(file.name) + "?x-oss-process=style/thumb-300";
				$("#uploadBg").attr('src', bgImgUrl);

			} else {
				$("#bgFileDescribe").innerHTML = info.response;
			}
		},

		Error: function(up, err) {
			if(err.code == -600) {
				$("#bgConsole").html('选择的文件太大了，不能超过10M!');

			} else if(err.code == -601) {
				$("#bgConsole").html('选择的文件后缀不对!');

			} else if(err.code == -602) {
				$("#bgConsole").html("这个文件已经上传过一遍了");
			} else {
				$("#bgConsole").html("上传出错！");
			}
		}
	}
});

bgUploader.init();

function loadingArticleById(id,ue) {

	$.ajax({
		type: "POST",
		url: "../article/getArticleDetailById/" + id,
		contentType: 'application/json',
		dataType: "json",
		beforeSend: function() {
			$("#circleProgress").show();
		},
		success: function(data) {
			$("#title").val(data.object.title);
			$("#abstract").val(data.object.abstractContent);
			var label = data.object.label;
			$('.chips-initial').material_chip({
				data: [{
					tag: 'Apple',
				}, {
					tag: 'Microsoft',
				}, {
					tag: 'Google',
				}],
			});
			
			var recommand = data.object.recommand;
			if (recommand == 0){
				$("#recommand2").attr("checked","checked");
			}
			else if (recommand == 1){ //推荐 
				$("#recommand1").attr("checked","checked");
			}
			categoryVue.selected = data.object.categoryId;
			$("#uploadThumb").attr('src', data.object.thumb);
			$("#uploadBg").attr('src', data.object.bgUrl);
			ue.setContent(data.object.content);
			
			thumbImgUrl = data.object.thumb;
			bgImgUrl = data.object.bgUrl;
			$("#circleProgress").hide();

		},
		statusCode: {
			404: function() {
				Materialize.toast('没有加载到相应页面!', 4000);
			},
			500: function() {
				Materialize.toast('服务器内部错误!', 4000);
			}
		}
	});
}

$(document).ready(function() {

	$("#ossThumbProgress").hide();
	$("#ossBgProgress").hide();

	var ue = UE.getEditor('myEditor');
	
	(function($) {
		$.getUrlParam = function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		}
	})(jQuery);

	$('.chips-initial').material_chip({
		data: [{
			tag: '新通道',
		}],
	});
	
	var id = $.getUrlParam('id');

	if(id > 0) { //编辑操作
		loadingArticleById(id,ue);
	}

	$("#submitBtn").click(function() {
		var recommand = $('input:radio:checked').val();
		var htmlContent = ue.getContent();

		let title = $("#title").val();
		let abstractData = $("#abstract").val();
		let tag = $('.chips-initial').material_chip('data');

		if(title == "") {
			Materialize.toast('标题不能为空!', 4000);
			return;
		}

		if(abstractData == "") {
			Materialize.toast('描述不能为空!', 4000);
			return;
		}

		if(categoryId == 0) {
			Materialize.toast('文章类别没选!', 4000);
			return;
		}

		if(tag == "") {
			Materialize.toast('文章标签不能为空!', 4000);
			return;
		}
		let requestData = {
			"title": title,
			"abstractContent": abstractData,
			"categoryId": categoryId,
			"label": tag,
			"recommand": recommand,
			"thumb": thumbImgUrl,
			"bgUrl": bgImgUrl,
			"type": 0,
			"content": txtContent
		};

		var requestUrl = "";

		if(insertOrUpdate == 0) {
			//插入数据
			requestUrl = "../article/create";
		} else if(insertOrUpdate == 1) {

			//更新数据
			requestData.id = updateId;
			requestUrl = "../article/update";
		}

		$.ajax({

			type: "POST",
			url: requestUrl,
			contentType: 'application/json',
			dataType: "json",
			data: JSON.stringify(requestData),
			beforeSend: function() {
				$("#circleProgress").show();
			},
			success: function(data) {
				//将数据通过vue.js更新到数据列表
				if(insertOrUpdate == 0) {
					//插入数据
					requestData.id = data.object;
					vum.datas.unshift(requestData);

				} else if(insertOrUpdate == 1) {
					vum.datas.forEach(function(categoryObj) {
						if(categoryObj.id == updateId) {
							categoryObj.name = title;
							categoryObj.description = description;
							categoryObj.bgImgUrl = picUrl;
						}
					});
				}

				$("#circleProgress").hide();
				$("#addPanel").hide();
				resetPanel();
			},
			statusCode: {
				404: function() {
					Materialize.toast('没有加载到相应页面!', 4000);
				},
				500: function() {
					Materialize.toast('服务器内部错误!', 4000);
				}
			}
		});
	});

	$("#browserBtn").click(function() {
		var recommand = $('input:radio:checked').val();
		var htmlContent = ue.getContent();

		let title = $("#title").val();
		let abstractData = $("#abstract").val();
		let tag = $('.chips-initial').material_chip('data');

		if(title == "") {
			Materialize.toast('标题不能为空!', 4000);
			return;
		}

		if(abstractData == "") {
			Materialize.toast('描述不能为空!', 4000);
			return;
		}

		if(categoryId == 0) {
			Materialize.toast('文章类别没选!', 4000);
			return;
		}

		if(tag == "") {
			Materialize.toast('文章标签不能为空!', 4000);
			return;
		}

		if(htmlContent == "") {
			Materialize.toast('文章内容不能为空!', 4000);
			return;
		}
		window.localStorage.setItem("htmlContent", htmlContent);

		window.open("articlePreview.html?title=" + title + "&bgImage=" + bgImgUrl);

	});

	$("#cancelBtn").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("contentManage.html");
	});
});