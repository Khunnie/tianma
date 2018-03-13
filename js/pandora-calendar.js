/*******************************************************************************
* Copyright (C) lvmama Corporation. All rights reserved. 
* 
* Version: 1.0 
* Author: Zhu.Xing.Chen 
* Email: zhux.chen@qq.com
* Create Date: 2013-09-25
* Description: pandora-calendar
*
* Update History:
* Date         Author               Description
* 2014/03/14   taosiyu              点击事件回调函数接收一个对象. 此对象增加一个属性为selectedDate.为此次所选的日期
* 2014/03/14   taosiyu              由事件触发渲染日历时增加阻止事件冒泡处理. 
* 2014/03/26   taosiyu              增加allowMutiSelected参数. 确定是否可以在日历上同时选择多个日期
* 2014/03/26   taosiyu              点击回调函数增加cancelDateCallback. 在自动渲染状态下取消选择日期后调用
* Revision History:
* Date         Author               Description
* 
* Demo:
*
*********************************************************************************/
(function (global, $, pandora, undefined) {
    "use strict"  // 严格模式

    if (pandora.calendar) {
        return;
    }

    // ES5 15.4.4.18
    // http://es5.github.com/#x15.4.4.18
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, scope) {
            var i, len;

            for (i = 0, len = this.length; i < len; ++i) {
                if (i in this) {
                    fn.call(scope, this[i], i, this);
                }
            }

        };
    }

    function toDate(date) {
        var d = null;

        if (typeof date === "string") {
            d = date.split("-");

            d = new Date(
                d[0],
                d[1] === "12" ? "11" : d[1] - 1,
                d[2]
            );
        }

        return d;
    }

    function Factory(options) {
        var options = options || {},
            defaults = Factory.defaults;

        // 合并默认配置
        for (var i in defaults) {

            if (options[i] === undefined) {
                options[i] = defaults[i];
            };

        };

        toDate(options.date);

        return new Calendar(options);
    }

    function Calendar(options) {
        this._init(options);
    }

    Calendar.prototype = {
        constructor: Calendar,

        _init: function (options) {
			var This = this;
            options.template = typeof options.template == "object" ? options.template : (options.template == "big" ? bigTemplate : smallTemplate)
            this.options = options;
            this.cacheDate = options.date;
            this.warp = this.warp || $($.trim(this.options.template.warp));
            this.warp.attr("data-render", options.autoRender); // 用于解决页面同时加载2种模式
			this.eventNum = 0;
            this.loadCal(This);
        },
        /**
         * 加载日历显示的方式
         */
        loadCal: function (This) {
            var options = this.options,
                that = this;

            if (options.autoRender) {
                $(options.target).append(this.warp);
				//$("body").append(that.warp);
                this.render();
                this.bindEvent();
            } else {
				//$(".demo12").bind("click",function(){alert(123);});
                $(options.trigger).bind(options.triggerEvent, function (e) {
					if(e.stopPropagation)
						e.stopPropagation();
					else
						window.event.cancelBubble=true;
					//$("body").append(that.warp);
                    $(options.target).append(that.warp);
                    that.$trigger = $(this);
                    that._isRange = options.isRange; // 是否级联
					if($(this).attr('name')=='beginBookTime'){
						This.eventNum = 0;
					}else if($(this).attr('name')=='endBookTime'){
						This.eventNum = 1;
					}
					
                    var offset = that.offset();
                    
                    if ($(".ui-calendar[data-render=false]").length > 1) {
                        that.warp.detach();
                    }
                    var offsetLeftAmount = options.offsetAmount.left;
                    var offsetTopAmount = options.offsetAmount.top;
                    that.warp.css({
                        position: "absolute",
                        zIndex: 9999,
                        left: offset.left + offsetLeftAmount,
                        top: offset.top + offsetTopAmount
                    });

                    that.render();
                    that.bindEvent();
                });

                this.triggerBlur();
            }
        },

        /**
        * 替换匹配的内容
        * @param {String} 参数 str
        * @param {Object} 参数 obj
        * @return {String}
        */
        replaceWith: function (str, obj) {

            for (var i in obj) {
                str = str.replace("{{" + i + "}}", obj[i]);
            }

            return str;
        },

        /**
         *  补零
         *  @param {Number} 月份、几号
         */
        mend: function (value) {
            return value.toString().length === 1 ? "0" + value : value;
        },

        /**
         * 绘制日历
         */
        render: function () {
            var options = this.options;

            this.warp.html("");
            this.warp.append(this.createHead());
            this.warp.append(this.createCalWarp());

            if (this.options.frequent) {
                this.warp.css("width", this.warp.find("div.calmonth").width());
            }

            if (typeof options.sourceFn === "function") {

                // this.fillData() 改写
                // 改变作用域 解决回调函数 this.warp 对象问题
                try{
                    var flag = options.sourceFn(this);
                    if(flag==false)
                        return false;
                }catch(err){
                    alert(err);
                    return false;
                }
                
            }

            this.warp.show();
            if (typeof options.completeCallback === "function") {
                options.completeCallback();
            }
			/*展示月份为1得时候，隐藏下一页按钮*/ 
			var mos = options.mos;
			if(mos==1){
				this.warp.find("span.month-next").hide();
			}
        },
        
        /**
         * 填充数据源
         * fillData 数据的变化多样化所以对方自定义
         */
        //fillData: function () {
        //    var that = this,
        //        data = this.options.source;

        //    data.forEach(function (arr) {
        //        var $td = that.warp.find("td[date-map=" + arr.date + "]");
        //        $td.find("span").eq(1).html(arr.number);
        //        $td.find("span").eq(2).html("<dfn>¥" + arr.price + "</dfn>");
        //        $td.find("span").eq(3).html(arr.active);
        //    });

        //},

        /**
        * 绘制日历头部翻页按钮
        */
        createHead: function () {
            var html = "";

            html = this.replaceWith(this.options.template.calControl, {
                stylePrev: 'style="display:' + (this.options.control ? this.options.showPrev ? "block" : "none" : "block") + '"',
                styleNext: 'style="display:' + (this.options.control ? this.options.showNext ? "block" : "none" : "block") + '"'
            });

            return html;
        },

        /**
         *  填充日历
         */
        createCalWarp: function () {
             
           var that = this,
               options = that.options,
               month = options.date.getMonth(),
               year = options.date.getFullYear(),
               html = "";

            html += that.createBody(month, year);

            // 显示一个月/二个月
            if (!options.frequent) {
                html += that.createBody((month + 1) % 12, month === 11 ? year + 1 : year);
            }

            html = this.replaceWith(options.template.calWarp, {
                content: html
            });

            return html;
        },

        /**
         * 生成日历的日期部分
         */
        createBody: function (month, year) {
            var html = "",
                options = this.options;
           
            html += this.replaceWith(options.template.calTitle, {
                month: this.replaceWith(options.titleTip, {
                    year: year,
                    month: month + 1
                })
            });

            html += this.replaceWith(options.template.calBody, {
                month: month + 1,
                date: this.createDay(month, year)
            });

            html = this.replaceWith(options.template.calMonth, {
                content: html
            });

            return html;
        },

        /**
		 *计算今明后节假日
		 @param {Date} date 日期
		 @returns {String} 今明后HTML
		 */
        setToday: function (d) {
            var nowDate = new Date(
				    new Date().getFullYear(),
				    new Date().getMonth(),
				    new Date().getDate()
			    ),
                date = new Date(d.year, d.month - 1, d.day),
                festival = this.options.festival,
                index = d.year + "-" +  this.mend(d.month) + "-" + this.mend(d.day),
                day = 0;
                
            day = (date.getTime() - nowDate.getTime()) / (1000 * 3600 * 24);
            
            switch (day) {
                case 0:
                    return "今天";
                    break;
                /*case 1:
                    return "明天";
                    break;
                case 2:
                    return "后天";
                    break;*/
                default:
                    return festival[index] ? festival[index] : d.day;
            }
            
        },

        /**
         * 生成 day html
         */
        createDay: function (month, year) {
            var html = "",
                day = "",
                that = this,
                options = that.options,
                dates = this.getDatesByMonth(month, year);

            dates.forEach(function (d) {

                d.forEach(function (d) {
                    
                    day += that.replaceWith(options.template.day, {
                        week: d === "" ? "" : 'week="' + new Date(d.year, d.month - 1, d.day).getDay() + '"',
                        dateMap: d === "" ? "" : 'date-map="' + d.year + "-" + that.mend(d.month) + "-" + that.mend(d.day) + '"',
                        day: d === "" ? "" : that.setToday(d),
                        className: 'class="' + that.getClass(d) + '"'
                    });

                });

                html += that.replaceWith(options.template.weekWarp, {
                    week: day
                });

                day = "";
            });

            return html;
        },

        /**
		 * 计算日期的样式
		 * @param {Date} date 日期
		 * @returns {String} 计算得到的Class
		 */
        getClass: function (date) {
            var options = this.options,
                fatalism = options.fatalism,
                cacheDate = this.cacheDate,

                // 用于火车票起始时间
                startDate = this.addDays(cacheDate, options.startDelayDays),

                // 用于火车票结束时间
                endDate = this.addDays(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()), fatalism),
                className = [],
                d1 = null,
                d2 = null,
                d3 = null,
                index = 0,
                val1 = "",
                val2 = "",
				nowDay = '',
				tomosend = null; //可选日期截止时间，按月份算

            if (date === "") {
                className.push(options.classNames.nodate);
            } else {
                d1 = new Date(date.year, date.month - 1, date.day);
                d2 = new Date(cacheDate.getFullYear(), cacheDate.getMonth(), cacheDate.getDate());

                if (this.$trigger !== undefined) {
                    d3 = toDate(this.$trigger.val())
                }

                // hack
                if (this._isRange) {
					var dateNow = new Date();
					
					//开启精确到天的月份显示
					if(options.mosAccurate){
						var nowYear = dateNow.getFullYear(),
							nowMonth = dateNow.getMonth()+1,
							nowDay = dateNow.getDate(),
							endTime = []
						if(nowMonth+options.mos>12){
							endTime=[nowYear+1,nowMonth+options.mos-12,nowDay];
						}else{
							endTime=[nowYear,nowMonth+options.mos,nowDay];
						}
						tomosend = new Date(endTime[0], endTime[1]-1, endTime[2]);
						
						if(d1>tomosend){
							className.push(options.classNames.nodate);
						}
					}
					
						
                    index = $(options.cascade.trigger).index(this.$trigger);
                    if (index > 0) {
                        var cascadeTriggerVal = $(options.cascade.trigger).eq(index - 1).val();
                        cascadeTriggerVal = cascadeTriggerVal == "" ? dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate() : cascadeTriggerVal;
                        val1 = cascadeTriggerVal.split("-");
                        val1[2] = (parseInt(val1[2], 10) + options.cascade.days).toString();
                        val2 = toDate(this.$trigger.val() == "" ? (dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate()) : this.$trigger.val());

                        d2 = new Date(
                            val1[0],
                            val1[1] === "12" ? "11" : val1[1] - 1,
                            val1[2]
                        );
                    }else
                        d2 = new Date();
                }

                // 过去日期
                if (fatalism == 0 && (d1 - d2) <= 0) {
                    if (!(options.isTodayClick && d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate())){
						if(options.oldDate == true){
							className.push(options.classNames.caldate);
						}else{
							className.push(options.classNames.nodate);
						}
					}else{
                        className.push(options.classNames.caldate);
					}
                }else if (fatalism == 0) {
                    className.push(options.classNames.caldate);
                }

                if (this._isRange === true && val1 !== "") {

                    if (val2 - d2 >= 0) {

                        // 两个日期区间
                        if (d1 - val2 < 0) {
                            className.push(options.classNames.interval);
                        }
						
						if(options.mosAccurate){
							//酒店业务需求，离店日期限20天
							var dbig = d2.getTime() + (1000 * 3600 * 24)*19;
							if (d1>dbig) {
								className.push(options.classNames.nodate);
							}	
						}
						

                        // input日期的颜色
                        if (date.year == val2.getFullYear() && date.month - 1 == val2.getMonth() && date.day == val2.getDate()) {
                            className.push(options.classNames.selectDay);
                        }

                    }
					

                } else {

                    // 当天日期
                    if (cacheDate.getFullYear() == date.year && cacheDate.getMonth() == date.month - 1 && cacheDate.getDate() == date.day) {
                        className.push(options.classNames.today);
                    }

                    // input日期的颜色
                    if (d3 !== null && date.year == d3.getFullYear() && date.month - 1 == d3.getMonth() && date.day == d3.getDate()) {
                        className.push(options.classNames.selectDay);
                    }
                }

                // 火车票逻辑
                if (fatalism > 0) {

                    if (startDate.getFullYear() == date.year && startDate.getMonth() == date.month - 1 && date.day < startDate.getDate()) {
                        className.push(options.classNames.nodate);
                    }

                    var d3 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

                    if ((d1 - d3) / (1000 * 60 * 60 * 24) > -1) {
                        className.push(options.classNames.nodate);
                    } else {

                        if ((d1 - d2) >= 0) {
                            className.push(options.classNames.caldate);
                        } else {
                            className.push(options.classNames.nodate);
                        }

                    }

                }

                // 节假日 今天 明天 后天
                var nowDate = new Date(
				    new Date().getFullYear(),
				    new Date().getMonth(),
				    new Date().getDate()
			    ),
                d4 = new Date(date.year, date.month - 1, date.day),
                day = -1,
                festivalIndex = date.year + "-" + this.mend(date.month) + "-" + this.mend(date.day);

                day = (d4.getTime() - nowDate.getTime()) / (1000 * 3600 * 24);

                if (day >= 0 && day <= 2) {
                    className.push(options.classNames.festival);
                } else {

                    if (options.festival[festivalIndex]) {
                        className.push(options.classNames.festival);
                    }

                }

                // 当天是否可点击
                if (!options.isTodayClick) {

                    if (cacheDate.getFullYear() == date.year && cacheDate.getMonth() == date.month - 1 && cacheDate.getDate() == date.day) {
                        className = [options.classNames.nodate];
                    }

                }
            }

            return className.join(" ");
        },

        /**
         * 日期加上天数后的新日期
         */
        addDays: function (date, days) {
            var nd = new Date(date);
            nd = nd.valueOf();
            nd = nd + days * 24 * 60 * 60 * 1000;
            nd = new Date(nd);

            return nd;
        },

        /**
         * 按月份生成6x7日期数组
         * @param {Number} 月份 month (0 1 2 3 4 5 6 7 8 9 10 11)
         * @param {Number} 年份 year (2013)
         */
        getDatesByMonth: function (month, year) {
            var result = [],
                firstDate = new Date(year, month, 1),
                lastDate = new Date(year, month + 1, 0),
                lastOfMonth = lastDate.getDate(), // 获取当月天数
                curr = 1, // 第一行
                line = 1; // 后续行

            // 修正year和month
            year = firstDate.getFullYear();
            month = firstDate.getMonth() + 1;

            for (var i = 0; i < 6; i++) {
                result.push(['', '', '', '', '', '', '']);
            }

            //firstDate.getDay() 获取当月1号是星期几索引
            for (var i = firstDate.getDay() ; i < 7; i++) {
                result[0][i] = { year: year, month: month, day: curr++ };
            }

            while (curr <= lastOfMonth) {

                for (var i = 0; i < 7; i++) {

                    if (curr > lastOfMonth) {
                        break;
                    }

                    result[line][i] = { year: year, month: month, day: curr++ };
                }

                line++;
            }

            return result;
        },

        /**
         * 换月
         */
        changeMonth: function (op) {
            var options = this.options,
                date = options.date,
                mos = options.mos,
                cacheDate = this.cacheDate;

            options.date = new Date(
                date.getFullYear(),
                date.getMonth() + op,
                1
            );

            // 设置换月按钮显示
            if (options.control) {
                options.showPrev = options.date.getFullYear() > cacheDate.getFullYear() ?
                    true : options.date.getMonth() === cacheDate.getMonth() ? false : true;

				if(Math.abs(op)==1){
					options.showNext = mos <= 0 ? true : ((date.getFullYear() - cacheDate.getFullYear()) * 12 +
                    date.getMonth() + op - cacheDate.getMonth() + 1) >= mos ? false : true;
				}else{
					options.showNext = mos <= 0 ? true : ((date.getFullYear() - cacheDate.getFullYear()) * 12 +
                    date.getMonth() + op - cacheDate.getMonth() + 1) >= mos-1 ? false : true;
				}
            }

            this.render();
            this.bindEvent();
        },

        /**
        * 绑定事件
        */
        bindEvent: function () {
            this.monthChangeEvent();
            this.selectDate();
            this.moveEvent();
        },

        /**
         * 月份切换事件
         */
        monthChangeEvent: function () {
            var that = this,
				mostwo = that.options.mostwo,
				mosN = 1;
			if(mostwo){
				mosN = 2;
			}

            this.warp.find("span.month-prev").bind("click", function () {
                that.changeMonth(-mosN);
            });

            this.warp.find("span.month-next").bind("click", function () {
                that.changeMonth(mosN);
            });
        },

        /**
         * 选中日期  
         */
        selectDate: function () {
            var that = this;

            this.warp.find("td div[class^=caldate]").bind('click',function () {
				if(!$(this).hasClass('nodate')){///有nodate的日期无法点击
					that._weekIndex = parseInt($(this).parent("td").attr("week"));
					
					
					
					if (!that.options.autoRender) {//非自动渲染 在选择完日期后关闭日历
						that.warp.detach();
						that.$trigger.blur();
						that.$trigger.val($(this).parent("td").attr("date-map"));
						that.selectedDate=$(this).parent("td").attr("date-map");
						if (typeof that.options.selectDateCallback === "function") {
							that.rangepage($(this));
							that.options.selectDateCallback(that,$(this));
						}
					}else{
						if (that.options.allowMutiSelected) {
							that.selectedDate=$(this).parent("td").attr("date-map");
							
							var $box=$(this).parent("td");
							if($box.hasClass("calSelected")){
								$box.removeClass("calSelected");
								if (typeof that.options.cancelDateCallback === "function") {
									that.options.cancelDateCallback(that);
								}
							}
							else{
								$box.addClass("calSelected");
								if (typeof that.options.selectDateCallback === "function") {
									that.rangepage($(this));
									that.options.selectDateCallback(that,$(this));
								}
							}
						}
					}
					
					
				}///
             });

        },
		/*
		//级联日历，第一个选择日期，选最后一天，级联到第二个日历时候要翻页动作。
		*/
		rangepage:function(obj){ 
			var options = this.options,
               month = options.date.getMonth()+1,
               year = options.date.getFullYear();
			if(options.isRange){
				var darr1 = $(options.trigger).eq(0).val().split('-'),
					darr2 = $(options.trigger).eq(1).val().split('-'),
					month1 = new Date(parseInt(darr1[0]), parseInt(darr1[1]),0),
					nowY = (new Date()).getFullYear(),
					nowM = (new Date()).getMonth()+1+options.mos,
					nowT = [],
					thisT = obj.parent('td').attr('date-map').split("-"),
					objM = thisT[0]+thisT[1],
					monthNum = obj.parents('.calmonth').index();
				//alert(nowY)
				if(nowM>12){
					nowT=nowY+1+''+nowM-12;
				}else{
					nowT=nowY+''+this.mend(nowM);
				};
				//alert(nowT)
				//处理点击最后一天，连动的第二个日历不翻月
				if(darr1[2]==month1.getDate() && this.eventNum ==0 && monthNum ==1 && nowT>objM){
					 this.changeMonth(1);
					 /*if(nowT==objM){ //级联点击最后一天，不往后推移时间，暂时不用
						setTimeout(function(){
							$(options.trigger).eq(1).val($(options.trigger).eq(0).val());
						},50)
					}*/
				}
			}
		},
        /**
		 * 移动事件
		 */
        moveEvent: function () {

        },

        /**
         *  设置 calendar 位置
         */
        offset: function () {
            var $trigger = this.$trigger,
                offset = $trigger.offset(),
                left = offset.left,
                top = offset.top + $trigger.outerHeight(true);

            return { left: left, top: top };
        },

        /**
         * 鼠标离开
         */
        triggerBlur: function () {
            var that = this,
                options = that.options;

            $(document).click(function (e) {
                var target = $(e.target);
                
                if (!target.hasClass(options.triggerClass) && !target.parents().hasClass(options.warpClass) &&
                    !target.hasClass(options.classNames.monthPrev) && !target.hasClass(options.classNames.monthNext)) {
                    that.warp.detach();
                }

            });

        }
    };

    // 日历插件版本
    Calendar.version = "1.0";

    Factory.defaults = {
        date: new Date(),
        target: "body",

        trigger: ".calendar", //对话框触发点/触发事件对象
        triggerEvent: "click",
        triggerClass: "calendar",
        warpClass: "ui-calendar",

        selectDateCallback: null,//点击选择日期后的回调函数
        cancelDateCallback: null,//取消选择日期的回调函数
        completeCallback:null,//数据加载完成并显示出日历后的回调函数

        autoRender: false,
        allowMutiSelected: false,//允许被点击选中以及再次点击取消
        sourceFn: null, // 数据源
        

        tipText: "yyyy-mm-dd", //文本日期格式

        frequent: false, // 单月显示
        titleTip: "{{year}}年{{month}}月",

        todayInfos: ["", "", ""],

        rangeColor: "#F0F5FB",  // 区间
        hoverColor: "#d9e5f4",  // 鼠标滑过

        control: true, // 控制翻页按钮是否显示
        showPrev: false,
        showNext: true,
		oldDate:false, //可以选择今天之前的日期

        startDelayDays: 0, // 在开始的基础上叠加天数 配合fatalism一起使用
        fatalism: 0, // 天数
        mos: 6, //可翻几个月
		mostwo:false,
		mosAccurate:false, //只可点击从今日起mos个月之内的日期，精确到天，配合mos一起使用。用于酒店入住离店时间业务.
        offsetAmount:{left:0,top:0},//日历层偏移量. 默认在目标下方 左对齐
        isTodayClick: false, // 当天是否可点击

        weeks: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

        classNames: {
            week: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
            caldate: "caldate",
            nodate: "nodate", // 禁用和空
            today: "today", // 今天
            hover: "hover", // 鼠标滑过效果
            selectDay: "selectDay", // input 
            interval: "interval", // 区间
            festival: "calfest", // 节日
            monthPrev: "month-prev",
            monthNext: "month-next"
        },
		isRange: false,
        // 级联
        cascade: {
            days: 1, // 天数叠加一天
            trigger: ".calendar",
            isTodayClick: false
        },

        template: "big",

        festival: {
            '2016-01-01': '元旦',
            '2016-02-07': '除夕',
            '2016-02-08': '春节',
            '2016-02-22': '元宵',
            '2016-04-04': '清明',
            '2016-05-01': '五一',
            '2016-06-09': '端午',
            '2016-09-15': '中秋',
            '2016-10-01': '国庆'
        	},
        setData:function(dateStart,dateEnd,dayfn){
            var times1 = dateStart.split('-'),
                times2 = dateEnd.split('-'),
                date1 = new Date(parseInt(times1[0]),parseInt(times1[1])-1,parseInt(times1[2])),
                date2 = new Date(parseInt(times2[0]),parseInt(times2[1])-1,parseInt(times2[2])),
                S1 = date1.getTime(),
                S2 = date2.getTime(),
                len = (S2-S1)/(1000*60*60*24),
                dateArr = [],
                warp = $('.'+this.warpClass);
                warp.find('td div').addClass('nodate')

            function buling(num){if(num<10){return '0'+num;} return num;}

            for (var i = len; i >=0; i--) {
               var Si = S2-1000*60*60*24*i,
                    dateThis = new Date(Si),
                    year = dateThis.getFullYear(),
                    month = buling(dateThis.getMonth()+1),
                    day = buling(dateThis.getDate());
               dateArr.push(year+'-'+month+'-'+day);
            };

           
            for (var i = 0; i < dateArr.length; i++) {
                warp.find('td[date-map^='+ dateArr[i] +']').find('div').removeClass('nodate')
            };

            
        }
    };
    var smallTemplate = {
        warp: '<div class="ui-calendar ui-calendar-mini"></div>',
        calControl: '<span class="month-prev" {{stylePrev}} title="上一月">‹</span><span class="month-next" {{styleNext}} title="下一月">›</span>',
        calWarp: '<div class="calwarp clearfix">{{content}}</div>',
        calMonth: '<div class="calmonth">{{content}}</div>',
        calTitle: '<div class="caltitle"><span class="mtitle">{{month}}</span></div>',
        calBody: '<div class="calbox">' +
                    '<i class="monthbg">{{month}}</i>' +
                    '<table cellspacing="0" cellpadding="0" border="0" class="caltable">' +
                        '<thead>' +
                            '<tr>' +
                                '<th class="sun">日</th>' +
                                '<th class="mon">一</th>' +
                                '<th class="tue">二</th>' +
                                '<th class="wed">三</th>' +
                                '<th class="thu">四</th>' +
                                '<th class="fri">五</th>' +
                                '<th class="sat">六</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '{{date}}' +
                        '</tbody>' +
                    '</table>' +
                '</div>',
        weekWarp: '<tr>{{week}}</tr>',
        day: '<td {{week}} {{dateMap}} >' +
                '<div {{className}}>{{day}}</div>' +
             '</td>'
    };

    var bigTemplate = {
        warp: '<div class="ui-calendar"></div>',
        calControl: '<span class="month-prev" {{stylePrev}} title="上一月">‹</span><span class="month-next" {{styleNext}} title="下一月">›</span>',
        calWarp: '<div class="calwarp clearfix">{{content}}</div>',
        calMonth: '<div class="calmonth">{{content}}</div>',
        calTitle: '<div class="caltitle"><span class="mtitle">{{month}}</span></div>',
        calBody: '<div class="calbox">' +
                    '<i class="monthbg">{{month}}</i>' +
                    '<table cellspacing="0" cellpadding="0" border="0" class="caltable">' +
                        '<thead>' +
                            '<tr>' +
                                '<th class="sun">日</th>' +
                                '<th class="mon">一</th>' +
                                '<th class="tue">二</th>' +
                                '<th class="wed">三</th>' +
                                '<th class="thu">四</th>' +
                                '<th class="fri">五</th>' +
                                '<th class="sat">六</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '{{date}}' +
                        '</tbody>' +
                    '</table>' +
                '</div>',
        weekWarp: '<tr>{{week}}</tr>',
        day: '<td {{week}} {{dateMap}} >' +
                '<div {{className}}>' +
                    '<span class="calday">{{day}}</span>' +
                    '<span class="calinfo"></span>' +
                    '<span class="calprice"></span>' +
                    '<span class="calactive"></span>' +
                '</div>' +
             '</td>'
    };
    // 前端框架 pandora 对象 
    $.fn.calendar = pandora.calendar = Factory;

    global.pandora = pandora;
}(this, jQuery, this.pandora || {}));
