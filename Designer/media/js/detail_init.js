window.onload = initPage;

function initPage() {
  element = document.getElementById("msg_content");
  content = element.childNodes[0].nodeValue;
  content = content.replace(/\.\.\//,'/');
  element.innerHTML = content;
  element.style.visibility = "";

  
  element_list = getElementsByClassName(document, "comment_detail");
  for (var i=0;i<element_list.length; i++){
  	content1 = element_list[i].childNodes[0].nodeValue;
  	content1 = content1.replace(/\.\.\/\.\.\//,'/');
  	element_list[i].innerHTML = content1;
  }  
  
  table = document.getElementById("msg_list");
  table.style.visibility = "visible";
  
  comment_list = document.getElementById("comment_list");
  comment_list.style.visibility = "visible";
  
  table = document.getElementById("id_content_td1");
  table.style.height = "300px";
  iframe = document.getElementById("id_content_ifr");
  iframe.style.height = "100%";
}
