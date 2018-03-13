/**
 *
 * Tab和Scroll方法  用在频道页里
 * america.html europe.html australia.html
 * Created by shenalfred on 16/7/1.
 */


//TODO  把每个频道页 里的公共html(groupbuying_channel.html destination.html hot_play.html)提取到一个html页并加载此js文件并调用


var tabScroll = (function(){

    function Tab(opts) {
        this.tabIndex = 0;
        this.isAnimate = false;
        this.displayBk = null;
        this.win_height = document.documentElement.clientHeight || document.body.clientHeight;

        this.opts = $.extend({}, opts);
    }
    Tab.prototype = {
        init: function(tabs, targetBlocks, index, callback, isScroll) {
            this._tabs = tabs;
            this._targetBlocks = targetBlocks;
            this.oldIndex = index;
            var _this = this;
            this.tab_active(index, 0);
            this._targetBlocks.eq(index).show().siblings().hide();
            this.displayBk = this._targetBlocks.eq(index);
            this.displayBk.attr('step', 0);
            this._tabs.each(function(item, index) {
                if(_this.opts.event == 'hover') {
                    $(this).mouseenter(function(){
                        var ele = $(this);
                        _this.changeBlock.apply(_this, [ele, isScroll, callback]);
                    });
                    $(this).mouseleave(function(){
                        _this.oldIndex = $(this).index();
                    });
                }else {
                    $(this).on('click', function() {
                        var ele = $(this);
                        _this.changeBlock.apply(_this, [ele, isScroll, callback]);
                    });
                }
            });
        },
        changeBlock: function(ele, isScroll, callback) {
            var index = this.tabIndex = ele.index();
            if (index == this.oldIndex) return;
            this.tab_active(index, this.oldIndex);
            this.addLazyClass(this._targetBlocks.eq(index), 0, isScroll);
            $.when(this.toggleBlock(index, this.oldIndex)).done(function () {
                callback && callback();
            });
            this.oldIndex = index;
        },
        toggleBlock: function(index, oldIndex) {
            if(this.isAnimate) {
                this._targetBlocks.eq(index).addClass('animated fadeInRight');
                this._targetBlocks.eq(oldIndex).removeClass('animated fadeInRight');
            }
            this.displayBk = this._targetBlocks.eq(index);
            this.prevBk = this._targetBlocks.eq(oldIndex);
            this.displayBk.show();
            this.prevBk.hide();
        },
        tab_active: function(index, oldIndex) {
            if(arguments.length > 1){
                this._tabs.eq(oldIndex).removeClass('active');
            }
            this._tabs.eq(index).addClass('active');
        },
        /** 
         * 懒加载图片
         *  @param element       包含需要懒加载图片集合元素的父元素 
         * @param index         因为要配合tab切换  所以需要index(显示当前区域块)下标 
         * @param isScroll      是否箭头滚动
         **/ 
        addLazyClass: function(element, index, isScroll) {
            var data_value= element.attr('data-value'),
                pNum = index + (data_value - 1) * 13;
            var images, _this =this; 
            if(isScroll) {
                images = element.eq(index).find('*[rel="plate_' + pNum + '"] img');
            }else {
                images = element.eq(index).find('img');
            }
            if(images) { 
                images.each(function(index, item) { 
                    var origin_url = $(this).attr('data-original') ;
                    if($(this).attr('src') != origin_url && (_this.isVisible($(this))) ) { 
                        $(this).attr('src', origin_url); 
                        /*$(this).on('load', function() { 
                            $(this).addClass('fadeIn'); 
                        }); */
                    } 
                }); 
            } 
        },
        /** 
         * 判断image元素是否滚动到可视区域 
         * @param img      * @returns {boolean} 
         **/ 
        isVisible: function(img) { 
            if(img.offset().top <= $(document).scrollTop()+this.win_height) { 
                return true; 
            }else { 
                return false; 
            } 
        }
    };

    function Scroll(config) {
        var _default = {
            prev: 'prev',                                                               //左箭头类名
            next: 'next',                                                               //右箭头类名
            scroll_block: 'scroll_block',                                               //包含滚动块元素(还包含左右箭头)
            num: 4                                                                      //显示个数
        };

        this.options = $.extend({}, _default, config);
        this.times = 0;                                                                 //多少屏
        this.index = this.options.scroll_block.attr('step') || 0;                       //滚动当前下标
        this.win_height = document.documentElement.clientHeight || document.body.clientHeight;
    }
    Scroll.prototype = {
        init: function() {
            this.$scroll_block_wrap = this.options.scroll_block;
            this.$prev = this.$scroll_block_wrap.find("." + this.options.prev);
            this.$next = this.$scroll_block_wrap.find("." + this.options.next);
            this.$scroll_block = this.$scroll_block_wrap.find('ul');
            this.single_width = this.$scroll_block.find('li:first').outerWidth(true);
            this.offsetX = this.single_width * this.options.num;
            this.$scroll_block_wrap.attr('step', 0);
            var max_length = this.$scroll_block.find('li').length,
                _this = this;

            this.$scroll_block_wrap.show();
            this.paging(max_length, this.options.num);

            if( max_length <= this.options.num ) {
                this.$prev.hide();
                this.$next.hide();
            }
            if( this.index == 0 ) {
                this.$prev.hide();
            }
            if( (this.index+1) >= this.times ) {
                this.$next.hide();
            }


            this.setUlWidth(this.$scroll_block, this.single_width, max_length);

            this.$next.on('click', function(){
                _this.next_handler.apply(_this);
            });
            this.$prev.on('click', function(){
                _this.prev_handler.apply(_this);
            });
        },
        //分页
        paging: function(len, num) {
            if(len % num == 0){
                this.times = parseInt(len / num);
            }else{
                this.times = parseInt(len / num) + 1;
            }
        },
        //下一个事件
        next_handler: function() {
            this.index++;
            this.options.scroll_block.attr('step', this.index);
            this.scrollHorizontal(this.$scroll_block, this.index, this.offsetX);
            this.addLazyImage(this.index);
            if( (this.index+1) >= this.times) {
                this.$next.hide();
            }
            if( this.index !=0 ) {
                this.$prev.show();
            }
        },
        //前一个事件
        prev_handler: function() {
            this.index--;
            this.options.scroll_block.attr('step', this.index);
            this.scrollHorizontal(this.$scroll_block, this.index, this.offsetX);
            if(this.index == 0) {
                this.$prev.hide();
            }
            if( this.index < this.times ) {
                this.$next.show();
            }
        },
        //懒加载图片
        addLazyImage: function(index) {
            //console.log(index)
            //console.log(this.$scroll_block_wrap.attr('data-value'))
            var data_value= parseInt(this.$scroll_block_wrap.attr('data-value')),
                pNum = index + (data_value - 1) * 13,
                _this = this;
            this.$scroll_block.find('*[rel="plate_' + pNum + '"] img').each(function(imgI, img){
                var origin_url = $(this).attr('data-original') ;
                if( $(this).attr('src') != origin_url && (_this.isVisible($(this))) ) {
                    $(this).attr('src', origin_url);
                }
            });
        },
        /** 
         * 判断image元素是否滚动到可视区域 
         * @param img      * @returns {boolean} 
         **/
        isVisible: function(img) {
            if(img.offset().top <= $(document).scrollTop()+this.win_height) {
                return true;
            }else {
                return false;
            }
        },
        //水瓶滚动
        scrollHorizontal: function(scroll_block, index, sWidth) {
            var nowLeft = -(index * sWidth);
            scroll_block.stop(true,false).animate({"left": nowLeft}, 300);
        },
        //设置总宽度
        setUlWidth: function(scroll_block, sWidth, len) {
            scroll_block.css("width", (sWidth * len) );
        },
        destroy: function() {
            this.$next.off('click', this.next_handler);
            this.$prev.off('click', this.prev_handler);
        }
    };

    function LazyLoad() {
        this.win_height = this.win_height = document.documentElement.clientHeight || document.body.clientHeight;
    }
    LazyLoad.prototype = {
        isVisible: function(obj) {
            if(obj.offset().top <= $(document).scrollTop()+this.win_height) {
                return true;
            }else {
                return false;
            }
        },
        loadIndex : function(nextNum) {
            //版块
            var imgs = $('div[rel="lazyImg"]:eq(' + nextNum + ') *[rel="plate_0"] img'); //div[rel="plate_0"] 只加载首个切换条的图片
            //加载图片
            $(imgs).each(function(imgI){
                if($(this).attr('src') != $(this).attr('data-original')) {
                    $(this).attr('src', $(this).attr('data-original'));
                }
            });
        }
    }

    return {
        Tab: Tab,
        Scroll: Scroll,
        LazyLoad: LazyLoad
    }

})();
