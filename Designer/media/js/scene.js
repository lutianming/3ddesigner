$(function(){
	$('#three-tab').on('click',function(event){
		$('#three-scene').show();
		$('#two-scene').hide();
		$(this).parent().addClass('active');
		$('#two-tab').parent().removeClass('active');

		$("#loading-box").show();

		editData = JSON.parse(exportJSON());

		$('#v-container').remove();

		$('#outer-v-container').append('<div id="v-container"></div>');

		var container = document.getElementById('v-container');
		var app = new SceneViewer();
		app.init({
			container: container
		});
		app.run();

		$("#loading-box").hide();
	});

	$('#two-tab').on('click',function(event){
		$('#two-scene').show();
		$('#three-scene').hide();
		$(this).parent().addClass('active');
		$('#three-tab').parent().removeClass('active');
	});
});
