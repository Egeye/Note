/** 深拷贝 **/
angular.copy();
/** ------------------------------------------------------------------------------------- **/

/** AngularJS的比较 **/
angular.equals(x, y);
/** ------------------------------------------------------------------------------------- **/

/** 页面数据存储方式 **/
sessionStorage.setItem("nodeId", $scope.nodeId);
sessionStorage.getItem("nodeId");
/** ------------------------------------------------------------------------------------- **/

/** 跨页面取数据(Angular) **/
window.opener.jQuery('[ng-controller="xxController"]').scope().bindData(JSON.stringify(data));
$scope.bindData = function (list) {
    $scope.hasExcuManualInstId = JSON.parse(list);
};
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


