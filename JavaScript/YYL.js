/**
 * 菜单左移右移点击
 */
function menuMoreOnclick($container,$menu) {
    $container.children("li").unbind("click").bind("click", function() {
        if ($(this).hasClass("admin-menu-to-right")) {
            $menu.find(".layui-nav-item:not(.layui-hide)").last();
        }
    })
}

// 我想取到最后一个class为layui-nav-item或则layui-nav-item layui-this 的li，

var frame = $(window.ducument).find("iframe[id='frameid']")[0].contentWindow;