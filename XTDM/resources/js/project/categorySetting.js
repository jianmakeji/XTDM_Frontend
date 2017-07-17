var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: ""
	},
	methods: {
		showData: function() {
			$.getJSON("category.json", function(data) {
				vum.datas = data;
			});
		}
	}
});

(function() {

	var currentPage = 0;

	$.getJSON("category.json", function(data) {

		vum.datas = data;
	});

	var showCategory = 0;
	$("#addCategory").click(function() {
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