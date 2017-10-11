/**
 * ALLOWED_IP_ADDRESS_FIRST_OCTET: '0-255',
 * ALLOWED_IP_ADDRESS_SECOND_OCTET: '0-255',
 * ALLOWED_IP_ADDRESS_THIRD_OCTET: '0-255',
 * ALLOWED_IP_ADDRESS_FOURTH_OCTET: '1-254',
 * @param value
 * @return {boolean}
 */
function checkIPv4Address(value) {
    try {
        const pattern = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
        const result = pattern.test(value);
        return result;
    } catch (e) {
        console.log(e);
    }
    return false;
}

/**
 * Single-byte lowercase check
 * @param   {string} value [[Description]]
 * @returns {boolean} Single-byte lowercase character: true, Otherwise: false
 */
function isAlphabeticLowerCase(value) {
    try {
        const pattern = /[a-z]+/;

        /** Single-byte uppercase character */
        // const pattern = /[A-Z]+/;

        /** Single-byte numbers */
            // const pattern = /[0-9]+/;

        const result = pattern.test(value);
        return result;
    } catch (err) {
        console.log(err.stack);
    }
    return false;
}

/**
 * 获取指定格式的当前时间
 * @param format like "yyyy-MM-dd hh:mm:ss"
 * @return {String} time
 */
function getDate(format) {
    var date = new Date();
    return date.Format(format);

}

/**
 * 获取指定格式的当前时间
 * @param format
 * @return {*}
 * @constructor
 */
Date.prototype.Format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 *
 * @param str
 * @param num
 */
function strReplace(str, num) {
    return str.replace(/\{([^{}]*)\}/g, function (a, b) {
        var r = num[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
}

/**
 * 日期合法检查
 * @param intYear 年
 * @param intMonth 月
 * @param intDay 日
 * @return {boolean} true：正确，false：错误
 */
function checkIsCorrectDate(intYear, intMonth, intDay) {
    var boolLeapYear;
    if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;
    if (intMonth > 12 || intMonth < 1) return false;
    if ((intMonth === 1
            || intMonth === 3
            || intMonth === 5
            || intMonth === 7
            || intMonth === 8
            || intMonth === 10
            || intMonth === 12) && (intDay > 31 || intDay < 1)) return false;
    if ((intMonth === 4
            || intMonth === 6
            || intMonth === 9
            || intMonth === 11) && (intDay > 30 || intDay < 1)) return false;
    if (intMonth === 2) {
        if (intDay < 1) return false;
        boolLeapYear = false;

        if ((intYear % 100) === 0) {
            if ((intYear % 400) === 0) boolLeapYear = true;
        }
        else {
            if ((intYear % 4) === 0) boolLeapYear = true;
        }

        if (boolLeapYear) {
            if (intDay > 29) return false;
        }
        else {
            if (intDay > 28) return false;
        }
    }
    return true;
}

/**
 * 数组移除指定元素
 * @param  arr [数组]
 * @param  val [元素]
 */
function removeUnselect(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);
            break;
        }
    }
}

/**
 * 数据去重处理
 * @param list
 * @return {Array|*}
 */
function arrFilterSame(list) {
    var removeObj = {};
    list.map(function (e) {
        removeObj[e.manualInstId] = e;
    });
    var keys = [];
    for (var property in removeObj) {
        keys.push(removeObj[property]);
    }
    list = keys;
    return list;
}

/**
 * 遮罩层
 */
function showLoad() {
    $("<div class=\"datagrid-mask\"></div>").css({
        display: "block",
        width: "100%",
        height: $(window).height()
    }).appendTo("body");
    $("<div class=\"datagrid-mask-msg\"></div>").html('请稍候...').appendTo("body").css({
        display: "block",
        left: ($(document.body).outerWidth(true) - 50) / 2,
        top: ($(window).height() - 45) / 2
    });
}

function hideLoad() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}