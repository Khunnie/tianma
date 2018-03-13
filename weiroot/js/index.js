$(function(){
	
	//显示引导提示
	$('.tit-select').on("click",function(){
		if($(".classify ul").is(':visible')===false){
			 $(this).siblings('.money_sw').stop().show().animate({
	            opacity: 1
	        })
		 }else{
		 	 $(this).siblings('.money_sw').stop().hide().css({
	            opacity: 0
	        })
		 }
	})
   
 	$('.money_sw li').click(function () {
        $(this).closest('.classify').find('.tit-select .selectbox').html($(this).html());
		$(this).addClass("on").siblings("a").removeClass("on");
        $(this).closest('.money_sw').hide();
    })
	$('.yy-btn').click(function () {
		$(".language-box,.overmark").show();
	})
	$(".close-box ").click(function(){
		$(".language-box,.overmark").hide();
	})

	$('.bz-btn').click(function () {
		$(".curren-box,.overmark").show();
	})
	$(".curren-box li").click(function(){
		$(".curren-box,.overmark").hide();
	})
	$(".language-box li").click(function(){
		$(".language-box,.overmark").hide();
	})

})
