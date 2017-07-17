'use strict';
var common = require('common');
require('ngCommon');
require('angular-toastr');
require('angular-toastrWrapper');
require('angular-animate');
require('angular-file-upload');

var oprtAppControllers = angular.module('oprtManageApp.controllers', ['toastr', 'ui.bootstrap','ui.grid','ui.grid.pagination','ngAnimate','angularFileUpload']);

//新增、修改操作
oprtAppControllers.controller('editOprtCtrl', ['$scope','ngDialog','toastr','oprtManageService','i18nService', '$routeParams','oprtService','$http', 'FileUploader',function ($scope,ngDialog,toastr,oprtManageService,i18nService,$routeParams,oprtService,$http, FileUploader){
    i18nService.setCurrentLang('zh-cn');
    var tempScriptList = [];
    var tempOprtName = "";
    var tempScriptParamList = [];
    var tempResourceObjList = []
    var tempLimitResource = false;
    var tempLimitRemark = "";
    var classIds = [];
    //脚本列表
    $scope.scriptList = [];
    //脚本参数列表
    $scope.scriptParamList = [];
    //已选资源对象列表
    $scope.resourceObjList = [];
    //操作名称
    $scope.oprtName = "";
    //操作功能说明及风险提示
    $scope.remark = "";
    //是否限定资源
    $scope.limitResource = false;
    $scope.OprtWinCheckStatus="0";
    //页面状态 pageState 0:新增 1:编辑 2:执行
    // $scope.pageState = $routeParams.pageState;
    // var moduleId = $routeParams.moduleId;
    var headRevision;
    // var cfgId = $routeParams.cfgId;
    $scope.pageState = getQueryString("pageState");
    var moduleId = getQueryString("moduleId");
    var nodeId = getQueryString("nodeId");
    var status = getQueryString("status");
    // var cfgInfoMap = JSON.parse(getQueryString("cfgInfoMap"));
    var cfgInfoMap = JSON.parse(sessionStorage.getItem("cfgInfoMap"));
    var tempoprtExcuType = "";
    $scope.flowstatus = status;
    if(cfgInfoMap){
        $scope.OprtWinCheckStatus = cfgInfoMap.oprtExcuType;
        tempoprtExcuType = cfgInfoMap.oprtExcuType;
    }
    $scope.moduleId = moduleId;
    // var headRevision = getQueryString("headRevision");
    var cfgId = getQueryString("cfgId");
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    if($scope.flowstatus == 1 && $scope.pageState == 2){
        console.log("----流程管理---输入参数页面--cfgInfoMaps-----------", cfgInfoMap);
        $scope.isShowLoading = true;
        console.log("or - cfgInfoMap", cfgInfoMap);
        if(cfgInfoMap != null) {
            $scope.scriptList = cfgInfoMap.oprtScriptList || [];
            if ($scope.moduleId == 3 && $scope.scriptList != []) {
                for (var i = 0; i < $scope.scriptList.length; i++) {
                    var filescriptobj = JSON.parse($scope.scriptList[i].scriptCont); //由JSON字符串转换为JSON对象
                    $scope.scriptList[i].sourcefilescriptObject = filescriptobj.sourcefilescriptObject;
                    $scope.scriptList[i].sourcefilescriptPath = filescriptobj.sourcefilescriptPath;
                    $scope.scriptList[i].destinationfilescriptPath = filescriptobj.destinationfilescriptPath;
                    console.log("or - $scope.scriptList[i]", $scope.scriptList[i]);
                    console.log("or - $scope.scriptList[i].fileResourceObj", $scope.scriptList[i].fileResourceObj);
                    if ($scope.scriptList[i].fileResourceObj && $scope.scriptList[i].fileResourceObj.fileRealName) {
                        $scope.scriptList[i].tagFilestate = 1;
                    } else {
                        $scope.scriptList[i].tagFilestate = 0;
                    }
                    console.log("or - $scope.scriptList[i].tagFilestate", $scope.scriptList[i].tagFilestate);
                }
            }
            tempScriptList = angular.copy($scope.scriptList);
            $scope.showScriptContMap = getScriptContMap();
            $scope.scriptParamList = cfgInfoMap.paramList || [];
            tempScriptParamList = angular.copy($scope.scriptParamList);
            $scope.resourceObjList = cfgInfoMap.resourceObjList || [];
            tempResourceObjList = angular.copy($scope.resourceObjList);
            $scope.remark = cfgInfoMap.remark || "";
            tempLimitRemark = angular.copy($scope.remark);
            $scope.oprtName = cfgInfoMap.oprtName || "";
            tempOprtName = angular.copy($scope.oprtName);
            $scope.limitResource = (cfgInfoMap.limitResource == "true") ? true : false;
            tempLimitResource = angular.copy($scope.limitResource);
            $scope.isShowLoading = false;
            headRevision = cfgInfoMap.headRevision;
        }

    }else {
        console.log("----操作管理---参数页面-------------");
        if ($scope.pageState == 1 || $scope.pageState == 2) {
            $scope.isShowLoading = true;
            oprtManageService.getOprtCfgInfo({"cfgId": cfgId}, function (datas) {
                console.log("or - datas", datas);
                $scope.scriptList = datas.oprtScriptList || [];
                if ($scope.moduleId == 3 && $scope.scriptList != []) {
                    for (var i = 0; i < $scope.scriptList.length; i++) {
                        var filescriptobj = JSON.parse($scope.scriptList[i].scriptCont); //由JSON字符串转换为JSON对象
                        $scope.scriptList[i].sourcefilescriptObject = filescriptobj.sourcefilescriptObject;
                        $scope.scriptList[i].sourcefilescriptPath = filescriptobj.sourcefilescriptPath;
                        $scope.scriptList[i].destinationfilescriptPath = filescriptobj.destinationfilescriptPath;
                        console.log("or - $scope.scriptList[i]", $scope.scriptList[i]);
                        console.log("or - $scope.scriptList[i].fileResourceObj", $scope.scriptList[i].fileResourceObj);
                        if ($scope.scriptList[i].fileResourceObj && $scope.scriptList[i].fileResourceObj.fileRealName) {
                            $scope.scriptList[i].tagFilestate = 1;
                        } else {
                            $scope.scriptList[i].tagFilestate = 0;
                        }
                        console.log("or - $scope.scriptList[i].tagFilestate", $scope.scriptList[i].tagFilestate);
                    }
                }
                tempScriptList = angular.copy($scope.scriptList);
                $scope.showScriptContMap = getScriptContMap();
                $scope.scriptParamList = datas.paramList || [];
                tempScriptParamList = angular.copy($scope.scriptParamList);
                $scope.resourceObjList = datas.resourceObjList || [];
                tempResourceObjList = angular.copy($scope.resourceObjList);
                $scope.remark = datas.remark || "";
                tempLimitRemark = angular.copy($scope.remark);
                $scope.oprtName = datas.oprtName || "";
                tempOprtName = angular.copy($scope.oprtName);
                $scope.limitResource = (datas.limitResource == "true") ? true : false;
                tempLimitResource = angular.copy($scope.limitResource);
                $scope.isShowLoading = false;
                headRevision = datas.headRevision;
            });
        }
    }
    $scope.saveOprt = function(){

        if(validate()){
            $scope.isShowLoading = true;
            var saveOprtObj = saveDatas();
            var saveOprtObjStr = JSON.stringify(saveOprtObj);
            console.log("or - saveOprt-", saveOprtObjStr);
            console.log("or - saveOprtObj -", saveOprtObj);


            oprtManageService.saveOprt({"saveOprtObjStr":saveOprtObjStr},function(result){
                if(result.message == "success"){
                    //修改by lidh 20160622，如果获取到status,说明请求方是流程管理
                    if(status){
                        var res = {};
                        res.taskId = result.taskId;
                        res.taskType = result.taskType;
                        res.taskName = result.taskName;
                        res.taskHid = result.taskHid;
                        $scope.isShowLoading = false;
                        window.opener.jQuery('[ng-controller="editFlowCtrl"]').scope().bindNode(JSON.stringify(res),status);
                        setTimeout(function () {
                            window.close();
                        }, 1000);
                    }else{
                        toastr.info("保存成功！");
                        window.opener.location.reload();
                        setTimeout(function () {

                            //window.opener.location.href = window.opener.location.href;
                            window.close();
                        }, 1000);
                    }
                }else{
                    toastr.info("保存失败！");
                }
                $scope.isShowLoading = false;
            });
        }
    }
    $scope.saveOprtflow = function(){
        if(validate()){
            $scope.isShowLoading = true;
            flowsaveDatas();
            $scope.isShowLoading = false;
            window.opener.jQuery('[ng-controller="editFlowCtrl"]').scope().bindNodeOprt(JSON.stringify(cfgInfoMap),nodeId);
            toastr.info("保存成功！");
            setTimeout(function () {
                window.close();
            }, 1000);
            $scope.isShowLoading = false;
        }
    }
    function saveDatas(){
        var saveOprtObj = {};
        //保存脚本
        saveOprtObj.scriptList = $scope.scriptList;
        //保存脚本参数 newParam=true表示新增的脚本参数
        saveOprtObj.scriptParamList = $scope.scriptParamList;
        //保存资源对象
        saveOprtObj.resourceObjList = $scope.resourceObjList;
        //保存模块
        saveOprtObj.moduleId = moduleId;
        //保存操作功能说明及风险提示
        saveOprtObj.remark = $scope.remark;
        //保存操作名称
        saveOprtObj.oprtName = $scope.oprtName;
        //保存是否限定资源
        saveOprtObj.limitResource = ($scope.limitResource)?"true":"false";
        //配置标识
        if($scope.pageState == "1") saveOprtObj.cfgId = cfgId;
        console.log("-数据保存----->>>>>>>");
        console.log(saveOprtObj);
        return saveOprtObj;
    }
    function flowsaveDatas(){
        // console.log("or --------- 初始串并行标识-", cfgInfoMap.oprtExcuType);
        // console.log("or --------- 初始串并行标识页面-", $scope.OprtWinCheckStatus);
        // console.log("----流程管理---初始输入参数页面--cfgInfoMaps-----------", cfgInfoMap);
        //保存脚本
        cfgInfoMap.oprtScriptList = $scope.scriptList;
        //保存脚本参数 newParam=true表示新增的脚本参数
        cfgInfoMap.paramList = $scope.scriptParamList;
        //保存资源对象
        cfgInfoMap.resourceObjList = $scope.resourceObjList;
        //保存操作功能说明及风险提示
        cfgInfoMap.remark = $scope.remark;
        //保存操作名称
        cfgInfoMap.oprtName = $scope.oprtName;
        //保存是否限定资源
        cfgInfoMap.limitResource = ($scope.limitResource)?"true":"false";
        cfgInfoMap.oprtExcuType = $scope.OprtWinCheckStatus;
        // console.log("or --------- 流程管理---修改之后输入参数页-", cfgInfoMap);
        // console.log("or --------- 串并行标识-",cfgInfoMap.oprtExcuType);
    }
    //取消
    $scope.resetOprt = function(){
        window.close();
    }
    //数据验证
    function validate(){
        if($scope.oprtName == ""){
            toastr.info("操作名称不允许为空！");
            return;
        }
        if($scope.scriptList.length == 0){
            if($scope.moduleId == 3){
                toastr.info("文件不允许为空,请添加文件！");
                return;
            }else {
                toastr.info("脚本不允许为空,请添加脚本！");
                return;
            }
        }
        //脚本 newScript=true表示新增的脚本
        if($scope.moduleId == 3) {
            for (var i = 0; i < $scope.scriptList.length; i++) {
                for (var j = 0; j < tempScriptList.length; j++) {
                    if ($scope.scriptList[i].scriptId == tempScriptList[j].scriptId &&
                        $scope.scriptList[i].scriptName == tempScriptList[j].scriptName &&
                        $scope.scriptList[i].sourcefilescriptObject == tempScriptList[j].sourcefilescriptObject &&
                        $scope.scriptList[i].sourcefilescriptPath == tempScriptList[j].sourcefilescriptPath &&
                        $scope.scriptList[i].destinationfilescriptPath == tempScriptList[j].destinationfilescriptPath &&
                        $scope.scriptList[i].sortId == tempScriptList[j].sortId) {
                        $scope.scriptList[i].newScript = false;
                        break;
                    } else $scope.scriptList[i].newScript = true;
                }
            }
        }else {
            for (var i = 0; i < $scope.scriptList.length; i++) {
                for (var j = 0; j < tempScriptList.length; j++) {
                    if ($scope.scriptList[i].scriptId == tempScriptList[j].scriptId &&
                        $scope.scriptList[i].scriptName == tempScriptList[j].scriptName &&
                        $scope.scriptList[i].scriptCont == tempScriptList[j].scriptCont &&
                        $scope.scriptList[i].sortId == tempScriptList[j].sortId) {
                        $scope.scriptList[i].newScript = false;
                        break;
                    } else $scope.scriptList[i].newScript = true;
                }
            }
        }
        var hasScript = false;
        //判断脚本
        for(var i = 0; i < $scope.scriptList.length; i++) {
            if ($scope.scriptList[i].scriptName == "") {
                if($scope.moduleId == 3){
                    toastr.info("文件名称不允许为空！");
                }else {
                    toastr.info("脚本名称不允许为空！");
                }
                return;
            }
            if ($scope.scriptList[i].scriptCont == "" && $scope.moduleId != 3) {
                toastr.info("脚本内容不允许为空！");
                return;
            }
            if ($scope.scriptList[i].sourcefilescriptObject == "" && $scope.moduleId == 3) {
                toastr.info("源文件资源对象不允许为空！");
                return;
            }
            if ($scope.scriptList[i].sourcefilescriptPath == "" && $scope.moduleId == 3) {
                toastr.info("源文件路径不允许为空！");
                return;
            }
            if ($scope.scriptList[i].sourcefilescriptPath != "" && $scope.moduleId == 3) {
                var fileContent  = $scope.scriptList[i].sourcefilescriptPath;
                // alert(fileContent);
                var fileNamepatn = /\||<|>|:|"/;
                if(fileNamepatn.test(fileContent) ) {
                    toastr.info("源文件路径的文件名输入不规范,不能包含特殊字符:<>|:\"！");
                    return;
                }
            }
            if ($scope.scriptList[i].destinationfilescriptPath == "" && $scope.moduleId == 3) {
                toastr.info("目标文件路径不允许为空！");
                return;
            }
            if ($scope.scriptList[i].destinationfilescriptPath != "" && $scope.moduleId == 3) {
                var fileContent  = $scope.scriptList[i].destinationfilescriptPath;
                // fileContent  = fileContent.repalce(/\\/g,"\\");
                fileContent = fileContent.substring(fileContent.lastIndexOf("\\")+1);
                // alert(fileContent);
                var fileNamepatn = /\||<|>|:|"/;
                if(fileNamepatn.test(fileContent) ) {
                    // alert("不能包含特殊字符");
                    toastr.info("目标文件路径的文件名输入不规范,不能包含特殊字符:<>|:\"！");
                    return;
                }
            }
            if ($scope.moduleId != 3) {
                var str = $scope.scriptList[i].scriptCont;
                var pattern = /\{(.+?)\}/g;
                var rsArry = str.match(pattern);
                if (rsArry != null) {
                    for (var j = 0; j < rsArry.length; j++) {
                        var paramItem = rsArry[j].replace("{", "").replace("}", "");
                        var isMatch = false;
                        for (var n = 0; n < $scope.scriptParamList.length; n++) {
                            if (paramItem == $scope.scriptParamList[n].paramName) {
                                isMatch = true;
                                break;
                            }
                        }
                        if (!isMatch) {
                            toastr.info("未找到可匹配的参数" + paramItem);
                            return;
                        }
                    }
                }
                if ($scope.scriptList[i].newScript) hasScript = true;
                //脚本类型scriptType 1:SHELL  2:SQL SELECT  3:SQL UPDATE  4:SQL PROC  5:SQL BLOCK  6:ftp
                var content = $scope.scriptList[i].scriptCont.toLowerCase();
                //先把SQL语句注释去掉再做处理
                content = content.replace(/\/\*(\s|.)*?\*\/|\-\-[^\n]*/, '');
                var sqlProcedureReg = /\s*call /,
                    sqlSelectReg = /^\s*select /,
                    sqlStatementReg = /^\s*begin /,
                    sqlUpdateReg = /^\s*update |^\s*insert |^\s*delete /;
                if (content.indexOf("echo ") > -1) $scope.scriptList[i].scriptType = "1";
                else if (content.match(sqlProcedureReg)) $scope.scriptList[i].scriptType = "4";
                else if (content.match(sqlStatementReg)) $scope.scriptList[i].scriptType = "5";
                else if (content.match(sqlSelectReg)) $scope.scriptList[i].scriptType = "2";
                else if (content.match(sqlUpdateReg)) $scope.scriptList[i].scriptType = "3";
            }
            if ($scope.moduleId == 3){
                var str = $scope.scriptList[i].sourcefilescriptPath;
                var str2 = $scope.scriptList[i].destinationfilescriptPath;
                var pattern = /\{(.+?)\}/g;
                var rsArry = str.match(pattern);
                if (rsArry != null) {
                    for (var j = 0; j < rsArry.length; j++) {
                        var paramItem = rsArry[j].replace("{", "").replace("}", "");
                        var isMatch = false;
                        for (var n = 0; n < $scope.scriptParamList.length; n++) {
                            if (paramItem == $scope.scriptParamList[n].paramName) {
                                isMatch = true;
                                break;
                            }
                        }
                        if (!isMatch) {
                            toastr.info("未找到可匹配的参数" + paramItem);
                            return;
                        }
                    }
                }
                var rsArry2 = str2.match(pattern);
                if (rsArry2 != null) {
                    for (var j = 0; j < rsArry2.length; j++) {
                        var paramItem = rsArry2[j].replace("{", "").replace("}", "");
                        var isMatch = false;
                        for (var n = 0; n < $scope.scriptParamList.length; n++) {
                            if (paramItem == $scope.scriptParamList[n].paramName) {
                                isMatch = true;
                                break;
                            }
                        }
                        if (!isMatch) {
                            toastr.info("未找到可匹配的参数" + paramItem);
                            return;
                        }
                    }
                }
                // var arr = new Array();
                // arr.push($scope.scriptList[i].sourcefilescriptObject);
                // arr.push($scope.scriptList[i].sourcefilescriptPath);
                // arr.push($scope.scriptList[i].destinationfilescriptPath);
                // $scope.scriptList[i].scriptCont = arr.join(",");
                $scope.scriptList[i].scriptType = "6";
                if ($scope.scriptList[i].newScript) hasScript = true;
                var filescript = new Object();
                filescript.sourcefilescriptObject = $scope.scriptList[i].sourcefilescriptObject;
                filescript.sourcefilescriptPath = $scope.scriptList[i].sourcefilescriptPath;
                filescript.destinationfilescriptPath = $scope.scriptList[i].destinationfilescriptPath;
                // wei
                if ($scope.scriptList[i].fileResourceObj) {
                    if ($scope.scriptList[i].fileResourceObj.fileRealName) {
                        filescript.filePath = $scope.scriptList[i].fileResourceObj.filePath;
                        filescript.fileRealName = $scope.scriptList[i].fileResourceObj.fileRealName;
                        filescript.fileSaveName = $scope.scriptList[i].fileResourceObj.fileSaveName;
                        filescript.fileSize = $scope.scriptList[i].fileResourceObj.fileSize;
                        filescript.serverUser = $scope.scriptList[i].fileResourceObj.serverUser;
                        filescript.serverPwd = $scope.scriptList[i].fileResourceObj.serverPwd;
                        filescript.serverIp = $scope.scriptList[i].fileResourceObj.serverIp;
                        filescript.serverPort = $scope.scriptList[i].fileResourceObj.serverPort;
                    } else {
                        filescript.accontInstId = $scope.scriptList[i].fileResourceObj.accontInstId;
                    }
                }
                $scope.scriptList[i].scriptCont = JSON.stringify(filescript);
            }
        }
        if($scope.scriptList.length !== tempScriptList.length) hasScript = true;
        //判断是否修改用户名
        if($scope.oprtName !== tempOprtName) hasScript = true;
        //判断是否修改脚本参数
        if(tempScriptParamList.length == $scope.scriptParamList.length){
            for(var i = 0; i < $scope.scriptParamList.length; i++){
                if($scope.scriptParamList[i].paramType == 1){
                    if(tempScriptParamList[i].enumList.length != $scope.scriptParamList[i].enumList.length){
                        hasScript = true;
                        break;
                    }else{
                        for(var k = 0; k < $scope.scriptParamList[i].enumList.length; k++){
                            if(tempScriptParamList[i].enumList[k].enumName !=$scope.scriptParamList[i].enumList[k].enumName){
                                hasScript = true;
                                break;
                            }else if(tempScriptParamList[i].enumList[k].enumVal !=$scope.scriptParamList[i].enumList[k].enumVal){
                                hasScript = true;
                                break;
                            }
                        }
                    }
                }
                if(tempScriptParamList[i].paramId !== $scope.scriptParamList[i].paramId){
                    hasScript = true;
                    break;
                }else if(tempScriptParamList[i].isManual !== $scope.scriptParamList[i].isManual){
                    hasScript = true;
                    break;
                }else if(tempScriptParamList[i].defaultName !== $scope.scriptParamList[i].defaultName){
                    hasScript = true;
                    break;
                }
            }
        }else{
            hasScript = true;
        }
        //判断是否修改资源对象
        if(tempResourceObjList .length == $scope.resourceObjList.length){
            for(var i = 0; i < $scope.resourceObjList.length; i++){
                if(tempResourceObjList [i].accontInstId !== $scope.resourceObjList[i].accontInstId){
                    hasScript = true;
                    break;
                }/*else if(tempScriptParamList[i].resourceName !== $scope.scriptParamList[i].resourceName){
                 hasScript = true;
                 break;
                 }else if(tempScriptParamList[i].userName !== $scope.scriptParamList[i].userName){
                 hasScript = true;
                 break;
                 }*/
            }
        }else{
            hasScript = true;
        }
        //判断是否修改限定资源对象
        if($scope.limitResource !== tempLimitResource){
            hasScript = true;
        }
        if($scope.remark !== tempLimitRemark){
            hasScript = true;
        }
        if($scope.flowstatus == 1 && $scope.pageState == 2) {
            if ($scope.OprtWinCheckStatus !== tempoprtExcuType) {
                hasScript = true;
            }
        }

        if(!hasScript){
            toastr.info("当前脚本未改变,保存失败！");
            return;
        }
        var scriptParamNameArry = [];
        for(var i = 0; i < $scope.scriptParamList.length; i++){
            if($scope.scriptParamList[i].paramName == ""){
                toastr.info("脚本参数名称不允许为空！");
                return;
            }
            if($scope.scriptParamList[i].paramNameCn == ""){
                toastr.info("脚本参数中文名称不允许为空！");
                return;
            }
            if(($scope.scriptParamList[i].paramType == '0' || $scope.scriptParamList[i].paramType == '2') && $scope.scriptParamList[i].defaultName == ""){
                toastr.info("脚本参数值不允许为空！");
                return;
            }
            if($scope.scriptParamList[i].paramType == '1' && $scope.scriptParamList[i].enumList.length == 0){
                toastr.info("请配置"+$scope.scriptParamList[i].paramName+"参数的枚举值！");
                return;
            }
            scriptParamNameArry.push($scope.scriptParamList[i].paramName);
        }
        if($scope.isRepeat(scriptParamNameArry)){
            toastr.info("脚本参数名称不允许重复！");
            return;
        }
        return true;
    }
    //脚本拖动排序
    var hasChangeOrder = false;
    $scope.sortableOptions = {
        update: function(e, ui) {
            hasChangeOrder = true;
        },
        stop: function(e, ui) {
            if (!hasChangeOrder) {
                return;
            }
            $scope.scriptList.forEach(function(sl, index) {
                sl.sortId = index;
            });
            hasChangeOrder = false;
        }
    };
    //脚本内容div 展示/收缩切换
    //默认全部展示
    function getScriptContMap(){
        var showScriptContMap = {};
        for(var i = 0; i < $scope.scriptList.length; i++){
            var scriptId = $scope.scriptList[i].scriptId;
            showScriptContMap[scriptId] = scriptId
        }
        return showScriptContMap;
    }
    $scope.showScriptContMap = getScriptContMap();
    $scope.arrowToggle = function(scriptId){
        if($scope.showScriptContMap[scriptId]) delete $scope.showScriptContMap[scriptId];
        else $scope.showScriptContMap[scriptId] = scriptId;
    }
    //删除脚本
    $scope.scriptItemDelete = function(index, delScriptId){

        console.log("or - --------delScriptId",delScriptId, "----",$scope.scriptList);
        if($scope.moduleId == 3) {
            for (var ii = 0; ii < $scope.scriptList.length; ii++) {
                if ($scope.scriptList[ii].scriptId == delScriptId) {
                    if ($scope.scriptList[ii].fileResourceObj.filePath) {
                        console.log("or - 多次添加文件---------");
                        var delFileDataString = $scope.scriptList[ii].fileResourceObj;
                        console.log("or - delFileDataString-----------", delFileDataString);
                        oprtManageService.deleteFile({"delFileData": delFileDataString}, function (datas) {
                            console.log('or - result-datas-------------', datas);
                            $scope.scriptList.splice(index, 1);
                        });
                    } else {
                        $scope.scriptList.splice(index, 1);
                    }
                    break;
                }
            }
        }else{
            $scope.scriptList.splice(index,1);
        }


    };
    //添加脚本
    var scriptId = 0;
    $scope.addScriptBtn = function(){
        scriptId = scriptId-1;
        var sortId = $scope.scriptList.length + 1;
        var scriptType = '1';
        if(moduleId == 1){
            scriptType = '2';
        }
        $scope.scriptList.push({"scriptId":scriptId,"ciCtrlColId":1,"scriptName":"","scriptType":scriptType,"scriptCont":"","newScript":true,"sortId":sortId});
        $scope.showScriptContMap[scriptId] = scriptId;
    }
    //添加文件脚本
    var scriptId = 0;
    $scope.addFileScriptBtn = function(){
        scriptId = scriptId-1;
        var sortId = $scope.scriptList.length + 1;
        var scriptType = '6';
        $scope.scriptList.push({
            "scriptId":scriptId,
            "ciCtrlColId":1,
            "scriptName":"",
            "scriptType":scriptType,
            "sourcefilescriptObject":"",
            "sourcefilescriptPath":"",
            "destinationfilescriptPath":"",
            "newScript":true,
            "tagFilestate":0,
            "sortId":sortId,
            "fileResourceObj":{} });
        $scope.showScriptContMap[scriptId] = scriptId;
        console.log("------addFileScriptBtn>>>>>>>");
        console.log($scope.scriptList);
        console.log("------addFileScriptBtn>>>>>>>");

    }
    //脚本参数设置
    //参数类型
    if ($scope.moduleId == 3) {
        $scope.paramTypeList = [{value: '0', label: "字符型"}, {value: '1', label: "枚举型"}];
        $scope.paramTypeVal = $scope.paramTypeList[0].value;
    }else {
        $scope.paramTypeList = [{value: '0', label: "字符型"}, {value: '1', label: "枚举型"}, {
            value: '2',
            label: "存储过程输出游标"
        }, {value: '3', label: "存储过程输出参数"}];
        $scope.paramTypeVal = $scope.paramTypeList[0].value;
    }

    //新增参数
    var paramId = 0;
    $scope.addParamBtn = function(){
        paramId = paramId-1;
        $scope.scriptParamList.push({paramId:paramId,paramName:"",paramNameCn:"",paramType:'0',paramTypeCn:"",defaultName:"",isManual:'0SX',newParam:true});
    }
    //是否人工介入
    $scope.isManualToggle = function(isManual,index){
        if($scope.pageState == 2) return;
        if(isManual == '0SA') $scope.scriptParamList[index].isManual = '0SX';
        else $scope.scriptParamList[index].isManual = '0SA';
    }
    //删除脚本参数
    $scope.scriptParamDelete = function(index){
        $scope.scriptParamList.splice(index,1);
    }
    //(新增参数)参数类型变化时触发的事件
    $scope.paramTypeChange = function(paramTypeVal,index){
        $scope.scriptParamList[index].paramType = paramTypeVal;
        $scope.scriptParamList[index].defaultName = "";
        if(paramTypeVal != '2') $scope.scriptParamList[index].enumList = [];
    }
    //设置枚举值
    $scope.openEnumCfgWin = function(paramId,parentIndex){
        ngDialog.open({
            template: '/app/oprt/views/enumConfig.html',
            showClose : false,
            className: 'ngdialog-theme-default enum-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                var enumList = $scope.$parent.scriptParamList[parentIndex].enumList||[];
                $scope.enumList = angular.copy(enumList);
                //新增枚举值
                $scope.addEnumBtn = function(){
                    $scope.enumList.push({paramId:paramId,enumVal:"",enumName:""});
                }
                //删除枚举值
                $scope.enumDelete = function(index){
                    $scope.enumList.splice(index,1);
                }
                //设为默认
                $scope.defaultVal = $scope.$parent.scriptParamList[parentIndex].defaultName||"";
                $scope.setDefaultVal = function(index){
                    $scope.defaultVal = $scope.enumList[index].enumVal;
                }
                //枚举配置完成
                $scope.enumCfgSave = function(){
                    var enumValArry = [];
                    var enumNameArry = [];
                    for(var i = 0; i < $scope.enumList.length; i++){
                        if($scope.enumList[i].enumVal == ""){
                            toastr.info("参数值不允许为空！");
                            return;
                        }
                        if($scope.enumList[i].enumName == ""){
                            toastr.info("对应解释不允许为空！");
                            return;
                        }
                        enumValArry.push($scope.enumList[i].enumVal);
                        enumNameArry.push($scope.enumList[i].enumName);
                    }
                    if($scope.$parent.isRepeat(enumValArry)){
                        toastr.info("参数值不允许重复！");
                        return;
                    }
                    if($scope.$parent.isRepeat(enumNameArry)){
                        toastr.info("对应解释不允许为空！");
                        return;
                    }
                    $scope.$parent.scriptParamList[parentIndex].defaultName = $scope.defaultVal;
                    $scope.$parent.scriptParamList[parentIndex].enumList = $scope.enumList;
                    this.closeThisDialog();
                }
            }],
        }).closePromise.then(function(){});
    }
    //判断数组中是否有重复的值
    $scope.isRepeat = function(arr){
        var hash = {};
        for(var i in arr) {
            if(hash[arr[i]]) return true;
            hash[arr[i]] = true;
        }
        return false;
    }
    //是否限定资源对象
    $scope.limitResourceToggle = function(){
        if($scope.pageState == 2) return;
        if($scope.resourceObjList.length == 0){
            toastr.info("请先添加资源对象！");
            return;
        }
        $scope.limitResource = !$scope.limitResource;
    }
    $scope.isShowTip = false;
    //删除资源对象
    $scope.resourceDelete = function(index){
        $scope.resourceObjList.splice(index,1);
        if($scope.resourceObjList.length == 0) $scope.limitResource = false;
    }


    //添加源文件资源对象
    $scope.openAddFileResourceObjWin = function(scriptIdValue){
        console.log("or - scriptIdValue", scriptIdValue);
        ngDialog.open({
            template: '/app/oprt/views/addFileResourceObj.html',
            showClose : false,
            className: 'ngdialog-theme-default update-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                var formData = new FormData();

                // 页面关闭方法
                $scope.closeWin = this.closeThisDialog;
                var uploader = $scope.uploader = new FileUploader({
                    url: "/oprt/uploadFile",
                    queueLimit: 1// 最大上传文件数量
                    // autoUpload: true
                });
                uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                    $scope.isShowLoading = false;
                };
                uploader.onAfterAddingFile = function (fileItem) {
                    console.info('onAfterAddingFile', fileItem);
                };
                uploader.onAfterAddingAll = function (addedFileItems) {
                    console.info('onAfterAddingAll', addedFileItems);
                };
                uploader.onBeforeUploadItem = function (item) {
                    console.info('onBeforeUploadItem', item);
                    $scope.isShowLoading = true;
                };
                uploader.onProgressItem = function (fileItem, progress) {
                    console.info('onProgressItem', fileItem, progress);
                };
                uploader.onProgressAll = function (progress) {
                    console.info('onProgressAll', progress);
                    if (progress == '100') {
                        $scope.isShowLoading = false;
                        console.log('or -----------99');
                    }
                };
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    $scope.isShowLoading = false;
                    console.info('onSuccessItem', fileItem, response, status, headers);
                    if("0" == response.result){
                        try{
                            toastr.info("上传成功!");
                            $scope.response = {
                                "fileRealName": response.fileRealName,
                                "fileSaveName": response.fileSaveName,
                                "srcFilePath": response.srcFilePath,
                                "serverIp": response.serverInfo[0].serverIp,
                                "serverPort": response.serverInfo[0].serverPort,
                                "serverPwd": response.serverInfo[0].serverPwd,
                                "serverUser": response.serverInfo[0].serverUser,
                                "fileSize": $scope.fileData.size
                            };

                            for (var ii = 0; ii < $scope.$parent.scriptList.length; ii++) {
                                if ($scope.$parent.scriptList[ii].scriptId == scriptIdValue) {
                                    $scope.$parent.scriptList[ii].fileResourceObj = {
                                        "serverUser": response.serverInfo[0].serverUser,
                                        "serverPwd": response.serverInfo[0].serverPwd,
                                        "serverIp": response.serverInfo[0].serverIp,
                                        "serverPort": response.serverInfo[0].serverPort,
                                        "fileRealName": response.fileRealName,
                                        "fileSaveName": response.fileSaveName,
                                        "filePath": response.srcFilePath,
                                        "fileSize": $scope.fileData.size
                                    };
                                    $scope.$parent.scriptList[ii].sourcefilescriptPath=$scope.$parent.scriptList[ii].fileResourceObj.fileRealName;
                                    $scope.$parent.scriptList[ii].sourcefilescriptObject="本地上传";
                                    $scope.scriptList[ii].tagFilestate = 1;
                                    break;
                                }
                            }
                            console.log("or ------$scope.response----", $scope.response);
                            $scope.closeWin();
                        }catch (e){
                            console.log("or - e-------------", e);
                            toastr.info("上传失败!");
                            $scope.response = "";
                        }
                    }
                    else{
                        toastr.info("上传失败!");
                    }
                };
                uploader.onErrorItem = function (fileItem, response, status, headers) {
                    console.info('onErrorItem', fileItem, response, status, headers);
                    $scope.isShowLoading = false;
                };
                uploader.onCancelItem = function (fileItem, response, status, headers) {
                    console.info('onCancelItem', fileItem, response, status, headers);
                    $scope.isShowLoading = false;
                };
                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    console.info('onCompleteItem', fileItem, response, status, headers);
                };
                uploader.onCompleteAll = function () {
                    console.info('onCompleteAll');
                    $scope.isShowLoading = false;
                    // window.setTimeout($scope.closeWindow(), 3000);
                };

                // 可选的资源对象列表
                $scope.waitResourceList = $scope.$parent.waitResourceList;
                //选择用户
                $scope.createUserMap = function(){
                    var userSelectedMap = {};
                    var fileResourceObj = null;
                    for (var x = 0; x < $scope.$parent.scriptList.length; x++){
                        if ($scope.$parent.scriptList[x].scriptId == scriptIdValue){
                            fileResourceObj = $scope.$parent.scriptList[x].fileResourceObj;
                            break;
                        }
                    }
                    console.log("or - fileResourceObj", fileResourceObj);
                    if (fileResourceObj && fileResourceObj.fileRealName){
                        var fileDatas = {};
                        fileDatas.name = fileResourceObj.fileRealName;
                        fileDatas.size = fileResourceObj.fileSize;
                        $scope.fileData = fileDatas;
                    }
                    if (fileResourceObj && fileResourceObj.accontInstId) {
                        for (var i = 0; i < $scope.waitResourceList.length; i++) {
                            var waitUserList = $scope.waitResourceList[i].user;
                            for (var j = 0; j < waitUserList.length; j++) {
                                if (waitUserList[j].instanceId == fileResourceObj.accontInstId) {
                                    var accontInstId = waitUserList[j].instanceId;
                                    userSelectedMap[accontInstId] = accontInstId;
                                }
                            }
                        }
                    } else {
                        var waitUser = $scope.waitResourceList[0].user;
                        userSelectedMap[waitUser[0].instanceId] = waitUser[0].instanceId;
                    }
                    return userSelectedMap;
                };
                $scope.userSelectedMap = $scope.createUserMap();

                $scope.$parent.tabFlg = 'serverUpload';
                $scope.tabLocalUploadFlg = function () {
                    $scope.$parent.tabFlg = 'localUpload';
                    console.log("or - tabFlg", $scope.$parent.tabFlg);
                };

                $scope.tabServerUploadFlg = function () {
                    $scope.$parent.tabFlg = 'serverUpload';
                    console.log("or - tabFlg", $scope.$parent.tabFlg);
                };

                // 单选框点击
                $scope.selectUser = function(accontInstId){
                    console.log("or - accontInstId", accontInstId);
                    console.log("or - userSelectedMap", $scope.userSelectedMap);
                    $scope.userSelectedMap = {};
                    $scope.userSelectedMap[accontInstId] = accontInstId;
                };

                // 本地上传
                $scope.getFileSize = function (fData) {
                    uploader.clearQueue();
                    if (fData && fData.files[0] &&fData.files[0].name) {
                        var fileDatas = {};
                        fileDatas.name = fData.files[0].name;
                        $scope.fileName = fData.files[0].name;
                        // var size = Math.floor(fData.files[0].size / 1048576);
                        if (fData.files[0].size > 10240) {
                            var size = fData.files[0].size / 1048576;
                            fileDatas.size = "(" + size.toFixed(2) + "MB)";
                        } else {
                            var size = fData.files[0].size / 1024;
                            fileDatas.size = "(" + size.toFixed(2) + "KB)";
                        }
                        $scope.fileData = fileDatas;
                        $scope.$apply();
                        console.log('or - ', $scope.fileData, fileDatas);
                        formData.append("file", fData.files[0]);
                    }
                };

                //SOLR搜索相关
                $scope.solrSearch = {};
                $scope.searchResource = function () {
                    console.log("or - search -----------------");

                    //var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    // if (keycode == 13) {
                    //如果等于回车键编码执行方法
                    var searchClass = classIds;
                    var searchTxt = $scope.solrSearch.searchTxt;
                    if (searchTxt == null || searchTxt == '') {
                        getWaitResourceListForFtp();
                        // toastr.info("请输入资源名称或者IP！");
                        // return false;
                    }else{
                        oprtService.searchAssestBySolr({
                            "searchText": searchTxt,
                            "searchClass": searchClass,
                            "searchDataSet": 102
                        }, function (data) {
                            var instIds = _.map(data.datas, 'INSTANCE_ID');
                            if(instIds== null || instIds == ''){
                                $scope.waitResourceList = {};
                            }else
                                getWaitResourceListForFtp(instIds);
                        });
                    }
                };
                function getWaitResourceListForFtp(instanceIds){
                    //先设置加载100条，后面有时间再改成瀑布流
                    var params = {
                        classIds:classIds,
                        datasetId:102,
                        instanceIds:instanceIds,
                        page:0,
                        size:100
                    };
                    oprtService.getResourceListByPage(params, function(datas) {
                        var idArry = [];
                        var datas  = datas.content;
                        for(var i = 0; i < datas.length; i++){
                            idArry.push(datas[i].instanceId);
                        }
                        var idStr = idArry.join(",");
                        oprtService.getIpListByIds({"instanceIds":idStr,"isHost":"true"},function(ipList){
                            for(var i = 0; i < datas.length; i++){
                                datas[i].ips = [];
                                for(var j = 0; j < ipList.length; j++){
                                    if(datas[i].instanceId == ipList[j].sourceId){
                                        datas[i].ips.push(ipList[j]);
                                    }
                                }
                            }
                        });
                        oprtService.getUserListByIds({"instanceIds":idStr},function(userList){
                            for(var i = 0; i < datas.length; i++){
                                datas[i].user = [];

                                for(var j = 0; j < userList.length; j++){
                                    if(datas[i].instanceId == userList[j].sourceId){
                                        datas[i].user.push(userList[j]);
                                    }
                                }
                            }
                            $scope.waitResourceList = datas;
                        });
                        $scope.addPageLoading = false;
                    })
                }

                // 删除
                $scope.btnDeleteFile = function () {
                    $scope.fileData = null;
                    $scope.delFileData = "";
                    if ($scope.response) {
                        $scope.delFileData = $scope.response;
                    } else {
                        for (var ii = 0; ii < $scope.$parent.scriptList.length; ii++) {
                            if ($scope.$parent.scriptList[ii].scriptId == scriptIdValue) {
                                $scope.delFileData = $scope.$parent.scriptList[ii].fileResourceObj;
                                console.log("or - $scope.$parent.scriptList[ii].fileResourceObj---------", $scope.$parent.scriptList[ii].fileResourceObj);
                            }
                        }
                    }
                    // $scope.delFileData = JSON.stringify(fileResourceData);
                    console.log('or - delete delFileData--------------', $scope.delFileData);
                };

                //完成
                $scope.fileResourceObjSave = function(){
                    // 多次添加文件
                    for (var ii = 0; ii < $scope.$parent.scriptList.length; ii++) {
                        if ($scope.$parent.scriptList[ii].scriptId == scriptIdValue) {
                            if ($scope.$parent.scriptList[ii].fileResourceObj.filePath) {
                                console.log("or - 多次添加文件---------");
                                var delFileDataString= $scope.$parent.scriptList[ii].fileResourceObj;
                                console.log("or - delFileDataString-----------",delFileDataString);
                                oprtManageService.deleteFile({"delFileData": delFileDataString},function(datas){
                                    console.log('or - result-datas-------------', datas);
                                    if (datas.result == "0") {
                                        $scope.$parent.scriptList[ii].fileResourceObj = {};
                                        $scope.$parent.scriptList[ii].sourcefilescriptPath="";
                                        $scope.$parent.scriptList[ii].sourcefilescriptObject="";
                                        console.log("or - datasdeleteSuccess--------", $scope.$parent.scriptList);
                                    } else {
                                        console.log("or - datasdeleteError--------", $scope.$parent.scriptList);
                                    }
                                });
                            }
                            break;
                        }
                    }

                    if ($scope.$parent.tabFlg == 'serverUpload') {
                        for (var z = 0; z < $scope.$parent.scriptList.length; z++){
                            if ($scope.$parent.scriptList[z].scriptId == scriptIdValue){
                                $scope.$parent.scriptList[z].fileResourceObj = {};
                            }
                        }
                        for (var i = 0; i < $scope.waitResourceList.length; i++) {
                            var waitUserList = $scope.waitResourceList[i].user;
                            for (var j = 0; j < waitUserList.length; j++) {
                                for (var accontInstId in $scope.userSelectedMap) {
                                    if (waitUserList[j].instanceId == $scope.userSelectedMap[accontInstId]) {
                                        if (waitUserList[j].instanceId == $scope.userSelectedMap[accontInstId]) {
                                            for (var v = 0; v < $scope.$parent.scriptList.length; v++){
                                                if ($scope.$parent.scriptList[v].scriptId == scriptIdValue){
                                                    $scope.$parent.scriptList[v].fileResourceObj = {
                                                        "accontInstId": waitUserList[j].instanceId,
                                                        "userName": waitUserList[j].userName,
                                                        "password": waitUserList[j].password,
                                                        "resourceName": $scope.waitResourceList[i].resourceName,
                                                        "ciInstId": $scope.waitResourceList[i].instanceId,
                                                        "ip": $scope.waitResourceList[i].ip,
                                                        "port": $scope.waitResourceList[i].port,
                                                        "connStr": $scope.waitResourceList[i].bunch,
                                                        "dbType": $scope.waitResourceList[i].dbType
                                                    };
                                                    $scope.$parent.scriptList[v].sourcefilescriptObject=$scope.$parent.scriptList[v].fileResourceObj.resourceName;
                                                    $scope.$parent.scriptList[v].sourcefilescriptPath="";
                                                    $scope.scriptList[v].tagFilestate = 0;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.closeThisDialog();
                    } else {
                        if ($scope.fileData && $scope.fileData.name != "" && $scope.fileData.name != null){
                            $scope.uploader.uploadAll();
                            $scope.closeWin = this.closeThisDialog;
                            // $scope.closeWin();
                            console.log("or ---$scope.$parent.scriptList----",$scope.$parent.scriptList);
                        } else {
                            if ($scope.delFileData && $scope.delFileData.fileRealName) {
                                $scope.closeWin = this.closeThisDialog;
                                var delFileDataStr= $scope.delFileData;
                                console.log("or - delFileDataStr-----------",delFileDataStr);
                                oprtManageService.deleteFile({"delFileData": delFileDataStr},function(datas){
                                    console.log('or - delete result--------------', datas);
                                    if (datas.result == "0") {
                                        for (var ii = 0; ii < $scope.$parent.scriptList.length; ii++) {
                                            if ($scope.$parent.scriptList[ii].scriptId == scriptIdValue) {
                                                $scope.$parent.scriptList[ii].fileResourceObj = {};
                                                $scope.$parent.scriptList[ii].sourcefilescriptPath="";
                                                $scope.$parent.scriptList[ii].sourcefilescriptObject="";
                                                console.log("or - deleteSuccess--------", $scope.$parent.scriptList);
                                            }
                                        }
                                        setTimeout($scope.closeWin(), 1000);
                                    } else {
                                        setTimeout($scope.closeWin(), 1000);
                                    }
                                });
                            } else {
                                this.closeThisDialog();
                            }
                        }
                    }
                };
            }]
        }).closePromise.then(function(){});
    };

    //添加资源对象
    $scope.openAddResourceObjWin = function(){
        ngDialog.open({
            template: '/app/oprt/views/addResourceObj.html',
            showClose : false,
            className: 'ngdialog-theme-default update-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                // 可选的资源对象列表
                // vali 0:验证不通过 1:验证通过 2:验证中 3:未验证
                $scope.waitResourceList = $scope.$parent.waitResourceList;
                console.log("------添加资源对象>>>>>>>",$scope.waitResourceList);
                //选择用户
                $scope.createUserMap = function(){
                    var userSelectedMap = {};
                    var resourceObjList = $scope.$parent.resourceObjList;
                    for(var i = 0; i < $scope.waitResourceList.length; i++){
                        var waitUserList = $scope.waitResourceList[i].user;
                        for(var j = 0; j < waitUserList.length; j++){
                            for(var n = 0; n < resourceObjList.length; n++){
                                if(waitUserList[j].instanceId == resourceObjList[n].accontInstId){
                                    var accontInstId = waitUserList[j].instanceId;
                                    userSelectedMap[accontInstId] = accontInstId;
                                }
                            }
                        }
                    }
                    return userSelectedMap;
                }
                $scope.userSelectedMap = $scope.createUserMap();
                $scope.selectUser = function(accontInstId){
                    if($scope.userSelectedMap[accontInstId]){
                        delete $scope.userSelectedMap[accontInstId];
                    }else{
                        $scope.userSelectedMap[accontInstId] = accontInstId;
                    }
                }
                //完成
                $scope.resourceObjSave = function(){
                    $scope.$parent.resourceObjList = [];
                    for(var i = 0; i < $scope.waitResourceList.length; i++){
                        var waitUserList = $scope.waitResourceList[i].user;
                        for(var j = 0; j < waitUserList.length; j++){
                            for(var accontInstId in $scope.userSelectedMap){
                                if(waitUserList[j].instanceId == $scope.userSelectedMap[accontInstId]){
                                    if(waitUserList[j].instanceId == $scope.userSelectedMap[accontInstId]){
                                        console.log("dbType:"+$scope.waitResourceList[i].dbType);
                                        $scope.$parent.resourceObjList.push({
                                            "accontInstId": waitUserList[j].instanceId,
                                            "userName": waitUserList[j].userName,
                                            "password":waitUserList[j].password,
                                            "resourceName": $scope.waitResourceList[i].resourceName,
                                            "ciInstId":$scope.waitResourceList[i].instanceId,
                                            "ip":$scope.waitResourceList[i].ip,
                                            "port":$scope.waitResourceList[i].port,
                                            "connStr":$scope.waitResourceList[i].bunch,
                                            "dbType":$scope.waitResourceList[i].dbType
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    this.closeThisDialog();
                }
                //SOLR搜索相关
                $scope.solrSearch = {};
                $scope.searchResource = function(){
                    //var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    // if (keycode == 13) {
                    //如果等于回车键编码执行方法
                    var searchClass = classIds;
                    var searchTxt = $scope.solrSearch.searchTxt;
                    if (searchTxt == null || searchTxt == '') {
                        getWaitResourceList();
                        // toastr.info("请输入资源名称或者IP！");
                        // return false;
                    }else{
                        oprtService.searchAssestBySolr({
                            "searchText": searchTxt,
                            "searchClass": searchClass,
                            "searchDataSet": 102
                        }, function (data) {
                            var instIds = _.map(data.datas, 'INSTANCE_ID');
                            if(instIds== null || instIds == ''){
                                $scope.waitResourceList = {};
                            }else
                                getWaitResourceList(instIds);
                        });
                    }
                }
                function getWaitResourceList(instanceIds){
                    //先设置加载100条，后面有时间再改成瀑布流
                    var params = {
                        classIds:classIds,
                        datasetId:102,
                        instanceIds:instanceIds,
                        page:0,
                        size:100
                    };
                    oprtService.getResourceListByPage(params, function(datas) {
                        var idArry = [];
                        var datas  = datas.content;
                        for(var i = 0; i < datas.length; i++){
                            idArry.push(datas[i].instanceId);
                        }
                        var idStr = idArry.join(",");
                        oprtService.getIpListByIds({"instanceIds":idStr,"isHost":"true"},function(ipList){
                            for(var i = 0; i < datas.length; i++){
                                datas[i].ips = [];
                                for(var j = 0; j < ipList.length; j++){
                                    if(datas[i].instanceId == ipList[j].sourceId){
                                        datas[i].ips.push(ipList[j]);
                                    }
                                }
                            }
                        });
                        oprtService.getUserListByIds({"instanceIds":idStr},function(userList){
                            for(var i = 0; i < datas.length; i++){
                                datas[i].user = [];

                                for(var j = 0; j < userList.length; j++){
                                    if(datas[i].instanceId == userList[j].sourceId){
                                        datas[i].user.push(userList[j]);
                                    }
                                }
                            }
                            $scope.waitResourceList = datas;
                        });
                        $scope.addPageLoading = false;
                    })
                }

            }],
        }).closePromise.then(function(){});
    }
    function validateBeforeExcu(){
        for(var i = 0; i < $scope.scriptParamList.length; i++){
            if($scope.scriptParamList[i].isManual == '0SX' && $scope.scriptParamList[i].defaultName == ''
                && $scope.scriptParamList[i].paramType != '3'){
                toastr.info($scope.scriptParamList[i].paramName+"参数值不允许为空！");
                return;
            }
        }
        return true;
    }
    //并行
    $scope.openOprtParallelWin = function(){
        if($scope.resourceObjList.length == 0){
            toastr.info("请先添加资源对象！");
            return;
        }
        for(var i = 0; i < $scope.resourceObjList.length; i++) {
            if (typeof($scope.resourceObjList[i].password) == 'undefined'|| $scope.resourceObjList[i].password == '') {
                inputPassword();
                return;
            }
        }
        if(validateBeforeExcu()){
            var saveOprtObj = saveDatas();
            sessionStorage.setItem("saveOprtObjStr",JSON.stringify(saveOprtObj));
            window.open("/oprt/oprtExcu?excuType=1&headRevision="+headRevision, "_self");
        }
    }
    //串行
    $scope.openOprtSerialWin = function(){
        if($scope.resourceObjList.length == 0){
            toastr.info("请先添加资源对象！");
            return;
        }
        for(var i = 0; i < $scope.resourceObjList.length; i++) {
            if (typeof($scope.resourceObjList[i].password) == 'undefined'|| $scope.resourceObjList[i].password == '') {
                inputPassword();
                return;
            }
        }
        if(validateBeforeExcu()){
            var saveOprtObj = saveDatas();
            sessionStorage.setItem("saveOprtObjStr",JSON.stringify(saveOprtObj));
            console.log("------openOprtSerialWin>>>>>>>");
            console.log(saveOprtObj);
            console.log("------openOprtSerialWin>>>>>>>");
            window.open("/oprt/oprtExcu?excuType=0&headRevision=" + headRevision, "_self");
        }
    }
    //输入密码
    function inputPassword(){
        for(var i = 0; i < $scope.resourceObjList.length; i++) {
            if (typeof($scope.resourceObjList[i].password) == 'undefined'|| $scope.resourceObjList[i].password == '') {
                $scope.resourceObjList[i].needPassword = true;
            }
        }
        ngDialog.open({
            template: '/app/oprt/views/inputPassword.html',
            showClose : false,
            className: 'ngdialog-theme-default enum-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                $scope.resourceObjList = angular.copy($scope.$parent.resourceObjList);
                $scope.sure = function () {
                    $scope.$parent.resourceObjList = $scope.resourceObjList;
                    this.closeThisDialog();
                }
            }],
        }).closePromise.then(function(){});
    }
//获取新增资源对象
    function getResourceListByPage(instanceIds){
        if(moduleId == 1){
            classIds =[200201,200208];
        }else if(moduleId == 2){
            classIds =[100101,100102,100103,100104,100106,100105];
        }else if(moduleId == 3){
            classIds =[100101,100102,100103,100104,100106,100105];
        }
        var params = angular.extend({
            classIds:classIds,
            instanceIds:instanceIds,
            datasetId:102
        });
        oprtService.getResourceListByPage(params, function(rs) {
            var idArry = [];
            var datas  = rs.content;
            for(var i = 0; i < datas.length; i++){
                idArry.push(datas[i].instanceId);
                if(datas[i].classId==200201){
                    datas[i].bunch = datas[i].oracleBunch;
                    datas[i].dbType = "Oracle";
                }else if(datas[i].classId==200208){
                    datas[i].bunch = datas[i].mysqlBunch;
                    datas[i].dbType = "MySQL";
                }
            }
            var idStr = idArry.join(",");

            //TODO 这里需要修改，ishost要去掉，改成按主机和数据库都能取到，否则在Mysql数据库会出现没有IP
            oprtService.getIpListByIds({"instanceIds":idStr},function(ipList){
                for(var i = 0; i < datas.length; i++){
                    datas[i].ips = [];
                    for(var j = 0; j < ipList.length; j++){
                        if(datas[i].instanceId == ipList[j].sourceId){
                            datas[i].ips.push(ipList[j]);
                        }
                    }
                }
            });

            // var ipList = oprtService.getIpListByIds({"instanceIds":idStr});
            oprtService.getUserListByIds({"instanceIds":idStr},function(userList){
                for(var i = 0; i < datas.length; i++){
                    datas[i].user = [];
                    for(var j = 0; j < userList.length; j++){
                        if(datas[i].instanceId == userList[j].sourceId){
                            datas[i].user.push(userList[j]);
                        }
                    }
                }
                $scope.waitResourceList = datas;
                console.log("-----------waitResourceList----begin-----------------");
                console.log($scope.waitResourceList);
                console.log("-----------waitResourceList----end-----------------");
            });
        })
    }
    getResourceListByPage();

}])

