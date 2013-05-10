/**
 * a class to access cookies in  javascript level
 * @return {[type]} [description]
 */
var _CookieManager = function(){
	/**
	 * set cookie [name=value]
	 * @param {[type]} name  [description]
	 * @param {[type]} value [description]
	 */
	function setCookie(name , value) {
		var days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + days*24*60*60*1000);
		document.cookie = name + "=" + escape(value) + ";expires="  + exp.toGMTString();
	}

	/**
	 * get cookie value by name
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	function getCookie(name) {
		var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     		if(arr != null) {
     			return unescape(arr[2]);
     		}
     		return null;
	}

	function delCookie(name) {
		var exp = new Date();
		exp.setTime( exp.getTime() -1 );
		var cval = getCookie(name);
		if (cval != null) {
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		}
	}

	return {
		setCookie : setCookie,
		getCookie : getCookie
	}
}