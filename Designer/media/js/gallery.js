$(function(){
	function getMoreScene(page){
		$.get(
			'/scene/getallscenelist/' + page ,
			{},
			function(data){
				$("#scene-ul").append(data);
				if(data === "") {
					$('#get-more-scene').text("No more scenes.")
				}
			}
		);
	}

	$('#get-more-scene').on('click',function(event){
		var page = $(this).attr("data-page");
		page++;
		getMoreScene(page);
		$(this).attr("data-page",page);
	});
});