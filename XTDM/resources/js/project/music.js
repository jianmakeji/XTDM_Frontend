var showMusicPanel = 0;
var insertOrUpdate = 0;//插入或更新标志
var updateId = 0; //更新记录的ID
var prePage = 1;//前一页，用于css修改点击样式
var currentPage = 1; //当前页码
var searchOrSelect = 0;

var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: "",
		pageNum: "", //数据总共分为多少页
		activeNumber: 1, //当前显示页的ID
		dataLength: 0, //总数据长度
		paginationNum:0, //当前处在第几块分页
		currentPaginationCount:10, //记录当前分页块总共有多少页
		paginationCount:0 //记录有多少分页块
	},
	methods: {
		updateData: function(e) {

			updateId = e.currentTarget.id;
			insertOrUpdate = 1;
			vum.datas.forEach(function(musicObj) {
				if(musicObj.id == updateId) {
					$("#title").val(musicObj.name);
					$("#musicLabel").addClass('active');
					$("#author").val(musicObj.author);
					$("#authorLabel").addClass('active');
					if(showMusicPanel == 0) {
						showMusicPanel = 1;
						$("#addPanel").show('slow');
					} else {
						showMusicPanel = 0;
						$("#addPanel").hide();
					}

					if(musicObj.url) {
						$("#filePanel").hide();
						$("#videoPanel").show();
					}

				}
			});
		},
		deleteData: function(e) {
			let id = e.currentTarget.id;

			var deleteRequest = $.ajax({

				type: "POST",
				url: "/music/delete/"+id,
				dataType: "json",
				data: data,
				beforeSend: function() {
					$("#circleProgress").show();
				}
				
			});
			
			var promise = deleteRequest.then(function(data){
				var loadCurrentPageData = $.getJSON("../music/getMusicByPage", {offset:currentPage*10,limit:10}, function(data) {
					vum.datas = data.object.list;
				});
				return loadCurrentPageData;
			})
			
			promise.done(function(data){
				$("#circleProgress").hide();
			});
		},
		getPageData:function(e){
			//$('li[id='+prePage+']').removeClass('active').addClass('waves-effect');
			$(".pagination").find('li[id='+prePage+']').removeClass('active').addClass('waves-effect');
			let id = e.currentTarget.id;
			currentPage = id;
			this.activeNumber = id;
			//$('li[id='+id+']').addClass('active');
			$(".pagination").find('li[id='+id+']').addClass('active');
			prePage = id;
			
			getDataList(id*10);
			/*
			$.getJSON("../music/getMusicByPage", {offset:id*10,limit:10}, function(data) {
				
				//vum.datas = data.slice((id - 1) * 10, (id - 1) * 10 + 10);
				vum.datas = data.object.list;
			});
			*/
		},
		prePageClick:function(e){
			vum.paginationNum = vum.paginationNum - 1;
			if (vum.paginationNum === 0){
				$("#chevron_left").hide();
			}
			$("#chevron_right").show();
			vum.currentPaginationCount = 10;
		},
		nextPageClick:function(e){
			$("#chevron_left").show();
			vum.paginationNum = vum.paginationNum + 1;
			
			if (vum.paginationNum === (vum.paginationCount - 1)){
				$("#chevron_right").hide();
				vum.currentPaginationCount = Math.ceil((vum.dataLength - vum.paginationNum * 10 * 10)/10);
			}
			else{
				vum.currentPaginationCount = 10;
			}
		}
	}

});

var mp3Url = "";

var uploader = new plupload.Uploader({
	runtimes: 'html5,flash,silverlight,html4',
	browse_button: 'selectfiles',
	//multi_selection: false,
	//container: document.getElementById('container'),
	flash_swf_url: '../resources/js/plupload-2.3.1/Moxie.swf',
	silverlight_xap_url: '../resources/js/plupload-2.3.1/Moxie.xap',
	url: 'http://oss.aliyuncs.com',

	filters: {
		mime_types: [ //只允许上传图片和zip,rar文件
			{
				title: "mp3 files",
				extensions: "mp3,ogg"
			}
		],
		max_file_size: '10mb', //最大只能上传10mb的文件
		prevent_duplicates: true
		//不允许选取重复文件
	},

	init: {
		PostInit: function() {
			$("#console").html('');
			serverUrl = '../uploadKey/1';
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
				mp3Url = host + "/" + get_uploaded_object_name(file.name);

			} else {
				$("#fileDescribe").innerHTML = info.response;
			}
		},

		Error: function(up, err) {
			if(err.code == -600) {
				$("#console").html('选择的文件太大了，不能超过10M!');

			} else if(err.code == -601) {
				$("#console").html('选择的文件后缀不对,只能传mp3和ogg!');

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
	$("#author").val('');
	$("#console").html('');
	$("#fileDescribe").html('');
	$("#fileCompletePersent").html('');
	$(".progress").hide();
	$("#titleLabel").removeClass('active');
	$("#authorLabel").removeClass('active');
	insertOrUpdate = 0;
	showCategory = 0;
}

function getDataList(offset) {
	
	var keyword = $("#condition").val();
	var data = {
		'offset': offset,
		'limit': '10',
	};
	
	var requestUrl = "";
	if (searchOrSelect == 1){
		if (keyword == ""){
			searchOrSelect = 0;
			requestUrl = "../music/getMusicByPage",
		}
		else{
			data.keyword = keyword;
			requestUrl = "../music/getMusicKeywordByPage",
		}
		
	}
	else{
		requestUrl = "../music/getMusicByPage",
	}
	
	$.ajax({

		type: "POST",
		url: "../music/getMusicKeywordByPage",
		dataType: "json",
		data: data,
		beforeSend: function() {
			$("#circleProgress").show();
		},
		success: function(msg) {
			//将数据通过vue.js更新到数据列表
			vum.datas = data.object.list;
			$("#circleProgress").hide();
		},
		statusCode: {
			404: function() {
				alert('page not found');
			},
			500: function() {

			}
		}
	});
}

(function() {

	$("#videoPanel").hide();
	$("#chevron_left").hide();
	
	$.getJSON("../music/getMusicByPage", {offset:0,limit:10}, function(data) {
		var pageNum = Math.ceil(data.object.count / 10);
		
		if(pageNum > 10) {
			vum.currentPaginationCount = 10;
		}
		else{
			vum.currentPaginationCount = pageNum;
		}
		
		vum.dataLength = data.object.count;
		//vum.datas = data.slice(currentPage * 10, currentPage * 10 + 10);
		vum.datas = data.object.list;
		vum.pageNum = pageNum;
		vum.paginationCount = Math.ceil(pageNum / 10);
		
		if (pageNum <= 10){
			$("#chevron_right").hide();
			$("#chevron_left").hide();
		}
	});

	$("#addMusic").click(function() {
		insertOrUpdate = 0;
		if(showMusicPanel == 0) {
			showMusicPanel = 1;
			$("#addPanel").show('slow');
		} else {
			showMusicPanel = 0;
			$("#addPanel").hide();
		}
	});

	$("#updateMusic").click(function() {
		$("#videoPanel").hide();
		$("#filePanel").show();
	});

	$("#cancel").click(function() {
		showMusicPanel = 0;
		resetPanel();
		$("#addPanel").hide();
		$("#circleProgress").hide();
	});

	$("#submit").click(function() {
		let title = $("#title").val();
		let author = $("#author").val();

		if(title == "") {
			Materialize.toast('标题不能为空!', 4000);
			return;
		}

		if(author == "") {
			Materialize.toast('描述不能为空!', 4000);
			return;
		}

		if(mp3Url == "") {
			Materialize.toast('没有上传MP3文件!', 4000);
			return;
		}

		let requestData = {
			"name": title,
			"author": author,
			"url": mp3Url
		};

		var requestUrl = "";
		
		if(insertOrUpdate == 0) {
			//插入数据
			requestUrl = "../music/create";
		} else if(insertOrUpdate == 1) {
			
			//更新数据
			requestData.id = updateId;
			requestUrl = "../music/update";
		}

		$.ajax({

			type: "POST",
			url: requestUrl,
			contentType : 'application/json',
			dataType: "json",
			data: JSON.stringify(requestData),
			beforeSend: function() {
				$("#circleProgress").show();
			},
			success: function(data) {
				if(insertOrUpdate == 0) {
					//插入数据
					requestData.id = data.object;
					var dateTime = new Date();
					requestData.createTime = dateTime.toLocaleDateString();
					vum.datas.push(requestData);
				} else if(insertOrUpdate == 1) {
					vum.datas.forEach(function(musicObj) {
						if(musicObj.id == updateId) {
							musicObj.name = title;
							musicObj.author = author;
							musicObj.url = mp3Url;
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
	
	//回车进行搜索查询
	$("#condition").keydown(function(event) {
		if(event.keyCode == 13) {
			searchOrSelect = 1;
			getDataList(0);
		}
	});

	//点击搜索图标进行查询
	$("#searchIcon").click(function() {
		searchOrSelect = 1;
		getDataList(0);
	});

})();