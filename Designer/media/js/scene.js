$(function(){
	$('#three-tab').on('click',function(event){
		$('#three-scene').show();
		$('#two-scene').hide();
		$(this).parent().addClass('active');
		$('#two-tab').parent().removeClass('active');
		// window.location.href='http://localhost:8000/scene/edit/11#'+$(this).attr("id");

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
		// window.location.href='http://localhost:8000/scene/edit/11#'+$(this).attr("id");
	});

	$("[id^=save-btn]").on("click",function(event){
		saveScene();
	});

	$("#save-draft-btn").on("click",function(event){
		saveDraft();
	});

	function saveDraft() {
		var content3 = exportJSON();
		var content2 = Two.save();
		var title = $("#inputSceneTitle").val();
		var description =  $("#inputSceneDescription").val();
		var sceneId = $("#sceneId").val();

		$.post(
			'/scene/save/',
			{
				content3 : content3,
				content2 : content2,
				title : title,
				description : description,
				sceneId : sceneId,
				draft : draft
			},
			function(data) {
				alert(data);
			}
		);
	}

	function saveScene() {
		$("#sceneContentData").val(exportJSON());
		$("#towContentData").val(Two.save());
		$("#scene-data-form").submit();
	}
});
