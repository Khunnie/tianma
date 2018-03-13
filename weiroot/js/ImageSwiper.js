(function ($) {
    $.fn.ImageSwiper = function (options) {
        var defaults = {
            // GENERAL        
            speed: 500,
            easing: null,
            slideMargin: 0,
            startSlide: 0,
            video: false,
            useCSS: true,
            responsive: true,
            slideZIndex: 50,
            // TOUCH
            touchEnabled: true,
            swipeThreshold: 50,
            oneToOneTouch: true,
            preventDefaultSwipeX: true,
            preventDefaultSwipeY: false,

            // PAGER
            pager: true,

            // CONTROLS
            controls: true,
            nextText: 'Next',
            prevText: 'Prev',
            nextSelector: null,
            prevSelector: null,
            autoControls: false,
            startText: 'Start',
            stopText: 'Stop',
            autoControlsCombine: false,
            autoControlsSelector: null,

            // AUTO
            auto: false,
            pause: 4000,
            autoStart: true,
            autoDirection: 'next',
            autoHover: false,
            autoDelay: 0,
            autoSlideForOnePage: false,

            // CAROUSEL
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 0,
            slideWidth: 0,

            // CALLBACKS
            onSliderLoad: function () { },
            onSlideBefore: function () { },
            onSlideAfter: function () { },
            onSlideNext: function () { },
            onSlidePrev: function () { },
            onSliderResize: function () { }
        }
        var slider = {};
        var el = this;
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        return this.each(function () {
            slider.settings = $.extend({}, defaults, options);
            slider.support = {
                touch: (window.Modernizr && Modernizr.touch === true) || (function () {
                    'use strict';
                    return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
                })(),
                transforms3d: (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                    'use strict';
                    var div = document.createElement('div').style;
                    return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
                })(),
                transforms: (window.Modernizr && Modernizr.csstransforms === true) || (function () {
                    'use strict';
                    var div = document.createElement('div').style;
                    return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
                })(),
                transitions: (window.Modernizr && Modernizr.csstransitions === true) || (function () {
                    'use strict';
                    var div = document.createElement('div').style;
                    return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
                })(),
                classList: (function () {
                    'use strict';
                    var div = document.createElement('div');
                    return 'classList' in div;
                })()
            };
            slider.desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
            if (window.navigator.MSPointerEvent)
                slider.desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
            else if (window.navigator.PointerEvent)
                slider.desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
            slider.touchEvents = {
                touchStart: slider.support.touch ? 'touchstart' : slider.desktopEvents[0],
                touchMove: slider.support.touch ? 'touchmove' : slider.desktopEvents[1],
                touchEnd: slider.support.touch ? 'touchend' : slider.desktopEvents[2]
            };
            init();
            function init() {
                windowWidth = $(window).width();
                windowHeight = $(window).height();
                slider.interval = null;
                slider.imgsWrap = slider.settings.imgsWrap || ".wrap";
                slider.btnsWrap = slider.settings.btnsWrap || ".btnsWrap"
                slider.imgsContainer = $(slider.imgsWrap, el);
                //slider.imgsContainer.css('position', 'relative');
                slider.btnsContainer = $(slider.btnsWrap, el);
                slider.slideWidth = parseInt(el.width()); // $("li", slider.imgsContainer).width();
                slider.child = $("li", slider.imgsContainer);
                slider.animProp = 'left';
                slider.usingCSS = slider.settings.useCSS && (function () {
                    // create our test div element
                    var div = document.createElement('div');
                    // css transition properties
                    var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                    // test for each property
                    for (var i in props) {
                        if (div.style[props[i]] !== undefined) {
                            slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                            slider.animProp = '-' + slider.cssPrefix + '-transform';
                            return true;
                        }
                    }
                    return false;
                } ());
                slider.activeIndex = 0;
                slider.working = false;
                if (slider.child.length == 0)
                    return;
                slider.imgsContainer.width(slider.slideWidth * slider.child.length);
                $("li", slider.imgsContainer).width(slider.slideWidth);
                if (slider.settings.pager && slider.btnsContainer.length > 0) {
                    slider.btnsContainer.empty();
                    $.each(slider.child, function (i, row) {
                        var a = $("<a/>");
                        a.attr("index", i);
                        $(a).bind(slider.support.touch ? "tap" : "click", function () {
                            el.goToSlide($(this).attr("index"));
                        });
                        slider.btnsContainer.append(a);
                    });
                    updatePagerActive(slider.activeIndex);
                }
                slider.touch = {
                    start: { x: 0, y: 0 },
                    end: { x: 0, y: 0 }
                }
                if (slider.support.touch || (window.navigator.MSPointerEvent || window.navigator.PointerEvent)) {
                    $(slider.imgsContainer).bind(slider.touchEvents.touchStart, onTouchStart);
                }
                if (slider.settings.auto) {
                    if (slider.settings.autoDelay > 0) {
                        var timeout = setTimeout(startAuto, slider.settings.autoDelay);
                    }
                    else {
                        startAuto();
                    }
                }

            }
            if (slider.settings.responsive) $(window).bind('resize', resizeWindow);
            function onTouchStart(e) {
                if (slider.working) {
                    e.preventDefault();
                }
                else {
                    slider.touch.originalPos = $(slider.imgsContainer).position();
                    var orig = e.originalEvent;
                    slider.touch.start.x = slider.support.touch ? orig.changedTouches[0].pageX : (e.pageX || e.clientX);
                    if (slider.support.touch) {
                        $(slider.imgsContainer).bind(slider.touchEvents.touchMove, onTouchMove);
                        $(slider.imgsContainer).bind(slider.touchEvents.touchEnd, onTouchEnd);
                    }
                    else {
                        $(document).bind(slider.touchEvents.touchMove, onTouchMove);
                        $(document).bind(slider.touchEvents.touchEnd, onTouchEnd);
                    }
                }
            }
            function onTouchMove(e) {
                e.preventDefault();
                var orig = e.originalEvent;
                if (slider.settings.oneToOneTouch) {
                    var change = (slider.support.touch ? orig.changedTouches[0].pageX : (e.pageX || e.clientX)) - slider.touch.start.x;
                    var value = slider.touch.originalPos.left + change;
                    setPositionProperty(value, 0);
                }
            }
            var onTouchEnd = function (e) {
                $(slider.imgsContainer).unbind(slider.touchEvents.touchMove, onTouchMove);
                var orig = e.originalEvent;
                var value = 0;
                slider.touch.end.x = slider.support.touch ? orig.changedTouches[0].pageX : (e.pageX || e.clientX);
                var distance = slider.touch.end.x - slider.touch.start.x;
                var value = slider.touch.originalPos.left;
                if (Math.abs(distance) >= slider.settings.swipeThreshold) {
                    distance < 0 ? el.goToNextSlide() : el.goToPrevSlide();
                    stopAuto();
                }
                else {
                    setPositionProperty("-" + (slider.slideWidth * slider.activeIndex), 200);
                }
                $(slider.imgsContainer).unbind(slider.touchEvents.touchEnd, onTouchEnd);
            }
            el.goToSlide = function (slideIndex) {
                if (slider.working || slider.activeIndex == slideIndex) return;
                slider.working = true;
                slider.oldIndex = slider.activeIndex;
                if (slideIndex < 0) {
                    slider.activeIndex = slider.child.length - 1;
                }
                else if (slideIndex >= slider.child.length) {
                    slider.activeIndex = 0;
                }
                else {
                    slider.activeIndex = slideIndex;
                }
                if (slider.settings.pager)
                    updatePagerActive(slider.activeIndex);
                setPositionProperty("-" + (slider.slideWidth * slider.activeIndex), slider.settings.speed);
            }
            el.goToNextSlide = function () {
                var pagerIndex = parseInt(slider.activeIndex) + 1;
                el.goToSlide(pagerIndex);
            }
            el.goToPrevSlide = function () {
                var pagerIndex = parseInt(slider.activeIndex) - 1;
                el.goToSlide(pagerIndex);
            }
            function startAuto() {
                if (!slider.settings.auto) return;
                if (slider.interval) return;
                slider.interval = setInterval(function () {
                    slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
                }, slider.settings.pause);
            }
            function stopAuto() {
                if (!slider.settings.auto) return;
                if (!slider.interval) return;
                clearInterval(slider.interval);
                slider.interval = null;
            }
            function updatePagerActive(slideIndex) {
                $(slider.btnsContainer).find("a").removeClass(slider.settings.activeClass);
                $(slider.btnsContainer).find("a").eq(slideIndex).addClass(slider.settings.activeClass);
            }
            function setPositionProperty(value, duration) {
                // use CSS transform
                if (slider.usingCSS) {
                    var propValue = 'translate3d(' + value + 'px, 0, 0)';
                    $(slider.imgsContainer).css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
                    $(slider.imgsContainer).css(slider.animProp, propValue);
                    $(slider.imgsContainer).bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                        // unbind the callback
                        $(slider.imgsContainer).unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                        slider.working = false;
                        startAuto();
                    });
                }
                else {
                    var animateObj = {};
                    animateObj[slider.animProp] = value;
                    $(slider.imgsContainer).animate(animateObj, duration, slider.settings.easing, function () {
                        slider.working = false
                        startAuto();
                    });
                }
            }
            function resizeWindow() {
                var windowNewWidth = $(window).width();
                var windowNewHeight = $(window).height();
                if (windowWidth != windowNewWidth || windowHeight != windowNewHeight) {
                    init();
                }
            }
        });
    }
})(jQuery);