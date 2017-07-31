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
				console.log(categoryId);
			}
		}
	})
});

//缩略图上传
var thumbOSSUploaderObject = new uploadOSSObject("uploadThumb","image/jpg,image/jpeg,image/png","jpg,jpeg,png",'1mb',
		$("#thumbConsole"),$("#ossThumbProgress"),$("#thumbFileDescribe"),$("#ossThumbfile .determinate"),$("#thumbFileCompletePersent"),$("#uploadThumb"));
var thumbUploader = createUploader(thumbOSSUploaderObject);
thumbUploader.init();

//背景图上传
var bgOSSUploaderObject = new uploadOSSObject("uploadBg","image/jpg,image/jpeg,image/png","jpg,jpeg,png",'10mb',
		$("#bgConsole"),$("#ossBgProgress"),$("#bgFileDescribe"),$("#ossBgfile .determinate"),$("#bgFileCompletePersent"),$("#uploadBg"));
var bgUploader = createUploader(bgOSSUploaderObject);
bgUploader.init();

function loadingArticleById(id,ue) {

	$.ajax({
		type: "GET",
		url: "../article/getArticleDetailById/" + id,
		contentType: 'application/json',
		dataType: "json",
		beforeSend: function() {
			$("#circleProgress").show();
		},
		success: function(data) {
			$("#title").val(data.object.title);
			$("#titleLabel").addClass('active');
			$("#abstract").val(data.object.abstractContent);
			$("#abstractLabel").addClass('active');
			var label = data.object.label;
			var labelArray = label.split(',');
			var labelData = [];
			labelArray.forEach(function(tag,i){
				var obj = {'tag':tag};
			    labelData.push(obj);
			})
			
			$('.chips-initial').material_chip({
				data:labelData,
			});
			
			var recommand = data.object.recommand;
			if (recommand == 0){
				$("#recommand2").attr("checked","checked");
			}
			else if (recommand == 1){ //推荐 
				$("#recommand1").attr("checked","checked");
			}

			$("#categorySelect option[value='"+data.object.categoryId+"']").attr("selected", true);
			
			$("#uploadThumb").attr('src', data.object.thumb);
			$("#uploadBg").attr('src', data.object.bgUrl);
			//ue.setContent(data.object.content);
			ue.execCommand('insertHtml', data.object.content);
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

	$('.chips-initial').material_chip({
		data: [{
			tag: '新通道',
		}],
	});
	
	var id = window.localStorage.getItem("articleId");
	
	if(id > 0) { //编辑操作
		loadingArticleById(id,ue);
	}

	$("#submitBtn").click(function() {
		var recommand = $('input:radio:checked').val();
		var htmlContent = ue.getContent();

		let title = $("#title").val();
		let abstractData = $("#abstract").val();
		let tag = $('.chips-initial').material_chip('data');

		var label = "";
		if (tag.length > 0){
			tag.forEach(function(object,i){
			    label = label + object.tag + ",";
			})
		}
		
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

		if(tag.length < 1) {
			Materialize.toast('文章标签不能为空!', 4000);
			return;
		}
		let requestData = {
			"title": title,
			"abstractContent": abstractData,
			"categoryId": categoryId,
			"label": label,
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
				Materialize.toast('操作成功!', 4000);
				$("#circleProgress").hide();
				$("#addPanel").hide();
				$("#managePanel").empty();
				$("#managePanel").load("contentManage.html");
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