$.fn.extend({
	NGD_calendar:function(options){
		var T=this;
		var nowDate=new Date();
		var settings = {
			withObj:[],  //关联按钮  [{obj:$(".btn"),event:"click"},{obj:".btn1",event:"click"},{obj:".btn2"}.....]
			width:"auto",
			height:"auto",
			format:"yyyy-MM-dd",
			today:new Date(),
			startDate:new Date(nowDate.getFullYear(),nowDate.getMonth(),1),
			dateArea:[new Date(1900,0,1),new Date(2020,12,1)], //时间选择区间
			showDateCount:"auto",  //显示天数  auto自动    数值
			months:1,  //显示几个月
			monthWidth:248,//月DOM的宽度,多月显示时需要用到
			rowMonths:1, //一行显示几个月
			startWeek:0, //第一列星期几
			data:{},
			positionDir:0, //定位方向   left,top
			event:"focus",//show初始显示
			showDateSelect:"select",   //select下拉显示并选择年月   text  只显示年月,不能选择
			tip:null,   //提示信息,显示在日历下方
			onClick:null,
			onSelect:null,
			onMouseOver:null,
			onMouseOut:null,
			dayBinded:null,
			dayBindBefore:function(e){return true;}
		};
		if(settings.event=="show"){
			var HZNUMS=["周日","周一","周二","周三","周四","周五","周六"];
		}else{
			var HZNUMS=["日","一","二","三","四","五","六"];
		}
		$.extend(settings, options);
		//初始化关联按钮对象
		for(var i in settings.withObj){
			if(typeof settings.withObj[i].obj=="string"){
				settings.withObj[i].obj=$(settings.withObj[i].obj);
			}
			if(!settings.withObj[i].event){
				settings.withObj[i].event="click";
			}
		}
		
		/*if(settings.startDate-settings.dateArea[0]<0||settings.startDate-settings.dateArea[1]>0){//不在允许期间内
			settings.startDate=settings.dateArea[0];
		}*/
		if(settings.startWeek>=7){settings.startWeek=0;}
		var doms={months:[]};
		var objs=[];
		//初始化
		var init=function(){
			doms.calendarBox=$('<div class="NGD_calendar_box"><a href="#" class="left prevYear">&lt;&lt;</a><a href="#" class="left prevMonth">&lt;</a><a href="#" class="right nextYear">&gt;&gt;</a><a href="#" class="right nextMonth">&gt;</a>');
			if(settings.event=="show"){
				doms.calendarBox.addClass("NGD_calendar_box_show");
			}
			doms.btnPrevYear=doms.calendarBox.children(".prevYear");
			doms.btnNextYear=doms.calendarBox.children(".nextYear");
			doms.btnPrevMonth=doms.calendarBox.children(".prevMonth");
			doms.btnNextMonth=doms.calendarBox.children(".nextMonth");
			for(var m=0;m<settings.months;m++){
				var dom={};
				dom.monthBox=$('<div class="NGD_month_box"/>');
				dom.tagBox=$('<div class="NGD_tag"/>');
				if(settings.showDateSelect=="select"){
					dom.selectYear=$('<select class="NGD_select_year"/>').appendTo(dom.tagBox);
					dom.selectMonth=$('<select class="NGD_select_month"/>').appendTo(dom.tagBox);
					for(var i=settings.dateArea[0].getFullYear();i<=settings.dateArea[1].getFullYear();i++){
						$('<option/>').text(i).appendTo(dom.selectYear);
					}
					for(var i=1;i<=12;i++){
						$('<option/>').text(i+"月").val(i-1).appendTo(dom.selectMonth);
					}
				}
				dom.daysBox=$('<div class="NGD_days"><ul class="NGD_days_tag"/><ul class="NGD_days_list"/></div>');
				dom.daysTag=dom.daysBox.children(".NGD_days_tag");
				dom.daysList=dom.daysBox.children(".NGD_days_list");
				for(var i=0;i<7;i++){
					var wa=i+settings.startWeek;
					$('<li/>').text(HZNUMS[(wa<7?wa:wa-7)]).appendTo(dom.daysTag);
				}
				dom.tagBox.appendTo(dom.monthBox);
				dom.daysBox.appendTo(dom.monthBox);
				if(m>0&&(settings.rowMonths>0?m%settings.rowMonths>0:true)){
					$('<div class="NGD_month_line"/>').appendTo(doms.calendarBox);
				}
				dom.monthBox.appendTo(doms.calendarBox);
				doms.months.push(dom);
			}
			doms.tipBox=$('<div class="NGD_calendar_tip"/>').appendTo(doms.calendarBox);
			if(settings.tip){
				if(typeof settings.tip=="object"){
					settings.tip.appendTo(doms.tipBox);
				}else if(typeof settings.tip=="string"){
					doms.tipBox.append(settings.tip);
				}
			}
			if(settings.event=="show"){
				doms.calendarBox.appendTo(T);
				T.each(function(i){
					var obj={o:$(this),date:new Date(),startDate:settings.startDate};
					show(obj);
					selectChange();
				});
			}else{
				doms.calendarBox.width(settings.monthWidth*(settings.rowMonths>0?settings.rowMonths:settings.months)+21*((settings.rowMonths>0?settings.rowMonths:settings.months)-1));
				doms.calendarBox.css({position:"absolute",zIndex:99999,left:300,top:100}).appendTo("body");
				T.each(function(i){
					$(this).addClass("NGD_calendar_bind");
					var obj={o:$(this)};
					if($(this).val().replace(/-/g,"/").match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)){
						obj.date=new Date($(this).val().replace(/-/g,"/"));
						if(obj.date-settings.dateArea[0]<0||obj.date-settings.dateArea[1]>0){//不在允许期间内
							obj.date=settings.dateArea[0];
						}
						obj.startDate=new Date(obj.date);
					}else{
						obj.date=new Date();
						if(obj.date-settings.dateArea[0]<0||obj.date-settings.dateArea[1]>0){//不在允许期间内
							obj.date=settings.dateArea[0];
						}
						obj.startDate=settings.startDate;
					}
					obj.startDate.setDate(1);
					objs.push(obj);
					$(this).focus(function(){
						eventShowHander(obj);
					});
					for(var i in settings.withObj){
						settings.withObj[i].obj.bind(settings.withObj[i].event,function(e){
							eventShowHander(obj);
							e.preventDefault();
						});
					}
				});
			}
			//dayListInit();
			eventInit();
			//selectChange();
		}
		function eventShowHander(obj){
			$(".NGD_calendar_box:not(.NGD_calendar_box_show)").hide();
			show(obj);
			selectChange();
		}
		var eventInit=function(){
			if(settings.showDateSelect=="select"){
				$.each(doms.months,function(m,dom){
					//年选择
					dom.selectYear.change(function(){
						doms.showObj.startDate.setYear($(this).val()); 
						selectChange();
					});
					//月选择
					dom.selectMonth.change(function(){
						doms.showObj.startDate.setMonth(parseInt($(this).val())-m);
						selectChange();
					});
				});
			}
			//前年 按钮
			doms.btnPrevYear.click(function(e){
				doms.showObj.startDate.setYear(doms.showObj.startDate.getFullYear()-1);
				selectChange();
				e.preventDefault();
			});
			//后年 按钮
			doms.btnNextYear.click(function(e){
				doms.showObj.startDate.setYear(doms.showObj.startDate.getFullYear()+1);
				selectChange();
				e.preventDefault();
			});
			//前月 按钮
			doms.btnPrevMonth.click(function(e){
				doms.showObj.startDate.setMonth(doms.showObj.startDate.getMonth()-1);
				selectChange();
				e.preventDefault();
			});
			//后月 按钮
			doms.btnNextMonth.click(function(e){
				doms.showObj.startDate.setMonth(doms.showObj.startDate.getMonth()+1);
				selectChange();
				e.preventDefault();
			});
		}
		var selectChange=function(){
			var date=new Date(doms.showObj.startDate);
			$.each(doms.months,function(m,item){
				if(settings.showDateSelect=="select"){
					item.selectYear.val(date.getFullYear());
					item.selectMonth.val(date.getMonth());
				}else{
					item.tagBox.text(dateFormat(date,"yyyy年MM月"));
				}
				date.setMonth(date.getMonth()+1);
			});
			dayListInit();
		}
		//显示日列表
		var dayListInit=function(){
			var startDate=new Date(doms.showObj.startDate);
						
			$.each(doms.months,function(m,dom){
				
				if(settings.showDateCount=="auto"){
					if(m>0){
						startDate.setMonth(startDate.getMonth()+1);
						startDate.setDate(1);
					}
					var end=new Date(startDate.getFullYear(),startDate.getMonth()+1,0);
					var countDays=end.getDate();
				}else{
					var end=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+settings.showDateCount);
					var countDays=settings.showDateCount;
				}
				
				dom.date=new Date(startDate);
				dom.daysList.html("");
				var spn=startDate.getDay();
				if(startDate.getDay()-settings.startWeek<0){
					spn=startDate.getDay()-settings.startWeek+7;
				}else{
					spn=startDate.getDay()-settings.startWeek;
				}
				for(var i=0;i<spn;i++){
					$('<li/>').appendTo(dom.daysList);
				}
				dom.daysObjs={};
				for(var i=0;i<=countDays-1;i++){
					(function(day){
						var fdate=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+day);
						var d=$('<li><span/><i/><strong/></li>');
						var robj={o:d,date:fdate};
						var isValid=settings.dayBindBefore(robj);
						if(doms.showObj.date - fdate==0&&isValid){
							d.addClass("NGD_days_selected");
							
						}
						isValid=settings.dateArea[0]-fdate<=0&&settings.dateArea[1]-fdate>=0&&isValid;
						if(isValid){
							d.addClass("NGD_days_select");
							
						}else{
							d.addClass("NGD_days_disbled");
						}
						d.children("span").text(fdate.getDate()).addClass("calday")
					/*	d.children("i").text("1800").addClass("calprice")
						d.children("strong").text("充足").addClass("cainfo")*/
						if(isValid){
							d.on("click",function(e,d){
								if(settings.event!="show"){
									doms.showObj.date=fdate;
									doms.showObj.o.val(dateFormat(fdate,settings.format));
									hide();
								}
								if(settings.onSelect){
									settings.onSelect(robj,d);
								}
							}).hover(function(){
								d.addClass("NGD_days_select_cur");
								if(settings.onMouseOver){
									settings.onMouseOver(robj);
								}
							},function(){
								d.removeClass("NGD_days_select_cur");
								if(settings.onMouseOut){
									settings.onMouseOut(robj);
								}
							});
						}
						d.appendTo(dom.daysList);
						dom.daysObjs[dateFormat(fdate,settings.format)]=robj;
						if(settings.dayBinded){
							settings.dayBinded(robj);
						}
					})(i);
				}
				if(settings.showDateCount=="auto"){
					var suppleCount=42-startDate.getDay()-end.getDate()+settings.startWeek;
					while(suppleCount>=7){
						suppleCount-=7;
					}
				}else{
					var suppleCount=0;
				}
				for(var i=0;i<suppleCount;i++){
					$('<li/>').appendTo(dom.daysList);
				}
				
			});
		}
		var show=function(obj){
			var o=obj.o;
			doms.showObj=obj;
			doms.calendarBox.show();
			if(settings.event!="show"){
				doms.calendarBox.css({left:o.offset().left-settings.positionDir,top:o.offset().top+o.outerHeight()});
				dEvent.bind();
			}
		}
		var hide=function(){
			doms.calendarBox.hide();
			if(settings.event!="show"){
				dEvent.unBind();
			}
		}
		var dEvent={
			bind:function(o){
				setTimeout(function(){
					$(document).bind("click",dEvent.documentClickHandler);
				},200);
			},
			unBind:function(){
				$(document).unbind("click",dEvent.documentClickHandler);
			},
			documentClickHandler:function(e){
				if($(e.target).parents(".NGD_calendar_box").length==0&&!$(e.target).hasClass("NGD_calendar_bind")){
					hide();
				}
			}
		}
		var verifyDate=function(n1,n2){
			return n1>n2?1:n1==n2?0:-1;
		}
		var getRe=function(){
			return {
				o:T,
				settings:settings,
				doms:doms,
				selectChange:selectChange,
				show:show,
				hide:hide
			}
		}
		init();
		return getRe();
	}
});
function dateFormat(date,fmt) {
	var o = {
	"M+": date.getMonth() + 1, //月份
	"d+": date.getDate(), //日
	//"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
	"h+": date.getHours(), //小时
	"m+": date.getMinutes(), //分
	"s+": date.getSeconds(), //秒
	"q+": Math.floor((date.getMonth() + 3) / 3), //季度
	"S": date.getMilliseconds() //毫秒
	};
	var week = {"0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六"};
	if (/(y+)/.test(fmt)) {
	fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
	fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
	}
	for (var k in o) {
	if (new RegExp("(" + k + ")").test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	}
	}
	return fmt;
}