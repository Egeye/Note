1. 深拷贝
    angular.copy();

2. 

3. 保留两位小数
    size.toFixed(2);

4. 定时器
    setTimeout(function () {}, 1000);
    $interval.cancel($scope.statusTimer);

5. 字符串替换
    function strReplace(str, num)
    {
        return str.replace(/\{([^{}]*)\}/g, function (a, b)
        {
            let r = num[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    }

6. 页面数据存储方式
    sessionStorage.setItem("nodeId",$scope.nodeId);
    sessionStorage.getItem("nodeId");

7. URL中文参数乱码问题
    window.open("/oprt/flowRecord?scriptObj=" + encodeURIComponent(scriptObj));
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }

8. 移动动画效果
    $("#idPRList").animate({left: "+=616px", width: "toggle"}, 500, null, function () {
        // $("#idPRList").hide();
    });

    $("#idPRList").show().animate({left: '-=616px', width:'616px'}, 500);

9. 包含判断 -1代表未匹配
    all.indexOf(item);

10. 新开窗口标签，第二个参数可保证窗口唯一
    window.open("/xxx/xxxx");
    window.open("/xxx/xxxx", param);

11. 数据合并处理
    [1，2], [1,2,3,4] = [1,2,3,4];
    combineScriptList(whole, target);

    function haveSameScriptId(arrA,x) {
        for(var i in arrA){
            if(arrA[i].scriptId === x.scriptId) return true;
        }
    }
    function combineScriptList(a,b){
        for (var i in a) {
            if(haveSameScriptId(b,a[i])) continue;
            b.push(a[i]);
        }
        return b;
    }

12. 数据去重处理
    var removeObj = {};
    $scope.manualInstList.map(function (e) {
        removeObj[e.manualInstId] = e;
    });
    var keys = [];
    for (var property in removeObj) {
        keys.push(removeObj[property]);
    }
    $scope.manualInstList = keys;

13. 日期检查
    function checkIsCorrectDate(intYear, intMonth, intDay)
    {
        let boolLeapYear;
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;
        if (intMonth > 12 || intMonth < 1) return false;
        if ((intMonth == 1
        || intMonth == 3
        || intMonth == 5
        || intMonth == 7
        || intMonth == 8
        || intMonth == 10
        || intMonth == 12) && (intDay > 31 || intDay < 1)) return false;
        if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30 || intDay < 1)) return false;
        if (intMonth == 2)
        {
            if (intDay < 1) return false;
            boolLeapYear = false;

            if ((intYear % 100) == 0)
            {
                if ((intYear % 400) == 0) boolLeapYear = true;
            }
            else
            {
                if ((intYear % 4) == 0) boolLeapYear = true;
            }

            if (boolLeapYear)
            {
                if (intDay > 29) return false;
            }
            else
            {
                if (intDay > 28) return false;
            }
        }
        return true;
    }

14. 日期格式化
    /**
     * time format 2017/04/24 14:35:31
     * @return {[type]} [description]
     */
    function getDate() {
      let date = new Date();
      let seperator1 = '/';
      let seperator2 = ':';
      let month = date.getMonth() + 1;
      let strDate = date.getDate();

      if (month >= 1 && month <= 9) month = '0' + month;
      if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate;

      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + ' ' + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();

      return currentdate;
    }

15. 字符串截取
    // substring只有一个参数时，参数表示从字符串的第几位开始截取
    let str = "Olive";
    let result1 = str.substring(3); // result1 is "ve"

    let res1 = str.substr(3);   // res1 is "ve"

    /**
    * [substring有两个参数时，
    * 第一个参数表示从字符串的第几位开始截取，
    * 第二个参数表示截取到字符串的第几位]
    */
    let result2 = str.substring(3, 4); // result2 is "v"
    let result3 = str.substring(3, 2); // result3 is "0"

    let res2 = str.substring(3, 4); // res2 is "ve"
    let res3 = str.substring(3, 2); // res3 is "ve"
    /**
    * [substr有两个参数时，
    * 第一个参数表示从字符串的第几位开始截取，
    * 第二个参数表示截取多少位字符串]
    */

16. 获取标签id，来改变该style
    /**
     * [获取标签id，来改变该style]
     * @param  {[type]}  [description]
     * @return {[type]}  [description]
     */
    document.getElementById('elemId').style.display = 'none';
    $('#elemId').removeAttr('style');

    if(testFlag)
    {
        $('#elemId').css('display','none');
        testFlag = false;
    }
    else
    {
        $('#elemId').css('display','block');
        testFlag = true;
    }
