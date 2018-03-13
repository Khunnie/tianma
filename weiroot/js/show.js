$(function(){
	// 加减法
	$("#room-page").on("click",".ic-input-add",function(){
		var Inum = $(this).siblings(".adult").text();
		var Sub = $(this).siblings('.ic-input-lessen');
		if (Inum >= 1 && Inum < 4) {
			$(this).siblings('.adult').text(parseInt(Inum)+1);
			Inum++;
			Sub.removeClass('disabled');
			$(this).removeClass('disabled');
			if (Inum == 4) {
				$(this).addClass('disabled');
				Sub.removeClass('disabled');
			}

		}else if (Inum ==4) {
			$(this).siblings('.adult').text(Inum);
			Sub.removeClass('disabled');
		}
		var indexNow = $(this).parents('.typeinfo').index();
		//getp(indexNow);
	})
	$("#room-page").on("click",".ic-input-lessen",function(){
		var Inum = $(this).siblings(".adult").text();
		var Add = $(this).siblings('.ic-input-add');
		if (Inum > 1) {
			Add.removeClass('disabled');
			$(this).siblings('.adult').text(parseInt(Inum)-1);
			Inum--;
			if (Inum == 1) {
				$(this).addClass('disabled');
				
			}
		}else if (Inum == 1) {
			Inum = 1;
			$(this).siblings('.adult').text(Inum);
			$(this).addClass('disabled');

		}
		var indexNow = $(this).parents('.typeinfo').index();
	})
	$(".ic-clone").click(function(){
		var $box =$('<dl class="a-dl-1 Addroom"><dt><span>房间2</span><a href="javascript:;" class="icon-lessen fr" ic-close=""></a></dt><dd><div><h5>成人</h5><div class="btn-group" ><div class="disabled ic-input-lessen">-</div><div class="adult" style="min-width:3em;">1</div><div class="ic-input-add" >+</div></div></div></dd></div>').insertBefore($(".customer_box").find('.ad'));
	})
	$(".customer_box").on("click",".icon-lessen",function(){
		var $that=$(this)
	    var $table = $that.parents(".a-dl-1")
	    $table.remove()
	})

	
	//加减法
	$(function() {
		init();	 
	})
	
	//加减组件初始化
	function init(){
		$(".btn-group").each(function(){
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
		var InpuText = $(id).find('.adult');

		var Inum = 0;
		Inum = $(id).find('.adult').val();
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
					$(this).parent().find('.adult').text(parseInt(Inum)+1);
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
					$(this).parent().find('.adult').text(parseInt(Inum)+1);
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
				$(this).parent().find('.adult').text(parseInt(Inum)-1);
				Inum--;
				if (Inum == 0) {
					Sub.addClass('disabled');
					InpuText.css('color','#999');
				}
			}else if (Inum == 0) {
				Inum = 0;
				$(this).parent().find('.adult').text(Inum);
				Sub.addClass('disabled');
				InpuText.css('color','#999');
			}
			var indexNow = $(this).parents('.typeinfo').index();
			//getp(indexNow);
		});
	} 
	// 上车地点

	$(".select-list li").click(function(){
		var input = $(this).find("input");
		if ($(input).is(":checked")){
			$(".select-list li input").prop("checked", true);
            $(input).prop("checked", false);
        }
       else
        {
        	$(".select-list li input").prop("checked", false);
            $(input).prop("checked", true);
            setTimeout(function(){
				$("#address-page,#language-page").addClass("not").siblings("#form").removeClass("not")
            },300)
            
            
        }
	})
	// 页面显示
	// $(window).ready(function(){
	// 	var Width = window.screen.width
	// 	console.log(Width)
	// 	$("#view-page>div.not").css({
	// 		left:-Width,
	// 	});
	// })
	 var $href = $("#form dt.arrow a")
	$href.click(function(){
		var ID = $(this).attr("href");
		$(ID).removeClass("not").siblings("div").addClass("not");
		$(ID).animate({left:0},1000)
	})

	$(".topside,.ok1").click(function(){
		var Name = $(this).find("a").attr("href");
		$(Name).addClass("not").siblings("#form").removeClass("not")
	})
})
			