var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: "",
		pageNum: "",
		activeNumber: 1,
		pageCount: 10
	},
	methods: {
		showData: function() {
			$.getJSON("resources/music.json", function(data) {
				vum.datas = data;
			});
		}
	}
});

(function() {

	var currentPage = 0;

	$.getJSON("resources/music.json", function(data) {
		var pageNum = data.length / 10;
		if(data.length % 10 != 0) {
			pageNum = pageNum + 1;
		}
		vum.datas = data.slice(currentPage * 10, currentPage * 10 + 10);
		vum.pageNum = pageNum;
	});

	var showCategory = 0;
	$("#addMusic").click(function() {
		if(showCategory == 0) {
			showCategory = 1;
			$("#addPanel").show('slow');
		} else {
			showCategory = 0;
			$("#addPanel").hide();
		}
	});

	$("#cancel").click(function() {
		showCategory = 0;
		$("#addPanel").hide();
	});
})();