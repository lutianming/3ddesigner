window.onload = initPage;

function initPage() {
  
  element_list = getElementsByClassName(document, "comment_detail");
  for (var i=0;i<element_list.length; i++){
  	content1 = element_list[i].childNodes[0].nodeValue;
  	content1 = content1.replace(/\.\.\/\.\.\//,'/');
  	element_list[i].innerHTML = content1;
  }  
  
  comment_list = document.getElementById("comment_list");
  comment_list.style.visibility = "visible";

}

