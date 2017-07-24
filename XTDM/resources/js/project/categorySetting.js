var picUrl = "";
var showCategory = 0;
var insertOrUpdate = 0;
var updateId = 0;

var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: ""
	},
	methods: {
		updateData: function(e) {
			updateId = e.currentTarget.id;
			insertOrUpdate = 1;

			vum.datas.forEach(function(categoryObj) {
				if(categoryObj.id == updateId) {
					$("#title").val(categoryObj.name);
					$("#titleLabel").addClass('active');

					$("#describe").val(categoryObj.description);
					$("#describeLabel").addClass('active');

					$("#uploadThumb").attr('src', categoryObj.bgImgUrl);
					picUrl = categoryObj.bgImgUrl;
					
					if(showCategory == 0) {
						showCategory = 1;
						$("#addPanel").show('slow');
					} else {
						showCategory = 0;
						$("#addPanel").hide();
					}

				}
			});
		},
		deleteData: function(e) {
			let id = e.currentTarget.id;

			$.ajax({

				type: "GET",
				url: "../category/delete/"+id,
				dataType: "json",
				beforeSend: function() {
					$("#circleProgress").show();
				},
				success: function(msg) {
					var i = 0;
					vum.datas.forEach(function(categoryObj) {
						i = i + 1;
						if(categoryObj.id == id) {
							vum.datas.splice(i, 1);
						}
					});
					
					$("#circleProgress").hide();
				},
				statusCode: {
					404: function() {
						Materialize.toast('找不到页面!', 4000);
					},
					500: function() {
						Materialize.toast('服务器内部错误!', 4000);
					}
				}
			});
		}
	},
});

var uploader = new plupload.Uploader({
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

function resetPanel() {
	$("#title").val('');
	$("#describe").val('');
	$("#uploadThumb").attr('src', '../resources/img/upload.png');
	$("#console").html('');
	$("#fileDescribe").html('');
	$("#fileCompletePersent").html('');
	$(".progress").hide();
	$("#titleLabel").removeClass('active');
	$("#describeLabel").removeClass('active');
	var insertOrUpdate = 0;
}

(function() {

	$(".progress").hide();
	
	$.getJSON("../category/getCategoryByPage",{offset:0,limit:1000}, function(data) {
		vum.datas = data.object.list;
	});
	
	
	$("#addCategory").click(function() {
		var insertOrUpdate = 0;
		if(showCategory == 0) {
			showCategory = 1;
			$("#addPanel").show('slow');
		} else {
			showCategory = 0;
			$("#addPanel").hide();
		}
	});

	

	$("#submit").click(function() {
		let title = $("#title").val();
		let description = $("#describe").val();

		if(title == "") {
			Materialize.toast('标题不能为空!', 4000);
			return;
		}

		if(describe == "") {
			Materialize.toast('描述不能为空!', 4000);
			return;
		}

		let requestData = {
			"name": title,
			"description": description,
			"bgImgUrl": picUrl
		};
		
		var requestUrl = "";
		
		if(insertOrUpdate == 0) {
			//插入数据
			requestUrl = "../category/create";
		} else if(insertOrUpdate == 1) {
			
			//更新数据
			requestData.id = updateId;
			requestUrl = "../category/update";
		}
		
		console.log(requestData);

		$.ajax({

			type: "POST",
			url: requestUrl,
			contentType : 'application/json',
			dataType: "json",
			data: JSON.stringify(requestData),
			beforeSend: function() {
				$("#circleProgress").show();
			},
			success: function(msg) {
				//将数据通过vue.js更新到数据列表
				if(insertOrUpdate == 0) {
					//插入数据
					vum.datas.push(requestData);
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
					alert('page not found');
				},
				500: function() {

				}
			}
		});
	});

	$("#cancel").click(function() {
		showCategory = 0;
		$("#addPanel").hide();
		$("#circleProgress").hide();
		resetPanel();
	});
})();