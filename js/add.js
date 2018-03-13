$(function() {
	init();	 
})

//加减组件初始化
function init(){
	$(".adder").each(function(){
		if(!$(this).hasClass("fixcount"))
		{
			adder("#" + $(this).attr("id"));
		}
	});
}

//加减法
function adder(id, MinInum, to, MaxInum) {
	var Add = $(id).find('.add');
	var Sub = $(id).find('.sub');
	if(Add.hasClass("fixcount"))
	{
		return;
	}
	if(Sub.hasClass("fixcount"))
	{
		return;
	}
	var InpuText = $(id).find('.inpuText');

	var Inum = 0;
	Inum = $(id).find('.inpuText').val();
	if (Inum <= 0) {
		Sub.addClass('disabled');
		Add.removeClass('disabled');
		InpuText.val(0);
		Inum = 0;
		InpuText.css('color','#999');
	}else{
		Sub.removeClass('disabled');
		InpuText.css('color','');
	}
	if (to) {
		if(Inum > 0 && Inum < MaxInum){
			Sub.removeClass('disabled');
			Add.removeClass('disabled');
		}
		Add.click(function() {
			if (Inum >= 0 && Inum < MaxInum) {
				$(this).parent().find('.inpuText').val(parseInt(Inum)+1);
				Inum++;
				Sub.removeClass('disabled');
				Add.removeClass('disabled');
				InpuText.css('color','');
				if (Inum == MaxInum) {
					Add.addClass('disabled');
					Sub.removeClass('disabled');
				}
			}
			var indexNow = $(this).parents('.typeinfo').index();
			//getp(indexNow);
		});
	} else {
		Add.click(function() {
			if (Inum >= 0) {
				$(this).parent().find('.inpuText').val(parseInt(Inum)+1);
				Inum++;
				Sub.removeClass('disabled');
				InpuText.css('color','');
			}
			var indexNow = $(this).parents('.typeinfo').index();
			//getp(indexNow);
		});
	}
	Sub.click(function() {
		if (Inum > 0) {
			Add.removeClass('disabled');
			$(this).parent().find('.inpuText').val(parseInt(Inum)-1);
			Inum--;
			if (Inum == 0) {
				Sub.addClass('disabled');
				InpuText.css('color','#999');
			}
		}else if (Inum == 0) {
			Inum = 0;
			$(this).parent().find('.inpuText').val(Inum);
			Sub.addClass('disabled');
			InpuText.css('color','#999');
		}
		var indexNow = $(this).parents('.typeinfo').index();
		//getp(indexNow);
	});
}
/*更多*/
function More(obj,name){
	obj.click(function(){
		var seah = $(this).parents(".place-nav").find(name).height();
		if (seah<50) {
			$(this).parents(".place-nav").find(name).css("height","auto");
			
		}else{
			$(this).parents(".place-nav").find(name).css("height","39px");
			
		}
	})
}

function each(obj){
	$(".place-nav").each(function(){
		if($(this).find(obj).height()<=50){
			$(this).find(obj).css("height","39px");
			
		}else{
			$(this).find(obj).css("height","auto");
		
		}
	})
}
function color(obj,color){
	obj.click(function(){
		$(this).addClass(color).siblings().removeClass(color);
	})
}
$(function(){
	More($(".wap-touch"),".place-l");
	More($(".nav-link"),".place-t");
	each(".place-l");
	each(".place-t");
	/*切换*/
	$(".area span").click(function(){
		$(this).addClass("city").siblings().removeClass("city");
		var index=$(this).index();
		$(".place-nav dd").eq(index).addClass("place").siblings("dd").removeClass("place");
	})
})



