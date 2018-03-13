$(function(){
	
	//显示引导提示
	var guideTips = $.cookie('guide_tips');
	if(guideTips != 1) {
		$("#J_guide_tips").show();
		setTimeout("$('#J_guide_tips').fadeOut('fast');$.cookie('guide_tips', 1);",7000);
	}
	
	$("#J_guide_tips i").click(function(){
	   $("#J_guide_tips").fadeOut('fast');
	   $.cookie('guide_tips', 1);
	});
	
	$('.money_sw_box').mouseenter(function () {
        $(this).find('.money_sw').stop().show().animate({
            opacity: 1
        })
    }).mouseleave(function () {
        $(this).find('.money_sw').stop().hide().css({
            opacity: 0
        })
    })
 	$('.money_sw a').click(function () {
        $(this).closest('.money_sw_box').find('.money_sw_box_txt .sw_syb').text($(this).find('.sw_syb').text());
		$(this).addClass("on").siblings("a").removeClass("on");
        $(this).closest('.money_sw').hide();
    })
	$('.language_box').mouseenter(function () {
			$(this).find('.language_sw').stop().show().animate({
				opacity: 1
			})
		}).mouseleave(function () {
			$(this).find('.language_sw').stop().hide().css({
				opacity: 0
			})
		})
	$('.language_sw a').click(function () {
		$(this).closest('.language_box').find('.language_box_txt .lg_nr').html($(this).html());
		$(this).addClass("on").siblings("a").removeClass("on");
		$(this).closest('.language_sw').hide();
	})
	$(".classify_nav li").on({
		mouseover:function(){
			$(this).children(".menu-box").show();
		},
		mouseout:function(){
			$(this).children(".menu-box").hide();
		}
	})
	//加减组件初始化
	$(function() {
		init();	 
	})
	function init(){
		$(".jsq").each(function(){
			if(!$(this).hasClass("fixcount"))
			{
				Adder("#" + $(this).attr("id"));
			}
		});
	}
	//加减法
	function Adder(id, MinInum, to, MaxInum) {
		var Add = $(id).find('.ic-input-add');
		var Sub = $(id).find('.ic-input-lessen');
		if(Add.hasClass("fixcount"))
		{
			return;
		}
		if(Sub.hasClass("fixcount"))
		{
			return;
		}
		var InpuText = $(id).find('.agetype');

		var Inum = 0;
		Inum = $(id).find('.agetype').val();
		if (Inum <= 0) {
			InpuText.val(0);
			Inum = 0;
			InpuText.css('color','#999');
		}else{
			InpuText.css('color','');
		}
		if (to) {		
			Add.click(function() {
				if (Inum >= 0 && Inum < MaxInum) {
					$(this).parent().find('.agetype').val(parseInt(Inum)+1);
					Inum++;
					InpuText.css('color','');			
				}
				var indexNow = $(this).parents('.typeinfo').index();
				//getp(indexNow);
			});
		} else {
			Add.click(function() {
				if (Inum >= 0) {
					$(this).parent().find('.agetype').val(parseInt(Inum)+1);
					Inum++;
					InpuText.css('color','');
				}
				var indexNow = $(this).parents('.typeinfo').index();
				//getp(indexNow);
			});
		}
		Sub.click(function() {
			if (Inum > 0) {
				$(this).parent().find('.agetype').val(parseInt(Inum)-1);
				Inum--;
				
			}else if (Inum == 0) {
				Inum = 0;
				$(this).parent().find('.agetype').val(Inum);
				InpuText.css('color','#999');
			}
			var indexNow = $(this).parents('.typeinfo').index();
			//getp(indexNow);
		});
	} 
	// 门票签证下拉框
	$(".numSelect").on("click",".Intab",function(){
		var Select = $(this).siblings(".lei-box");
		if (Select .height() ===0) {
			$(".ico-select").addClass("active")
			Select.css("border","1px solid #d1d1d1")
			Select.animate({height:"155px"})

		}else{
			$(".ico-select").removeClass("active")
			Select.css("border","none")
			Select.animate({height:"0px"})
		}
	})
	// 确定
	$(".lei-box").on("click",".sure",function(){
		$(this).parents(".lei-box").animate({height:"0px"},50)
	})
})
