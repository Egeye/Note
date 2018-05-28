/*
 * 比较两个日期的大小
 * 传入的参数推荐是"yyyy-mm-dd"的格式，其他的日期格式也可以，但要保证一致
 */
var dateCompare = function (date1, date2) {
    if (date1 && date2) {
        var a = new Date(date1);
        var b = new Date(date2);
        return a < b;
    }
};

/*
 * @author : Hill
 * @desc: 比较两个时间的大小（传入的参数是"HH:mm"的格式，）
 * @param: time1:目标时间;time2:被比较时间
 */
var timeCompare = function (time1, time2) {
    //console.info(time1+"-"+time2);
    try {
        if (time1 && time2) {
            var t1 = parseInt(time1.split(":")[0]) * 60 + parseInt(time1.split(":")[1]);
            var t2 = parseInt(time2.split(":")[0]) * 60 + parseInt(time2.split(":")[1]);
            return t1 < t2;
        }
        return false;
    } catch (e) {
        return false;
    }
};

/*
 * @author : Hill
 * @desc: 比较两个时间的大小，支持的格式可在formatArr扩展
 * @param: datetime1:目标时间;datetime2:被比较时间
 */
var dateTimeCompare = function (datetime1, datetime2) {
    //支持的格式
    var formatArr = [
        'YYYY-MM-DD',
        'YYYY-MM-DD HH:mm',
        'YYYY-MM-DD HH:mm:ss'
    ];
    try {
        if (datetime1 && datetime2) {
            var dt1 = moment(datetime1, formatArr);
            var dt2 = moment(datetime2, formatArr);
            return dt1 < dt2;
        }
        return false;
    } catch (e) {
        return false;
    }
};

/*
 * 对easyui-validatebox的验证类型的扩展
 */
$.extend($.fn.validatebox.defaults.rules, {
    //手机号码
    mobile: {
        validator: function (value, param) {
            return /^0{0,1}1[3,8,5][0-9]{9}$/.test(value);
        },
        message: "手机号码格式不正确"
    },
    //select空值验证
    selectNotNull: {
        validator: function (value, param) {
            //console.info(value);
            return $(param[0]).find("option:contains('" + value + "')").val() !== '';
            //return value!='';
        },
        message: "请选择"
    },
    //正整数
    pnum: {
        validator: function (value, param) {
            return /^[0-9]*[1-9][0-9]*$/.test(value);
        },
        message: "请输入正整数"
    },
    //非0开头正整数
    pznum: {
        validator: function (value, param) {
            return /^[1-9]*[1-9][0-9]*$/.test(value);
        },
        message: "请输入非0开头的正整数"
    },
    //正实数，包含小数
    num: {
        validator: function (value, param) {
            return /^\d+(\.\d+)?$/.test(value);
        },
        message: "请输入正整数或者小数"
    },
    //2位正整数，或精确两位小数
    numTwoOrPointTwo: {
        validator: function (value, param) {
            return /^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|0)$/.test(value);
        },
        message: "请输入1到2位的正整数或者精确到2位的小数"
    },
    //6位正整数，或精确两位小数
    numSixOrPointTwo: {
        validator: function (value, param) {
            return /^(([0-9]|([1-9][0-9]{0,5}))((\.[0-9]{1,2})?))$/.test(value);
        },
        message: "请输入1到6位的正整数或者精确到2位的小数"
    },
    //过滤特殊字符
    filterSpecial: {
        validator: function (value, param) {

            //过滤空格
            var flag = /\s/.test(value);
            //过滤特殊字符串
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】’‘《》；：”“'。，、？]");
            var specialFlag = pattern.test(value);
            return !flag && !specialFlag;


        },
        message: "非法字符，请重新输入"
    },
    //身份证
    IDCard: {
        validator: function (value, param) {
            //return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
            var flag = checkIdcard(value);
            return flag == true ? true : false;
        },
        message: "请输入正确的身份证号码"
    },
    //比较日期选择器
    compareDate: {
        validator: function (value, param) {
            return dateCompare($(param[0]).datebox("getValue"), value);
        },
        message: "结束日期不能小于或等于开始日期"
    },
    //比较时间选择器（时分秒）
    compareTime: {
        validator: function (value, param) {
            return timeCompare($(param[0]).timespinner("getValue"), value);
        },
        message: "结束时间不能小于或等于开始时间"
    },
    //比较时间选择器（时分秒）
    compareDateTime: {
        validator: function (value, param) {
            return dateTimeCompare($(param[0]).timespinner("getValue"), value);
        },
        message: "结束时间不能小于或等于开始时间"
    },
    // 验证是否包含空格和非法字符
    unnormal: {
        validator: function (value) {
            return /^[a-zA-Z0-9]/i.test(value);

        },
        message: '输入值不能为空和包含其他非法字符'
    }

});

//校验身份证合法性
function checkIdcard(idcard) {
    var Errors = ["验证通过!",
        "身份证号码位数不对!",
        "身份证号码出生日期超出范围或含有非法字符!",
        "身份证号码校验错误!",
        "身份证地区非法!"];
    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

    //var idcard=idcard;
    var Y, JYM;
    var S, M;
    var idcard_array = [];
    idcard_array = idcard.split("");
    //地区检验
    if (area[parseInt(idcard.substr(0, 2))] == null) {
        //alert(Errors[4]);
        //setItemFocus(0, 0, "CertID");
        return Errors[4];
    }

    //身份号码位数及格式检验
    switch (idcard.length) {
        case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
            } else {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
            }

            if (ereg.test(idcard)) {
                //alert(Errors[0]);
                //setItemFocus(0, 0, "CertID");
                return true;

            } else {
                //alert(Errors[2]);
                //setItemFocus(0, 0, "CertID");
                return Errors[2];
            }
            break;
        case 18:
            //18位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
            } else {
                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) {//测试出生日期的合法性
                //计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                    + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                    + parseInt(idcard_array[7])
                    + parseInt(idcard_array[8]) * 6
                    + parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y, 1);//判断校验位
                if (M === idcard_array[17]) {
                    return true;
                    //Errors[0];        //检测ID的校验位
                } else {
                    //alert(Errors[3]);
                    //setItemFocus(0, 0, "CertID");
                    return Errors[3];
                }
            } else {
                //alert(Errors[2]);
                //setItemFocus(0, 0, "CertID");
                return Errors[2];
            }
            break;
        default:
            //alert(Errors[1]);
            //setItemFocus(0, 0, "CertID");
            return Errors[1];
            break;
    }
}

/**
 * EasyUi输入框验证扩展大全
 */
$.extend($.fn.validatebox.defaults.rules, {
    CHS: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: '请输入汉字'
    },
    ZIP: {
        validator: function (value, param) {
            return /^[1-9]\d{5}$/.test(value);
        },
        message: '邮政编码不存在'
    },
    email: {
        validator: function (value, param) {
            return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value);
        },
        message: '邮箱格式有误'
    },

    QQ: {
        validator: function (value, param) {
            return /^[1-9][0-9]{4,9}$/.test(value);
        },
        message: 'QQ号码不正确'
    },
    mobile: {
        validator: function (value, param) {

            return /^(0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8})$/.test(value) || /^(0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}\/0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8})$/.test(value);
        },
        message: '手机号码不正确'
    },
    phone: {
        validator: function (value, param) {

            return /^(\+\d+)?(\d{3,4}\-?)?\d{7,8}$/.test(value);
        },
        message: '座机号码不正确'
    },
    mobileorphone: {
        validator: function (value, param) {

            return /^((\+\d+)?(\d{3,4}\-?)?\d{7,8})|(0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8})$/.test(value);
        },
        message: '电话号码不正确'
    },
    fax: {
        validator: function (value, param) {
            return /^(\d{3,4}-)?\d{7,8}$/.test(value);
        },
        message: '传真号码不正确'
    },

    loginName: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5\w]+$/.test(value);
        },
        message: '登录名称只允许汉字、英文字母、数字及下划线。'
    },
    safepass: {
        validator: function (value, param) {
            return safePassword(value);
        },
        message: '密码由字母和数字组成，至少6位'
    },
    equalTo: {
        validator: function (value, param) {
            alert(param);
            return value == $(param[0]).val();
        },
        message: '两次输入的字符不一致'
    },
    equalOrGreatTo: {
        validator: function (value, param) {
            return value >= $(param[0]).val();
        },
        message: '本次输入的字符和上次比较应该相同或者更大'
    },
    number: {
        validator: function (value, param) {
            return isNumber(value);
        },
        message: '请输入正整数字'
    },
    isNumber: {
        validator: function (value, param) {
            return /^[\-]?\d+([\.]?[\d]{1,})?$/.test(value);
        },
        message: '请输入数字'
    },
    Char: {
        validator: function (value, param) {
            return /^[a-zA-Z]+$/.test(value);
        },
        message: '请输入英文字母'
    },
    numberAndChar: {
        validator: function (value, param) {
            return /^[a-zA-Z0-9]+$/.test(value);
        },
        message: '请输入数字或英文字母'
    },
    stringsDou: {
        validator: function (value, param) {
            return /^[a-zA-Z0-9,]+$/.test(value);
        },
        message: '请输入数字或英文字母'
    },
    numberCharAndChs: {
        validator: function (value, param) {
            return /^[a-zA-Z0-9\u0391-\uFFE5]+$/.test(value);
        },
        message: '请输入数字或英文字母或汉字'
    },
    stringsDouT: {//包含小数点 add by mengxin 2014-11-13
        validator: function (value, param) {
            return /^[a-zA-Z0-9.\u0391-\uFFE5]+$/.test(value);
        },
        message: '请输入数字或英文字母'
    },
    idcard: {
        validator: function (value, param) {
            return idCard(value);
        },
        message: '请输入正确的身份证号码'
    },
    numberDouble: {
        validator: function (value, param) {
            if (undefined == param) {
                return isNumber(value);
            }
            var pattern = new RegExp("^[1-9]{1}\\d*([\\.]{1}[\\d]{1," + param + "})?$|^0$|^[0]{1}[\\.]{1}[\\d]{1," + param + "}$");
            return pattern.test(value);
        },
        message: '请输入小数或整数,小数点后保留{0}位'
    },
    exRateHL: {
        validator: function (value, param) {
            if (undefined == param) {
                return false;
            }
            var pattern = new RegExp("^[1-9]{0," + param[0] + "}([\\.]{1}[\\d]{0," + (param[1] - 1) + "})?[1-9]$|^[0]{1}[\\.]{1}[\\d]{0," + (param[1] - 1) + "}[1-9]$");
            return pattern.test(value);
        },
        message: '汇率格式为小数点前最多1-{0}位,小数点后保留{1}位,最后一位不可为0'
    },
    isNotChinese: {
        validator: function (value, param) {
            return /[^\u4e00-\u9fa5]+$/.test(value);
        },
        message: '请输入非中文字符'
    },
    isString: {  //汉字、英文、数字 、下滑线、横线、点、空格、逗号
        validator: function (value, param) {
            return /^[\u0391-\uFFE5\w\s-\.\,]+$/.test(value);
        },
        message: '输入内容含有非法字符'
    },
    isPercent: {  //验证百分数
        validator: function (value, param) {
            return /^[\-]?\d+([\.]?[\d]{1,})?\%$/.test(value);
        },
        message: '请输入百分数'
    },
    isNotSelect: {
        validator: function (value, param) {
            return isSelect(value);
        },
        message: '请选择下拉选项'
    },
    date: {
        validator: function (value, param) {
            return /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[0-9])|([1-2][0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/.test(value);
        },
        message: '请输入正确的日期格式'
    },
    date_yyyy_mm: {
        validator: function (value, param) {
            return /^\b[1-3]\d{3}(-|\/)(0[1-9]|1[0-2])$/.test(value);
        },
        message: '请输入格式为yyyy-MM(2014-01)'
    },
    date_yyyy_mm_dd: {
        validator: function (value, param) {
            return /^\b[1-3]\d{3}(-|\/)(0[1-9]|1[0-2])(-|\/)(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/.test(value);
        },
        message: '请输入格式为yyyy-MM-dd(2014-01-01)'
    },
    date_yyyy_mm_dd_hh_mm: {
        validator: function (value, param) {
            return /^\b[1-3]\d{3}(-|\/)(0[1-9]|1[0-2])(-|\/)(0[1-9]|1[0-9]|2[0-9]|3[0-1])\s((0?[0-9])|(1[0-9]|2[0-3]))\:([0-5]?[0-9])$/.test(value);
        },
        message: '请输入格式为yyyy-MM-dd hh:mm(2014-01-01 00:00)'
    },
    comparedate: {
        /* 比较大小 */
        validator: function (value, param) {
            var msg = param[1];
            var startDate = new Date(Date.parse($('#' + param[0]).datebox("getValue").replace(/-/g, "/")));
            var endDate = new Date(Date.parse(value.replace(/-/g, "/")));
            if (startDate.getTime() < endDate.getTime()) {
                return true;
            } else {
                $.fn.validatebox.defaults.rules.comparedate.message = msg;
                return false;
            }
        },
        message: '该输入项为必输项'
    },
    compare: {
        /* 比较大小 */
        validator: function (value, param) {
            var msg = param[2];
            var expression = param[1];
            var cv = parseFloat($('#' + param[0]).val()); //比较值
            value = parseFloat(value);
            if (expression == "\>") {
                if (value > cv) {
                    return true;
                } else {
                    $.fn.validatebox.defaults.rules.compare.message = msg;
                    return false;
                }
            } else if (expression == "\>=") {
                if (value >= cv) {
                    return true;
                } else {
                    $.fn.validatebox.defaults.rules.compare.message = msg;
                    return false;
                }
            } else if (expression == "\<") {
                if (value < cv) {
                    return true;
                } else {
                    $.fn.validatebox.defaults.rules.compare.message = msg;
                    return false;
                }
            } else if (expression == "\<=") {
                if (value <= cv) {
                    return true;
                } else {
                    $.fn.validatebox.defaults.rules.compare.message = msg;
                    return false;
                }
            } else {
                if (value == cv) {
                    return true;
                } else {
                    $.fn.validatebox.defaults.rules.compare.message = msg;
                    return false;
                }
            }
        },
        message: '该输入项为必输项'
    },
    CJH: {//车架号验证
        validator: function (value, param) {
            if (value.length == 0) {
                return false;
            }
            var result = $.ajax({
                type: "POST",//http请求方式
                url: purl + 'cjhValidator.dh?key=checkCJH',    //服务器段url地址
                data: {CJH: value},      //发送给服务器段的数据
                dataType: "json", //告诉JQuery返回的数据格式
                async: false
            }).responseText;
            result = JSON.parse(result);
            if (result.success == false) {
                $.fn.validatebox.defaults.rules.CJH.message = result.msg;
                return false;
            } else {
                return true;
            }
        },
        message: '该输入项为必输项'
    },
    checklength: {
        validator: function (value, param) {
            if (value.length != param[0]) {
                $.fn.validatebox.defaults.rules.checklength.message = param[1] + '的长度必须为' + param[0] + '位';
                return false;
            } else {
                return true;
            }
        }
    }
});

var isSelect = function (value) {
    if (value.indexOf("请选择") > -1)
        return false;
    return true;
};

var isNumber = function (value) {
    return /^\d+$/.test(value);
};

var safePassword = function (value) {
    return !(/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/.test(value));
};

var idCard = function (value) {
    if (value.length == 18 && 18 != value.length) return false;
    var number = value.toLowerCase();
    var d, sum = 0, v = '10x98765432', w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        a = '11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91';
    var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/);
    if (re == null || a.indexOf(re[1]) < 0) return false;
    if (re[2].length == 9) {
        number = number.substr(0, 6) + '19' + number.substr(6);
        d = ['19' + re[4], re[5], re[6]].join('-');
    } else d = [re[9], re[10], re[11]].join('-');
    if (!isDateTime.call(d, 'yyyy-MM-dd')) return false;
    for (var i = 0; i < 17; i++) sum += number.charAt(i) * w[i];
    return (re[2].length == 9 || number.charAt(17) == v.charAt(sum % 11));
};

var isDateTime = function (format, reObj) {
    format = format || 'yyyy-MM-dd';
    var input = this, o = {}, d = new Date();
    var f1 = format.split(/[^a-z]+/gi), f2 = input.split(/\D+/g), f3 = format.split(/[a-z]+/gi),
        f4 = input.split(/\d+/g);
    var len = f1.length, len1 = f3.length;
    if (len != f2.length || len1 != f4.length) return false;
    for (var i = 0; i < len1; i++) if (f3[i] != f4[i]) return false;
    for (var i = 0; i < len; i++) o[f1[i]] = f2[i];
    o.yyyy = s(o.yyyy, o.yy, d.getFullYear(), 9999, 4);
    o.MM = s(o.MM, o.M, d.getMonth() + 1, 12);
    o.dd = s(o.dd, o.d, d.getDate(), 31);
    o.hh = s(o.hh, o.h, d.getHours(), 24);
    o.mm = s(o.mm, o.m, d.getMinutes());
    o.ss = s(o.ss, o.s, d.getSeconds());
    o.ms = s(o.ms, o.ms, d.getMilliseconds(), 999, 3);
    if (o.yyyy + o.MM + o.dd + o.hh + o.mm + o.ss + o.ms < 0) return false;
    if (o.yyyy < 100) o.yyyy += (o.yyyy > 30 ? 1900 : 2000);
    d = new Date(o.yyyy, o.MM - 1, o.dd, o.hh, o.mm, o.ss, o.ms);
    var reVal = d.getFullYear() == o.yyyy && d.getMonth() + 1 == o.MM && d.getDate() == o.dd && d.getHours() == o.hh && d.getMinutes() == o.mm && d.getSeconds() == o.ss && d.getMilliseconds() == o.ms;
    return reVal && reObj ? d : reVal;

    function s(s1, s2, s3, s4, s5) {
        s4 = s4 || 60, s5 = s5 || 2;
        var reVal = s3;
        if (s1 != undefined && s1 != '' || !isNaN(s1)) reVal = s1 * 1;
        if (s2 != undefined && s2 != '' && !isNaN(s2)) reVal = s2 * 1;
        return (reVal == s1 && s1.length != s5 || reVal > s4) ? -10000 : reVal;
    }
};



/********************************************************************************/
$.extend($.fn.validatebox.defaults.rules, {
// 验证密码
    checkPassword: {
        validator: function (value) {
            // var pattern = /^(\w)+$/;
            var pattern = /([a-zA-z]+$)|(\d+$)|([!.,?@';#$%^&*]+$)+$/;
            return pattern.exec(value);
        },
        message: '输入不合法'
    }
});

