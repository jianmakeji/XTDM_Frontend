var categoryId = 0;
var insertOrUpdate = 0;

var pptDataList = [];

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

//幻灯片上传
var pptOSSUploaderObject = new uploadOSSObject("uploadPpt","image/jpg,image/jpeg,image/png","jpg,jpeg,png",'10mb',
		$("#pptConsole"),$("#ossPptProgress"),$("#pptFileDescribe"),$("#ossPptfile .determinate"),$("#pptFileCompletePersent"),$("#uploadPpt"));
var pptUploader = createUploader(pptOSSUploaderObject);	
pptUploader.init();

function loadingArticleById(id) {

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
			
			pptDataList = JSON.parse(data.object.content);
			vum.datas = pptDataList;
			
			console.log(pptDataList);
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

var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: pptDataList,
	},
	methods: {
		updateData: function(e) {
			let id = e.currentTarget.id;

			vum.datas.forEach(function(pptObj) {

				if(pptObj.pptPicUrl == id) {
					showCategory = 1;
					$("#addPanel").show('slow');
					$("#uploadPpt").attr('src',pptObj.pptPicUrl);
					$("#textarea1").val(pptObj.describe);
				}
			});
		},
		deleteData: function(e) {
			let id = e.currentTarget.id;
			var i = 0;
			vum.datas.forEach(function(pptObj) {
				if(pptObj.pptPicUrl == id) {
					vum.datas.splice(i,1);
				}
				i = i + 1;
			});
			
		},
	}
});

$(document).ready(function() {
	$("#ossThumbProgress").hide();
	$("#ossBgProgress").hide();
	$("#ossPptProgress").hide();

	let aliyunOSSUrl = "aliyuncs.com";
	
	var id = window.localStorage.getItem("articleId");
	
	if(id > 0) { //编辑操作
		loadingArticleById(id);
	}

	$('.chips-initial').material_chip({
		data: [{
			tag: '新通道',
		}],
	});

	$("#submitBtn").click(function() {
		var recommand = $('input:radio:checked').val();
		
		let title = $("#title").val();
		let abstractData = $("#abstract").val();
		let tag = $('.chips-initial').material_chip('data');
		
		let thumbImgUrl = $("#uploadThumb").attr('src');
		let bgImgUrl = $("#uploadBg").attr('src');
		
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
		
		if (pptDataList.length == 0){
			Materialize.toast('请上传幻灯片图片!', 4000);
			return;
		}
		
		if(!$("#uploadThumb").text().indexOf(aliyunOSSUrl) > 0 ) {
			Materialize.toast('缩略图不能为空!', 4000);
			return;
		}
		
		if(!$("#uploadBg").text().indexOf(aliyunOSSUrl) > 0 ) {
			Materialize.toast('背景图片不能为空!', 4000);
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
			"type": 1,
			"content": JSON.stringify(pptDataList)
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
		
		let title = $("#title").val();
		let abstractData = $("#abstract").val();
		let tag = $('.chips-initial').material_chip('data');

		let thumbImgUrl = $("#uploadThumb").attr('src');
		let bgImgUrl = $("#uploadBg").attr('src');
		
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

		if(pptDataList.length == 0) {
			Materialize.toast('幻灯片内容不能为空!', 4000);
			return;
		}
		
		if(!$("#uploadThumb").text().indexOf(aliyunOSSUrl) > 0 ) {
			Materialize.toast('缩略图不能为空!', 4000);
			return;
		}
		
		if(!$("#uploadBg").text().indexOf(aliyunOSSUrl) > 0 ) {
			Materialize.toast('背景图片不能为空!', 4000);
			return;
		}
		
		window.localStorage.setItem("pptDataList", JSON.stringify(pptDataList));

		window.open("pptPreview.html?title=" + title + "&bgImgUrl=" + bgImgUrl);
	});

	$("#cancelBtn").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("contentManage.html");
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

	$("#cancelPptBtn").click(function() {
		showCategory = 0;
		$("#uploadPpt").attr('src','../resources/img/upload.png');
		$("#describe").val('');
		$("#addPanel").hide();
	});
	
	$("#addPptBtn").click(function(){
		var pptPicUrl = $("#uploadPpt").attr('src');
		var describe = $("#textarea1").val();

		if(!pptPicUrl.indexOf(aliyunOSSUrl) > 0) {
			Materialize.toast('图片不能为空!', 4000);
			return;
		}

		if(describe == "") {
			Materialize.toast('描述不能为空!', 4000);
			return;
		}
		
		pptDataList.push({"pptPicUrl":pptPicUrl,"describe":describe});
		console.log(pptDataList);
		
		$("#uploadPpt").attr('src','../resources/img/upload.png');
		$("#textarea1").val('');
		$("#ossPptProgress").hide();
		$("#pptConsole").html('');
		$("#pptFileDescribe").html('');
		$("#pptFileCompletePersent").html('');
		$("#addPanel").hide();
		$(".determinate").css("width","1%");
		showCategory = 0;
	});
});