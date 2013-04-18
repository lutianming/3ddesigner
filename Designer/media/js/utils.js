function createRequest() {
  try {
    request = new XMLHttpRequest();
  } catch (tryMS) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (otherMS) {
      try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (failed) {
        request = null;
      }
    }
  }	
  return request;
}

function getElementsByClassName(node,classname) {
  if (node.getElementsByClassName) { // use native implementation if available
    return node.getElementsByClassName(classname);
  } else {
    return (function getElementsByClass(searchClass,node) {
        if ( node == null )
          node = document;
        var classElements = [],
            els = node.getElementsByTagName("*"),
            elsLen = els.length,
            pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

        for (i = 0, j = 0; i < elsLen; i++) {
          if ( pattern.test(els[i].className) ) {
              classElements[j] = els[i];
              j++;
          }
        }
        return classElements;
    })(classname, node);
  }
}

function getFormQueryString(frmID)
{ 
	   var frmID=document.getElementById(frmID); 
       var i,queryString = "", and = "";
       var item; 
       var itemValue;
       for( i=0;i<frmID.length;i++ ) 
       {
              item = frmID[i];
              if ( item.name!='' ) 
              {
                     if ( item.type == 'select-one' ) 
                     {
                            itemValue = item.options[item.selectedIndex].value;
                     }
                     else if ( item.type=='checkbox' || item.type=='radio') 
                     {
                            if ( item.checked == false )
                            {
                                   continue;    
                            }
                            itemValue = item.value;
                     }	
					 else if ( item.type == 'button' || item.type == 'submit' || item.type == 'reset' || item.type == 'image')
                     {
                            continue;
                     }
                     else 
                     {
                            itemValue = item.value;
                     }
                     itemValue = escape(itemValue);
                     queryString += and + itemValue;
                     and="&";
              }
       }
       return queryString;
}