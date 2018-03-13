var RegName = /(^[\u4e00-\u9fa5]{2,5}$)|(^[a-zA-Z]{3,10}$)/;
var RegUnSafe = /^[^<>\'=]*$/;
var RegCurrency = /^\d+(\.\d+)?$/;
var RegEnglish = /^[A-Za-z]+$/;
function IsSafe(str) { return !this.RegUnSafe.test(str); }
function CheckMobilePhone(phoneNum) {
    var tmpVarPhone = /^((13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8})$/;
    if (!tmpVarPhone.test(phoneNum)) {
        return false;
    }
    return true;
}
function gettypename(value) {
    var returnvalue = "";
    switch (value.toString()) {
        case "0":
            returnvalue = "身份证";
            break;
        case "1":
            returnvalue = "护照";
            break;
        case "2":
            returnvalue = "军官证";
            break;
        case "3":
            returnvalue = "学生证";
            break;
        case "4":
            returnvalue = "其他";
            break;
    }
    return returnvalue;

}

/* 是否是手机号码 */
function CheckPhoneNum(phoneNum) {
    var partten = /(^(\d{3,4}\-)?\d{7,8}(\-\d{3,4})?$)|(^(13|14|15|18|17)\d{9}$)/;
    if (!partten.test(phoneNum)) {
        return false;
    }
    return true;
}
/* 是否是邮箱 */
function CheckEmail(email) {
    var myReg = /(^\s*)\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*(\s*$)/;
    if (!myReg.test(email)) {
        return false;
    }
    return true;
}
/* 检查用户名 */
function CheckLoginName(UserName) {
    var myReg = /^[a-zA-Z_]{1}([a-zA-Z0-9_]){4,19}$/;
 
    if (!myReg.test(UserName)) {
        return false;
    }
    return true;
}

//确认对话框
var mDialogCallback;
function showConfirmer(msg, callback) {
    mDialogCallback = callback;
    var _window = $('<div style="z-index:1000" class="windows-open window-black"></div>');
    var _openbox = $('<div class="open-box" style="width:90%; height:auto" id="other-open"></div>');
    var _title = $('<div class="open-title"><b>提示信息</b></div>');
    var _content = $('<div class="open-content2"><ul class="otherlist"><li>' + msg + '</li></ul><div class="clearfix" style="padding-top:1rem;"><a href="javascript:void(0);" class="ok">确定</a><a href="javascript:void(0);" class="cancel">取消</a></div></div>');
    $(document.body).append($(_window).append($(_openbox).append(_title).append(_content)));
    $(_openbox).css('margin-top', $(window).height() / 2 - $(_openbox).height() / 2 - 100);
    $(_window).fadeIn("slow");
    //确定
    $(".ok", _content).click(function () {
        $(_window).fadeOut("slow");
        mDialogCallback(true);
        $(_window).remove();
    });
    //取消
    $(".cancel", _content).click(function () {
        $(_window).fadeOut("slow");
        mDialogCallback(false);
        $(_window).remove();
    });
    //取消
    $("img", _title).click(function () {
        $(_window).fadeOut("slow");
        mDialogCallback(false);
        $(_window).remove();
    });
}

/* 是否是有效的值 */
function GetTextBoxVal(obj, msg) {
    if ($(obj).val() != msg) {
        return $(obj).val();
    }
    return "";
}
function OnTextBoxClick(obj, msg) {
    if ($(obj).val() == $.trim(msg)) {
        $(obj).val("");
    }
}
function OnTextBoxBlur(obj, msg) {
    if ($(obj).val() == "") {
        $(obj).val(msg);
    }
}
function ShowMsg(msg) {
    var tips = $("<div class='tips'/>");
    tips.text(msg);
    tips.show();
    setTimeout(function () {
        tips.hide();
    }, 2000);
    tips.appendTo(".global:visible");
}
function ShowokMsg(msg) {
    var tips = $("<div class='tipsok'/>");
    tips.text(msg);
    tips.show();
    setTimeout(function () {
        tips.hide();
    }, 2000);
    tips.appendTo(".global:visible");
}



Date.prototype.format = function (format) {
    /*
    * eg:format="YYYY-MM-dd hh:mm:ss";
    */
    var o = {
        "M+": this.getMonth() + 1,  //month
        "d+": this.getDate(),     //day
        "h+": this.getHours(),    //hour
        "m+": this.getMinutes(),  //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

Date.prototype.dateAdd = function (interval, number) {
    var d = this;
    var k = { 'y': 'FullYear', 'q': 'Month', 'm': 'Month', 'w': 'Date', 'd': 'Date', 'h': 'Hours', 'n': 'Minutes', 's': 'Seconds', 'ms': 'MilliSeconds' };
    var n = { 'q': 3, 'w': 7 };
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    return d;
}
/* \u8ba1\u7b97\u4e24\u65e5\u671f\u76f8\u5dee\u7684\u65e5\u671f\u5e74\u6708\u65e5\u7b49 */
Date.prototype.dateDiff = function (interval, objDate2) {
    var d = this, i = {}, t = d.getTime(), t2 = objDate2.getTime();
    i['y'] = objDate2.getFullYear() - d.getFullYear();
    i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
    i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
    i['ms'] = objDate2.getTime() - d.getTime();
    i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
    i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
    i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
    i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
    i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
    return i[interval];
}
//格式化json时间
function ConertJsonTimeAndFormat(jsonTime, format) {
    return new Date(eval(jsonTime.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"))).format(format);
}
/*表单AJAX提交封装(包含验证)*/
function AjaxInitForm(formId, btnId, isDialog, urlId) {
    var formObj = $('#' + formId);
    var btnObj = $("#" + btnId);
    var urlObj = $("#" + urlId);
    formObj.Validform({
        tiptype: 3,
        callback: function (form) {
            //AJAX提交表单
            $(form).ajaxSubmit({
                beforeSubmit: formRequest,
                success: formResponse,
                error: formError,
                url: formObj.attr("url"),
                type: "post",
                dataType: "json",
                timeout: 60000
            });
            return false;
        }
    });

    //表单提交前
    function formRequest(formData, jqForm, options) {
        btnObj.prop("disabled", true);
        btnObj.val("提交中...");
    }

    //表单提交后
    function formResponse(data, textStatus) {
        if (data.status == 1) {
            btnObj.val("提交成功");
            //是否提示，默认不提示
            if (isDialog == 1) {
              

                    if (data.url) {
                        location.href = data.url;
                    } else if (urlObj.length > 0 && urlObj.val() != "") {
                        location.href = urlObj.val();
                    } else {
                        location.reload();
                    }

            } else {
            if (data.url) {
                location.href = data.url;
            } else if (urlObj) {
                location.href = urlObj.val();
            } else {
                location.reload();
            }
            }
        } else {
        // dialog({ title: '提示', content: data.msg, okValue: '确定', ok: function () { } }).showModal();
        ShowMsg(data.msg);
            btnObj.prop("disabled", false);
            btnObj.val("再次提交");
        }
    }
    //表单提交出错
    function formError(XMLHttpRequest, textStatus, errorThrown) {
        // $.dialog.alert("状态：" + textStatus + "；出错提示：" + errorThrown);
        btnObj.prop("disabled", false);
        btnObj.val("再次提交");
    }
}