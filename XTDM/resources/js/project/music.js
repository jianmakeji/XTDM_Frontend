var showMusicPanel = 0;
var insertOrUpdate = 0;//插入或更新标志
var updateId = 0; //更新记录的ID
var prePage = 1;//前一页，用于css修改点击样式
var currentPage = 0; //当前页码

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

			$.ajax({

				type: "POST",
				url: "/music/delete/"+id,
				dataType: "json",
				data: data,
				beforeSend: function() {
					$("#circleProgress").show();
				},
				success: function(msg) {
					$("#circleProgress").hide();
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
		},
		getPageData:function(e){
			//$('li[id='+prePage+']').removeClass('active').addClass('waves-effect');
			$(".pagination").find('li[id='+prePage+']').removeClass('active').addClass('waves-effect');
			let id = e.currentTarget.id;
			this.activeNumber = id;
			//$('li[id='+id+']').addClass('active');
			$(".pagination").find('li[id='+id+']').addClass('active');
			prePage = id;
			
			$.getJSON("../resources/music.json", {offset:id*10,limit:10}, function(data) {
				
				vum.datas = data.slice((id - 1) * 10, (id - 1) * 10 + 10);
				
			});
	
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
				mp3Url = host + "/" + get_uploaded_object_name(file.name) + "?x-oss-process=style/thumb-150";

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
}

(function() {

	$("#videoPanel").hide();
	$("#chevron_left").hide();
	
	$.getJSON("../resources/music.json", {offset:0,limit:10}, function(data) {
		var pageNum = Math.ceil(data.length / 10);
		
		if(pageNum > 10) {
			vum.currentPaginationCount = 10;
		}
		else{
			vum.currentPaginationCount = pageNum;
		}
		
		vum.dataLength = data.length;
		vum.datas = data.slice(currentPage * 10, currentPage * 10 + 10);
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
			//写入数据
			
			requestUrl = "../category/create";
		} else if(insertOrUpdate == 1) {
			//更新数据
			requestData.push({
				'id':
				updateId
			});
			requestUrl = "../category/update";
		}

		$.ajax({

			type: "POST",
			url: requestUrl,
			dataType: "json",
			data: requestData,
			beforeSend: function() {
				$("#circleProgress").show();
			},
			success: function(msg) {
				if(insertOrUpdate == 0) {
					//插入数据
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

})();