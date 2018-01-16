/**
 * Easyui 弹出加载中的遮罩的两种方法
 */

//弹出加载层
function showMask() {
    $("<div class=\"datagrid-mask\"></div>").css({
        display: "block",
        width: "100%",
        height: $(window).height()
    }).appendTo("body");
    $("<div class=\"datagrid-mask-msg\"></div>").html("请稍候。。。").appendTo("body").css({
        display: "block",
        left: ($(document.body).outerWidth(true) - 190) / 2,
        top: ($(window).height() - 45) / 2
    });
}

//取消加载层
function hideMask() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}


$.messager.progress({
    title: '提示',
    msg: '文件上传中，请稍候……',
    text: ''
});
$.messager.progress('close');