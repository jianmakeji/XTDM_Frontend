var prePage = 1; //前一页，用于css修改点击样式
var currentPage = 0; //当前页码
var searchOrSelect = 0;
var categoryId = 0;

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

var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: "",
		pageNum: "",
		activeNumber: 1,
		dataLength: 0, //总数据长度
		paginationNum: 0, //当前处在第几块分页
		currentPaginationCount: 10, //记录当前分页块总共有多少页
		paginationCount: 0 //记录有多少分页块
	},
	methods: {
		updateData: function(e) {
			let id = e.currentTarget.id;
			vum.datas.forEach(function(articleObj) {
				if(articleObj.id == id) {
					window.localStorage.setItem("articleId", id);
					if(articleObj.type == 0){
						$("#managePanel").empty();
						$("#managePanel").load("addArticleContent.html");
					}
					else if (articleObj.type == 1){
						$("#managePanel").empty();
						$("#managePanel").load("addPptContent.html");
					}
				}
			});
		},
		deleteData: function(e) {
			let id = e.currentTarget.id;

			var deleteRequest = $.ajax({
				type: "GET",
				url: "../music/delete/"+id,
				dataType: "json",
				beforeSend: function() {
					$("#circleProgress").show();
				}
			});
			
			var promise = deleteRequest.then(function(data){
				var loadCurrentPageData = $.getJSON("../article/getArticleByPage", {offset:(currentPage - 1)*10,limit:10}, function(data) {
					vum.datas = data.object.list;
				});
				return loadCurrentPageData;
			})
			
			promise.done(function(data){
				$("#circleProgress").hide();
			});
		},
		getPageData: function(e) {
			$(".pagination").find('li[id=' + prePage + ']').removeClass('active').addClass('waves-effect');
			let id = e.currentTarget.id;
			this.activeNumber = id;
			$(".pagination").find('li[id=' + id + ']').addClass('active');
			prePage = id;
			currentPage = id;
			getDataList((id - 1)*10);
		},
		prePageClick: function(e) {
			vum.paginationNum = vum.paginationNum - 1;
			if(vum.paginationNum === 0) {
				$("#chevron_left").hide();
			}
			$("#chevron_right").show();
			vum.currentPaginationCount = 10;
		},
		nextPageClick: function(e) {
			$("#chevron_left").show();
			vum.paginationNum = vum.paginationNum + 1;

			if(vum.paginationNum === (vum.paginationCount - 1)) {
				$("#chevron_right").hide();
				vum.currentPaginationCount = Math.ceil((vum.dataLength - vum.paginationNum * 10 * 10) / 10);
			} else {
				vum.currentPaginationCount = 10;
			}
		}
	}
});

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
			data.categoryId = categoryId;
			requestUrl = "../article/getArticleByPage";
		}
		else{
			data.keyword = keyword;
			requestUrl = "../article/getArticleKeywordByPage";
		}
	}
	else{
		data.categoryId = categoryId;
		requestUrl = "../article/getArticleByPage";
	}
	
	$.ajax({

		type: "GET",
		url: requestUrl,
		dataType: "json",
		data: data,
		beforeSend: function() {
			$("#circleProgress").show();
		},
		success: function(data) {
			//将数据通过vue.js更新到数据列表
			vum.datas = data.object.list;
			$("#circleProgress").hide();
		},
		statusCode: {
			404: function() {
				Materialize.toast('没有相应的请求地址!', 4000);
			},
			500: function() {
				Materialize.toast('服务器内部错误!', 4000);
			}
		}
	});
}

(function() {
	
	var currentPage = 0;

	$.getJSON("../article/getArticleByPage", {
		offset: 0,
		limit: 10,
		categoryId:0
	}, function(data) {
		var pageNum = Math.ceil(data.object.count / 10);

		if(pageNum > 10) {
			vum.currentPaginationCount = 10;
		} else {
			vum.currentPaginationCount = pageNum;
		}

		vum.dataLength = data.object.count;
		vum.datas = data.object.list;
		vum.pageNum = pageNum;
		vum.paginationCount = Math.ceil(pageNum / 10);

		if(pageNum <= 10) {
			$("#chevron_right").hide();
			$("#chevron_left").hide();
		}
	});

	$("#addArticleContent").click(function() {
		window.localStorage.setItem("articleId", 0);
		$("#managePanel").empty();
		$("#managePanel").load("addArticleContent.html");
	});

	$("#addPptContent").click(function() {
		window.localStorage.setItem("articleId", 0);
		$("#managePanel").empty();
		$("#managePanel").load("addPptContent.html");
	});

	$("#addContentSign").html('');
	$("#categoryId").hide();

	$("#addContent").click(function() {
		let categoryId = $("#categoryId").html();
		$("#managePanel").empty();
		$("#managePanel").load("addContent.html");
		$("#addContentSign").html("1");
	});

	//回车进行搜索查询
	$("#condition").keydown(function(event) {
		if(event.keyCode == 13) {
			searchResult();
		}
	});

	//点击搜索图标进行查询
	$("#searchIcon").click(function() {
		searchResult();
	});
	

})();