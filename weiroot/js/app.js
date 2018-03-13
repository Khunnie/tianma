var BC = BC || {
};
BC = {
    //表单
    form: {
        //搜索组件
        search: function () {
            var DATA_COUNTRY = null;
            $('.BC_form.serch').each(function (index, element) {
                var T = $(this);
                var input = T.find('input');
                var box = T.find('.box');
                var btn = T.find('.btn');
                input.click(function () {
                    box.addClass('cur');
                    setTimeout(function () {
                        btn.show();
                    }, 300);
                    //获取国家数据
                    if (!DATA_COUNTRY) {
                        getCountryData();
                    }
                    historyKey = $(this).val();
                    listeningSwitch = true;
                    listeningInput($(this));
                });
                btn.click(function () {
                    input.val('');
                    listeningSwitch = false;
                    $('#country_index').show();
                    $('#country_searlist,#nocountry').hide();
                    btn.hide();
                    box.removeClass('cur');
                });
            });
            var listeningSwitch = false; //是否继续匹配
            var historyKey = '';
            $('#country_searlist,#nocountry,#country_searlist').hide();
            function listeningInput(o) {
                if (listeningSwitch) {
                    if (historyKey != o.val()) {
                        $('#country_searlist>.title>span').text('搜索结果');
                        $('#country_index,#historycountry').hide();
                        historyKey = o.val();
                        matchCountryList(o, historyKey);
                    } else if (o.val() == '') {
                        $('#country_searlist>.title>span').text('搜索历史');
                        $('#country_index,#country_searlist,#nocountry').hide();
                        showHistoryList(o);
                    }
                    setTimeout(function () {
                        listeningInput(o);
                    }, 500);
                }
            }
            function showHistoryList(o) {
                var searchHistoryListJSON = getHistoryList();
                if (searchHistoryListJSON.length > 0) {
                    showCountryList(o, searchHistoryListJSON);
                } else {
                    $('#historycountry').show();
                }
            }
            function getHistoryList() {
                var searchHistoryListStr = BC.cookie.get('searchHistoryList');
                if (searchHistoryListStr && searchHistoryListStr != '') {
                    var searchHistoryListJSON = JSON.parse(searchHistoryListStr);
                } else {
                    var searchHistoryListJSON = [
                    ];
                }
                return searchHistoryListJSON;
            }
            function setHistoryList(data) {
                var searchHistoryListJSON = getHistoryList();
                var isHave = false;
                for (var i in searchHistoryListJSON) {
                    if (searchHistoryListJSON[i].name == data.name) {
                        searchHistoryListJSON[i].searchNum++;
                        isHave = true;
                        break;
                    }
                }
                if (!isHave) {
                    data.searchNum = 1;
                    searchHistoryListJSON.push(data);
                }
                searchHistoryListJSON.sort(function (a, b) {
                    return a.searchNum < b.searchNum
                });
                BC.cookie.set('searchHistoryList', JSON.stringify(searchHistoryListJSON), 525600); //历史记录保存一年
            }
            function matchCountryList(o, key) {
                if (!DATA_COUNTRY) {
                    showCountryEmpty();
                    return;
                }
                var countryList = [
                ];
                for (var i in DATA_COUNTRY) {
                    var data = DATA_COUNTRY[i];
                    if (data.name.indexOf(key) != - 1 || data.py.indexOf(key) != - 1 || data.pys.indexOf(key) != - 1) {
                        countryList.push(data);
                    }
                }
                if (countryList.length > 0) {
                    showCountryList(o, countryList);
                } else {
                    showCountryEmpty();
                }
            }
            function showCountryList(o, list) {
                $('#nocountry,#historycountry').hide();
                $('#country_searlist').show().find('.c_list').remove();
                for (var i in list) {
                    (function (data) {
                        var html = $('<a class="c_list"><span/><div class="line"/></a>');
                        html.attr('href', data.link).find('span').text(data.name).end().click(function (e) {
                            setHistoryList(data);
                            o.val(data.name);
                        }).appendTo('#country_searlist');
                    }) (list[i]);
                }
            }
            function showCountryEmpty() {
                $('#country_searlist').hide();
                $('#nocountry').show();
            }
            //获取国家数据

            function getCountryData() {
                $.get('../../../tmp_data/visa/countrylist.js', function (data) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    DATA_COUNTRY = data;
                });
            }
        },
        //单选组件
        radio: function () {
            $('.BC_form.radio').each(function (index, element) {
                var T = $(this);
                var input = T.find('input');
                input.each(function (index, element) {
                    if (typeof ($(this).attr('checked')) == 'undefined') {
                        //$("<sub ></sub >").appendTo(T);
                    } else {
                        //$("<sub class='selecd'></sub >").appendTo(T);
                    }
                });
            });
            $('.BC_form.radio').each(function (index, element) {
                var T = $(this);
                var radio = T.find('sub ');
                var input = T.find('input');
                radio.on('click', function () {
                    var li = radio.index(this);
                    radio.removeClass('selecd');
                    $(this).addClass('selecd');
                    input.eq(li).get(0).checked = true;
                })
            });
        },
        //复选控件
        BC_Control_Checked: function () {
            $('.BC_Control_Checkbox').each(function () {
                if ($(this).hasClass('BC_Control_Checkbox_binded')) {
                    return true;
                }
                if ($(this).attr('styleclass')) {
                    var className = $(this).attr('styleclass');
                } else {
                    var className = 'BC_Control_Checkbox';
                }
                $(this).addClass(className + '_binded').hide();
                var THIS = $(this).get(0);
                var html = $('<div/>').addClass(className + '_box');
                $('<div/>').addClass(className + '_Popo').appendTo(html);
                html.bind('click', function (e) {
                    if (THIS.checked) {
                        THIS.checked = false;
                        $(this).removeClass(className + '_box_checked');
                    } else {
                        THIS.checked = true;
                        $(this).addClass(className + '_box_checked');
                    }
                });
                html.insertAfter($(this));
                if (THIS.checked) {
                    html.addClass(className + '_box_checked');
                }
            });
        },
        //模拟选择菜单
        select_btn: function () {
            $('.box_a,.box_d,.pingan_block').find('li.BC_rel').each(function (index, element) {
                var _this = $(this);
                var btn_select = _this.find('select');
                var s_text = _this.find('.B_text_b');
                btn_select.on('change', function () {
                    var text = $(this).find('option:selected').text();
                    $(this).parents('.BC_rel').find('.B_text_b').text(text);
                })
                s_text.text(btn_select.find('option:selected').text());
            });
        },
        //透视提示
        Prompt: function (text) {
            var html = $('<div class="BC_form tishi" style="position:absolute;z-index:9999; font-size:28px;"/>').text(text)
            html.appendTo('body').delay(1500).fadeOut(500, function () {
                $(this).remove();
            })
            html.css({
                left: ($(window).width() - html.outerWidth()) / 2,
                top: ($(window).height() - html.outerHeight()) / 2 + $(window).scrollTop()
            })
        },
        //
        select_date: function () {
            $('.rili').each(function (index, element) {
                var o = $(this);
                var btn = $('.input_date');
                var text = $('.B_text_b');
                btn.change(function () {
                    text.text('');
                })
            });
        },
        //加减组件
        BC_Control_Increment1: function (abc) {
            $('.BC_Control_Increment').each(function () {
                var T = $(this);
                var btnReduction = $(this).find('.BC_Control_Increment_Reduction');
                var btnAdd = $(this).find('.BC_Control_Increment_Add');
                var ValueObj = $(this).find('.BC_Control_Increment_Value');
                //var Value=parseInt(ValueObj.text(),10);
                //var ValueObj = abc;
                var Value = parseInt(abc, 10);
                var minValue = ValueObj.attr('min') ? parseInt(ValueObj.attr('min'), 10)  : null;
                var maxValue = ValueObj.attr('max') ? parseInt(ValueObj.attr('max'), 10)  : null;
                var ValueStep = ValueObj.attr('step') ? parseInt(ValueObj.attr('step'), 10)  : 1;
                var showResultInfo = function (type, txt, status) {
                    if (typeof BC_Control_Increment_CallBack == 'function') {
                        BC_Control_Increment_CallBack({
                            o: T,
                            type: type,
                            min: minValue,
                            max: maxValue,
                            value: Value,
                            txt: txt,
                            status: status
                        });
                    } else if (status == 0) {
                        alert(txt);
                    }
                }
                btnReduction.click(function (e) {
                    if ($(this).hasClass('disabled')) {
                        return false;
                    }
                    if (Value - minValue >= ValueStep) {
                        Value -= ValueStep;
                        //showResultInfo("min","",1);
                    } else {
                        //showResultInfo("min","最小值为"+minValue,0);
                        Value = minValue;
                    }
                    ValueObj.text(Value);
                });
                btnAdd.click(function (e) {
                    if ($(this).hasClass('disabled')) {
                        return false;
                    }
                    if (maxValue - Value >= ValueStep) {
                        Value += ValueStep;
                        //showResultInfo("max","",1);
                    } else {
                        //showResultInfo("max","最大值为"+maxValue,0);
                        Value = maxValue;
                    }
                    ValueObj.text(Value);
                });
                ValueObj.blur(function () {
                    if (!$(this).val().match(/^\d+$/)) {
                        Value = minValue;
                        $(this).text(minValue);
                        //showResultInfo("max","只能输入数字",0);
                        return false;
                    }
                    Value = parseInt(ValueObj.val(), 10);
                    if (Value < minValue) {
                        Value = minValue;
                        //showResultInfo("min","最小值为"+minValue,0);
                    } else if (Value > maxValue) {
                        Value = maxValue;
                        //showResultInfo("max","最大值为"+maxValue,0);
                    } else {
                        //showResultInfo("max","",1);
                    }
                    $(this).text(Value);
                });
            });
        },
        BC_Control_Increment: function () {
            $('.BC_Control_Increment').each(function () {
                var T = $(this);
                var btnReduction = $(this).find('.BC_Control_Increment_Reduction');
                var btnAdd = $(this).find('.BC_Control_Increment_Add');
                var ValueObj = $(this).find('.BC_Control_Increment_Value');
                var Value = parseInt(ValueObj.text(), 10);
                var minValue = ValueObj.attr('min') ? parseInt(ValueObj.attr('min'), 10)  : null;
                var maxValue = ValueObj.attr('max') ? parseInt(ValueObj.attr('max'), 10)  : null;
                var ValueStep = ValueObj.attr('step') ? parseInt(ValueObj.attr('step'), 10)  : 1;
                var showResultInfo = function (type, txt, status) {
                    if (typeof BC_Control_Increment_CallBack == 'function') {
                        BC_Control_Increment_CallBack({
                            o: T,
                            type: type,
                            min: minValue,
                            max: maxValue,
                            value: Value,
                            txt: txt,
                            status: status
                        });
                    } else if (status == 0) {
                        alert(txt);
                    }
                }
                btnReduction.click(function (e) {
                    if ($(this).hasClass('disabled')) {
                        return false;
                    }
                    if (Value - minValue >= ValueStep) {
                        Value -= ValueStep;
                        showResultInfo('min', '', 1);
                    } else {
                        showResultInfo('min', '最小值为' + minValue, 0);
                        Value = minValue;
                    }
                    ValueObj.text(Value);
                });
                btnAdd.click(function (e) {
                    if ($(this).hasClass('disabled')) {
                        return false;
                    }
                    if (maxValue - Value >= ValueStep) {
                        Value += ValueStep;
                        showResultInfo('max', '', 1);
                    } else {
                        showResultInfo('max', '最大值为' + maxValue, 0);
                        Value = maxValue;
                    }
                    ValueObj.text(Value);
                });
                ValueObj.blur(function () {
                    if (!$(this).val().match(/^\d+$/)) {
                        Value = minValue;
                        $(this).text(minValue);
                        showResultInfo('max', '只能输入数字', 0);
                        return false;
                    }
                    Value = parseInt(ValueObj.val(), 10);
                    if (Value < minValue) {
                        Value = minValue;
                        showResultInfo('min', '最小值为' + minValue, 0);
                    } else if (Value > maxValue) {
                        Value = maxValue;
                        showResultInfo('max', '最大值为' + maxValue, 0);
                    } else {
                        showResultInfo('max', '', 1);
                    }
                    $(this).text(Value);
                });
            });
        },
        validation: {
            vBind: function () {
                var T = this;
                var selector = 'input:not(.noBindValidation):not(:radio):not(:checkbox):not([type=button]),select:not(.noBindValidation),textarea:not(.noBindValidation)';
                $(selector).bind('focus change', function (e) {
                    $(this).removeClass('BC_Input_error');
                    if (typeof T.showInputRight == 'function') {
                        T.showInputRight($(this));
                    }
                }).blur(function (e) {
                    var o = $(this);
                    setTimeout(function () {
                        var r = T.validation(o);
                        if (!r.result) {
                            result = false;
                            T.showInputError(o, r.txt, {
                                fromEvent: 'blur'
                            });
                        } else if (typeof T.showInputRight == 'function') {
                            T.showInputRight(o);
                        }
                    }, 200);
                });
                var validationFormBox = $('.BC_ValidationFormBox');
                if (validationFormBox.length == 0) {
                    validationFormBox = $('form');
                }
                validationFormBox.each(function () {
                    var thisForm = $(this);
                    var btnValidation = $(this).find('.BC_validation');
                    btnValidation.each(function () { //不同验证按钮规则
                        var btn = $(this);
                        if ($(this).attr('vali-objs')) {
                            var vselector = $(this).attr('vali-objs');
                        } else {
                            var vselector = selector + ',.BC_Validation_Radio,.BC_Validation_Checkbox';
                        }
                        var inputs = thisForm.find(vselector);
                        var btnSwitchClass = btn.attr('switchclass');
                        if (btnSwitchClass) { //验证按钮控制逻辑
                            var keyupValidationTimeout = null;
                            inputs.bind('keyup', function () {
                                var thisInput = $(this);
                                if (keyupValidationTimeout) {
                                    clearTimeout(keyupValidationTimeout);
                                    keyupValidationTimeout = null;
                                }
                                keyupValidationTimeout = setTimeout(function () {
                                    var r = T.validation(thisInput);
                                    if (r.result) {
                                        inputsEachAll();
                                    } else {
                                        btn.addClass(btnSwitchClass);
                                    }
                                }, 500);
                            });
                            inputs.bind('blur', function () {
                                var thisInput = $(this);
                                if (keyupValidationTimeout) {
                                    clearTimeout(keyupValidationTimeout);
                                    keyupValidationTimeout = null;
                                }
                                var r = T.validation(thisInput);
                                if (!r.result) {
                                    T.showInputError(thisInput, r.txt, {
                                        fromEvent: 'blur'
                                    });
                                }
                                inputsEachAll();
                            });
                            inputs.filter('select').bind('change', function () {
                                var r = T.validation($(this));
                                if (!r.result) {
                                    T.showInputError($(this), r.txt, {
                                        fromEvent: 'blur'
                                    });
                                }
                                inputsEachAll();
                            });
                            var inputsEachAll = function (isShowError) {
                                inputs.each(function () {
                                    var r = T.validation($(this));
                                    if (!r.result) {
                                        if (isShowError) {
                                            T.showInputError($(this), r.txt, {
                                                fromEvent: 'blur'
                                            });
                                        }
                                        btn.addClass(btnSwitchClass);
                                        return false;
                                    } else if (typeof T.showInputRight == 'function') {
                                        if (isShowError) {
                                            T.showInputRight($(this));
                                        }
                                        btn.removeClass(btnSwitchClass);
                                    }
                                });
                            };
                            inputsEachAll();
                        }
                        btn.click(function (e) {
                            /*if(btnSwitchClass&&$(this).hasClass(btnSwitchClass)){
								result=false;
							}else{*/
                            var result = T.vAll(inputs);
                            /*}*/
                            if (!result) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                            }
                        });
                        if ($(this).attr('valiall')) {
                        }
                    });
                });
                $('.BC_Validation_Radio,.BC_Validation_Checkbox').click(function () {
                    $(this).removeClass('BC_Input_error');
                    if (typeof T.showInputRight == 'function') {
                        T.showInputRight($(this));
                    }
                });
                $.fn.extend({
                    BC_ValidationRadioEvent: function (type) {
                        switch (type) {
                            case 'getValue':
                                return this.find('input:radio:checked').val();
                                break;
                            default:
                                break;
                        }
                    },
                    BC_ValidationCheckboxEvent: function (type) {
                        switch (type) {
                            case 'getValue':
                                var cs = this.find('input:checkbox:not(:disabled):checked');
                                var r = '';
                                cs.each(function (i) {
                                    if (i > 0) {
                                        r += ',';
                                    }
                                    r += $(this).val();
                                });
                                return r;
                                break;
                            default:
                                break;
                        }
                    }
                });
            }, vAll: function (os) {
                var T = this;
                var result = true;
                os.each(function () {
                    var o = $(this);
                    var r = T.validation(o);
                    if (!r.result) {
                        result = false;
                        T.showInputError(o, r.txt, {
                            fromEvent: 'all'
                        });
                        return false;
                    } else if (typeof T.showInputRight == 'function') {
                        T.showInputRight(o);
                    }
                });
                return result;
            }, showInputError: function (o, txt, opt) {
                var settings = {
                    isPos: false,
                    fromEvent: ''
                };
                $.extend(settings, opt);
                $('.BC_Input_error_tishi').remove();
                o.addClass('BC_Input_error');
                var html = $('<div class="BC_form tishi BC_Input_error_tishi" style="position:absolute;z-index:9999;"/>').text(txt).click(function (e) {
                    $(this).remove();
                    o.focus();
                    e.preventDefault();
                }).appendTo('body').delay(1500).fadeOut(500, function () {
                    $(this).remove();
                });
                html.css({
                    left: ($(window).width() - html.outerWidth()) / 2,
                    top: ($(window).height() - html.outerHeight()) / 2 + $(window).scrollTop()
                });
                if (settings.isPos) {
                    $('html,body').stop().animate({
                        scrollTop: o.offset().top
                    }, 300);
                }
            }, showInputRight: function (o) {
                o.removeClass('BC_Input_error');
            }, validation: function (o) {
                if (o.hasClass('validation_none')) {
                    return {
                        o: o,
                        result: true,
                        txt: '不验证'
                    };
                }
                if (o.is(':hidden') && o.attr('type') != 'hidden') {
                    return {
                        o: o,
                        result: true,
                        txt: '不可见控件'
                    };
                }
                var txt = '';
                var result = true;
                var op = o;
                var value = '';
                if (o.hasClass('BC_Validation_Radio')) {
                    value = o.BC_ValidationRadioEvent('getValue');
                } else if (o.hasClass('BC_Validation_Checkbox')) {
                    value = o.BC_ValidationCheckboxEvent('getValue');
                } else {
                    value = o.val();
                }
                var fn = o.attr('fn');
                var fc = o.attr('fc');
                var placeholder = o.attr('placeholder');
                op.removeClass('error');
                if (o.hasClass('required')) {
                    if (value == '' || value == placeholder) {
                        result = false;
                        txt = getInfoTxt('不能为空', '请选择');
                        return {
                            o: o,
                            result: result,
                            txt: txt
                        };
                    }
                }
                if (typeof cacheData == 'undefined') {
                    cacheData = {
                    };
                }
                var v = o.attr('vali');
                if (v && value != '' && value != placeholder) {
                    var rela = 'or';
                    var vs = v.split('||');
                    if (vs.length == 1 && v.split('&&').length > 1) {
                        rela = 'and';
                        vs = v.split('&&');
                    }
                    for (var i = 0; i < vs.length; i++) {
                        var reg = getRules(vs[i]);
                        if (reg.k) { //其他条件验证
                            var isBreak = false;
                            switch (reg.k) {
                                case 'same': /*相同内容*/
                                    var v = '';
                                    var sameobj = o.parents('form').find('[vali=same\\[' + reg.n + '\\]]');
                                    sameobj.removeClass('BC_Input_error');
                                    sameobj.each(function (i) {
                                        if (i == 0) {
                                            v = $(this).val();
                                        } else if ($(this).val() != '') {
                                            if (v != $(this).val()) {
                                                result = false;
                                                txt = getInfoTxt('内容不同');
                                            }
                                        }
                                    });
                                    break;
                                case 'with': /*比对相同内容*/
                                    var withObj = $(reg.n);
                                    if (withObj.length) {
                                        if (value != withObj.val()) {
                                            result = false;
                                            txt = getInfoTxt('密码不同');
                                        }
                                    } else {
                                        result = false;
                                        txt = getInfoTxt('找不到比对对象');
                                    }
                                    break;
                                case 'withnot': /*比对不相同内 容*/
                                    var withObj = $(reg.n);
                                    if (withObj.length) {
                                        if (value == withObj.val()) {
                                            result = false;
                                            txt = getInfoTxt('不能相同');
                                        }
                                    } else {
                                        result = false;
                                        txt = getInfoTxt('找不到比对对象');
                                    }
                                    break;
                                case 'not': /*不为**/
                                    if (value == reg.n) {
                                        result = false;
                                        txt = getInfoTxt('选择不正确');
                                    }
                                    break;
                                case 'max': /*最大值**/
                                    if (!Number(value)) {
                                        result = false;
                                        txt = getInfoTxt('只能填写数字');
                                    } else if (!Number(reg.n)) {
                                        result = false;
                                        txt = getInfoTxt('验证规则错误');
                                    } else if (Number(value) > Number(reg.n)) {
                                        result = false;
                                        txt = getInfoTxt('最大值:' + reg.n);
                                    }
                                    break;
                                case 'ajax': /*ajax验证(同步)**/
                                    var rnArray = reg.n.replace(/[\'\"]/g, '').split(',');
                                    var ajaxSettings = {
                                        url: rnArray[0],
                                        data: rnArray.length >= 1 ? rnArray[1] : {
                                        },
                                        type: rnArray.length >= 2 ? rnArray[2] : 'GET'
                                    }
                                    $.ajax({
                                        type: ajaxSettings.type,
                                        url: ajaxSettings.url,
                                        data: ajaxSettings.data,
                                        async: false,
                                        success: function (data) {
                                            if (typeof data == 'string') {
                                                data = eval('(' + data + ')');
                                            }
                                            if (!data.result) {
                                                result = false;
                                                txt = data.txt;
                                            }
                                            if (typeof ajaxValidationCallback == 'function') {
                                                ajaxValidationCallback({
                                                    o: o,
                                                    result: data.result,
                                                    txt: data.txt
                                                });
                                            }
                                        }
                                    });
                                    break;
                                default:
                                    break;
                            }
                            if (rela == 'and' && !result) {
                                break;
                        } else if (rela == 'or' && result) {
                            break;
                    }
                } else { //正则验证
                    var cm = value.match(reg);
                    if (!!cm) {
                        result = true;
                        if (rela == 'or') {
                            break;
                        }
                    } else {
                        result = false;
                        txt = getInfoTxt('格式不正确');
                        if (rela == 'and') {
                            break;
                        }
                    }
                }
            }
        }
        function getInfoTxt(error, chooseError) {
            if (chooseError && o.get(0).tagName.toLowerCase() == 'select') {
                return (o.attr('fc') ? o.attr('fc')  : chooseError) + (o.attr('fn') ? o.attr('fn')  : '');
            } else {
                return (o.attr('fn') ? o.attr('fn')  : '') + (o.attr('fc') ? o.attr('fc')  : error);
            }
        }
        function getRules(rname) {
            var rns = rname.match(/^([a-z]+)\[(.+)\]$/i);
            if (rns) {
                var cname = rns[1];
            } else {
                var cname = rname;
            }
            switch (cname) {
                case 'mobile':
                    return /^((\(\d{2,3}\))|(\d{3}\-))?1[34578]\d{9}$/;
                    break;
                case 'phone':
                    return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
                    break;
                case 'email':
                    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                    break;
                case 'idcard':
                    return /^(\d{17}[xXyY]|\d{18})|(\d{14}[xXyY]|\d{15})$/;
                    break;
                case 'passport':
                    return /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/;
                    break;
                case 'qq':
                    return /^[1-9][0-9]{4,}$/;
                    break;
                case 'url':
                    return /^([a-zA-Z]+:\/\/)?[^\s\.]+\.[^\s]*$/;
                    break;
                case 'date':
                    return /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
                    break;
                case 'chinese':
                    return /^[\u4E00-\u9FA5]+$/;
                    break;
                case 'english':
                    return /^[a-zA-Z\s]+$/;
                    break;
                case 'same':
                    return {
                        k: 'same',
                        n: rns[2]
                    };
                    break;
                case 'with':
                    return {
                        k: 'with',
                        n: rns[2]
                    };
                    break;
                case 'withnot':
                    return {
                        k: 'withnot',
                        n: rns[2]
                    };
                    break;
                case 'integer':
                    return /^\d+$/;
                    break;
                case 'length': //length[0,4],length[4],length[4,]
                    var ls = rns[2].split(',');
                    var rs = '';
                    for (var i in ls) {
                        if (i > 0) {
                            rs += ',';
                        }
                        rs += String(ls[i]);
                    }
                    return new RegExp('^.{' + rs + '}$');
                    break;
                case 'custom':
                    return new RegExp(rns[2]);
                    break;
                case 'max':
                    return {
                        k: 'max',
                        n: rns[2]
                    };
                    break;
                case 'length': //length[0,4],length[4],length[4,]
                    var ls = rns[2].split(',');
                    var rs = '';
                    for (var i in ls) {
                        if (i > 0) {
                            rs += ',';
                        }
                        rs += String(ls[i]);
                    }
                    return new RegExp('^.{' + rs + '}$');
                    break;
                case 'not':
                    return {
                        k: 'not',
                        n: rns[2]
                    };
                    break;
                case 'ajax':
                    return {
                        k: 'ajax',
                        n: rns[2]
                    };
                    break;
                default:
                    break;
            }
        }
        return {
            o: o,
            result: result,
            txt: txt
        }
    }
}
}, BC_Control_Radio: function () {
$('.BC_Control_Radio').each(function () {
    if ($(this).hasClass('BC_Control_Radio_Binded')) {
        return;
    }
    $(this).addClass('BC_Control_Radio_Binded');
    var T = $(this);
    var curItem = null;
    $(this).find(':radio').each(function () {
        var TT = $(this).hide();
        var itemtype = $(this).attr('itemtype')
        var title = $(this).attr('title');
        var curClassName = itemtype == 'image' ? 'New_btn_img_cur' : 'btn_e_cur';
        var className = itemtype == 'image' ? 'New_btn_img ' : 'New_btn btn_e ';
        className += $(this).get(0).checked ? curClassName + ' ' : '';
        if ($(this).attr('class')) {
            className += $(this).attr('class');
        }
        var thisItem = $('<a href="#"/>').addClass(className).click(function (e) {
            if (!$(this).hasClass(curClassName)) {
                TT.get(0).checked = true;
                if (curItem) {
                    curItem.removeClass(curClassName);
                }
                curItem = $(this).addClass(curClassName);
            }
            if (typeof BC_Control_Radio_Callback == 'function') {
                BC_Control_Radio_Callback({
                    box: T,
                    o: TT,
                    value: TT.val()
                });
            }
            e.preventDefault();
        }).insertAfter(TT);
        if ($(this).get(0).checked) {
            curItem = thisItem;
        }
        if (itemtype == 'image') {
            $('<span class="BC_Control_Radio_Checked_Border"/>').appendTo(thisItem);
        } else {
            thisItem.html(title);
        }
        if ($(this).data('other')) {
            $('<div class="BC_Control_Radio_other"/>').html($(this).data('other')).appendTo(thisItem);
        }
        if (title) {
            thisItem.attr('title', title);
        }
    });
});
},
//弹出层
pageLock: {
show: function (index, ceng, colse, cfun) {
    if (!$('#lockpage').length) {
        var $width = ($(window).width() - $(ceng).outerWidth()) / 2
        var $height = ($(window).height() - $(ceng).outerHeight()) / 2
        var lockhtml = $('<div id=\'lockpage\'/>').css({
            position: 'absolute',
            zIndex: (index ? index : 20),
            left: 0,
            top: 0,
            width: $(window).width(),
            height: $(document).height(),
            background: '#000',
            opacity: 0.3
        }).appendTo($('.pageconversionwrap').length > 0 ? '.pageconversionwrap' : 'body');
    }
    $('#lockpage').css({
        opacity: 0,
        display: 'block'
    }).animate({
        opacity: 0.3
    }, 500);
    $(ceng).css({
        position: 'fixed',
        left: $width,
        top: $height
    });
    $(ceng).show();
    $(ceng).click(function (e) {
        e.stopPropagation();
    })
    $(colse).click(function (e) {
        $(ceng).hide();
        BC.pageLock.hide()
        e.stopPropagation();
        return false
    });
    if (typeof cfun == 'function') {
        $('#lockpage').one('click', cfun);
    } 
    else
    {
        $('#lockpage').unbind('click');
    }
},
hide: function (ceng) {
    $('#lockpage').hide();
    $(ceng).hide();
},
start: function (ceng, dian, colse) {
    $(dian).click(function (event) {
        BC.pageLock.show('', ceng, colse)
        event.stopPropagation();
    })
}
}, layer: {
html: null,
con: null,
settings: null,
show: function (options) {
    var T = this;
    var settings = {
        width: 'auto',
        height: 'auto',
        ifmID: '',
        ifmContent: '',
        type: 'clone', //clone 将弹层内容节点连同内部事件复制至浮层内,  move  将弹层内容节点连同内部事件移动至浮层内,关闭后还原
        closeClass: '.layer_close',
        onShow: function (e) {
        },
        onClose: function (e) {
        },
        lockEvent: function (e) {
        }
    };
    $.extend(settings, options);
    this.settings = settings;
    this.con = null;
    if (settings.ifmID && settings.ifmID != '') {
        if (typeof settings.ifmID == 'object') {
            this.con = settings.ifmID;
        } else {
            this.con = $(settings.ifmID);
        }
    } else if (settings.ifmContent && settings.ifmContent != '') {
        if (typeof settings.ifmContent == 'object') {
            this.con = settings.ifmContent;
        } else {
            this.con = $(settings.ifmContent);
        }
    }
    if (settings.type == 'clone') {
        this.con = this.con.clone(true, true);
    }
    this.html = $('<div/>').css({
        position: 'fixed',
        zIndex: 1000,
        left: '50%',
        top: '50%'
    });
    this.con.show().find(settings.closeClass).click(function (e) {
        //settings.onClose({html:this.html});
        T.remove();
        e.preventDefault();
    }).end().appendTo(this.html);
    settings.onShow({
        html: this.html
    });
    this.html.appendTo('body');
    this.html.css({
        width: this.html.outerWidth(),
        height: this.html.outerHeight(),
        marginLeft: this.html.outerWidth() / 2 * - 1,
        marginTop: this.html.outerHeight() / 2 * - 1
    });
    BC.pageLock.show(999, null, null, settings.lockEvent);
    return this;
},
remove: function () {
    if (this.settings.type == 'move') {
        this.con.hide().appendTo('body');
    }
    if (this.html) {
        this.html.remove();
        this.html = null;
    }
    this.settings.onClose(this);
    BC.pageLock.hide();
},
rParent: function () {
    try {
        return top.layerbox;
    } catch (e) {
        return null;
    }
}
}, pageConversion: function (options) {
var T = this;
var settings = {
    effect: 'right' //效果:left 从左侧进入,right 从右侧进入,top 从上侧进入,bottom 从下侧进入
}
$.extend(settings, options);
var historyPages = [
];
var pages = $('[page-rule=page]').addClass('pageconversion');

if (pages.length == 0) {
    return;
}
var prevPageName = '';
var currentPageName = getPageName();
var zIndex = 1000;
if (currentPageName != '') {
    var cPage = pages.filter('#' + currentPageName);
    if (cPage.length > 0) {
        togglePage(cPage, 'none');
    } else {
        togglePage(pages.eq(0), 'none');
    }
} else {
    togglePage(pages.eq(0), 'none');
}


$('a').click(function (e) {
    var transition = $(this).attr('link-transition') ? $(this).attr('link-transition')  : 'from-right';
    if ($(this).attr('link-rule') == '') {
        return false;
    }
    toggle($(this).attr('link-rule'), transition);
});
function toggle(type, transition) {
    switch (type) {
        case 'page':
            prevPageName = getPageName();
            setTimeout(function () {
                currentPageName = getPageName();
                togglePage(pages.filter('#' + currentPageName), transition);
            }, 100);
            break;
        case 'back':
            var outPage = getPageName();
            setTimeout(function () {
                historyPages.splice(historyPages.length - 1, 1);
                currentPageName = historyPages[historyPages.length - 1].attr('id');
                window.location.href = '#' + currentPageName;
                if (currentPageName == '') {
                    currentPageName = pages.eq(0).attr('id');
                }
                backPage(pages.filter('#' + currentPageName), pages.filter('#' + outPage), transition);
            }, 100);
            break;
        case 'close':
            break;
    }
}
function back() {
    toggle('back', 'from-right');
}
function togglePage(page, transition) {
    zIndex++;
    var oldPage = historyPages[historyPages.length - 1];
    historyPages.push(page);
    page.css({
        zIndex: zIndex
    });
    $('html,body').animate({
        scrollTop: 0
    }, 100);
    var currentPage = page;
    var className = 'pageconversionshow pageconversionshow-in-' + transition;
    currentPage.removeClass(className);
    setTimeout(function () {
        currentPage.addClass(className);
        //setWrapHeight(page);
    }, 100);
    currentPage.get(0).addEventListener('webkitAnimationEnd', inPageHandler, false);
    function inPageHandler() {
        currentPage.removeClass('pageconversionshow-in-' + transition);
        if (oldPage) {
            oldPage.removeClass('pageconversionshow');
        }
        currentPage.get(0).removeEventListener('webkitAnimationEnd', inPageHandler);
    }
}
function backPage(page, outPage, transition) {
    page.css({
        zIndex: zIndex
    });
    $('html,body').animate({
        scrollTop: 0
    }, 100);
    //setWrapHeight(page);
    page.addClass('pageconversionshow');
    outPage.addClass('pageconversionshow-out-' + transition);
    outPage.get(0).addEventListener('webkitAnimationEnd', outPageHandler, false);
    function outPageHandler() {
        outPage.removeClass('pageconversionshow pageconversionshow-out-' + transition);
        outPage.get(0).removeEventListener('webkitAnimationEnd', outPageHandler);
    }
}

function getPageName() {
    var pageName = '';
    if (location.hash != '') {
        pageName = location.hash.replace('#', '');
    }
    return pageName;
}
return {
    back: back,
    togglePage: function (id, transition) {
        togglePage($('#' + id), transition);
    }
}
},
cookie: {
get: function (_name) {
    var cookies = document.cookie,
    pos = cookies.indexOf(_name + '='),
    value;
    if (pos !== - 1) {
        var start = pos + _name.length + 1;
        var end = cookies.indexOf(';', start);
        //最后一个
        if (end === - 1) {
            end = cookies.length;
        }
        value = cookies.substring(start, end);
        value = decodeURIComponent(value);
    }
    return value;
},
set: function (_name, _value, minutes) {
    if (minutes) {
        var expi = new Date();
        expi.setMinutes(minutes);
        document.cookie = _name + '=' + encodeURIComponent(_value) + ';expires=' + expi.toGMTString();
    } else {
        document.cookie = _name + '=' + encodeURIComponent(_value);
    }
},
clearcookie: function (_name) {
    document.cookie = _name + '=;expires=' + (new Date(0)).toGMTString();
}
},
session: {
get: function (_name) {
    return window.sessionStorage.getItem(_name);
},
set: function (_name, _value) {
    window.sessionStorage.setItem(_name, _value);
},
remove: function (_name) {
    window.sessionStorage.removeItem(_name);
},
clear: function () {
    window.sessionStorage.clear();
},
getAll: function () {
    return window.sessionStorage;
},
isExist: function (_name) {
    if (window.sessionStorage.getItem(_name)) {
        return true;
    } else {
        return false;
    }
}
},
////获取url参数
getURLParam: function (_key) {
var searchStr = window.location.search,
paramStr,
paramObj = {
},
paramArr,
splitArr;
if (!searchStr) {
    return '';
}
paramStr = searchStr.slice(1);
//单个参数
if (paramStr.indexOf('&') === - 1) {
    splitArr = paramStr.split('=');
    paramObj[splitArr[0]] = splitArr[1];
    return paramObj[_key];
}
//多个

paramArr = paramStr.split('&');
for (var i = 0; i < paramArr.length; i += 1) {
    splitArr = paramArr[i].split('=');
    paramObj[splitArr[0]] = splitArr[1];
}
return paramObj[_key];
},
//日期时间格式化
dateFormat: function (date, fmt) {
var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    //"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
};
var week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
};
if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
}
if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468')  : '') + week[date.getDay() + '']);
}
for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])  : (('00' + o[k]).substr(('' + o[k]).length)));
    }
}
return fmt;
},
Nav: function () {
var code = '<div class="tel_nav" style="bottom:135px; position:fixed; left:20px;z-index:1000; opacity:0.95">\t\t\t\t   <div class="logo"></div>\t\t\t\t   <div class="box">\t\t\t\t   <div class="nav">\t\t\t\t\t <ul>\t\t\t\t\t   <li><a href="/"><i class="icon_a"></i><br/>首页</a></li>\t\t\t\t\t   <li><a href="/destination_index"><i class="icon_b"></i><br/>目的地</a></li>\t\t\t\t\t   <li><a href="javascript:void(0);" onclick="javascript:NTKF.im_openInPageChat()"><i class="icon_service"></i><br/>客服</a></li>\t\t\t\t\t   <li><a href="/newloginmember"><i class="icon_c"></i><br/>我的</a></li>\t\t\t\t\t </ul>\t\t\t\t   </div>\t\t\t\t   </div>\t\t\t\t</div>'
;
$('body').append(code);
//document.write(code);
$('.tel_nav').each(function (index, element) {
    var T = $(this);
    var logo = T.find('.logo');
    var nav = T.find('.nav');
    var box = T.find('.box');
    logo.click(function () {
        if (nav.hasClass('cur')) {
            nav.removeClass('cur');
            logo.removeClass('on');
            T.css({
                'opacity': '0.95'
            });
            logo.css({
                '-webkit-animation': 'animations5  ease-out .3s',
                '-moz-animation': 'animations5s  ease-out .3s',
                '-o-animation': 'animations5  ease-out .3s'
            });
            nav.css({
                '-webkit-animation': 'animations1  ease-out .2s',
                '-moz-animation': 'animations1  ease-out .2s',
                '-o-animation': 'animations1  ease-out .2s'
            });
            setTimeout(function () {
                box.css('display', 'none');
            }, 200);
        } 
        else
        {
            box.css('display', 'block');
            nav.addClass('cur');
            logo.addClass('on');
            T.css({
                'opacity': '1'
            });
            logo.css({
                '-webkit-animation': 'animations4  ease-out .3s',
                '-moz-animation': 'animations4  ease-out .3s',
                '-o-animation': 'animations4  ease-out .3s'
            });
            nav.css({
                '-webkit-animation': 'animations3  ease-out .2s',
                '-moz-animation': 'animations3  ease-out .2s',
                '-o-animation': 'animations3  ease-out .2s'
            });
        }
    })
})
},
NavCMBC: function () {
var code = '<div class="tel_nav" style="bottom:135px; position:fixed; left:20px;z-index:1000; opacity:0.95">\t\t\t\t   <div class="logo"></div>\t\t\t\t   <div class="box">\t\t\t\t   <div class="nav_cmbc">\t\t\t\t\t <ul>\t\t\t\t\t   <li><a href="javascript:void(0);" onclick="javascript:NTKF.im_openInPageChat()"><i class="icon_service"></i><br/>客服</a></li>\t\t\t\t\t   <li><a href="/newloginmember"><i class="icon_c"></i><br/>我的</a></li>\t\t\t\t\t </ul>\t\t\t\t   </div>\t\t\t\t   </div>\t\t\t\t</div>'
;
$('body').append(code);
//document.write(code);
$('.tel_nav').each(function (index, element) {
    var T = $(this);
    var logo = T.find('.logo');
    var nav = T.find('.nav_cmbc');
    var box = T.find('.box');
    logo.click(function () {
        if (nav.hasClass('cur')) {
            nav.removeClass('cur');
            logo.removeClass('on');
            T.css({
                'opacity': '0.95'
            });
            logo.css({
                '-webkit-animation': 'animations5  ease-out .3s',
                '-moz-animation': 'animations5s  ease-out .3s',
                '-o-animation': 'animations5  ease-out .3s'
            });
            nav.css({
                '-webkit-animation': 'animations1  ease-out .2s',
                '-moz-animation': 'animations1  ease-out .2s',
                '-o-animation': 'animations1  ease-out .2s'
            });
            setTimeout(function () {
                box.css('display', 'none');
            }, 200);
        } 
        else
        {
            box.css('display', 'block');
            nav.addClass('cur');
            logo.addClass('on');
            T.css({
                'opacity': '1'
            });
            logo.css({
                '-webkit-animation': 'animations4  ease-out .3s',
                '-moz-animation': 'animations4  ease-out .3s',
                '-o-animation': 'animations4  ease-out .3s'
            });
            nav.css({
                '-webkit-animation': 'animations3  ease-out .2s',
                '-moz-animation': 'animations3  ease-out .2s',
                '-o-animation': 'animations3  ease-out .2s'
            });
        }
    })
})
},
getCSS3Vendors: function () {
if (typeof CSS3Vendors != 'string') {
    CSS3Vendors = '';
    vendors = {
        Webkit: 'webkit',
        Moz: '',
        O: 'o'
    }
    testEl = document.createElement('div')
    $.each(vendors, function (vendor, event) {
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + vendor.toLowerCase() + '-'
            eventPrefix = event
            CSS3Vendors = event;
        }
    })
}
return CSS3Vendors;
}
}
var pageConversion = null;
$(function () {
pageConversion = BC.pageConversion();
BC.form.BC_Control_Checked();
BC.form.validation.vBind();
BC.form.select_btn();
BC.BC_Control_Radio()
//testInit();
});
$.fn.extend({
infiniteScroll: function (options) {
var settings = {
    topBiff: 10,
    dataUrl: '../../../tmp_data/dujiaJSON.js',
    loadStart: function (e) {
    },
    loadData: function (e) {
    },
    loadNull: function (e) {
    },
    getParam: function (e) {
        return {
        };
    },
    getIsShow: function (e) {
        return true;
    }
};
$.extend(settings, options);
var ts = [
];
this.each(function (i) {
    var box = $(this);
    var boxBottom = box.position().top + box.outerHeight();
    var isLoading = false;
    var isEnd = false;
    var page = 0;
    $(window).scroll(function () {
        infi();
    });
    function infi() {
        if (!isLoading && !isEnd && settings.getIsShow({
            i: i,
            settings: settings
        })) {
            if ($(window).scrollTop() > boxBottom - settings.topBiff - $(window).height()) {
                settings.loadStart({
                    o: box
                });
                page++;
                isLoading = true;
                var param = settings.getParam();
                param.page = page;
                $.get(settings.dataUrl, param, function (data) {
                    if (typeof data == 'string') {
                        data = eval('(' + data + ')');
                    }
                    if (data.data.items.length == 0) {
                        isEnd = true;
                        settings.loadNull({
                            o: box
                        });
                    } else {
                        if (settings.loadData({
                            o: box,
                            data: data
                        }) == false) {
                            isEnd = true;
                        }
                    }
                    boxBottom = box.position().top + box.outerHeight();
                    isLoading = false;
                    //infi();
                });
            }
        }
    }
    infi();
    ts.push({
        infi: infi
    });
});
var infyLoad = function () {
    for (var i in ts) {
        ts[i].infi();
    }
};
return {
    os: this,
    infyLoad: infyLoad
};
},
//tab切换
tabsBind: function (options) {
var settings = {
    event: 'mouseover',
    tabs: '',
    lists: null,
    curIsRun: false,
    curClass: 'current',
    tabsDefault: 0,
    onSelect: function (e) {
    }
};
$.extend(settings, options);
var r = [
];
this.each(function () {
    if ($(this).hasClass('BC_tabs_binded')) return true;
    $(this).addClass('BC_tabs_binded');
    var T = $(this);
    var tabs = $(this).find(settings.tabs);
    if (tabs.length == 0) {
        return;
    }
    if (settings.lists) {
        var lists = $(this).find(settings.lists);
    }
    tabs.each(function (i) {
        $(this).bind(settings.event, function (e, d) {
            if ($(this).hasClass(settings.curClass) && !settings.curIsRun) {
                return false;
            }
            tabs.removeClass(settings.curClass);
            $(this).addClass(settings.curClass);
            if (settings.lists) {
                T.height(T.height());
                lists.stop(true, true).hide().eq(i).fadeIn(300, function () {
                    T.height('auto');
                });
            }
            settings.onSelect({
                e: e,
                o: $(this),
                i: i,
                box: T,
                tabs: tabs,
                lists: lists,
                list: settings.lists ? lists.eq(i)  : null,
                model: d
            });
            if ($(this).get(0).tagName.toLowerCase() == 'a') {
                e.preventDefault();
            }
        });
    });
    tabs.eq(settings.tabsDefault).trigger(settings.event, 'init');
    r.push({
        tabs: tabs,
        lists: lists
    });
});
return r;
},
countDown: function (options) {
var settings = {
    type: 'date', //date,num
    order: - 1,
    dataAttr: 'date', //if type=="num"     [60,0]
    dateType: 'end', //end, between
    data: null,
    format: 'yyyy年MM月dd日 hh:mm:ss',
    step: 1000,
    callback: null,
    onEnd: function (e) {
    }
};
$.extend(settings, options);
this.each(function () {
    var T = $(this);
    if (settings.data) {
        if (settings.type == 'date') {
            var date = settings.data;
        } else if (settings.type == 'num') {
            var startNum = settings.data[0];
            var endNum = settings.data[1];
        }
    } else {
        if (settings.type == 'date') {
            var date = new Date(T.data(settings.dataAttr));
        } else if (settings.type == 'num') {
            var dataAttr = T.data(settings.dataAttr).split(',');
            var startNum = parseInt(dataAttr[0]);
            var endNum = parseInt(dataAttr[1]);
        }
    }
    var timeAni = setInterval(function () {
        if (settings.type == 'date') {
            showTime();
        } else if (settings.type == 'num') {
            showNum();
        }
    }, settings.step);
    var isEnd = false;
    var showNum = function () {
        if (settings.callback) {
            settings.callback({
                o: T,
                num: startNum,
                isEnd: isEnd
            });
        }
        if (startNum == endNum) {
            isEnd = true;
            if (settings.onEnd) {
                settings.onEnd({
                    o: T,
                    num: startNum,
                    isEnd: isEnd
                });
            }
        }
        if (isEnd) {
            clearInterval(timeAni);
            return;
        }
        startNum += settings.order;
    }
    var showTime = function () {
        if (settings.dateType == 'end') {
            var now = new Date();
            var diffdate = date.getTime() - now.getTime();
        } else if (settings.dateType == 'between') {
            var diffdate = date;
            date -= settings.step;
        }
        if (diffdate > 0) {
            int_day = Math.floor(diffdate / 86400000)
            diffdate -= int_day * 86400000;
            int_hour = Math.floor(diffdate / 3600000)
            diffdate -= int_hour * 3600000;
            int_minute = Math.floor(diffdate / 60000)
            diffdate -= int_minute * 60000;
            int_second = Math.floor(diffdate / 1000)
            diffdate -= int_second * 1000;
            int_millisecond = Math.floor(diffdate)
            var diff = {
                day: int_day,
                hour: int_hour,
                minute: int_minute,
                second: int_second,
                millisecond: int_millisecond
            };
        } else {
            isEnd = true;
            var diff = {
                day: 0,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            }
        }
        if (settings.callback) {
            settings.callback({
                o: T,
                date: date,
                diff: diff,
                isEnd: isEnd
            });
        } else {
            //天时分秒 FORMAT后续开发
            //T.text(startDate.pattern(settings.format));
        }
        if (isEnd) {
            clearInterval(timeAni);
            settings.onEnd({
                o: T,
                date: date
            });
        }
    }
    if (settings.type == 'date') {
        showTime();
    } else if (settings.type == 'num') {
        showNum();
    }
});
},
BC_DateSelect: function (opts) {
var settings = {
    dateArea: [
        new Date(1900, 0, 1),
        new Date(2050, 12, 31)
    ],
    selectedClass: 'BC_DateSelect_Selected',
    onSelect: function (e) {
    }
};
$.extend(settings, opts);
var EVENT = {
    click: 'click'
}
this.each(function () {
    var T = $(this);
    var selectDate = {
        fullDate: null,
        year: null,
        month: null,
        date: null
    };
    var thisDefaultDate = T.val().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (thisDefaultDate) {
        selectDate.fullDate = new Date(parseInt(thisDefaultDate[1], 10), parseInt(thisDefaultDate[2], 10) - 1, parseInt(thisDefaultDate[3], 10));
    } else {
        selectDate.fullDate = new Date();
    }
    function init() {
        T.on('focus', function () {
            if (settings.doms && settings.doms.obj.filter(':visible').length) {
                return;
            }
            initHtml();
        });
    }
    function initHtml() {
        var html = $('<div class="BC_DateSelectBox">\t\t\t\t\t\t\t\t<div class="box">\t\t\t\t\t\t\t\t\t<div class="tag">请选择日期</div>\t\t\t\t\t\t\t\t\t<div class="dbox">\t\t\t\t\t\t\t\t\t\t<div class="selectline"></div>\t\t\t\t\t\t\t\t\t\t<div class="datebox BC_dflex">\t\t\t\t\t\t\t\t\t\t\t<div class="column column_year"><ul class="column_swiper"/></div>\t\t\t\t\t\t\t\t\t\t\t<div class="column BC_flex column_month"><ul class="column_swiper"/></div>\t\t\t\t\t\t\t\t\t\t\t<div class="column BC_flex column_date"><ul class="column_swiper"/></div>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="btns">\t\t\t\t\t\t\t\t\t\t<a href="#" class="btn_submit">确定</a>\t\t\t\t\t\t\t\t\t\t<a href="#" class="btn_cancel">取消</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</div>'
        );
        var doms = {
            obj: html,
            year: html.find('.column_year>ul'),
            month: html.find('.column_month>ul'),
            date: html.find('.column_date>ul'),
            submit: html.find('.btn_submit'),
            cancel: html.find('.btn_cancel')
        }
        doms.submit.on('click', function (e) {
            var year = doms.year.swiper.activeSlide().nextSibling.getAttribute('year');
            var month = doms.month.swiper.activeSlide().nextSibling.getAttribute('month');
            var date = doms.date.swiper.activeSlide().nextSibling.getAttribute('date');
            doms.date = selectDate.fullDate = new Date(year, month, date);
            T.val(BC.dateFormat(doms.date, 'yyyy-MM-dd'));
            html.remove();
            if (settings.onSelect) {
                settings.onSelect(doms, date);
            }
            e.preventDefault();
        });
        doms.cancel.on('click', function (e) {
            html.remove();
            e.preventDefault();
        });
        settings.doms = doms;
        html.appendTo('body');
        getList('year');
        getList('month');
        getList('date');
        if (selectDate.fullDate) {
            var yearIndex = doms.year.children().index(doms.year.children('[year=' + selectDate.fullDate.getFullYear() + ']')) - 1;
            var monthIndex = doms.month.children().index(doms.month.children('[month=' + selectDate.fullDate.getMonth() + ']')) - 1;
            var dateIndex = doms.date.children().index(doms.date.children('[date=' + selectDate.fullDate.getDate() + ']')) - 1;
        }
        doms.year.swiper = swiper(html.find('.column_year'), yearIndex);
        doms.month.swiper = swiper(html.find('.column_month'), monthIndex);
        doms.date.swiper = swiper(html.find('.column_date'), dateIndex);
    }
    function getList(t) {
        var doms = settings.doms;
        switch (t) {
            case 'year':
                for (var i = settings.dateArea[0].getFullYear(); i <= settings.dateArea[1].getFullYear(); i++) {
                    (function (ii) {
                        $('<li class="item"/>').text(ii + '年').attr('year', ii).appendTo(settings.doms.year);
                    }) (i);
                }
                //doms.year.swiper.reInit();

                break;
            case 'month':
                doms.month.html('');
                for (var i = 0; i <= 11; i++) {
                    var thisDate = new Date(selectDate.year, i, 1);
                    if (selectDate.year && (thisDate - settings.dateArea[0] < 0 ||
                    thisDate - settings.dateArea[1] > 0
                    )
                    ) {
                        continue;
                    }(function (ii) {
                        var className = '';
                        if (selectDate.month != null && selectDate.month == ii) {
                            className = settings.selectedClass;
                        }
                        $('<li class="item"/>').text((ii + 1) + '月').attr('month', ii).appendTo(settings.doms.month);
                    }) (i);
                }
                break;
            case 'date':
                doms.date.html('');
                for (var i = 1; i <= 31; i++) {
                    var thisDate = new Date(selectDate.year, selectDate.month, i);
                    if (selectDate.year && selectDate.month != null && (thisDate - settings.dateArea[0] < 0 ||
                    thisDate - settings.dateArea[1] > 0
                    )
                    ) {
                        continue;
                    }(function (ii) {
                        var className = '';
                        if (selectDate.date != null && selectDate.date == ii) {
                            className = settings.selectedClass;
                        }
                        $('<li class="item"/>').text(ii + '日').attr('date', ii).appendTo(doms.date);
                    }) (i);
                }
                break;
            default:
                break;
        }
    }
    function setSelectDate(year, month, date) {
        if (year) {
            selectDate.year = year;
        } else if (month != null) {
            selectDate.month = month;
        } else if (date) {
            selectDate.date = date;
        }
        selectDate.fullDate = new Date(selectDate.year, selectDate.month, selectDate.date);
        if (selectDate.fullDate - settings.dateArea[0] < 0 || selectDate.fullDate - settings.dateArea[1] > 0) {
            if (year) {
                selectDate.month = null;
                selectDate.date = null;
                getList('month');
                getList('date');
            }
            if (month != null) {
                selectDate.date = null;
                getList('date');
            }
        }
    }
    function swiper(o, initialSlide) {
        return new Swiper(o.selector, {
            wrapperClass: 'column_swiper',
            slideClass: 'item',
            slidesPerView: 3,
            loopAdditionalSlides: 100,
            mode: 'vertical',
            loop: true,
            watchActiveIndex: true,
            initialSlide: initialSlide
        });
    }
    init();
});
},
searchBarEvent: function (opts) {
var settings = {
    url: null,
    witeTime: 500,
    input: null,
    clear: null,
    cancel: null,
    onFocus: function (e) {
    },
    onBlur: function (e) {
    },
    onClear: function (e) {
    },
    onCancel: function (e) {
    },
    onKey: function (e) {
    },
    onDataReadyBefore: function (e) {
        return true;
    },
    onData: function (e) {
    }
};
$.extend(settings, opts);
if (this.length != 1) {
    alert('需要1个DOM');
    return;
}
var T = $(this);
if (!settings.input) {
    alert('缺少文本框');
}
var input = T.find(settings.input);
var btnClear = settings.clear ? T.find(settings.clear)  : null;
var btnCancel = settings.cancel ? T.find(settings.cancel)  : null;
var getDataSetTime = null;
input.on('focus', function () {
    settings.onFocus();
});
input.on('blur', function () {
    settings.onBlur();
});
input.on('keyup', function () {
    if (settings.url != '') {
        if (getDataSetTime) clearTimeout(getDataSetTime);
        getDataSetTime = setTimeout(function () {
            if (settings.onDataReadyBefore(input.val())) {
                getData(input.val());
            }
            getDataSetTime = null;
        }, settings.witeTime);
    }
    settings.onKey(input.val());
});
if (btnClear) {
    btnClear.on('click', function () {
        input.val('');
        settings.onClear();
    });
}
if (btnCancel) {
    btnCancel.on('click', function () {
        input.val('');
        settings.onCancel();
    });
}
function getData(v) {
    $.get(settings.url, {
        k: v
    }, function (data) {
        if (typeof data == 'string') {
            data = eval('(' + data + ')');
        }
        settings.onData(data);
    });
}
}
});
//测试专用
function testInit() {
$('<a href="#"/>').text('点击刷新').css({
position: 'absolute',
zIndex: 9999,
left: 0,
top: 0,
width: '100%',
lineHeight: '30px',
textAlign: 'center',
display: 'block'
}).click(function (e) {
window.location.reload();
e.preventDefault();
}).appendTo('body');
}
function dateFormat(date, fmt) {
var o = {
'M+': date.getMonth() + 1, //月份
'd+': date.getDate(), //日
//"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
'h+': date.getHours(), //小时
'm+': date.getMinutes(), //分
's+': date.getSeconds(), //秒
'q+': Math.floor((date.getMonth() + 3) / 3), //季度
'S': date.getMilliseconds() //毫秒
};
var week = {"0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六"};
if (/(y+)/.test(fmt)) {
fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
}
if (/(E+)/.test(fmt)) {
fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : "周")  : '') + week[date.getDay() + '']);
}
for (var k in o) {
if (new RegExp('(' + k + ')').test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])  : (('00' + o[k]).substr(('' + o[k]).length)));
}
}
return fmt;
}
