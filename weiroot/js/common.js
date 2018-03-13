;
(function($) {
//	if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
//		if (window.location.href.indexOf("?mobile") < 0) {
//			try {
//				if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
//					window.location.href = "http://www.baidu.com";
//				} else if (/iPad/i.test(navigator.userAgent)) {} else {
//					window.location.href = "http://www.baidu.com"
//				}
//			} catch (e) {}
//		}

//	}

	$.extend({
          weburl: "http://www.2300000.com/",
		//dburl: "http://58.49.57.33/tools/app_ajax.ashx",
		//dburl: "http://192.168.1.18/tools/app_ajax.ashx",
		//dburl: "http://localhost:11897/tools/app_ajax.ashx",
		dburl: "../../tools/app_ajax.ashx",
//		payurl: "http://www.sjwhly.cn/api/payment/alipaypc/index.aspx",
//		weburl: "http://www.sjwhly.cn/",
		SetLoginLocalStorage: function(n) {
			localStorage.setItem("name", n);
			localStorage.setItem("time", $.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"));
		},
		isLogin: function() {
			var gsthistime = $.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
			var localtime = localStorage.getItem("time");
			if (localtime == "" || localtime == null) {
				return false;
			}
			if ($.DiffLong(localtime, gsthistime)) return true;
			return false;
		},
		OutLogin: function() {
			localStorage.removeItem("name");
			localStorage.removeItem("time");
		},
		StrSubString: function(str, num) {
			if (str.length > num) {
				return str.substring(0, num) + "...";
			}
			return str;
		},
		dateFormat: function(dates, fmt) {
			dates = new Date(dates.toString().replace(/-/g, '/'));
			var o = {
				"M+": dates.getMonth() + 1, //月份
				"d+": dates.getDate(), //日
				//"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
				"h+": dates.getHours(), //小时
				"m+": dates.getMinutes(), //分
				"s+": dates.getSeconds(), //秒
				"q+": Math.floor((dates.getMonth() + 3) / 3), //季度
				"S": dates.getMilliseconds() //毫秒
			};
			var week = {
				"0": "/u65e5",
				"1": "/u4e00",
				"2": "/u4e8c",
				"3": "/u4e09",
				"4": "/u56db",
				"5": "/u4e94",
				"6": "/u516d"
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			if (/(E+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		},
		getQueryString: function(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return unescape(r[2]);
			}
			return null;
		},
		Request: function(url, data, successCallback) {
			$.ajax({
				type: "post",
				url: $.dburl + "?" + url + "&callback=?",
				data: data,
				dataType: "jsonp",
				success: function(data) {
					successCallback(data);
				}
			});
		},
		DiffLong: function(datestr1, datestr2) {
			//date2>date1
			var date1 = new Date(Date.parse(datestr1.replace(/-/g, "/")));
			var date2 = new Date(Date.parse(datestr2.replace(/-/g, "/")));
			var datetimeTemp;
			var isLater = true;

			if (date1.getTime() > date2.getTime()) {
				isLater = false;
				datetimeTemp = date1;
				date1 = date2;
				date2 = datetimeTemp;
			}

			difference = date2.getTime() - date1.getTime();
			thisdays = Math.floor(difference / (1000 * 60 * 60 * 24));

			difference = difference - thisdays * (1000 * 60 * 60 * 24);
			thishours = Math.floor(difference / (1000 * 60 * 60 * 24));
			// var strRet = thisdays + '天' + thishours + '小时';
			if (thisdays > 0) {
				return false;
			}

			var strRet = Math.floor(difference / (1000 * 60));
			if (strRet > 20) return false;
			return true;
		},
		mytel: function() {
			tel('24小时服务热线', '0731-82366888');
		},
		GetUrl: function() {
			var url = document.referrer;
			if (url == "" || url == null) {
				return "usercenter.html";
			}
			var urlArr = url.split('/');
			return urlArr[urlArr.length - 1];
		},

		isReturnLogin: function(s) {
			if (s == "islogin") {
				alert("登陆失效，请重新登陆！");
				window.location = "login.html";
			} else {
				ShowMsg(s);
			}
		}
	});

//	}
	$.extend({
		//dburl: "http://58.49.57.33/tools/app_ajax.ashx",
		//dburl: "http://192.168.1.18/tools/app_ajax.ashx",
		//dburl: "http://localhost:11897/tools/app_ajax.ashx",
		dburl: "../../tools/app_ajax.ashx",
//		payurl: "http://www.sjwhly.cn/api/payment/alipaypc/index.aspx",
//		weburl: "http://www.sjwhly.cn/",
		SetLoginLocalStorage: function(n) {
			localStorage.setItem("name", n);
			localStorage.setItem("time", $.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"));
		},
		isLogin: function() {
			var gsthistime = $.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
			var localtime = localStorage.getItem("time");
			if (localtime == "" || localtime == null) {
				return false;
			}
			if ($.DiffLong(localtime, gsthistime)) return true;
			return false;
		},
		OutLogin: function() {
			localStorage.removeItem("name");
			localStorage.removeItem("time");
		},
		StrSubString: function(str, num) {
			if (str.length > num) {
				return str.substring(0, num) + "...";
			}
			return str;
		},
		dateFormat: function(dates, fmt) {
			dates = new Date(dates.toString().replace(/-/g, '/'));
			var o = {
				"M+": dates.getMonth() + 1, //月份
				"d+": dates.getDate(), //日
				//"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
				"h+": dates.getHours(), //小时
				"m+": dates.getMinutes(), //分
				"s+": dates.getSeconds(), //秒
				"q+": Math.floor((dates.getMonth() + 3) / 3), //季度
				"S": dates.getMilliseconds() //毫秒
			};
			var week = {
				"0": "/u65e5",
				"1": "/u4e00",
				"2": "/u4e8c",
				"3": "/u4e09",
				"4": "/u56db",
				"5": "/u4e94",
				"6": "/u516d"
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			if (/(E+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		},
		getQueryString: function(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return unescape(r[2]);
			}
			return null;
		},
		Request: function(url, data, successCallback) {
			$.ajax({
				type: "post",
				url: $.dburl + "?" + url + "&callback=?",
				data: data,
				dataType: "jsonp",
				success: function(data) {
					successCallback(data);
				}
			});
		},
		DiffLong: function(datestr1, datestr2) {
			//date2>date1
			var date1 = new Date(Date.parse(datestr1.replace(/-/g, "/")));
			var date2 = new Date(Date.parse(datestr2.replace(/-/g, "/")));
			var datetimeTemp;
			var isLater = true;

			if (date1.getTime() > date2.getTime()) {
				isLater = false;
				datetimeTemp = date1;
				date1 = date2;
				date2 = datetimeTemp;
			}

			difference = date2.getTime() - date1.getTime();
			thisdays = Math.floor(difference / (1000 * 60 * 60 * 24));

			difference = difference - thisdays * (1000 * 60 * 60 * 24);
			thishours = Math.floor(difference / (1000 * 60 * 60 * 24));
			// var strRet = thisdays + '天' + thishours + '小时';
			if (thisdays > 0) {
				return false;
			}

			var strRet = Math.floor(difference / (1000 * 60));
			if (strRet > 20) return false;
			return true;
		},
		mytel: function() {
			tel('24小时服务热线', '0731-85012281');
		},
		GetUrl: function() {
			var url = document.referrer;
			if (url == "" || url == null) {
				return "usercenter.html";
			}
			var urlArr = url.split('/');
			return urlArr[urlArr.length - 1];
		},

		isReturnLogin: function(s) {
			if (s == "islogin") {
				alert("登陆失效，请重新登陆！");
				window.location = "login.html";
			} else {
				ShowMsg(s);
			}
		}
	});

//	}
	$.extend({
		//dburl: "http://58.49.57.33/tools/app_ajax.ashx",
		//dburl: "http://192.168.1.18/tools/app_ajax.ashx",
		//dburl: "http://localhost:11897/tools/app_ajax.ashx",
		dburl: "../../tools/app_ajax.ashx",
//		payurl: "http://www.sjwhly.cn/api/payment/alipaypc/index.aspx",
//		weburl: "http://www.sjwhly.cn/",
		SetLoginLocalStorage: function(n) {
			localStorage.setItem("name", n);
			localStorage.setItem("time", $.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"));
		},
		isLogin: function() {
			var gsthistime = $.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
			var localtime = localStorage.getItem("time");
			if (localtime == "" || localtime == null) {
				return false;
			}
			if ($.DiffLong(localtime, gsthistime)) return true;
			return false;
		},
		OutLogin: function() {
			localStorage.removeItem("name");
			localStorage.removeItem("time");
		},
		StrSubString: function(str, num) {
			if (str.length > num) {
				return str.substring(0, num) + "...";
			}
			return str;
		},
		dateFormat: function(dates, fmt) {
			dates = new Date(dates.toString().replace(/-/g, '/'));
			var o = {
				"M+": dates.getMonth() + 1, //月份
				"d+": dates.getDate(), //日
				//"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
				"h+": dates.getHours(), //小时
				"m+": dates.getMinutes(), //分
				"s+": dates.getSeconds(), //秒
				"q+": Math.floor((dates.getMonth() + 3) / 3), //季度
				"S": dates.getMilliseconds() //毫秒
			};
			var week = {
				"0": "/u65e5",
				"1": "/u4e00",
				"2": "/u4e8c",
				"3": "/u4e09",
				"4": "/u56db",
				"5": "/u4e94",
				"6": "/u516d"
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			if (/(E+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		},
		getQueryString: function(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return unescape(r[2]);
			}
			return null;
		},
		Request: function(url, data, successCallback) {
			$.ajax({
				type: "post",
				url: $.dburl + "?" + url + "&callback=?",
				data: data,
				dataType: "jsonp",
				success: function(data) {
					successCallback(data);
				}
			});
		},
		DiffLong: function(datestr1, datestr2) {
			//date2>date1
			var date1 = new Date(Date.parse(datestr1.replace(/-/g, "/")));
			var date2 = new Date(Date.parse(datestr2.replace(/-/g, "/")));
			var datetimeTemp;
			var isLater = true;

			if (date1.getTime() > date2.getTime()) {
				isLater = false;
				datetimeTemp = date1;
				date1 = date2;
				date2 = datetimeTemp;
			}

			difference = date2.getTime() - date1.getTime();
			thisdays = Math.floor(difference / (1000 * 60 * 60 * 24));

			difference = difference - thisdays * (1000 * 60 * 60 * 24);
			thishours = Math.floor(difference / (1000 * 60 * 60 * 24));
			// var strRet = thisdays + '天' + thishours + '小时';
			if (thisdays > 0) {
				return false;
			}

			var strRet = Math.floor(difference / (1000 * 60));
			if (strRet > 20) return false;
			return true;
		},
		mytel: function() {
			tel('24小时服务热线', '0731-85012281');
		},
		GetUrl: function() {
			var url = document.referrer;
			if (url == "" || url == null) {
				return "usercenter.html";
			}
			var urlArr = url.split('/');
			return urlArr[urlArr.length - 1];
		},

		isReturnLogin: function(s) {
			if (s == "islogin") {
				alert("登陆失效，请重新登陆！");
				window.location = "login.html";
			} else {
				ShowMsg(s);
			}
		}
	});
	 function show(str,box){
		str.bind("click",function(){
			 $('html,body').addClass('ovfHiden');
			$(".overmark").show();
			box.show();
		})
	}
	show($(".filtrate"),$(".screen-page"))
	show($(".rank"),$(".rank-page"))
	show($(".purpose"),$(".purpose-page"))
	$(".rank-page li").click(function(){
		$(".overmark,.rank-page").hide();
	})
	/*取消*/
	$(".Close").bind("click",function(){
		
		 $('html,body').removeClass('ovfHiden');
		$(".overmark,.screen-page,.purpose-page,.rank-page").hide();
	})
	/*右侧点击切换*/
	$(".screen-page .menu_nav li").click(function(){
		$(this).addClass("this").siblings().removeClass("this");
		$(".screen-page .menu-content").hide();
		$(".screen-page .menu-content").eq($(this).index()).show();
	})
	$(".purpose-page .menu_nav li").click(function(){
		$(this).addClass("this").siblings().removeClass("this");
		$(".purpose-page .menu-content").hide();
		$(".purpose-page .menu-content").eq($(this).index()).show();
	})
	
	/*清空*/
	$(".empty span").click(function(){
		$(".menu-list ul li input").attr("checked", false);
	})
	/*勾选*/
	$(".menu-list ul li").on("click",function(){
		var input = $(this).find("input");
		if ($(input).is(":checked")){
            $(input).prop("checked", false);
        }
       else
        {
            $(input).prop("checked", true);
        }
	})
	// $(".menu-list ul li").click(function(){
	// 	var input = $(this).find("input");
	// 	if ($(input).is(":checked")){
 //            $(input).prop("checked", false);
 //        }
 //       else
 //        {
 //            $(input).prop("checked", true);
 //        }
	// })
	/*确定*/
	$(".success").click(function(){
		 $('html,body').removeClass('ovfHiden');
		$(".overmark,.screen-page,.purpose-page,.rank-page").hide();
	})

})(jQuery);