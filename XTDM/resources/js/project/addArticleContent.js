var thumbImgUrl = "";
var bgImgUrl = "";
var categoryId = 0;
var insertOrUpdate = 0;

/**
 * 初始化下拉列表框
 */
$.getJSON("../category/getCategoryByPage", {
	offset: 0,
	limit: 1000
}, function(data) {
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
			$("#ossThumbfile .progress").show();
			plupload.each(files,
				function(file) {
					$("#thumbFileDescribe").append(file.name + ' (' + plupload.formatSize(file.size) + ') ');
				});

			set_upload_param(uploader, '', false);
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
				thumbImgUrl = host + "/" + get_uploaded_object_name(file.name) + "?x-oss-process=style/thumb-150";
				$("#uploadThumb").attr('src', thumbImgUrl);

			} else {
				$("#thumbFileDescribe").innerHTML = info.response;
			}
		},

		Error: function(up, err) {
			if(err.code == -600) {
				$("#thumbConsole").html('选择的文件太大了，不能超过10M!');

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

			set_upload_param(uploader, '', false);
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
				bgImgUrl = host + "/" + get_uploaded_object_name(file.name) + "?x-oss-process=style/thumb-150";
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

$(document).ready(function() {
	
	$("#previewPanel").hide();
	
	(function($) {
		$.getUrlParam = function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		}
	})(jQuery);

	var id = $.getUrlParam('id');

	if(id > 0) { //编辑操作

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

	$("#submitBtn").click(function() {
		var recommand = $('input:radio:checked').val();
		var htmlContent = ue.getContent();

		let title = $("#title").val();
		let abstract = $("#abstract").val();
		let tag = $('.chips-initial').material_chip('data');

		if(title == "") {
			Materialize.toast('标题不能为空!', 4000);
			return;
		}

		if(describe == "") {
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
			Materialize.toast('文章标签不能为空!', 4000);
			return;
		}
		
		let requestData = {
			"title": title,
			"abstractContent": description,
			"categoryId": categoryId,
			"label": tag,
			"recommand": recommand,
			"thumb": thumbImgUrl,
			"bgUrl": bgImgUrl,
			"type": 0,
			"content": htmlContent
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
		var txtContent = ue.getContentTxt();

		console.log(htmlContent);
		console.log(txtContent);

		let title = $("#title").val();
		let abstract = $("#abstract").val();
		let tag = $('.chips-initial').material_chip('data');

		if(title == "") {
			Materialize.toast('标题不能为空!', 4000);
			return;
		}

		if(describe == "") {
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

		$("#previewContent").html(txtContent);
		
		const columnWidth = 200;
		const columnGap = 15;
		const fontSize = 16;
		const lineHeight = 24;

		var textCount = $("#previewContent").html().length;
		let windowHeight = $(window).height();
		let imgCount = $('#previewContent').children('img').length;

		$("#previewContent img").each(function() {
			let imgHeight = $(this).height();
			textCount += Math.ceil(columnWidth / fontSize) * Math.ceil(imgHeight / lineHeight);
		});
		
		let columnCount = Math.ceil(textCount / (Math.ceil(windowHeight / lineHeight) * Math.ceil(200 / fontSize)));

		$("#previewContent").css({
			'column-fill': 'balance',
			'column-count': columnCount,
			'column-width': columnWidth,
			'column-gap': columnGap,
			'width': 215 * (columnCount + 1)
		});

	});

	$("#cancelBtn").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("contentManage.html");
	});
});