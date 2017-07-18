var vum = new Vue({
	el: '#dataTable',
	data: {
		datas: ""
	}
});

(function() {

	$.getJSON("../resources/category.json", function(data) {

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

	var bgImgUrl = "";
	
	$("#submit").click(function() {
		let title = $("#title").val();
		let describe = $("#describe").val();

		if(title == "") {
			Materialize.toast('标题不能为空!', 4000);
			return;
		}

		if(describe == "") {
			Materialize.toast('描述不能为空!', 4000);
			return;
		}


		let data = {"name":title,"describe":describe,"bgImgUrl":bgImgUrl};
		
		$.ajax({

			type: "POST",
			url: "some.php",
			dataType:"json",
			data: data,
			beforeSend:function(){
				$("#circleProgress").show();
			},
			success: function(msg) {
				$("#circleProgress").hide();
			},
			statusCode: {404: function() {
    				alert('page not found');
  				},500:function(){
  				
  				}
			}
		});
	});

	$("#cancel").click(function() {
		showCategory = 0;
		$("#addPanel").hide();
		$("#circleProgress").hide();
	});
})();