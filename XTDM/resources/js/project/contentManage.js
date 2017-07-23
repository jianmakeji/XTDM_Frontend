var prePage = 1; //前一页，用于css修改点击样式
var currentPage = 0; //当前页码

var categoryVue = new Vue({
	el: '#dropdown',
	data: {
		selected: '',
		menus: [{
			'id': '1',
			'name': '人文'
		}, {
			'id': '2',
			'name': '物语'
		}, {
			'id': '3',
			'name': '风景'
		}, {
			'id': '4',
			'name': '社区'
		}]
	},
	methods: {
		menuClick: function(event, index) {

			$("#breadcrumbs").html("内容管理   > " + text);
			$("#categoryId").html(id);

		}
	},
	mounted: function() {
		$('#dropdown select').material_select();
		$('#categorySelect').change(function() {
			categoryVue.selected = $('#categorySelect').val();
		});
	},
	watch: {
		selected: function(value) {
			console.log(value);
		}
	}
})

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
		showData: function() {
			$.getJSON("../resources/table.json", function(data) {
				vum.datas = data;
			});
		},
		getPageData: function(e) {
			$(".pagination").find('li[id=' + prePage + ']').removeClass('active').addClass('waves-effect');
			let id = e.currentTarget.id;
			this.activeNumber = id;
			$(".pagination").find('li[id=' + id + ']').addClass('active');
			prePage = id;

			$.getJSON("../resources/table.json", {
				offset: id * 10,
				limit: 10
			}, function(data) {

				vum.datas = data.slice((id - 1) * 10, (id - 1) * 10 + 10);

			});

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

function searchResult() {
	var keyword = $("#condition").val();
	var data = {
		'offset': 0,
		'limit': '10'
	};
	$.ajax({

		type: "POST",
		url: "../article/getArticleKeywordByPage",
		dataType: "json",
		data: data,
		beforeSend: function() {
			$("#circleProgress").show();
		},
		success: function(msg) {
			//将数据通过vue.js更新到数据列表

			vum.datas.push(requestData);

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
	
	var currentPage = 0;

	$.getJSON("../resources/table.json", {
		offset: 0,
		limit: 10
	}, function(data) {
		var pageNum = Math.ceil(data.length / 10);

		if(pageNum > 10) {
			vum.currentPaginationCount = 10;
		} else {
			vum.currentPaginationCount = pageNum;
		}

		vum.dataLength = data.length;
		vum.datas = data.slice(currentPage * 10, currentPage * 10 + 10);
		vum.pageNum = pageNum;
		vum.paginationCount = Math.ceil(pageNum / 10);

		if(pageNum <= 10) {
			$("#chevron_right").hide();
			$("#chevron_left").hide();
		}
	});

	$("#addArticleContent").click(function() {
		$("#managePanel").empty();
		$("#managePanel").load("addArticleContent.html");
	});

	$("#addPptContent").click(function() {
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