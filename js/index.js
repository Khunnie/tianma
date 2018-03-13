$(function () {
	/*banner效果*/
	var index = 0;
	var picTimer;
	var sWidth;
	var len = $("#focus ul li").length;
	var btn = "<div class='banner-btns'><div class='btn'>";
	for (var i = 0; i < len; i++) {
		btn += "<span></span>";
	}
	btn += "</div></div>";
	$("#focus").append(btn);
	sWidth = $(window).width();
	$(window).resize(function () {
		sWidth = ($(window).width() <= 1200) ? 1200 : $(window).width();
		$('#focus').width(sWidth);
		$('#focus ul li').width(sWidth);
	});
	$('#focus').width(sWidth);
	$('#focus ul li').width(sWidth);

	$("#focus .btn span").mouseover(function () {
		index = $("#focus .btn span").index(this);
		showPics(index, sWidth);
	}).eq(0).trigger("mouseover");

	$("#focus ul").css("width", sWidth * (len));

	$("#focus").hover(function () {
		$('#focus .wrap').addClass('active');
		clearInterval(picTimer);
	}, function () {
		$('#focus .wrap').removeClass('active');
		picTimer = setInterval(function () {
			if (index == len - 1) {
				index = -1;
			}
			showPics(index + 1, sWidth);
			index++;
			// showPics(index,sWidth);
			// index++;
			// if(index == len) {index = 0;}
		}, 5000);
	}).trigger("mouseleave");


	$('.pre').click(function () {
		if (index == 0) {
			index = len;
		}
		showPics(index - 1, sWidth);
		index--;
	})

	$('.next').click(function () {
		if (index == len - 1) {
			index = -1;
		}
		showPics(index + 1, sWidth);
		index++;

	})
	//$('.holiday-block ul li:last-child').addClass("cur");
	//手风琴
	$(".holiday-block li").hover(function() {
		if($(window).width()<=1320){
			$(this).stop().animate({"width":"310px"},500).siblings().stop().animate({"width":"120px"},500);// 当鼠标移动到li上，当前变600 其余的兄弟变90
			$(this).find("span").stop().css({"background-color":"rgba(0,0,0,0)","padding-top":"120px","height":"190px"}).parents("li").siblings().find("span").stop().css({"background-color":"rgba(0,0,0,0.5)","padding-top":"80px","height":"230px"});
		}else{
			$(this).stop().animate({"width":"490px"},500).siblings().stop().animate({"width":"120px"},500);// 当鼠标移动到li上，当前变600 其余的兄弟变90
			$(this).find("span").stop().css({"background-color":"rgba(0,0,0,0)","padding-top":"120px","height":"190px"}).parents("li").siblings().find("span").stop().css({"background-color":"rgba(0,0,0,0.5)","padding-top":"80px","height":"230px"});
		}
		
		//$(this).find("span").stop().addClass("cur").parents("li").siblings().find("span").stop().removeClass("cur");
	});
	
	function showPics(index, sWidth) {
		$("#focus ul").css("width", sWidth * (len));
		var nowLeft = -index * sWidth;
		$("#focus ul").stop(true, false).animate({"left": nowLeft}, 300);
		$("#focus .btn span").stop(true, false).removeClass('on').eq(index).stop(true, false).addClass('on');
	}
	
	$('.rightBarBot .linkTop').click(function () {
        $('html,body').stop(!0, !0).animate({
            scrollTop: 0
        }, 600)
    })
	
	
	
})