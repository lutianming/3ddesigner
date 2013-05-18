$(function(){

	/* button click event */
	$('#three-tab').on('click',function(event){
		$('#three-scene').show();
		$('#two-scene').hide();
		$(this).parent().addClass('active');
		$('#two-tab').parent().removeClass('active');
		// window.location.href='http://localhost:8000/scene/edit/11#'+$(this).attr('id');

		$('#loading-box').show();

		editData = JSON.parse(exportJSON());

		$('#v-container').remove();

		$('#outer-v-container').append('<div id="v-container"></div>');

		var container = document.getElementById('v-container');
		var app = new _App();
		globalApp = app;
		app.startApp({container:container});

		$('#v-container').focus();

		$('#loading-box').hide();
	});

	$('#two-tab').on('click',function(event){
		$('#two-scene').show();
		$('#three-scene').hide();
		$(this).parent().addClass('active');
		$('#three-tab').parent().removeClass('active');
		// window.location.href='http://localhost:8000/scene/edit/11#'+$(this).attr('id');
	});

	$('[id^=save-btn]').on('click',function(event){
		saveScene();
	});

	$('#save-draft-btn').on('click',function(event){
		saveDraft();
	});

	// init controls by cookie data
	var controlmode = _CookieManager().getCookie('threemode');
	if (controlmode === undefined || controlmode==0) {
		$('#ov-btn').addClass('active');
		$('#track-alert').show();
		$('#firstperson-alert').hide();
	}
	else {
		$('#fp-btn').addClass('active');
		$('#track-alert').hide();
		$('#firstperson-alert').show();
	}

	$('#ov-btn').on('click',function(event){
		_CookieManager().setCookie('threemode',0);
		$('#track-alert').show();
		$('#firstperson-alert').hide();
		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		globalApp.setControls(0);
	});

	$('#fp-btn').on('click',function(event){
		_CookieManager().setCookie('threemode',1);
		$('#track-alert').hide();
		$('#firstperson-alert').show();
		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		$('#v-container canvas').focus();
		globalApp.setControls(1);
	});

	function saveDraft() {
		var content3 = exportJSON();
		var content2 = Two.save();
		var title = $('#inputSceneTitle').val();
		var description =  $('#inputSceneDescription').val();
		var sceneId = $('#sceneId').val();
		var draft = true;

		if (title.length==0) {
			alert('Please fill in title and description');
			return;
		}

		$.post(
			'/scene/save/',
			{
				contentthree : content3,
				contenttwo : content2,
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

		var title = $('#inputSceneTitle').val();

		if (title.length==0) {
			alert('Please fill in title');
			return;
		}

		$('#sceneContentData').val(exportJSON());
		$('#towContentData').val(Two.save());


		function saveCallback(img) {
			$('#sceneImageUrlData').val(img.src);
			$('#scene-data-form').submit();
		}
		
		Two.snapshot(saveCallback);
	}
});
