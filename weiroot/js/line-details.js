//标题简介吸顶
$(function() {
	$(window).scroll(function() {
		var spaceHight = $('#price_bar').innerHeight();
		var toptip = $('.detailbanner');
		var oTopbar = $('#price_bar');
		var tabbox = $(".intro-tit");
		var tabsItems = $(".intro-tit li");
		var allcont=$(".intro");
		tabsCons=[];
		$(".intro .intro-con").each(function(){
			if($(this).attr("tab")){
				tabsCons.push($(this));
			}
		});
		if($(window).scrollTop()>toptip.offset().top+toptip.outerHeight()+5){
			oTopbar.css({
				"position": "fixed",
				"top": "0px",
				"box-shadow":"0 0.3rem 0.3rem rgba(0,0,0,.3)"
			}).next().css('margin-top',spaceHight+10);
		}else{
			oTopbar.css({
				"position": "relative",
				"top": "",
				"box-shadow":"0 0 0 rgba(0,0,0,0)"
			}).next().css('margin-top','0.5rem');
		}
		for(var i=tabsItems.length-1;i>=0;i--){
			if(tabsCons[i].offset().top<$(window).scrollTop()+oTopbar.outerHeight()){
				tabsItems.removeClass("on").eq(i).addClass("on");
				break;
			}
		}
		tabsItems.click(function(e){
			var index=tabsItems.index($(this));
			$("html,body").stop().animate({scrollTop:tabsCons[index].offset().top - spaceHight+5},800);
		});
		
	});
	
	//经理推荐
	if($('.recommend .dj_feiynr').height()<=150){
	  $(".recommend .showbtn").hide();
	} else {
	   $(".recommend .showbtn.show").show();
	   $(".dj_feiynr").css({height: '7rem'});
	   $(".recommend .show").click(function(){
		$(this).hide();
		$(this).parent(".recommend").find(".up").css({display: 'block'});
		$(this).parent(".recommend").find(".dj_feiynr").css({height: 'auto'})
	  });
	  $(".recommend .up").click(function(){
		$(this).hide();
		$(this).parent(".recommend").find(".show").show();
		$(this).parent(".recommend").find(".dj_feiynr").css({height: '7rem'})
	  });
	}

})



