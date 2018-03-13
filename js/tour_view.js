$(function(){
	   $(".tour_image").mouseenter(function(){
		       $(".scene_img_navs").slideDown("fast");
		}).mouseleave(function(){
			   $(".scene_img_navs").slideUp("fast",function(){
				        $(this).stop(true,true);
				   });
			})
	
	$(".items_op .option i input[type='checkbox']").each(function() {
         $(this).click(function(){
			 var curcheck=$(this).attr("checked"); 
			 if(curcheck){
				  $(this).parents("li.option").addClass("active");	 
				  $(this).parents("li.option").find(".li_l span").show();
				  var aminput = $(this).parents("li.option").find(".li_l span input[type='text']");
				  if(aminput.val() == '') {
					  aminput.val(1);
				  }
				  
				  //$(this).parents("li.option").find(".tips").show();
			 }
		     else{
			      $(this).parents("li.option").removeClass("active");	
				  $(this).parents("li.option").find(".li_l span").hide(); 
				  //$(this).parents("li.option").find(".tips").hide();
			 }
			 countActNormalmustPrice();countActNormalselfPrice();countActHotelPrice();countActCharterPrice();countActRentPrice();countActPickupPrice();countActInsurancePrice();
		 });
    });
	
	$(".items_op .cancel").each(function() {
         $(this).click(function(){
             //添加rel属性，当点击取消选择时，详情页已选择的自选项目清空 by Xiaopei 2016-12-06
             var name = $(this).attr('rel')
             var html = '<span class="fl">请选择</span>';
             $('#act_'+name+'_selected').html(html);
		     $(this).parents(".items_op").find("input").attr("checked",false);
             $(this).parents(".items_op").find("li.option").removeClass("active");
             $(this).parents(".items_op").find(".li_l span").hide();
             $(this).parents(".items_op").find(".tips").hide();
		 })
    });
    //详情页弹出层问号hover
     $(".J_qmark").hover(function() {
     	$(this).parents('.li_l').find('.qdes').css('display', 'block');
     }, function() {
     	$(this).parents('.li_l').find('.qdes').css('display', 'none');
     });
})


/*主导航滚动监听*/
var flashnum=1;
$(function(){
	   var imgLength=$(".scene_img_navs .tnavsbar a").length;
	   $("#ico_preimg").css({"cursor":"default"});
	   if(imgLength<=5){
		       $("#ico_nextimg").attr("href","javascript:;").css({"cursor":"default"});
		       $("#ico_nextimg").css({"display":"none"});
		       $("#ico_preimg").css({"display":"none"});
		   }
	   else{
		       $("#ico_nextimg").attr("href","javascript:showNextTourImg();").css({"cursor":"pointer"});
		   }
		   
	})
function showNextTourImg(){
	   //var curIndex=$(".scene_img_navs .tnavsbar a").index($(".scene_img_navs .tnavsbar a.cur_img"))+1;
	   var imgLength=$(".scene_img_navs .tnavsbar a").length;
	   var i=Math.floor(imgLength/5);
	   var j=Math.ceil(imgLength/5);
	   if(flashnum<=i){
		       $(".scene_img_navs .tnavsbar ul").animate({marginLeft:-flashnum*395});
			   flashnum+=1;
			   $("#ico_preimg").attr("href","javascript:showPreTourImg();").css({"cursor":"pointer"});
			   if(flashnum==j){
				        $("#ico_nextimg").attr("href","javascript:;").css({"cursor":"default"});
				   }
			   else{
				       	$("#ico_nextimg").attr("href","javascript:showNextTourImg();").css({"cursor":"pointer"});    
				   }
		   }
	   else{
		       $("#ico_nextimg").attr("href","javascript:;").css({"cursor":"default"});
		   }
	}
function showPreTourImg(){
	   var prenum=flashnum-2;
	   $(".scene_img_navs .tnavsbar ul").animate({marginLeft:-prenum*495});
	   if(prenum<=0){
		       $("#ico_preimg").attr("href","javascript:;").css({"cursor":"default"});
			   $("#ico_nextimg").attr("href","javascript:showNextTourImg();").css({"cursor":"pointer"});
		   }
	   else{
		      $("#ico_nextimg").attr("href","javascript:showNextTourImg();").css({"cursor":"pointer"});
		   }
	   flashnum=prenum+1;
	}
var startTimerTv=setInterval("setNumsTv()",5000)
var indexTv=1;
var k=1;
function setNumsTv(){
	var imgLength=$(".scene_img_navs .tnavsbar a").length;
	if(imgLength>1){
			if(indexTv<imgLength){indexTv+=1}
			else{ indexTv=1}
			autoChangeTourImg(indexTv);
		}
}
function autoChangeTourImg(indexTv){
	var imgLength=$(".scene_img_navs .tnavsbar a").length;
	var i=Math.floor(imgLength/5);<!--2-->
	var j=Math.ceil(imgLength/5);<!--3--> 
	 $(".tour_image_d").hide();
	 $("#tour_image_d_"+indexTv).fadeIn("fast");   

}
function changeTourImages(num){
   var eq=num-1;
   $(".tour_image_d").hide();
   $("#tour_image_d_"+num).show();
   $(".scene_img_navs .tnavsbar a").removeClass("cur_img");
   $(".scene_img_navs .tnavsbar a:eq("+eq+")").addClass("cur_img");
   indexTv=num;
}
