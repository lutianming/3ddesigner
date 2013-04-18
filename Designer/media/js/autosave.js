
var AutoSaveTime=6000;

var AutoSaveTimer;


window.onload = initpage();


function initpage() {	
	SetAutoSave();
}

function AutoSave() {
	var contentStr = getFormQueryString("postForm");
	var strs = contentStr;
	var title = strs;
	var action = "save";
	var url="autosave/";
	var json_obj = {"title":title,"action":action};
	var json_str = JSON.stringify(json_obj);
	//$.post(url,{"title":title},function(msg){ alert("save");$("#AutoSaveMsg").html(msg);});
	$.post(url,json_str,savecallback,"json");
	
}

function savecallback(json){
	//alert("savecallback");
	$("#AutoSaveMsg").html(json['result']);
}

function SetAutoSave() {
	AutoSaveTimer=setInterval("AutoSave()",AutoSaveTime);
}










