/** 深拷贝 **/
angular.copy();
/** ------------------------------------------------------------------------------------- **/

/** AngularJS的比较 **/
angular.equals(x, y);
/** ------------------------------------------------------------------------------------- **/

/** iframe **/
// 改变iframe内容
$('#yourID').attr('src', 'yourURL');
// iframe对象获取
var view = window.frames['idContent'];
/** ------------------------------------------------------------------------------------- **/

/** 页面数据存储方式 **/
sessionStorage.setItem("wfId", that.wfId);
sessionStorage.getItem("nodeId");
/** ------------------------------------------------------------------------------------- **/

/** 跨页面取数据(Angular) **/
window.opener.jQuery('[ng-controller="xxController"]').scope().bindData(JSON.stringify(data));
$scope.bindData = function (list) {
    $scope.hasExcuManualInstId = JSON.parse(list);
};
/** ------------------------------------------------------------------------------------- **/

/** EasyUI combobox 使用 **/
$('#id').combobox('select', 1);
$('#id').combobox('unselect', '');
$("#id").combobox("setValue", "2");     // 给combobox赋初始值（2是json数据中的id值）
$('#id').combobox('getValue');          // 可以说是获得键 获取当前值（得到的是json数据中的id值）
$('#id').combobox('getText');           // 可以说是获得值
$('#id').combobox('getData');           // 获取所有数据
$('#id').combobox('clear');             // 清空combobox的值
$('#id').combobox('hidePanel');         // 直接收起
$("#id").combobox({'required': true});
$('#id').combobox('disable');           // 禁用combobox
$('#id').combobox('enable');            // 启用combobox
$kafkaServers.combobox('textbox').prev().hide();
$kafkaServers.next().children().eq(1).width($kafkaServers.next().children().eq(1).width() + 20)

var row = $('#dg').datagrid('getSelected');     // 1、获取当前行
var rows = $('#dg').datagrid('getSelections');  // 2、获取所有选中行
var rows = $("#dg").datagrid("getRows");        // 3、获取所有行
var rows = $('#dg').datagrid('getRows');        // 4、获取行中间的某列数据
for (var i = 0; i < rows.length; i++) {
    alert(rows[i]['SCORE']); //获取指定列
}


/** textbox **/
$('#status').textbox('setValue', detailValue);
/** ------------------------------------------------------------------------------------- **/

/** 保留两位小数 **/
size.toFixed(2);
/** ------------------------------------------------------------------------------------- **/

/** 定时器 **/
setTimeout(function () {
}, 1000);
var interval = setInterval(function () {
}, 300);
clearInterval(interval);

// Angular
$interval(function () {
}, 300);
$interval.cancel($scope.statusTimer);
/** ------------------------------------------------------------------------------------- **/

/** URL中文参数乱码问题 **/
window.open("/oprt/flowRecord?scriptObj=" + encodeURIComponent(scriptObj));

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}

/** ------------------------------------------------------------------------------------- **/

/** 移动动画效果 **/
$("#idPRList").animate({left: "+=616px", width: "toggle"}, 500, null, function () {
    // $("#idPRList").hide();
});

$("#idPRList").show().animate({left: '-=616px', width: '616px'}, 500);

/** 包含判断 -1代表未匹配 **/
all.indexOf(item);

/** 新开窗口标签，第二个参数可保证窗口唯一 **/
window.open("/xxx/xxxx");
window.open("/xxx/xxxx", param);
/** ------------------------------------------------------------------------------------- **/

/** 数据合并处理 **/
// source1: [1，2],
// source2: [1, 2, 3, 4]
// target:  [1, 2, 3, 4];
combineScriptList(whole, target);

function haveSameScriptId(arrA, x) {
    for (var i in arrA) {
        if (arrA[i].scriptId === x.scriptId) return true;
    }
}

function combineScriptList(a, b) {
    for (var i in a) {
        if (haveSameScriptId(b, a[i])) continue;
        b.push(a[i]);
    }
    return b;
}

/** ------------------------------------------------------------------------------------- **/

/** 字符串截取 **/
// substring只有一个参数时，参数表示从字符串的第几位开始截取
var str = "Olive";
var result1 = str.substring(3); // result1 is "ve"

var res1 = str.substr(3);   // res1 is "ve"

/**
 * [substring有两个参数时，
 * 第一个参数表示从字符串的第几位开始截取，
 * 第二个参数表示截取到字符串的第几位]
 */
var result2 = str.substring(3, 4); // result2 is "v"
var result3 = str.substring(3, 2); // result3 is "0"

var res2 = str.substring(3, 4); // res2 is "ve"
var res3 = str.substring(3, 2); // res3 is "ve"
/**
 * [substr有两个参数时，
 * 第一个参数表示从字符串的第几位开始截取，
 * 第二个参数表示截取多少位字符串]
 */
/** ------------------------------------------------------------------------------------- **/

/** 获取标签id，来改变该style **/
document.getElementById('elemId').style.display = 'none';
$('#elemId').removeAttr('style');

if (testFlag) {
    $('#elemId').css('display', 'none');
    testFlag = false;
}
else {
    $('#elemId').css('display', 'block');
    testFlag = true;
}
/** ------------------------------------------------------------------------------------- **/

/** 判断字符串类型的数字 **/
var s = "37";
if (typeof(s) === "number") {
    alert("是数字");
}
// 37 虽然可以转化成数字，但这里它毕竟是字符串类型，所以此法不正确。


var n = parseInt(s);
if (!isNaN(n)) {
    alert("是数字");
}
// parseInt 会将字符串转化成整数，
// 但它会忽略非数字部分而不给任何提示，
// 比如："37ABC" 会转化成 37，所以此法不正确。


n = Number(s);
if (!isNaN(n)) {
    alert("是数字");
}
// 注意：在 JavaScript 中，对于省略写法（如：".3"、"-.3"）、科学计数法（如："3e7"、"3e-7"）、十六进制数（如："0xFF"、"0x3e7"）均被认定为数字格式，这类字符串都可以用 Number 转化成数字。
// isNaN 返回一个 Boolean 值，指明提供的值是否是 NaN ，NaN 的意思是 not a number（不是一个数字）。
// 语法：isNaN(numValue)
/** ------------------------------------------------------------------------------------- **/

/** ------------------------------------------------------------------------------------- **/
document.getElementById("idEnd").isDisabled = true;
$("#id").attr("disabled", "disabled");
$("#id").disabled = true;
$("#id").disable = true;
$("#id").disabled = 'disabled';
$("#id").disable = 'disabled';
$("#id").disabled();
$("#id").disable();
$('#id').show();
$('#id').hide();
/** ------------------------------------------------------------------------------------- **/


/** 清空下拉框的数据 **/
$("#search").find("option").remove();
$("#search").empty();
/** ------------------------------------------------------------------------------------- **/