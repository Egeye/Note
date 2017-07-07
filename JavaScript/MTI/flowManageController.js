'use strict';
var common = require('common');
require('ngCommon');
require('angular-toastr');
require('angular-toastrWrapper');
require('angular-animate');

var flowAppControllers = angular.module('flowManageApp.controllers', ['toastr', 'ui.bootstrap','ui.grid','ui.grid.pagination','ngAnimate']);

//新增、修改操作
flowAppControllers.controller('editFlowCtrl', ['$scope','ngDialog','toastr','flowManageService','i18nService', '$interval','oprtManageService', 'oprtService', function ($scope,ngDialog,toastr,flowManageService,i18nService,$interval,oprtManageService, oprtService){
    i18nService.setCurrentLang('zh-cn');
    //操作名称
    $scope.flowName = "";
    //操作功能说明及风险提示
    $scope.remark = "";
    //鼠标选定菜单ID
    $scope.nodeId = "";
    //是否限定资源
    $scope.limitResource = false;

    /**********************节点任务相关start*********************/
    //task类型节点的任务类型，对应操作的moduleid
    $scope.taskType = "";
    //task类型节点的任务类型，对应操作的cfgid
    $scope.taskId = "";
    //task类型节点的任务类型，对应操作的headrevision
    $scope.taskHid = "";
    //task类型节点的任务类型，对应操作的oprtName
    $scope.taskName = "";
    /**********************节点任务相关end*********************/
    //分支条件的数组，key为分支存放的节点名，value为branches的数组集合
    $scope.branches = [];

    //页面状态 pageState 0:新增 1:编辑 2:执行 3:查看
    $scope.pageState = getQueryString("pageState");
    var cfgId = getQueryString("cfgId");
    var flag = "";
    var flowExecInstId = "";
    var headRevision = "";

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    if($scope.pageState == 2 || $scope.pageState == 3){
        if($scope.pageState == 3){
            flowExecInstId = getQueryString("flowExecInstId");
            headRevision = getQueryString("headRevision");
        }
    }else{
        if($scope.pageState == 0){
            flag = "0";
        }else{
            flag = "1";
        }
    }

    /*************************流程图部分start**********************************/
    //初始化jsplumb实例
    var instance = window.jsp = jsPlumb.getInstance({
            DragOptions : { cursor: "pointer", zIndex:2000 },
            ConnectionOverlays : [[ "Arrow", {location: 1, id:"arrow", length:10, width: 10} ]],
            Container:"flowContent"
        });
    var pstyle = {
            Connector : [ "Flowchart"],
            HoverPaintStyle : {strokeStyle:"#7073EB" }
        },
        connectorPaintStyle = {
            strokeWidth: 2,
            stroke: "#61B7CF",
            joinstyle: "round",
            outlineStroke: "white",
            outlineWidth: 2
        },
        connectorHoverStyle = {
            strokeWidth: 3,
            stroke: "#216477",
            outlineWidth: 5,
            outlineStroke: "white"
        },
        endpointHoverStyle = {
            fill: "#216477",
            stroke: "#216477"
        };

    instance.registerConnectionType("basic", pstyle);
    function renderConnect(newid,type){//渲染

        var sz = [];
        var k = "";
        //对类型进行判断;
        if(type==="start"){ //开始
            sz.push("RightMiddle,1,#FF8891");
        }else if(type==="task"){ //流程
            sz.push("LeftMiddle,1,#D4FFD6");
            sz.push("RightMiddle,1,#FF8891");
        }else if(type==="branch"){ //分支
            sz.push("LeftMiddle,1,#D4FFD6");
            sz.push("RightMiddle,-1,#FF8891");
        }else if(type==="converge"){ //汇聚
            sz.push("LeftMiddle,-1,#D4FFD6");
            sz.push("RightMiddle,1,#FF8891");
        }else{ //结束
            sz.push("LeftMiddle,-1,#D4FFD6");
        }
        instance.batch(function(){

            for(var i = 0;i<sz.length;i++){
                k = sz[i].split(",");
                if(k[2]==="#FF8891"){
                    instance.addEndpoint(newid, {
                        endpoint: "Dot",
                        paintStyle: { radius:3,fill: k[2],strokeWidth: 1 },
                        EndpointStyle : { radius:5, fillStyle:"#E8C870" },
                        EndpointHoverStyle : {fillStyle:"#7073EB" },
                        maxConnections:k[1],
                        isSource:true,
                        isTarget:false,
                        uuid:newid+k[0],
                        connector: [ "Flowchart"],
                        connectorStyle: connectorPaintStyle,
                        hoverPaintStyle: endpointHoverStyle,
                        connectorHoverStyle: connectorHoverStyle
                    },{
                        anchor:k[0]
                    });
                }else{
                    instance.addEndpoint(newid, {
                        endpoint: "Dot",
                        paintStyle: { radius:3,fill: k[2],strokeWidth: 1 },
                        EndpointStyle : { radius:5, fillStyle:"#E8C870" },
                        hoverPaintStyle: endpointHoverStyle,
                        maxConnections:k[1],
                        isSource:false,
                        isTarget:true,
                        uuid:newid+k[0],
                    },{
                        anchor:k[0]
                    });
                }
            }

        });
        if($scope.pageState != "2" && $scope.pageState != "3"){
            bindConvert(newid);
            instance.draggable(newid);
        }
    }

    //切换任务文字的展示状态和输入状态
    function bindConvert(id){
        var obj = $("#"+id).children().last();
        var tagName = obj.prop("tagName");
        if(tagName=="TEXTAREA"){
            $("#"+id).children().last().bind('blur', function() {
                var p = $(this).val();
                $(this).parent().append("<span class='flowShowText' title = "+p+">"+p+"</span>");
                $(this).remove();
                bindConvert(id);
            });
        }else{
            $("#"+id).children().last().bind('click', function() {
                var p = $(this).text();
                $(this).parent().append("<textarea class='flowEditText' title = "+p+" onChange = '$(this).attr('title',$(this).val())'>"+p+"</textarea>");
                $(this).remove();
                obj.focus();
                bindConvert(id);
            });
        }
    }
    //拖动创建元素
    $("#lefticon div[class^='flow-event-content']").draggable({
        helper: 'clone',
        scope: 'flow'
    });
    $('#flowContent').droppable({
        scope: 'flow',
        drop: function(event, ui){
            //获取基本元素与参数
            var $this = $(this),
                dragui = ui.draggable,
                fatop = parseInt($this.offset().top),
                faleft = parseInt($this.offset().left),
                uitop = parseInt(ui.offset.top),
                uileft = parseInt(ui.offset.left),
                uid = dragui.attr('icontype'),
                spantxt = dragui.find("span").text(),
                alluid = $("#flowContent").children('div.' + uid);

            //ID计算
            var allicon = alluid.length,
                idnum = 0,
                idArr  = new Array;
            alluid.each(function(i) {
                idArr.push(parseInt($(this).attr('id').split('_')[1]));
            });
            idArr.sort(function(a,b){return a>b?1:-1});
            for(var i = 0; i < allicon; i++){
                var idArrOne = parseInt(idArr[i]);
                if(i != idArrOne){
                    idnum = idArrOne - 1;
                    break;
                }else{
                    idnum = allicon;
                }
            }

            //根据选择元素判断插入元素
            var newstyle = 'left:' + (uileft - faleft) + 'px;top:' + (uitop - fatop) + 'px',
                newid = uid + '_' + idnum,str,addStr = '';

            if(spantxt.indexOf("SQL")>=0){
                $scope.taskType = "1"
                addStr = '<article class="tipsimgsql"></article>';
            }else if(spantxt.indexOf("Shell")>=0){
                $scope.taskType = "2";
                addStr = '<article class="tipsimgshell"></article>';
            }else if(spantxt.indexOf("文件")>=0){
                $scope.taskType = "3";
                addStr = '<article class="tipsimgftp"></article>';
            }

            str = '<div class='+uid+' id='+newid+' style='+newstyle+' taskType='+$scope.taskType+'>' +
                    addStr +
                  '<textarea class="flowEditText" placeholder="请输入环节名称" onChange = "$(this).attr("title",$(this).val())"></textarea></div>';

            $this.append(str);
            renderConnect(newid,uid);
            instance.revalidate(newid);
            $("#" + newid).draggable({
                start: function() {
                    $(".hoverMenu").hide();
                },
                containment: "parent"
            });
        }
    });
    $(document).on('mouseleave', '.hoverMenu ', function(){
        $(".hoverMenu").hide();
    });

    $(document).on('mouseenter', '#flowContent div', function(){

        var $this = $(this),
            cls = $this.attr('class').split(" ")[0],
            idStr = $this.attr('id'),oLeft,oTop;

        if(idStr){
            if(cls=="branch"){
                oLeft = parseInt($this.css('left'))+10
                oTop = parseInt($this.css('top'))+80;
            }else{
                oLeft = parseInt($this.css('left'))
                oTop = parseInt($this.css('top'))+60;
            }
            if($scope.pageState=="2"||$scope.pageState=="3"){
                oLeft = parseInt(oLeft);
            }
            $scope.nodeId = idStr;
            if(idStr.indexOf("task")>=0){
                $scope.taskId = $this.attr('taskId');
                $scope.taskHid = $this.attr('taskHid');
                $scope.taskName = $this.attr('taskName');
                $scope.taskType = $this.attr('taskType');
            }

            if($scope.pageState=="0"||$scope.pageState=="1"){ //页面处于新增修改状态
                if(cls=="task"){
                    //存在流程
                    if($("#"+idStr).attr("taskId")){
                        $(".hoverMenu img:eq(0)").attr("title","选择操作").show();
                        $(".hoverMenu img:eq(1)").attr("title","修改操作").show();
                        $(".hoverMenu img:eq(2)").hide();
                        $(".hoverMenu img:eq(3)").hide();
                        $(".hoverMenu img:eq(4)").show();
                        $(".hoverMenu img").css("margin-left","10px");
                    }else{
                        $(".hoverMenu img:eq(0)").attr("title","选择操作").show();
                        $(".hoverMenu img:eq(1)").hide();
                        $(".hoverMenu img:eq(2)").attr("title","新增操作").show();
                        $(".hoverMenu img:eq(3)").hide();
                        $(".hoverMenu img:eq(4)").show();
                        $(".hoverMenu img").css("margin-left","10px");
                    }
                }else if(cls=="branch"){
                    var flag = false;
                    var sourceNode = instance.getConnections({target:idStr}, true);
                    var targetNode = instance.getConnections({source:idStr}, true);
                    if(sourceNode.length) {
                        var sourceNodeId = sourceNode[0].sourceId;
                        for(var i = 0;i<$scope.branches.length;i++){
                            if($scope.branches[i].node_Id==sourceNodeId){
                                flag = true;
                                break;
                            }
                        }
                    }
                    if(flag){
                        $(".hoverMenu img:eq(0)").hide();
                        $(".hoverMenu img:eq(1)").attr("title","修改条件").show();
                        $(".hoverMenu img:eq(2)").hide();
                        $(".hoverMenu img:eq(3)").hide();
                        $(".hoverMenu img:eq(4)").show();
                        $(".hoverMenu img").css("margin-left","15px");
                    }else{
                        if(targetNode.length==0){
                            $(".hoverMenu img:eq(0)").hide();
                            $(".hoverMenu img:eq(1)").hide();
                            $(".hoverMenu img:eq(2)").hide();
                            $(".hoverMenu img:eq(3)").hide();
                            $(".hoverMenu img:eq(4)").show();
                            $(".hoverMenu img").css("margin-left","35px");
                        }else{
                            $(".hoverMenu img:eq(0)").hide();
                            $(".hoverMenu img:eq(1)").hide();
                            $(".hoverMenu img:eq(2)").attr("title","新增条件").show();
                            $(".hoverMenu img:eq(3)").hide();
                            $(".hoverMenu img:eq(4)").show();
                            $(".hoverMenu img").css("margin-left","15px");
                        }
                    }
                }else{
                    $(".hoverMenu img:eq(0)").hide();
                    $(".hoverMenu img:eq(1)").hide();
                    $(".hoverMenu img:eq(2)").hide();
                    $(".hoverMenu img:eq(3)").hide();
                    $(".hoverMenu img:eq(4)").show();
                    $(".hoverMenu img").css("margin-left","40px");
                }
            }else if($scope.pageState=="2"){ //页面处于查看状态
                if(cls=="task"){
                    $(".hoverMenu img:eq(0)").hide();
                    $(".hoverMenu img:eq(1)").attr("title","输入参数").show();
                    $(".hoverMenu img:eq(2)").hide();
                    $(".hoverMenu img:eq(3)").hide();
                    $(".hoverMenu img:eq(4)").hide();
                    $(".hoverMenu img").css("margin-left","40px");
                }else if(cls=="branch"){
                    $(".hoverMenu img:eq(0)").hide();
                    $(".hoverMenu img:eq(1)").hide();
                    $(".hoverMenu img:eq(2)").hide();
                    $(".hoverMenu img:eq(3)").attr("title","查看条件").show();
                    $(".hoverMenu img:eq(4)").hide();
                    $(".hoverMenu img").css("margin-left","35px");
                }else{
                    $(".hoverMenu img:eq(0)").hide();
                    $(".hoverMenu img:eq(1)").hide();
                    $(".hoverMenu img:eq(2)").hide();
                    $(".hoverMenu img:eq(3)").hide();
                    $(".hoverMenu img:eq(4)").hide();
                }

            }else{ //页面处于执行中状态
                if(cls=="task"){
                    $(".hoverMenu img:eq(0)").hide();
                    $(".hoverMenu img:eq(1)").hide();
                    $(".hoverMenu img:eq(2)").hide();
                    $(".hoverMenu img:eq(3)").attr("title","执行情况").show();
                    $(".hoverMenu img:eq(4)").hide();
                    $(".hoverMenu img").css("margin-left","40px");
                }else if(cls=="branch"){
                    $(".hoverMenu img:eq(0)").hide();
                    $(".hoverMenu img:eq(1)").hide();
                    $(".hoverMenu img:eq(2)").hide();
                    $(".hoverMenu img:eq(3)").attr("title","查看条件").show();
                    $(".hoverMenu img:eq(4)").hide();
                    $(".hoverMenu img").css("margin-left","40px");
                }else{
                    $(".hoverMenu img:eq(0)").hide();
                    $(".hoverMenu img:eq(1)").hide();
                    $(".hoverMenu img:eq(2)").hide();
                    $(".hoverMenu img:eq(3)").hide();
                    $(".hoverMenu img:eq(4)").hide();
                }
            }

            $(".hoverMenu").css({"left": oLeft, "top" : oTop, "height": "31px", zIndex : 2999}).show();
        }
    });

    instance.bind("connectionDragStop", function(info) {//点击连接线、overlay、label提示删除连线 + 不能以自己作为目标元素
        if(info.sourceId == info.targetId){
            toastr.info('不能以自己作为目标元素');
            instance.deleteConnection(info);
        }
        if($("#"+info.sourceId).attr("id").indexOf("start")>=0&&$("#"+info.targetId).attr("id").indexOf("task")<0){
            toastr.info('开始节点必须连接一个任务节点！');
            instance.deleteConnection(info);
        }
        if($("#"+info.sourceId).attr("id").indexOf("branch")>=0&&$("#"+info.targetId).attr("id").indexOf("task")<0){
            toastr.info('分支节点后必须连接任务节点！');
            instance.deleteConnection(info);
        }
        if($("#"+info.sourceId).attr("id").indexOf("converge")<0&&$("#"+info.targetId).attr("branch").indexOf("task")>=0){
            toastr.info('汇聚节点后不能连接分支节点！');
            instance.deleteConnection(info);
        }

    });

    if($scope.pageState=="0"||$scope.pageState=="1"){
        //单击连线提示是否删除
        instance.bind("click",function(info) {
            ngDialog.open({
                template: '/app/oprt/views/confirmTip.html',
                showClose : false,
                className: 'ngdialog-theme-default delete-dialog-width',
                scope : $scope,
                controller: ['$scope', function($scope) {
                    $scope.message = '是否删除此条连线？';
                    $scope.accept = function(){
                        instance.deleteConnection(info);
                        this.closeThisDialog();
                    }
                    $scope.decline = function(){
                        var self = this;
                        self.closeThisDialog();
                    }

                }],
            }).closePromise.then(function(){});
        })
    }

    /*************************流程图部分end**********************************/

    //如果不为新增页面，从数据库读取流程图
    if($scope.pageState != 0){
        flowManageService.getFlowCfgInfo({"cfgId":cfgId},function(data){
            $scope.headRevision = data.headRevision;
            $scope.flowName = data.flowName;
            var str = data.flowContent;
            var arr = [];
            var ele = [];
            var htmlText = "";

            $(str).find("sequenceFlow").each(function() {
                var field = $(this);
                var sourceRef = field.attr("sourceRef");//读取子节点的值
                var targetRef = field.attr("targetRef");//读取子节点的值
                arr.push({
                    sourceRef: sourceRef,
                    targetRef : targetRef,
                });
            });
            $(str).find("bpmndi\\:BPMNShape").each(function() {
                var field = $(this);
                var id = field.attr("bpmnElement");//读取子节点的值
                var x = field.children("omgdc\\:Bounds").attr("x");//读取子节点的值
                var y = field.children("omgdc\\:Bounds").attr("y");//读取子节点的值
                var name = field.attr("id").substring(field.attr("id").indexOf("_")+1,field.attr("id").length);
                var docData = ""; //记录节点附带的操作

                //说明存在task任务
                if(id.indexOf( "task")>=0){
                    $(str).find("userTask").each(function() {
                        //如果id匹配，取得数据
                        if($(this).attr("id")===id){
                            docData = $(this).children("documentation").text();
                        };
                    });
                }
                ele.push({
                    id: id,
                    name : name,
                    x : x,
                    y : y,
                    doc : docData
                });
            });
            for( var i in ele){
                var eleStyle = 'left:'+ele[i].x+'px;top:'+ele[i].y+'px;',
                    eleId = ele[i].id,
                    eleName = ele[i].name,
                    eleClass = ele[i].id.split("_")[0],
                    eleContent = ele[i].doc,
                    taskType = "",taskId = "",taskHid = "",taskName = "",addStr = "";
                //开始解析json数据
                if(eleContent){
                    eleContent = JSON.parse(eleContent);
                    taskType = eleContent.taskType;
                    taskId = eleContent.cfgId;
                    taskHid = eleContent.headRevision;
                    taskName = eleContent.taskName;
                    if(eleContent.branches){
                        $scope.branches.push({
                            "node_Id":eleId,
                            "branches":eleContent.branches
                        });
                    }
                }
                // 获取右边弹出面板所需数据
                $scope.linkListName.push({"id": eleId,
                                    "name": eleName,
                                    "taskType": taskType,
                                    "taskId": taskId,
                                    "taskHid": taskHid,
                                    "taskName": taskName});

                if(taskType=="1"){
                    addStr = '<article class="tipsimgsql"></article>';
                }else if(taskType=="2"){
                    addStr = '<article class="tipsimgshell"></article>';
                }else if(taskType=="3"){
                    addStr = '<article class="tipsimgftp"></article>';
                }

                htmlText = '<div class='+eleClass+' id='+eleId+' style='+eleStyle+' taskType='+taskType+' taskId='+taskId+' taskHid='+taskHid+' taskName='+taskName+'>' +
                            addStr+
                            '<span class="flowShowText" title = '+eleName+'>'+eleName+'</span>' +
                            '</div>';


                $("#flowContent").append(htmlText);
                renderConnect(eleId,eleClass);

                instance.revalidate(eleId);
                //如果为修改页面，设置为可拖动状态
                if($scope.pageState == 1){
                    $("#" + eleId).draggable({
                        start: function() {
                            $(".hoverMenu").hide();
                        },
                        containment: "parent"
                    });
                }
            };
            var isEditable = false;
            if($scope.pageState=="1"){
                isEditable = true;
            }
            for( var i in arr){
                instance.connect({uuids: [arr[i].sourceRef+"RightMiddle", arr[i].targetRef+"LeftMiddle"], editable: isEditable});
            };
            //如果为执行页面，调用获取操作方法
            if($scope.pageState == 2){
                getAllOprt();
            }
            //如果为查看页面，调用获取流程当前节点及执行记录方法
            if($scope.pageState == 3){
                getAllOprt();
                $scope.isEnded = false;
                //查看页面状态的定时器
                $scope.statusTimer = $interval(function(){
                    queryFlowInstStatus();
                } ,2000);
            }
        });
    }
    $scope.$on('destroy',function(){
        $interval.cancel($scope.statusTimer);
    })


    //新增操作
    $scope.addNode = function(){
        //新增流程分支
        if($scope.nodeId.indexOf("branch")>=0){
            var arr = [];
            var scriptsList = [];
            //获取分支节点之前的节点ID
            var sourceNode = instance.getConnections({target:$scope.nodeId}, true);
            if(sourceNode.length){
                //根据节点ID获取
                var sourceNodeId = sourceNode[0].sourceId;
                var sourceTaskId = $("#"+sourceNode[0].sourceId).attr("taskId");
                var curConditions = [];
                if(!sourceTaskId){
                    toastr.info("该分支节点任务前节点未选择操作，请检查！");
                    return false;
                }else{
                    //将操作的ID用于查询已保存的条件集合
                    for(var i = 0;i<$scope.branches.length;i++){
                        if($scope.branches[i].node_Id==sourceNodeId){
                            curConditions = $scope.branches[i].branches;
                            break;
                        }
                    }
                }
                oprtManageService.getOprtCfgInfo({"cfgId":sourceTaskId},function(datas){
                    if(datas.oprtScriptList != []) {
                        for (var i = 0; i < datas.oprtScriptList.length; i++) {
                            var moduleName = "";
                            switch (datas.oprtScriptList[i].scriptType) {
                                case "1":
                                    moduleName = "SHELL";
                                    break;
                                case "6":
                                    moduleName = "FTP";
                                    break;
                                default:
                                    moduleName = "SQL";
                            }
                            scriptsList.push({"oprtId":""+datas.oprtScriptList[i].scriptId+"","oprtName":datas.oprtScriptList[i].scriptName, "moduleName": moduleName});
                        }
                        //完成scriptList,获取分支节点之后的节点ID集合
                        var targetNodes = instance.getConnections({source:$scope.nodeId}, true);
                        if(targetNodes.length){
                            for(var i = 0;i<targetNodes.length;i++){
                                //获取节点的ID
                                var targetNodeId = targetNodes[i].targetId;
                                //标志是否已经添加存在的元素
                                var addFlag = false;
                                //根据此ID遍历已保存的条件，如果存在，赋值，不存在，新增
                                for(var k = 0;k<curConditions.length;k++){
                                    if(targetNodeId==curConditions[k].task_id){
                                        arr.push({"taskId": targetNodeId,"taskName":$("#"+targetNodeId).children('textarea').val() || $("#"+targetNodeId).children('span').text(),"btnName":"清除全部","hasCreated":true,"res_flag":curConditions[k].res_flag,"default_flag":curConditions[k].default_flag,"cons_flag":curConditions[k].cons_flag,"conditions":curConditions[k].conditions, "conId": targetNodeId+'cid'});
                                        addFlag = true;
                                        break;
                                    }
                                }
                                if(!addFlag){
                                    arr.push({"taskId": targetNodeId,"taskName":$("#"+targetNodeId).children('textarea').val() || $("#"+targetNodeId).children('span').text(),"btnName":"新建","hasCreated":false,"res_flag":"0","default_flag":"0","cons_flag":"0","conditions":[], "conId": targetNodeId+'cid'});
                                }
                            }
                            openBranchWin(arr,scriptsList,sourceNodeId,1);
                        }else{
                            toastr.info("该分支节点后未连接任务节点，请检查！");
                            return false;
                        }
                    }
                });
            }else{
                toastr.info("该分支节点前未连接节点，请检查！");
                return false;
            }
            //新增对应操作
        }else if($scope.nodeId.indexOf("task")>=0){
            window.open("/oprt/oprtManage?pageState=0&moduleId="+$scope.taskType+"&headRevision=-1&cfgId=-1&status=1");

        }

    }
    //操作页面传送数据到流程页面
    $scope.bindNode = function(task,status){
        task = JSON.parse(task);
        $("#"+$scope.nodeId).attr("taskType",task.taskType);
        $("#"+$scope.nodeId).attr("taskId",task.taskId);
        $("#"+$scope.nodeId).attr("taskHid",task.taskHid);
        $("#"+$scope.nodeId).attr("taskName",task.taskName);
        if(status=="1"){
            ngDialog.open({
                template: '/app/oprt/views/confirmTip.html',
                showClose : false,
                className: 'ngdialog-theme-default delete-dialog-width',
                scope : $scope,
                controller: ['$scope', function($scope) {
                    $scope.message = '是否把操作保存到操作管理列表中？';
                    $scope.accept = function(){
                        this.closeThisDialog();
                    }
                    $scope.decline = function(){
                        var self = this;
                        oprtManageService.updateOprt({"cfgId":task.taskId},function(){
                            self.closeThisDialog();
                        });
                    }

                }],
            }).closePromise.then(function(){});
        }
   }

    $scope.bindNodeOprt = function(cfgInfoMap,nodeId){
        console.log("----------------bindNodeOprt----$scope.nodeId-----------------",nodeId);
        cfgInfoMap = JSON.parse(cfgInfoMap);
        $scope.scriptList[nodeId]=cfgInfoMap;
        console.log("----------------bindNodeOprt-----cfgInfoMap----------------",cfgInfoMap);
        console.log("----------------bindNodeOprt---------------------",$scope.scriptList[nodeId]);
        console.log("----------------bindNodeOprt-----$scope.scriptList----------------",$scope.scriptList);
        $scope.$apply();
    };
    $scope.bindHasExcuManualList = function(list){
        console.log('or - $scope.hasExcuManualInstId -',$scope.hasExcuManualInstId);
        $scope.hasExcuManualInstId = JSON.parse(list);
    };
    $scope.$on('bindNodeOprt', function(event,data) {
        console.log(data);
    });

    //打开分支条件页面
    function openBranchWin(arr,scriptsList,sourceNodeId,status){
        console.log('or');
        ngDialog.open({
            template: '/app/oprt/views/addBranch.html',
            showClose : false,
            className: 'ngdialog-theme-default condition-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                $scope.RangeNames = [{"Id":"0","Name":"任何"},{"Id":"1","Name":"全部"}];
                $scope.ConditionNames = [{"Id":"0","Name":"包含"},{"Id":"1","Name":"等于"},{"Id":"2","Name":"大于"},{"Id":"3","Name":"大于等于"},{"Id":"4","Name":"小于"},{"Id":"5","Name":"小于等于"},{"Id":"6","Name":"不等于"}]
                //连接的任务数
                $scope.branches = angular.copy(arr);
                $scope.scriptsList = angular.copy(scriptsList);
                $scope.status = status;
                $scope.isDisabled = false;
                if(status==0){
                    $scope.isDisabled = true;
                }
                // 新建/清除全部
                $scope.createCondition = function (taskId) {
                    var branches = $scope.branches;
                    //循环遍历节点，给选定的list加上condition
                    for(var i = 0;i<branches.length;i++){
                        if(branches[i].taskId==taskId){
                            if(branches[i].conditions.length==0){//说明不存在条件，新增
                                branches[i].btnName="清除全部";
                                branches[i].hasCreated=true;
                                branches[i].conditions.push({"script_id":"","check_flag":"0","check_value":""});
                            }else{
                                branches[i].btnName="新建";
                                branches[i].hasCreated=false;
                                branches[i].conditions.splice(0,branches[i].conditions.length);
                            }
                        }
                    }
                };
                //+添加按钮
                $scope.addCondition = function (taskId) {
                    var branches = $scope.branches;
                    //循环遍历节点，给选定的list加上condition
                    for(var i = 0;i<branches.length;i++){
                        if(branches[i].taskId==taskId){
                            branches[i].conditions.push({"script_id":"","check_flag":"0","check_value":""});
                        }
                    }
                };
                // X删除按钮
                $scope.delCondition = function (taskId,index) {
                    var branches = $scope.branches;
                    for(var i = 0;i<branches.length;i++){
                        if(branches[i].taskId==taskId){
                            branches[i].conditions.splice($.inArray(index, branches[i].conditions), 1);
                        }
                        if(branches[i].conditions.length==0){
                            branches[i].btnName="新建";
                            branches[i].hasCreated=false;
                            branches[i].conditions.splice(0,branches[i].conditions.length);
                        }
                    }
                };
                //分支条件设置选择事件
                $scope.change = function (obj,key,val){
                        obj[key] = val;
                }
                $scope.saveConditions = function () {
                    //$scope.$parent.branches.splice(0,$scope.$parent.branches.length);
                    var saveBranches = [];

                    var noConditions = false;
                    if ($scope.branches) {
                        for (var i in $scope.branches) {
                            if ($scope.branches[i].conditions.length === 0) {
                                noConditions = true;
                            }
                            if ($scope.branches[i].btnName === "清除全部") {
                                saveBranches.push({
                                    "task_id": $scope.branches[i].taskId,
                                    "res_flag": $scope.branches[i].res_flag,
                                    "default_flag": $scope.branches[i].default_flag,
                                    "cons_flag": $scope.branches[i].cons_flag,
                                    "conditions": $scope.branches[i].conditions
                                });
                            }
                        }
                    }
                    var isEmpty = false;
                    for (var sIndex = 0; sIndex < saveBranches.length; sIndex++) {
                        var sData = saveBranches[sIndex].conditions;
                        for (var sdIndex = 0; sdIndex < sData.length; sdIndex++) {
                            var sdConditions = sData[sdIndex];
                            if (sdConditions.check_value === "" || sdConditions.script_id === "") {
                                isEmpty = true;
                            }
                        }
                    }
                    if (isEmpty || noConditions) {
                        toastr.info("请加条件！");
                        return;
                    }
                    // $scope.$parent.branches.splice(0,$scope.$parent.branches.length);//首先清空外部数组
                    for(var i = 0;i<$scope.$parent.branches.length;i++){
                        var branch = $scope.$parent.branches[i];
                        if(branch.node_Id == sourceNodeId){
                            $scope.$parent.branches.splice(i,1);
                            break;
                        }
                    }
                    $scope.$parent.branches.push({
                        "node_Id":sourceNodeId,
                        "branches":saveBranches
                    });
                    this.closeThisDialog();
                };

                $scope.showConDetailObj = {};
                $scope.showConDetail = function (bc) {
                    console.log('or -bc', bc);
                    if($scope.showConDetailObj[bc.conId]) delete $scope.showConDetailObj[bc.conId];
                    else $scope.showConDetailObj[bc.conId] = bc.conId;
                    $("#" + bc.conId).slideToggle('normal',function(){});
                };
            }]
        }).closePromise.then(function(){});

    }
    //获取节点对应的全部操作
    function getAllOprt(){
        $scope.scriptList = {};
        var nodeMap = {};
        var length = 0;
        var resMap = {};
        //首先遍历，获取全部节点
        $("#flowContent").children("div .task").each(function (idx, elem) {
            var $elem = $(elem),key=$elem.attr('id'),value=$elem.attr('taskid');
            if(key&&value){
                nodeMap[key] = value;
                length++;
            }
        });
        var oprtIdListStr = JSON.stringify(nodeMap);
        flowManageService.getFlowAllOprtCfgs({"oprtIdListStr":oprtIdListStr},function(data){
            for(var key in data){
                if(length==0){
                    break;
                }

                if (key.indexOf('task') < 0) {
                    continue;
                }
                resMap[key] = data[key];
                resMap[key].oprtExcuType = "0";
                resMap[key].nodeId = key + 'Id';
                resMap[key].resoId = key + 'rd';

                $scope.linkListName.map(function (lln) {
                    if (lln.id === key) {
                        resMap[key].nodeName = lln.name;
                    }
                });

                // var linkObj = angular.copy(data[key]);
                // linkObj.id = key;
                // $scope.linkListData.push(linkObj);

                length--;
            }
            $scope.scriptList = resMap;
        });

    }
    $scope.manualList = [];
    //获取当前流程执行状况及历史轨迹
    function queryFlowInstStatus(){
        if(flowExecInstId==""||headRevision==""){
            $interval.cancel($scope.statusTimer);
            return;
        }
        var queryFlowStr = {};
        queryFlowStr.inst_id = flowExecInstId;
        queryFlowStr.headRevision = headRevision;
        queryFlowStr = JSON.stringify(queryFlowStr);
        //$interval.cancel($scope.statusTimer);
        flowManageService.queryFlowInstStatus({"queryFlowStr":queryFlowStr},function(data){
            console.info(data);
            //定义线段颜色
            var newStyle = {
                strokeWidth: 2,
                stroke: "#FF9393",
                joinstyle: "round",
                outlineStroke: "white",
                outlineWidth: 2
            },newHoverStyle= {},newEndpointHoverStyle = {};
            //设置Z-INDEX属性
            $(".jtk-connector").css("z-index",1999);
            $(".jtk-endpoint").css("z-index",999);
            $(".jtk-overlay").css("z-index",2999);
            $(".jtk-hover").css("z-index",4999);
            if(data.result="true"){
                var currentTasks = data.currentTasks;
                var historyTasks = data.historyTasks;
                if(data.processEndFlag=="0"){ //执行中
                    //首先获取当前节点信息
                    for(var i = 0;i<currentTasks.length;i++){
                        var currentTask = currentTasks[i];

                        //拼接展示执行结果字符串
                        var showStr = "";
                        if(currentTask.errorNum>0){
                            showStr  = '<span>'+currentTask.errorNum+'个资源执行异常</span>';
                        }
                        if(currentTask.manualNum>0){
                            showStr  = '<span>'+currentTask.manualNum+'个资源等待介入</span>';
                        }
                        if(currentTask.errorNum>0&&currentTask.manualNum>0){
                            var showStr  = '<span>'+currentTask.errorNum+'个资源执行异常</span><br/>'+
                                            '<span>'+currentTask.manualNum+'个资源等待介入</span>';

                        }


                        //将对话框放到指定节点上
                        var oLeft = parseInt($("#"+currentTask.nodeId).css('left'))-10,
                            oTop = parseInt($("#"+currentTask.nodeId).css('top'))-40;
                        $(".bubble").css({"margin-left": oLeft, "top" : oTop, zIndex : 3999});
                        $(".spinner").css({"margin-left": oLeft+60, "top" : oTop+110, zIndex : 4999}).show();

                        if(showStr!=""){
                            $(".bubble span").html(showStr);
                            $(".bubble").show();
                            $(".tipsarrow").show();
                        }else{
                            $(".bubble").hide();
                            $(".tipsarrow").hide();
                            $scope.isEnded = false;
                        }

                        //循环拼接人工介入实例字符串
                        $scope.manualList = currentTask.manual_params_list;
                        // for(var k = 0;k<currentTask.manual_params_list.length;k++){
                        //     $scope.manualList.push({
                        //           manualInstId:currentTask.manual_params_list[k].manualInstId,
                        //             flowInstId:currentTask.manual_params_list[k].flowInstId,
                        //             oprtInstId:currentTask.manual_params_list[k].oprtInstId,
                        //                 taskId:currentTask.manual_params_list[k].taskId,
                        //          accontInstId:currentTask.manual_params_list[k].accontInstId,
                        //               scriptId:currentTask.manual_params_list[k].scriptId,
                        //         excuOprtObjStr:""
                        //     });
                        // }
                    }
                    //遍历历史节点，画连线
                    for(var i = 0;i<historyTasks.length;i++) {
                        if ($("#" + historyTasks[i].nodeId)) {
                            var sConnection = instance.getConnections({target: $("#" + historyTasks[i].nodeId)}, true);
                            var eConnection = instance.getConnections({source: $("#" + historyTasks[i].nodeId)}, true);
                            if (sConnection.length > 0) {
                                sConnection[0].setPaintStyle(newStyle, false);
                                sConnection[0].setHoverPaintStyle(newHoverStyle, false);
                                sConnection[0].setHoverPaintStyle(newEndpointHoverStyle, false);
                                sConnection[0].canvas.attributes.style.value += ";z-index:3000 !important;";
                            }
                            if (eConnection.length > 0) {
                                eConnection[0].setPaintStyle(newStyle, false);
                                eConnection[0].setHoverPaintStyle(newHoverStyle, false);
                                eConnection[0].setHoverPaintStyle(newEndpointHoverStyle, false);
                                eConnection[0].canvas.attributes.style.value += ";z-index:3000 !important;";
                            }
                        }
                    }
                    //遍历当前节点，画连线
                    for(var i = 0;i<currentTasks.length;i++) {
                        if ($("#" + currentTasks[i].nodeId)) {
                            var sConnection = instance.getConnections({target: $("#" + currentTask.nodeId)}, true);
                            if (sConnection.length > 0) {
                                sConnection[0].setPaintStyle(newStyle, false);
                                sConnection[0].setHoverPaintStyle(newHoverStyle, false);
                                sConnection[0].setHoverPaintStyle(newEndpointHoverStyle, false);
                                sConnection[0].canvas.attributes.style.value += ";z-index:3000 !important;";
                            }
                        }
                    }

                }else{  //执行结束,直接显示历史轨迹
                    $scope.isEnded = true;
                    //遍历历史节点，画连线
                    for(var i = 0;i<historyTasks.length;i++) {
                        if ($("#" + historyTasks[i].nodeId)) {
                            var sConnection = instance.getConnections({target: $("#" + historyTasks[i].nodeId)}, true);
                            var eConnection = instance.getConnections({source: $("#" + historyTasks[i].nodeId)}, true);
                            if (sConnection.length > 0) {
                                sConnection[0].setPaintStyle(newStyle, false);
                                sConnection[0].setHoverPaintStyle(newHoverStyle, false);
                                sConnection[0].setHoverPaintStyle(newEndpointHoverStyle, false);
                                sConnection[0].canvas.attributes.style.value += ";z-index:3000 !important;";
                            }
                            if (eConnection.length > 0) {
                                eConnection[0].setPaintStyle(newStyle, false);
                                eConnection[0].setHoverPaintStyle(newHoverStyle, false);
                                eConnection[0].setHoverPaintStyle(newEndpointHoverStyle, false);
                                eConnection[0].canvas.attributes.style.value += ";z-index:3000 !important;";
                            }
                        }
                    }
                    //结束定时请求控制器
                    $(".spinner").hide();
                    $interval.cancel($scope.statusTimer);
                }
            }else{
                toastr.info("获取流程执行状态失败！");
                console.info(data.reason);
            }
        });
    }

    //删除环节
    $scope.deleteNode = function(){
        ngDialog.open({
            template: '/app/oprt/views/deleteTip.html',
            showClose : false,
            className: 'ngdialog-theme-default delete-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                $scope.message = '确认删除此环节及其连线？';
                $scope.delete = function(){
                    var self = this;
                    //如果是任务环节，删除scope中存储的分支任务信息
                    if($scope.nodeId.indexOf("task")>=0){
                        for(var i = 0;i<$scope.branches.length;i++) {
                            var branch = $scope.branches[i].branches;
                            for(var k = 0;k<branch.length;k++){
                                //说明存在绑定节点
                                if($scope.nodeId== branch[k].task_id){
                                    branch.splice(k,1);
                                }
                            }
                        }
                    }
                    //如果是分支环节，删除scope中存储的分支信息
                    //TODO 首先获取分支前的连线ID，进行比对删除即可。
                    var connection = instance.getConnections({target:$scope.nodeId}, true);
                    if($scope.nodeId.indexOf("branch")>=0){
                        if(connection.length>0){
                            var sourceId = connection[0].sourceId;
                            for(var i = 0;i<$scope.branches.length;i++) {
                                var branchId = $scope.branches[i].node_Id;
                                if(sourceId=branchId){
                                    $scope.branches.splice(i,1);
                                    break;
                                }
                            }
                        }
                    }
                    instance.removeAllEndpoints($scope.nodeId);
                    instance.remove($scope.nodeId);
                    self.closeThisDialog();
                    //console.info($scope.branches);
                }
            }],
        }).closePromise.then(function(){});
    }

    //输入参数
    $scope.insertParam = function(){
        if($scope.nodeId.indexOf("branch")>=0){
            getBranchData();
        }else {
            var cfgId = $("#" + $scope.nodeId).attr("taskId");
            var moduleId = $("#" + $scope.nodeId).attr("taskType");

            if ($scope.pageState == "0" || $scope.pageState == "1") {
                window.open("/oprt/oprtManage?pageState=1&status=0&moduleId=" + moduleId + "&cfgId=" + cfgId);
            } else {
                // window.open("/oprt/oprtManage?pageState=2&moduleId="+$scope.taskType+"&cfgInfoMap={}"+"&status=1");
                console.log("or ---------输入参数id------ $scope.nodeId", $scope.nodeId);
                console.log("or ---------输入参数------ $scope.scriptList", $scope.scriptList);
                console.log("or ---------输入参数[$scope.nodeId]------ $scope.scriptList", $scope.scriptList[$scope.nodeId]);
                var objscript=JSON.stringify($scope.scriptList[$scope.nodeId]);
                sessionStorage.setItem("cfgInfoMap",objscript);
                sessionStorage.setItem("nodeId",$scope.nodeId);
                sessionStorage.setItem("moduleId",$scope.taskType);
                sessionStorage.setItem("status","1");
                console.log("or ---------输入参数------ sessionStorage", sessionStorage);
                window.open("/oprt/oprtManage?pageState=2&moduleId="+$scope.taskType+"&nodeId="+$scope.nodeId+"&status=1");
            }
        }
    }

    //选择对应操作
    $scope.selectNode = function(){

        var type = $scope.taskType;
        ngDialog.open({
            template: '/app/oprt/views/chooseOprt.html',
            showClose : false,
            className: 'ngdialog-theme-default update-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                $scope.oprtDatas = [];
                $scope.solrSearch = {};
                $scope.searchOprt = function(e) {
                    //循环结果集，根据条件筛选
                    var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    if (keycode == 13) {

                        for (var i = 0; i < $scope.oprtDatas.length; i++) {
                            if ($scope.oprtDatas[i].creator.indexOf($scope.solrSearch.searchTxt) >= 0 ||
                                $scope.oprtDatas[i].oprtName.indexOf($scope.solrSearch.searchTxt) >= 0) {
                                $scope.oprtDatas[i].isShow = "1";
                            }else{
                                $scope.oprtDatas[i].isShow = "0";
                            }
                        }
                    }
                }
                var params = {
                    type:type,
                    page:0,
                    size:100
                };
                $scope.isShowLoading = true;
                angular.element(document).ready(function() {
                    oprtManageService.getOprtCfgListByPage(params, function(rs) {
                        $scope.oprtDatas = rs.content;
                        for(var i = 0;i<$scope.oprtDatas.length;i++){
                            $scope.oprtDatas[i].isShow = "1";
                        }
                        $scope.isShowLoading = false;
                        console.info($scope.oprtDatas);
                    });
                });

                $scope.getOprt = function(cfgId,head,moduleId,taskName){
                    //task类型节点的末班ID,对应操作的moduleId
                    $scope.taskType = moduleId;
                    //task类型节点的任务类型，对应操作的cfgid
                    $scope.taskId = cfgId;
                    //task类型节点的任务类型，对应操作的headrevision
                    $scope.taskHid = head;
                    //task类型节点的任务类型，对应操作的oprtName
                    $scope.taskName = taskName;
                }
                //修改对应操作
                $scope.update = function(){
                    if($scope.taskId==""||$scope.taskId=="undefined"){
                        toastr.info("请选择操作！");
                        return;
                    }
                    //给对应task元素赋值
                    $("#"+$scope.nodeId).attr("taskType",$scope.taskType);
                    $("#"+$scope.nodeId).attr("taskId",$scope.taskId);
                    $("#"+$scope.nodeId).attr("taskHid",$scope.taskHid);
                    $("#"+$scope.nodeId).attr("taskName",$scope.taskName);

                    //赋值给外部对象
                    $scope.$parent.taskType = $scope.taskType;
                    $scope.$parent.taskId = $scope.taskId;
                    $scope.$parent.taskHid = $scope.taskHid;
                    $scope.$parent.taskName = $scope.taskName;

                    this.closeThisDialog();
                }


            }],
        }).closePromise.then(function(){
        });

    }
    //收集页面元素，生成可供引擎识别的XML字符串
    function generateXML(){
        //-------------------XML生成(start)-------------------
        var look = '',//表示外观的xml元素集合
            process = '',//表示进程的xml元素集合
            retXML ={}; //返回的集合

        //将连线转换为XML
        $.each(instance.getAllConnections(), function (idx, connection) {
            if(connection.sourceId.indexOf("branch")>=0){ //说明是起点为分支的连线，设置条件
                process += '<sequenceFlow id="flow'+idx+'" name="'+name+'" sourceRef="'+connection.sourceId+'" targetRef="'+connection.targetId+'">'
                    +'<conditionExpression xsi:type="tFormalExpression"><![CDATA[${taskId == "'+connection.targetId+'"}]]></conditionExpression>'
                    +'</sequenceFlow>';
            }else{
                process += '<sequenceFlow id="flow'+idx+'" name="'+name+'" sourceRef="'+connection.sourceId+'" targetRef="'+connection.targetId+'"></sequenceFlow>';
            }
        });

        //将节点转换为XML
        $("#flowContent").children("div").each(function (idx, elem) {
            var $elem = $(elem), type = $elem.attr('class').split(' ')[0];
            if( $elem.attr('id')){
                var id = $elem.attr('id'),name =  $elem.children('textarea').val()||$elem.children('span').text(),BlockX = parseInt($elem.css("left")),BlockY = parseInt($elem.css("top")),taskDes,description;
                switch(type){
                    case  "start" : //开始事件
                        process += '<startEvent id="'+id+'" name="'+name+'"></startEvent>  ';
                        look +=  '<bpmndi:BPMNShape bpmnElement="'+id+'" id="start_'+name+'">  '
                            +'<omgdc:Bounds  x="'+BlockX+'" y="'+BlockY+'" width="20" height="20"/>  '
                            +'</bpmndi:BPMNShape>';
                        break;
                    case "end" : //结束事件
                        process += '<endEvent id="'+id+'" name="'+name+'"></endEvent>  ';
                        look +=  '<bpmndi:BPMNShape bpmnElement="'+id+'" id="end_'+name+'">  '
                            +'<omgdc:Bounds  x="'+BlockX+'" y="'+BlockY+'" width="20" height="20"/>  '
                            +'</bpmndi:BPMNShape>';
                        break;
                    case "branch" : //分支（目前只接受排他分支）
                        process += '<exclusiveGateway id="'+id+'" name="'+name+'"></exclusiveGateway>  ';
                        look +=  '<bpmndi:BPMNShape bpmnElement="'+id+'" id="branch_'+name+'">  '
                            +'<omgdc:Bounds  x="'+BlockX+'" y="'+BlockY+'" width="20" height="20"/>  '
                            +'</bpmndi:BPMNShape>';
                        break;
                    case "converge" : //汇聚
                        process += '<inclusiveGateway id="'+id+'" name="'+name+'"></inclusiveGateway>  ';
                        look +=  '<bpmndi:BPMNShape bpmnElement="'+id+'" id="converge_'+name+'">  '
                            +'<omgdc:Bounds  x="'+BlockX+'" y="'+BlockY+'" width="20" height="20"/>  '
                            +'</bpmndi:BPMNShape>';
                        break;
                    case "task" : //任务
                        taskDes = {};
                        taskDes.taskType = $elem.attr('tasktype');
                        taskDes.cfgId = $elem.attr('taskid');
                        taskDes.headRevision = $elem.attr('taskhid');
                        taskDes.taskName = $elem.attr('taskname');
                        //如果分支ID匹配成功，保存进XML
                        for(var i = 0;i<$scope.branches.length;i++){
                            if($scope.branches[i].node_Id==$elem.attr('id')){
                                taskDes.branches = $scope.branches[i].branches;
                                break;
                            }
                        }
                        description = JSON.stringify(taskDes);
                        process += '<userTask id="'+id+'" name="'+name+'">  '
                            +'<documentation>'+description+'</documentation>  '
                            +'</userTask>  ';

                        look    +=  '<bpmndi:BPMNShape bpmnElement="'+id+'" id="task_'+name+'">  '
                            +'<omgdc:Bounds  x="'+BlockX+'" y="'+BlockY+'" width="20" height="20"/>  '
                            +'</bpmndi:BPMNShape>';
                        break;
                    default:
                        break;
                }
            }
        });

        retXML.look = look;
        retXML.process = process;

        return retXML;
        //-------------------XML生成(end)-------------------
    }
    //保存流程方法
    $scope.saveFlow = function(){

        $scope.isShowLoading = true;
        var res = validate();
        if(res.result == "false"){
            toastr.info(res.message);
            $scope.isShowLoading = false;
            return  false;
        }

        //如果为新增状态，首先获取流程定义的ID
        var retXML = generateXML();
        var process = retXML.process,look = retXML.look,xmlText;
        $scope.saveFlowObj = {};
        if(flag=="0"){
            flowManageService.getNewFlowId({"wew":""},(function(data){
                if(data.result=="true"){

                    xmlText = '<?xml version="1.0" encoding="UTF-8"?>  '+
                        '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.activiti.org/test">  '+
                        '<process id="flow'+data.newFlowId+'" name="'+$scope.flowName+'" isExecutable="true">  '+
                        process+
                        '</process>  '+
                        '<bpmndi:BPMNDiagram id="BPMNDiagram_flow'+data.newFlowId+'">  '+
                        '<bpmndi:BPMNPlane bpmnElement="flow'+data.newFlowId+'" id="BPMNPlane_flow'+data.newFlowId+'">  '+
                        look+
                        '</bpmndi:BPMNPlane>  '+
                        '</bpmndi:BPMNDiagram>  '+
                        '</definitions>  ';
                    //流程ID
                    $scope.saveFlowObj.cfgId = data.newFlowId;
                    //修改或者新增的标识
                    $scope.saveFlowObj.flag = flag;
                    //流程名称
                    $scope.saveFlowObj.flowName = $scope.flowName;
                    //流程内容
                    $scope.saveFlowObj.flowContent = xmlText;
                    //流程说明
                    $scope.saveFlowObj.remark = "";
                    var saveFlowObjStr = JSON.stringify($scope.saveFlowObj);
                    //console.info(xmlText);
                    flowManageService.saveFlow({"saveFlowObjStr":saveFlowObjStr},function(data){
                        if(data.result == "true"){
                            toastr.info("保存成功！");
                            window.opener.location.reload();
                            setTimeout(function () {

                                //window.opener.location.href = window.opener.location.href;
                                window.close();
                            }, 1000);

                        }else{
                            toastr.info("保存失败！");
                        }
                        $scope.isShowLoading = false;
                    });

                }else{
                    console.log(data.reason);
                    toastr.info("获取ID失败！");
                    return;
                }
            }));
        }else{
            xmlText = '<?xml version="1.0" encoding="UTF-8"?>  '+
                '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.activiti.org/test">  '+
                '<process id="flow'+cfgId+'" name="'+$scope.flowName+'" isExecutable="true">  '+
                process+
                '</process>  '+
                '<bpmndi:BPMNDiagram id="BPMNDiagram_flow'+cfgId+'">  '+
                '<bpmndi:BPMNPlane bpmnElement="flow'+cfgId+'" id="BPMNPlane_flow'+cfgId+'">  '+
                look+
                '</bpmndi:BPMNPlane>  '+
                '</bpmndi:BPMNDiagram>  '+
                '</definitions>  ';
            //流程ID
            $scope.saveFlowObj.cfgId = cfgId;
            //修改或者新增的标识
            $scope.saveFlowObj.flag = flag;
            //流程名称
            $scope.saveFlowObj.flowName = $scope.flowName;
            //流程内容
            $scope.saveFlowObj.flowContent = xmlText;
            //流程说明
            $scope.saveFlowObj.remark = "";

            var saveFlowObjStr = JSON.stringify($scope.saveFlowObj);
            flowManageService.saveFlow({"saveFlowObjStr":saveFlowObjStr},function(data){
                if(data.result == "true"){
                    toastr.info("保存成功！");
                    window.opener.location.reload();
                    setTimeout(function () {

                        //window.opener.location.href = window.opener.location.href;
                        window.close();
                    }, 1000);

                }else{
                    toastr.info("保存失败！");
                }
                $scope.isShowLoading = false;
            });

        }

    }
    //校验流程方法
    $scope.checkFlow = function(){
        $scope.saveFlowObj = {};
        $scope.isShowLoading = true;
        var res = validate();
        if(res.result == "false"){
            toastr.info(res.message);
            $scope.isShowLoading = false;
            return  false;
        }
        var retXML = generateXML();
        var process = retXML.process,look = retXML.look,xmlText;
        xmlText = '<?xml version="1.0" encoding="UTF-8"?>  '+
            '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.activiti.org/test">  '+
            '<process id="flowcheck" name="'+$scope.flowName+'" isExecutable="true">  '+
            process+
            '</process>  '+
            '<bpmndi:BPMNDiagram id="BPMNDiagram_flowcheck">  '+
            '<bpmndi:BPMNPlane bpmnElement="flowcheck" id="BPMNPlane_flowcheck">  '+
            look+
            '</bpmndi:BPMNPlane>  '+
            '</bpmndi:BPMNDiagram>  '+
            '</definitions>  ';
        //流程名称
        $scope.saveFlowObj.flowName = $scope.flowName;
        //流程内容
        $scope.saveFlowObj.flowContent = xmlText;
        //流程说明
        $scope.saveFlowObj.remark = "";

        var saveFlowObjStr = JSON.stringify($scope.saveFlowObj);
        flowManageService.checkFlow({"saveFlowObjStr":saveFlowObjStr},function(data){
            if(data.result == "true"){
                toastr.info("校验成功！");
            }else{
                toastr.info(data.reason);
            }
            $scope.isShowLoading = false;
        });

    }
    //取消
    $scope.resetFlow = function(){
        window.close();
    }

    //执行流程
    $scope.executeFlow=function(){
            var flag = "0";
            for(var key in $scope.scriptList){
                var obj = $scope.scriptList[key];
                var name = $("#"+key).children("span").text();
                if(!obj.resourceObjList||obj.resourceObjList.length==0){
                    toastr.info("任务节点["+name+"]的资源列表为空！请检查！");
                    flag = "1";
                    break;
                }
            }
            if(flag=="1"){
                return;
            }
            var excuOprtObjsStr = JSON.stringify($scope.scriptList);
            flowManageService.excuFlow({"cfgId":cfgId,"excuOprtObjsStr":excuOprtObjsStr},function(data){

                if(data.result=="true"){
                    if(data.execInstId!="0"){
                        window.location.href="/oprt/flowManage?pageState=3&cfgId="+cfgId+"&headRevision="+$scope.headRevision+"&flowExecInstId="+data.execInstId;
                    }else{
                        toastr.info("流程执行失败！");
                        console.log("流程执行失败原因=================获取了不合法的实例ID！");
                    }

                }else{
                    toastr.info("流程执行失败！");
                    console.log("流程执行失败原因================="+data.reason);
                }
            });

    }

    //数据验证
    function validate(){

        var start = $("#flowContent").children("div .start");
        var end = $("#flowContent").children("div .end");
        var task = $("#flowContent").children("div .task");
        var branch = $("#flowContent").children("div .branch");
        var converge = $("#flowContent").children("div .converge");
        var res = {};
        //1、必须要有开始和结束框，且只能有一个
        if(start.length>1){
            res.message = "开始节点有且只能存在一个！";
            res.result = "false";

            return res;
        }else if(end.length>1){
            res.message = "结束节点有且只能存在一个！";
            res.result = "false";
            return res;
        }else if(start.length==0){
            res.message = "没有添加开始节点！";
            res.result = "false";
            return res;
        }else if(end.length==0){
            res.message = "没有添加结束节点！";
            res.result = "false";
            return res;
        }
        //2、开始节点对应的验证
        start.each(function (idx, elem) {
            var $elem = $(elem),id=$elem.attr('id');
            if(instance.getConnections({source:id}, true).length==0){
                res.message = "开始节点必须连接连线！";
                res.result = "false";
                return res;
            }
            if(!$elem.children('textarea').val()&&!$elem.children('span').text()){
                res.message = "请输入开始环节的名称！";
                res.result = "false";
                return res;
            }
        });
        //3、结束节点对应的验证
        end.each(function (idx, elem) {
            var $elem = $(elem),id=$elem.attr('id');
            if(instance.getConnections({target:id}, true).length==0){
                res.message = "结束节点必须连接连线！";
                res.result = "false";
                return res;
            }
            if(!$elem.children('textarea').val()&&!$elem.children('span').text()){
                res.message = "请输入结束环节的名称！";
                res.result = "false";
                return res;
            }
        });
        //4、环节框对应的验证
        task.each(function (idx, elem) {
            var $elem = $(elem),id=$elem.attr('id'),taskid=$elem.attr('taskid'),taskname=$elem.attr('taskname');
            if(instance.getConnections({target:id}, true).length==0){
                res.message = "任务节点后必须连接环节！";
                res.result = "false";
                return res;
            }
            if(instance.getConnections({source:id}, true).length==0){
                res.message = "任务节点前必须要连接环节！";
                res.result = "false";
                return res;
            }
            if(taskid==""){
                res.message = "任务节点必须选择对应的操作！";
                res.result = "false";
                return res;
            }
            if(!$elem.children('textarea').val()&&!$elem.children('span').text()){
                res.message = "请输入任务环节的名称！";
                res.result = "false";
                return res;
            }
        });
        //5、条件框对应的验证
        branch.each(function (idx, elem) {
            var $elem = $(elem),id=$elem.attr('id'),taskid=$elem.attr('taskid'),taskname=$elem.attr('taskname');
            if(instance.getConnections({source:id}, true).length<2){
                res.message = "分支节点后必须要连接至少两个环节！";
                res.result = "false";
                return res;
            }
            if(instance.getConnections({source:id}, true).length==0){
                res.message = "分支节点前必须要连接环节！";
                res.result = "false";
                return res;
            }else{             //分支节点是否包含条件
                var connection = instance.getConnections({target:id}, true);
                var tconnection = instance.getConnections({source:id}, true);
                var nodeId = connection[0].sourceId;
                if($scope.branches.length==0){
                    res.message = "未添加分支条件！";
                    res.result = "false";
                    return res;
                }
                for(var i = 0;i<$scope.branches.length;i++) {
                    if ($scope.branches[i].node_Id == nodeId) {
                        if ($scope.branches[i].branches.length != tconnection.length) {
                            res.message = "条件框的分支条件需要对应每个后续环节！";
                            res.result = "false";
                            return res;
                        }
                    }
                }
            }

            if(!$elem.children('textarea').val()&&!$elem.children('span').text()){
                res.message = "请输入分支环节的名称！";
                res.result = "false";
                return res;
            }
        });
        //6、汇聚节点对应的验证
        converge.each(function (idx, elem) {
            var $elem = $(elem),id=$elem.attr('id');
            if(instance.getConnections({target:id}, true).length==0){
                res.message = "汇聚节点后必须连接环节！";
                res.result = "false";
                return res;
            }
            if(instance.getConnections({source:id}, true).length==0){
                res.message = "汇聚节点前必须要连接环节！";
                res.result = "false";
                return res;
            }

            if(!$elem.children('textarea').val()&&!$elem.children('span').text()){
                res.message = "请输入汇聚环节的名称！";
                res.result = "false";
                return res;
            }
        });

        if($scope.flowName == ""){
            res.message = "流程名称不允许为空！";
            res.result = "false";
            return res;
        }

        return res;
    }

    // 查看环节
    $scope.showNode = function () {
         if($scope.nodeId.indexOf("branch")>=0){
             getBranchData();
        }else {
             console.log("or - showNode");
             var scriptObj = JSON.stringify($scope.scriptList[$scope.nodeId]);
             var manualInstList = angular.copy($scope.manualList);
             // 假数据
             // var manualInstList = [{
             //     manualInstId: 56,
             //     flowInstId: 57,
             //     oprtInstId: 58,
             //     taskId: 59,
             //     accontInstId: 900000122985725,
             //     scriptId: 2414,
             //     excuOprtObjStr:""
             // }];
             console.log('or - flowExecInstId', flowExecInstId, $scope.nodeId);
             console.log('or - objscript---', scriptObj);
             console.log('or - objscript Object---', $scope.scriptList[$scope.nodeId]);
             console.log('or - manualInstList---', manualInstList);

             // 过滤已经执行过的
             if ($scope.hasExcuManualInstId.length > 0) {
                 var filterData = [];
                 for (var xx = 0; xx < manualInstList.length; xx++) {
                     var isExist = false;
                     for (var zz = 0; zz < $scope.hasExcuManualInstId.length; zz++) {
                         if (manualInstList[xx].manualInstId === $scope.hasExcuManualInstId[zz].manualInstId) {
                             isExist = true;
                         }
                     }
                     if (!isExist) {
                         filterData.push(manualInstList[xx]);
                     }
                 }
                 manualInstList = filterData;
             }

             var removeObj = {};
             manualInstList.map(function(e) {
                 removeObj[e.manualInstId] = e;
             });
             var keys = [];
             for (var property in removeObj)
             {
                 keys.push(removeObj[property]);
             }
             manualInstList = keys;

             console.log('or - manualInstList---', manualInstList);
             console.log('or - $scope.hasExcuManualInstId---', $scope.hasExcuManualInstId);

             sessionStorage.setItem("scriptObj",scriptObj);
             sessionStorage.setItem("manualInstList",JSON.stringify(manualInstList));
             sessionStorage.setItem("nodeId",$scope.nodeId);
             sessionStorage.setItem("flowExecInstId",flowExecInstId);
             // window.open("/oprt/flowRecord?scriptObj=" + encodeURIComponent(scriptObj)
             //     + "&manualInstList=" + JSON.stringify(manualInstList)
             //     + "&nodeId=" + $scope.nodeId
             //     + "&flowExecInstId=" + flowExecInstId);
             window.open("/oprt/flowRecord", $scope.nodeId);

         }
    };

    // 输入参数（全流程 - 右边展开面板-------------------------
    $scope.hasExcuManualInstId = [];
    $scope.isFolded = false;
    // $scope.isFoldedNow = false;
    $scope.fold = function () {
        $scope.isFolded = !$scope.isFolded;
        // $scope.isFoldedNow = !$scope.isFoldedNow;
        // console.log("or - fold function -------------");
        // $("#idParamList").animate({width:'toggle'},500, null, function () {
        //     $scope.isFolded = !$scope.isFolded;
        //     console.log("or -------------------sdfsdf----", $scope.isFolded);
        //     $scope.$apply();
        // });
    };
    $scope.unFold = function () {
        // document.getElementById("idBtnFold").click();
        // $scope.fold();
        $scope.isFolded = !$scope.isFolded;
    };
    var classIds = [];
    $scope.linkListName = [];
    $scope.resourceObjList = [];
    //添加资源对象
    $scope.openAddResourceObjWin = function(llst){
        console.log('or ---llst---+-', llst);
        ngDialog.open({
            template: '/app/oprt/views/addResourceObj.html',
            showClose : false,
            className: 'ngdialog-theme-default update-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                // 先单独根据moduleId获取新增资源对象
                var moduleId = "";
                switch(llst.oprtScriptList[0].scriptType) {
                    case "1":
                        moduleId = 2;
                        break;
                    case "6":
                        moduleId = 3;
                        break;
                    default:
                        moduleId = 1;
                        break;
                }
                if(moduleId == 1){
                    classIds =[200201,200208];
                }else if(moduleId == 2){
                    classIds =[100101,100102,100103,100104,100106,100105];
                }else if(moduleId == 3){
                    classIds =[100101,100102,100103,100104,100106,100105];
                }
                var params = angular.extend({
                    classIds:classIds,
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
                        $scope.$parent.waitResourceList = datas;
                        console.log("-----------waitResourceList----begin-----------------");
                        console.log($scope.$parent.waitResourceList);
                        console.log("-----------waitResourceList----end-----------------");

                        // 可选的资源对象列表
                        // vali 0:验证不通过 1:验证通过 2:验证中 3:未验证
                        $scope.waitResourceList = $scope.$parent.waitResourceList;
                        //选择用户
                        $scope.createUserMap = function(){
                            var userSelectedMap = {};
                            var resourceObjList = llst.resourceObjList || [];
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
                            llst.resourceObjList = [];
                            for(var i = 0; i < $scope.waitResourceList.length; i++){
                                var waitUserList = $scope.waitResourceList[i].user;
                                for(var j = 0; j < waitUserList.length; j++){
                                    for(var accontInstId in $scope.userSelectedMap){
                                        if(waitUserList[j].instanceId == $scope.userSelectedMap[accontInstId]){
                                            if(waitUserList[j].instanceId == $scope.userSelectedMap[accontInstId]){
                                                console.log("dbType:"+$scope.waitResourceList[i].dbType);
                                                llst.resourceObjList.push({
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
                    });
                });

            }]
        }).closePromise.then(function(){});
    };
    //删除资源对象
    $scope.resourceDelete = function(index, llst) {
        console.log('or - llst -', llst);
        llst.resourceObjList.splice(index,1);
        if(llst.resourceObjList.length === 0) llst.limitResource = false;
    };
    $scope.showDetail = function (llst) {
        console.log('or -llst', llst);
        if($scope.showParamDetail[llst.nodeId]) delete $scope.showParamDetail[llst.nodeId];
        else $scope.showParamDetail[llst.nodeId] = llst.nodeId;
        $("#" + llst.nodeId).slideToggle('normal',function(){});
    };
    $scope.showParamDetail = {};
    $scope.showResouDetail = {};
    $scope.showResoDetail = function (llst) {
        console.log('or -llst', llst);
        if($scope.showResouDetail[llst.resoId]) delete $scope.showResouDetail[llst.resoId];
        else $scope.showResouDetail[llst.resoId] = llst.resoId;
        $("#" + llst.resoId).slideToggle('normal',function(){});
    };
    // 输入参数（全流程 - 右边展开面板-------------------------

    function getBranchData() {
        var arr = [];
        var scriptsList = [];
        //获取分支节点之前的节点ID
        var sourceNode = instance.getConnections({target:$scope.nodeId}, true);
        if(sourceNode.length){
            //根据节点ID获取
            var sourceNodeId = sourceNode[0].sourceId;
            var sourceTaskId = $("#"+sourceNode[0].sourceId).attr("taskId");
            var curConditions = [];
            //将操作的ID用于查询已保存的条件集合
            for(var i = 0;i<$scope.branches.length;i++){
                if($scope.branches[i].node_Id==sourceNodeId){
                    curConditions = $scope.branches[i].branches;
                    break;
                }
            }
            oprtManageService.getOprtCfgInfo({"cfgId":sourceTaskId},function(datas){
                if(datas.oprtScriptList != []) {
                    for (var i = 0; i < datas.oprtScriptList.length; i++) {
                        var moduleName = "";
                        switch (datas.oprtScriptList[i].scriptType) {
                            case "1":
                                moduleName = "SHELL";
                                break;
                            case "6":
                                moduleName = "FTP";
                                break;
                            default:
                                moduleName = "SQL";
                        }
                        scriptsList.push({"oprtId":""+datas.oprtScriptList[i].scriptId+"","oprtName":datas.oprtScriptList[i].scriptName, "moduleName": moduleName});
                    }
                    //完成scriptList,获取分支节点之后的节点ID集合
                    var targetNodes = instance.getConnections({source:$scope.nodeId}, true);
                    if(targetNodes.length){
                        for(var i = 0;i<targetNodes.length;i++){
                            //获取节点的ID
                            var targetNodeId = targetNodes[i].targetId;
                            //标志是否已经添加存在的元素
                            var addFlag = false;
                            //根据此ID遍历已保存的条件，如果存在，赋值，不存在，新增
                            for(var k = 0;k<curConditions.length;k++){
                                if(targetNodeId==curConditions[k].task_id){
                                    arr.push({"taskId": targetNodeId,"taskName":$("#"+targetNodeId).children('textarea').val() || $("#"+targetNodeId).children('span').text(),"btnName":"清除全部","hasCreated":true,"res_flag":curConditions[k].res_flag,"default_flag":curConditions[k].default_flag,"cons_flag":curConditions[k].cons_flag,"conditions":curConditions[k].conditions, "conId": targetNodeId+'cid'});
                                    addFlag = true;
                                    break;
                                }
                            }
                            if(!addFlag){
                                arr.push({"taskId": targetNodeId,"taskName":$("#"+targetNodeId).children('textarea').val() || $("#"+targetNodeId).children('span').text(),"btnName":"新建","hasCreated":false,"res_flag":"0","default_flag":"0","cons_flag":"0","conditions":[], "conId": targetNodeId+'cid'});
                            }
                        }
                        if($scope.pageState=="0"||$scope.pageState=="1"){
                            openBranchWin(arr,scriptsList,sourceNodeId,1);
                        }else{
                            openBranchWin(arr,scriptsList,sourceNodeId,0);
                        }
                    }
                }
            });
        }
    }
}]);

flowAppControllers.controller('flowManageCtrl', ['$scope','ngDialog','toastr','i18nService','flowManageService', '$location', function ($scope,ngDialog,toastr,i18nService,flowManageService,$location) {
    i18nService.setCurrentLang('zh-cn');
    $scope.$parent.selectId = 3;
    var moduleList = common.getJsonFromHtmlData("moduleList");
    var template = {
        opera:
        '<div>' +
        '   <div type="button" class="edit-btn" style="display: inline-block;" ng-click="grid.appScope.openUpdateWin(row.entity)"></div>' +
        '   <span class="oper-border"></span>' +
        '   <div type="button" class="delete-btn" style="display: inline-block;" ng-click="grid.appScope.openDeleteWin(row.entity.CFGID,row.entity.FLOWNAME)"></div>' +
        '   <span class="oper-border"></span>' +
        '   <div type="button" class="excu-btn" style="display: inline-block;" ng-click="grid.appScope.openExcuWin(row.entity)"></div>' +
        '</div>'
    }
    $scope.gridOptions = {
        paginationPageSizes: [10,15,20],
        paginationPageSize: 10,

        enableColumnResizing: true,
        enableHorizontalScrollbar: 0,

        columnDefs : [common.getUiGridSeqColumn(),{
            displayName: '流程名称',
            field: 'FLOWNAME',
            width:475,
        }, {
            displayName: '创建人',
            field: 'creator',
            cellClass: 'text-center',
            width:120
        }, {
            displayName: '创建时间',
            field: 'CREATETIME',
            cellClass: 'text-center',
            width:200
        }, {
            displayName: '修改人',
            field: 'LASTMODIFIER',
            cellClass: 'text-center',
            width:120
        }, {
            displayName: '修改时间',
            field: 'LASTMODIFYTIME',
            cellClass: 'text-center',
            width:200
        }, {
            displayName: '操作',
            width:120,
            field: 'CFGID',
            cellClass: 'text-center',
            cellTemplate: template.opera,
            enableSorting: false
        }]
    };
    var gridHelper = common.simpleUiGridPageHelper({
        gridOption: $scope.gridOptions,
        listener: function(params) {
            getFlowCfgListByPage();
        },
        // datasourceFn: function(params) {
        //     $scope.isShowLoading = true;
        //     var datas = flowManageService.getFlowCfgListByPage(params);
        //     $scope.isShowLoading = false;
        //     return datas;
        // },
        scope: $scope
    });
    function getFlowCfgListByPage(){
        var flowName = $scope.cacheSearchTxt;
        var params = angular.extend({
            flowName:flowName
        }, gridHelper.getParams());
        $scope.isShowLoading = true;
        flowManageService.getFlowCfgListByPage(params, function(rs) {
            $scope.gridDatas = $scope.gridOptions.data = rs.content;
            $scope.gridOptions.totalItems = rs.totalElements;
            gridHelper.refresh();
            $scope.isShowLoading = false;
        })
    }
    getFlowCfgListByPage();
    //新增操作
    $scope.openAddScriptWin = function(){

        window.open("/oprt/flowManage?pageState=0&cfgId=1");

    }
    //修改操作
    $scope.openUpdateWin = function(obj){
        window.open("/oprt/flowManage?pageState=1&cfgId="+obj.CFGID);
    }
    //执行操作
    $scope.openExcuWin = function(obj){
        window.open("/oprt/flowManage?pageState=2&cfgId="+obj.CFGID);
    }
    //删除流程
    $scope.openDeleteWin = function(cfgId,flowName){
        ngDialog.open({
            template: '/app/oprt/views/deleteTip.html',
            showClose : false,
            className: 'ngdialog-theme-default delete-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                $scope.message = '删除流程"'+flowName+'"';
                $scope.delete = function(){
                    var self = this;
                    flowManageService.updateFlow({"cfgId":cfgId},function(){
                        getFlowCfgListByPage();
                        self.closeThisDialog();
                    });
                }
            }],
        }).closePromise.then(function(){});
    }
    //搜索操作
    $scope.searchFlowCfg = function () {
        //搜索后保存搜索条件用于点击分页
        $scope.cacheSearchTxt = $scope.searchTxt;
        if ($scope.searchTxt == null || $scope.searchTxt == '') {
            //toastr.info("请输入操作名称！");
            getFlowCfgListByPage();
            return false;
        }
        $scope.gridOptions.paginationCurrentPage = 0;
        getFlowCfgListByPage();
    }


}]);

flowAppControllers.controller('flowRecordCtrl',  ['$scope','ngDialog','toastr','i18nService', 'oprtManageService', 'flowManageService', '$interval', function ($scope,ngDialog,toastr,i18nService, oprtManageService, flowManageService, $interval) {
    i18nService.setCurrentLang('zh-cn');
    // var scriptObj = getQueryString("scriptObj");
    // var manualInstList = getQueryString("manualInstList");
    // $scope.nodeId  = getQueryString("nodeId");
    // $scope.flowExecInstId = getQueryString("flowExecInstId");

    var scriptObj = sessionStorage.getItem("scriptObj");
    var manualInstList = sessionStorage.getItem("manualInstList");
    $scope.nodeId = sessionStorage.getItem("nodeId");
    $scope.flowExecInstId = sessionStorage.getItem("flowExecInstId");

    $scope.moduleId = "";
    $scope.scriptObj = JSON.parse(scriptObj);
    $scope.manualInstList = JSON.parse(manualInstList);
    $scope.hasExcuManualInstId = [];
    // 参数列表使用上个页面传下来的
    $scope.scriptParamList = $scope.scriptObj.paramList || [];

    // 0:串行/1:并行
    $scope.oprtExcuType = $scope.scriptObj.oprtExcuType;

    // 请求参数
    $scope.manualInstId = "";
    $scope.headRevision = $scope.scriptObj.headRevision;
    $scope.execInstId = "";

    switch($scope.scriptObj.oprtScriptList[0].scriptType) {
        case "1":
            $scope.moduleId = 2;
            break;
        case "6":
            $scope.moduleId = 3;
            break;
        default:
            $scope.moduleId = 1;
            break;
    }
    // 给脚本加初始执行状态
    if ($scope.oprtExcuType === "0") {
        $scope.scriptObj.oprtScriptList.map(function (osl) {
            osl.execStatus = 0;
        });
    } else {
        $scope.scriptObj.oprtScriptList.map(function (e) {
            $scope.manualInstList.map(function (v) {
               if (e.scriptId === v.scriptId) {
                   e.execStatus = 1;
               } else {
                   e.execStatus = 0;
               }
            });
        });
    }

    // 给每个脚本加参数的数据
    for(var i = 0; i < $scope.scriptObj.oprtScriptList.length; i++){
        $scope.scriptObj.oprtScriptList[i].paramList = [];
        var str = $scope.scriptObj.oprtScriptList[i].scriptCont;
        var pattern = /\{(.+?)\}/g;
        var rsArry;
        if($scope.moduleId === 3) {
            var stmp = str.slice(1,str.length-1);
            rsArry = stmp.match(pattern);
        }else{
            rsArry = str.match(pattern);
        }
        if(rsArry !== null){
            for(var k = 0; k < $scope.scriptParamList.length; k++){
                $scope.scriptParamList[k].selected = false;
            }
            for(var j = 0; j < rsArry.length; j++){
                var paramItem = rsArry[j].replace("{","").replace("}","");
                for(var n = 0; n < $scope.scriptParamList.length; n++){
                    var scriptParamItem;
                    if($scope.moduleId === 3){
                        if(paramItem === $scope.scriptParamList[n].paramName){
                            scriptParamItem = $scope.scriptParamList[n];
                            $scope.scriptParamList[n].selected = true;
                            if(scriptParamItem.isManual === "0SX"){
                                str = str.replace("$","").replace(rsArry[j],"'"+scriptParamItem.defaultName+"'");
                                $scope.scriptObj.oprtScriptList[i].scriptCont = str;
                            }
                            $scope.scriptObj.oprtScriptList[i].paramList.push(scriptParamItem);
                        }
                    }else {
                        if (paramItem === $scope.scriptParamList[n].paramName && !$scope.scriptParamList[n].selected) {
                            scriptParamItem = $scope.scriptParamList[n];
                            $scope.scriptParamList[n].selected = true;
                            if (scriptParamItem.isManual === "0SX") {
                                if (scriptParamItem.paramType === '2') {
                                    str = str.replace("$", "").replace(rsArry[j], "?");
                                    $scope.scriptObj.oprtScriptList[i].outParamType = 'cur';
                                    scriptParamItem.outParamType = 'cur';
                                } else if (scriptParamItem.paramType === '3') {
                                    str = str.replace("$", "").replace(rsArry[j], "?");
                                    $scope.scriptObj.oprtScriptList[i].outParamType = 'str';
                                    scriptParamItem.outParamType = 'str';
                                } else {
                                    str = str.replace("$", "").replace(rsArry[j], "'" + scriptParamItem.defaultName + "'");
                                }
                                $scope.scriptObj.oprtScriptList[i].scriptCont = str;
                            }
                            $scope.scriptObj.oprtScriptList[i].paramList.push(scriptParamItem);
                        }
                    }
                }
            }
        }
    }

    // 给资源加脚本数据
    $scope.scriptObj.resourceObjList.map(function (sorol) {
        sorol.scriptList = $scope.scriptObj.oprtScriptList;
        if ($scope.manualInstList.length > 0 && sorol.accontInstId === $scope.manualInstList[0].accontInstId) {
            sorol.execStatus = 2;
        } else {
            sorol.execStatus = 0;
        }
    });

    console.log("or - data - start - scriptObj", $scope.scriptObj);
    console.log("or - data - start - $scope.nodeId", $scope.nodeId);
    console.log("or - data - start - manualInstList", $scope.manualInstList);
    console.log("or - data - start - flowExecInstId", $scope.flowExecInstId);

    // 根据headRevision获取执行execInstId
    flowManageService.getExecInstId({"headRevision":$scope.headRevision}, function (response) {
        console.log("---------execInstId------------",response.EXEC_INST_ID);
        $scope.execInstId = response.EXEC_INST_ID;

        intervalRequest();

        // 查询执行记录
        oprtManageService.getExcuRecordDetail({"headRevision":$scope.headRevision,"execInstId":$scope.execInstId},function(datas){
            console.log("or - flowRecord -", datas);
            $scope.oprtName = datas.oprtName;
            $scope.resourceObjList = datas.resourceObjList||[];
            for(var i = 0 ; i < $scope.resourceObjList.length; i++){
                var scriptListStr = $scope.resourceObjList[i].oprtExecLogList||"";
                var scriptList = $scope.resourceObjList[i].scriptList = JSON.parse(scriptListStr);
                $scope.showExcuResultMap = getScriptContMap(scriptList);
                for(var j = 0 ; j < scriptList.length; j++){
                    if(scriptList[j].execStatus===2){
                        $scope.resourceObjList[i].scriptList[j].recvMsg = JSON.parse(scriptList[j].recvMsg);
                    }else
                        $scope.resourceObjList[i].scriptList[j].recvMsg = scriptList[j].recvMsg;
                }
            }

            console.log('or - $scope.resourceObjList', $scope.resourceObjList);
            console.log('or - getOprtCfgInfo - ', $scope.scriptObj.oprtScriptList);
            $scope.resourceObjList.map(function (rol) {
                if(rol.scriptList.length !== $scope.scriptObj.oprtScriptList.length) {
                    $scope.scriptObj.oprtScriptList.map(function (osl) {
                        rol.scriptList.map(function (sl) {
                            if (osl.scriptId !== sl.scriptId) {
                                rol.scriptList.push({
                                    "execStatus": 0,
                                    "scriptId": osl.scriptId,
                                    "scriptName": osl.scriptName,
                                    "scriptType": osl.scriptType,
                                    "sendMsg": osl.scriptCont
                                });
                            }
                        });
                    });
                }
            });

            $scope.resourceObjList.map(function (rol) {
                var removeObj = {};
                rol.scriptList.map(function(e) {
                    removeObj[e.scriptId] = e;
                });
                var keys = [];
                for (var property in removeObj)
                {
                    keys.push(removeObj[property]);
                }
                rol.scriptList = keys;
            });

            console.log('or - $scope.resourceObjList - AFTER -', $scope.resourceObjList);
            console.log('or - $scope.resourceObjList - AFTERStringify -', JSON.stringify($scope.resourceObjList));

            // 执行记录不完整，开始合并页面数据
            if ($scope.resourceObjList.length === 0) {
                $scope.resourceObjList = $scope.scriptObj.resourceObjList;
            } else if ($scope.scriptObj.resourceObjList.length > $scope.resourceObjList.length) {
                // $scope.scriptObj.resourceObjList.map(function (sorol) {
                //     $scope.resourceObjList.map(function (rol) {
                //         if (sorol.accontInstId !== rol.accontInstId) {
                //             $scope.resourceObjList.push(rol);
                //         }
                //     });
                // });
                // var combineROList = [];
                for (var sIndex = 0; sIndex < $scope.scriptObj.resourceObjList.length; sIndex++) {
                    var sorol = $scope.scriptObj.resourceObjList[sIndex];
                    var isExist = false;
                    for (var rIndex = 0; rIndex < $scope.resourceObjList.length; rIndex++) {
                        var rol = $scope.resourceObjList[rIndex];
                        if (sorol.accontInstId === rol.accontInstId) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        $scope.resourceObjList.push(sorol);
                    }
                }
                // $scope.resourceObjList = combineROList;
            }
            console.log('or ---- $scope.resourceObjList ---------', $scope.resourceObjList);

            $scope.manualInstList.map(function (e) {
                $scope.resourceObjList.map(function (rol) {
                    if (e.accontInstId === rol.accontInstId) {
                        rol.execStatus = 2;

                        var scripListStatus = angular.copy(rol.scriptList);
                        scripListStatus.map(function (sl) {
                            if (sl.scriptId === e.scriptId) {
                                sl.execStatus = 1;
                            }
                        });
                        rol.scriptList = scripListStatus;
                    }
                });
            });

            console.log('or ---- $scope.resourceObjList status end---------', $scope.resourceObjList);

            // 点击某个资源对象触发的事件
            $scope.selectedIndex = 0;
            $scope.excuItemSelected = function(index){
                console.log("or - excuItemSelected -", index);
                $scope.selectedIndex = index;
            };
            //查看脚本
            $scope.openCheckScriptWin = function(scriptName,sl){
                ngDialog.open({
                    template: '/app/oprt/views/checkScript.html',
                    showClose : false,
                    className: 'ngdialog-theme-default enum-dialog-width',
                    scope : $scope,
                    controller: ['$scope', function($scope) {
                        console.log('or - scriptName - ', scriptName);
                        console.log('or - scriptCont - ', sl);
                        $scope.scriptName = scriptName;
                        $scope.scriptCont = sl.sendMsg || sl.scriptCont;
                    }]
                }).closePromise.then(function(){});
            };
            //脚本查询结果div 展示/收缩切换
            //默认全部收缩
            function getScriptContMap(scriptList){
                var showExcuResultMap = {};
                for(var i = 0; i < scriptList.length; i++){
                    var scriptId = scriptList[i].scriptId;
                    showExcuResultMap[scriptId] = scriptId
                }
                console.log("or - showExcuResultMap -", showExcuResultMap);
                return showExcuResultMap;
            }

            $scope.arrowToggle = function(scriptId){
                if($scope.showExcuResultMap[scriptId]) delete $scope.showExcuResultMap[scriptId];
                else $scope.showExcuResultMap[scriptId] = scriptId;
            };
            for(var i = 0; i < $scope.resourceObjList.length; i++){
                for(var j = 0; j < $scope.resourceObjList[i].scriptList.length; j++) {
                    if ($scope.resourceObjList[i].scriptList[j].execStatus !== '3' || $scope.resourceObjList[i].scriptList[j].execStatus !== '4')
                        if(typeof ($scope.resourceObjList[i].scriptList[j].recvMsg)!=='undefined'){
                            if (typeof ($scope.resourceObjList[i].scriptList[j].recvMsg.recvMsg) !== 'undefined')
                                $scope.resourceObjList[i].scriptList[j].recvMsg = $scope.resourceObjList[i].scriptList[j].recvMsg.recvMsg;
                            if ($scope.resourceObjList[i].scriptList[j].recvMsg.length > 0) {
                                var recvMsgItem = $scope.resourceObjList[i].scriptList[j].recvMsg[0];
                                var recvMsgListHeader = [];
                                for (var key in recvMsgItem) {
                                    recvMsgListHeader.push(key);
                                    if ($scope.resourceObjList[i].scriptList[j].scriptType === '2') {
                                        if ($scope.resourceObjList[i].scriptList[j].execStatus !== '3' && $scope.resourceObjList[i].scriptList[j].execStatus !== '4') {
                                            var recvMsgList = recvMsgItem[key];
                                            recvMsgItem = recvMsgList[0];
                                            $scope.resourceObjList[i].scriptList[j].recvMsg = recvMsgList;
                                            recvMsgListHeader = [];
                                            for (var tip in recvMsgItem) {
                                                recvMsgListHeader.push(tip);
                                            }
                                        }
                                    }

                                }
                                $scope.resourceObjList[i].scriptList[j].recvMsgListHeader = recvMsgListHeader;
                            }
                        }
                }
            }
            //查看初始参数
            $scope.openInitParamWin = function(){
                ngDialog.open({
                    template: '/app/oprt/views/checkInitParam.html',
                    showClose : false,
                    className: 'ngdialog-theme-default enum-dialog-width',
                    scope : $scope,
                    controller: ['$scope', function($scope) {
                        console.log('or - $scope.$parent.scriptParamList - ', $scope.$parent.scriptParamList);
                        $scope.scriptParamList = $scope.$parent.scriptParamList;
                    }]
                }).closePromise.then(function(){});
            };

            // 定时请求更新状态数据
            $scope.logDataTimer = $interval(intervalRequest,3000);
        });
    });

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }
    $scope.resourceObjList = [];
    $scope.showExcuResultMap = {};
    $scope.isShowLoading = true;


    //输入介入参数
    $scope.openManualParamWin = function(scriptIndex, p) {
        console.log('or - scriptIndex -', scriptIndex);
        console.log('or - p -', p);
        console.log('or - $scope.scriptObj; - ', $scope.scriptObj);
        console.log('or - $scope.resourceObjList -', $scope.resourceObjList);
        console.log('or - $scope.scriptParamList -', $scope.scriptParamList);
        ngDialog.open({
            template: '/app/oprt/views/inputManualParam.html',
            showClose : false,
            className: 'ngdialog-theme-default bunch-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                $interval.cancel($scope.logDataTimer);
                var excuOprtObj = {};
                excuOprtObj.scriptItem = angular.copy($scope.scriptObj.oprtScriptList[scriptIndex]);
                excuOprtObj.scriptIndex = scriptIndex;
                excuOprtObj.rIndex = $scope.$parent.selectedIndex;
                excuOprtObj.scriptLength = $scope.scriptObj.oprtScriptList.length - 1;
                excuOprtObj.rIndexLength = $scope.resourceObjList.length;
                excuOprtObj.resourceObj = $scope.resourceObjList[$scope.$parent.selectedIndex];
                excuOprtObj.execInstId = $scope.execInstId;

                // $scope.scriptParamList = $scope.$parent.scriptParamList;
                var resourceIndex = $scope.$parent.selectedIndex;
                var scriptParamList = [];
                if($scope.resourceObjList[resourceIndex].scriptList[scriptIndex].paramList){
                    scriptParamList = angular.copy($scope.resourceObjList[resourceIndex].scriptList[scriptIndex].paramList);
                }
                $scope.scriptParamList = scriptParamList;

                // 确定
                $scope.saveManualParam = function () {
                    // 保存已经选过的人工介入实例ID
                    $scope.manualInstList.map(function (e) {
                        if (e.accontInstId === excuOprtObj.resourceObj.accontInstId) {
                            $scope.manualInstId = e.manualInstId;
                            $scope.hasExcuManualInstId.push(e);
                        }
                    });

                    console.log('or - $scope.hasExcuManualInstId --------', $scope.hasExcuManualInstId);
                    window.opener.jQuery('[ng-controller="editFlowCtrl"]').scope().bindHasExcuManualList(JSON.stringify($scope.hasExcuManualInstId));

                    $scope.resourceObjList[$scope.$parent.selectedIndex].scriptList[scriptIndex].execStatus = 0;
                    $scope.resourceObjList[$scope.$parent.selectedIndex].execStatus = 1;
                    var str = excuOprtObj.scriptItem.scriptCont;
                    var pattern = /\{(.+?)\}/g;
                    var rsArry;
                    if($scope.moduleId === 3) {
                        var stmp = str.slice(1,str.length-1);
                        rsArry = stmp.match(pattern);
                    }else{
                        rsArry = str.match(pattern);
                    }
                    console.log("--------------输入介入参数------------");
                    console.log(str);
                    console.log(rsArry);
                    if (rsArry !== null) {
                        for (var j = 0; j < rsArry.length; j++) {
                            var paramItem = rsArry[j].replace("{","").replace("}","");
                            for (var n = 0; n < $scope.scriptParamList.length; n++) {
                                if (paramItem === $scope.scriptParamList[n].paramName) {
                                    console.log("--------------输入介入参数--replace----------");
                                    str = str.replace("$","").replace(rsArry[j],"'"+$scope.scriptParamList[n].defaultName+"'");
                                    excuOprtObj.scriptItem.scriptCont = str;
                                    if ($scope.moduleId === 3) {
                                        var filescriptobj = JSON.parse($scope.resourceObjList[$scope.$parent.selectedIndex].scriptList[scriptIndex].scriptCont); //由JSON字符串转换为JSON对象
                                        $scope.resourceObjList[$scope.$parent.selectedIndex].scriptList[scriptIndex].sourcefilescriptObject = filescriptobj.sourcefilescriptObject;
                                        $scope.resourceObjList[$scope.$parent.selectedIndex].scriptList[scriptIndex].sourcefilescriptPath = filescriptobj.sourcefilescriptPath;
                                        $scope.resourceObjList[$scope.$parent.selectedIndex].scriptList[scriptIndex].destinationfilescriptPath = filescriptobj.destinationfilescriptPath;
                                    }
                                    console.log('^^^^^^^^^^',$scope.resourceObjList[$scope.$parent.selectedIndex].scriptList[scriptIndex].scriptCont);
                                    console.log('^^^^^^^^^^',$scope.resourceObjList[$scope.$parent.selectedIndex].scriptList);
                                }
                            }
                        }
                    }

                    var excuOprtObjAdd = {"excuOprtObjStr": excuOprtObj};
                    var excuOprtObjStr = JSON.stringify(excuOprtObjAdd);

                    console.log('or ------- stringify',excuOprtObjStr);
                    console.log('or - $scope.manualInstId -', $scope.manualInstId);

                    flowManageService.setManualParams({"manualInstId": $scope.manualInstId, "excuOprtObjStr": excuOprtObjStr},function(response){
                        console.log('or - setManualParams - response------', response);
                        if (response.result) {
                            // 保存已经输入过人工参数的数据
                            $scope.manualInstList.map(function (e) {
                                if (e.manualInstId === $scope.manualInstId) {
                                    $scope.hasExcuManualInstId.push(e);
                                }
                            });
                        }
                    });
                    setTimeout(this.closeThisDialog, 100);
                }
            }]
        }).closePromise.then(function(){
            console.log('or - restar');
            $scope.logDataTimer = $interval(intervalRequest,3000);
        });
    };

    //查看源文件路径
    $scope.openFilePathWin = function(scriptName, sendMsg) {
        console.log('or - scriptName -', scriptName);
        console.log('or - sendMsg -', sendMsg);
        ngDialog.open({
            template: '/app/oprt/views/checkFilePath.html',
            showClose : false,
            className: 'ngdialog-theme-default enum-dialog-width',
            scope : $scope,
            controller: ['$scope', function($scope) {
                $scope.scriptName = scriptName;
                var sendMsgObj = JSON.parse(sendMsg);
                $scope.sourcefilescriptObject = sendMsgObj.sourcefilescriptObject;
                $scope.sourcefilescriptPath = sendMsgObj.sourcefilescriptPath;
                $scope.destinationfilescriptPath = sendMsgObj.destinationfilescriptPath;
            }]
        }).closePromise.then(function(){});
    };

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

    function intervalRequest() {
        console.log('or - interval -');

        if ($scope.hasExcuManualInstId.length > 0) {
            var removeObj = {};
            $scope.hasExcuManualInstId.map(function(e) {
                removeObj[e.manualInstId] = e;
            });
            var keys = [];
            for (var property in removeObj)
            {
                keys.push(removeObj[property]);
            }
            $scope.hasExcuManualInstId = keys;
        }

        var flowManualAndOprtLogData = {};
        flowManualAndOprtLogData.headRevision = $scope.headRevision;
        flowManualAndOprtLogData.nodeId = $scope.nodeId;
        flowManualAndOprtLogData.flowExecInstId = $scope.flowExecInstId;
        flowManualAndOprtLogData.execInstId = $scope.execInstId;
        flowManageService.queryFlowManualAndOprtLog({"flowManualAndOprtLogStr": JSON.stringify(flowManualAndOprtLogData)}, function (response) {
            console.log('------ queryFlowManualAndOprtLog response --------');
            console.log(response);
            if (response.oprtExecStatus === "3" || response.oprtExecStatus === "4") {
                $interval.cancel($scope.logDataTimer);
            }
            console.log('------ queryFlowManualAndOprtLog response --------');

            // 把新的人工参数并入
            if (response.manualParams) {
                response.manualParams.map(function (mp) {
                    $scope.manualInstList.push(mp);
                });
            }

            // 去重
            if ($scope.manualInstList.length > 0) {
                var removeObj = {};
                $scope.manualInstList.map(function(e) {
                    removeObj[e.manualInstId] = e;
                });
                var keys = [];
                for (var property in removeObj)
                {
                    keys.push(removeObj[property]);
                }
                $scope.manualInstList = keys;
            }

            // 开始过滤
            if ($scope.hasExcuManualInstId.length > 0) {
                var filterData = [];

                for (var xx = 0; xx < $scope.manualInstList.length; xx++) {
                    var isExist = false;
                    for (var zz = 0; zz < $scope.hasExcuManualInstId.length; zz++) {
                        if ($scope.manualInstList[xx].manualInstId === $scope.hasExcuManualInstId[zz].manualInstId) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        filterData.push($scope.manualInstList[xx]);
                    }
                }
                $scope.manualInstList = filterData;

            }

            console.log('-------interval-----manualInstList--sta--');
            console.log($scope.manualInstList);
            console.log('-------interval-----manualInstList--end--');

            var newResourceObjList = angular.copy(response.excuRecordDetail.resourceObjList) || [];
            for(var i = 0 ; i < newResourceObjList.length; i++){
                var scriptListStr = newResourceObjList[i].oprtExecLogList||"";
                var scriptList = newResourceObjList[i].scriptList = JSON.parse(scriptListStr);
                // $scope.showExcuResultMap = getScriptContMap(scriptList);
                for(var j = 0 ; j < scriptList.length; j++){
                    if(scriptList[j].execStatus === 2){
                        newResourceObjList[i].scriptList[j].recvMsg = JSON.parse(scriptList[j].recvMsg);
                    }else
                        newResourceObjList[i].scriptList[j].recvMsg = scriptList[j].recvMsg;
                }
            }
            console.log('or -- newResourceObjList -----longTime---', newResourceObjList);
            newResourceObjList.map(function (rol) {
                // 脚本数据不足
                if(rol.scriptList.length !== $scope.scriptObj.oprtScriptList.length) {
                    combineScriptList($scope.scriptObj.oprtScriptList, rol.scriptList);
                }
            });

            // 去除重复
            newResourceObjList.map(function (rol) {
                var removeObj = {};
                rol.scriptList.map(function(e) {
                    removeObj[e.scriptId] = e;
                });
                var keys = [];
                for (var property in removeObj)
                {
                    keys.push(removeObj[property]);
                }
                rol.scriptList = keys;
            });

            // 定时更新数据合并
            $scope.resourceObjList.map(function (oldData) {
                if (oldData.execStatus !== "3" && oldData.execStatus !== "4") {
                    newResourceObjList.map(function (newData) {
                        if (newData.accontInstId === oldData.accontInstId) {
                            oldData.execStatus = newData.execStatus;
                            oldData.scriptList = newData.scriptList;
                        }
                    });
                }
            });

            console.log('or - $scope.resourceObjList - interval -', $scope.resourceObjList);

            // 判断是否人工介入
            $scope.manualInstList.map(function (e) {
                $scope.resourceObjList.map(function (rol) {
                    if (e.accontInstId === rol.accontInstId) {
                        rol.execStatus = 2;

                        var scripListStatus = angular.copy(rol.scriptList);
                        scripListStatus.map(function (sl) {
                            if (sl.scriptId === e.scriptId) {
                                sl.execStatus = 1;
                            }
                        });
                        rol.scriptList = scripListStatus;
                    }
                });
            });
            console.log('or - $scope.resourceObjList - interval - before comb -', $scope.resourceObjList);

            // 根据返回状态更新状态值
            var newStatus = angular.copy(response.resScriptResultList) || [];
            $scope.resourceObjList.map(function (rol) {
                newStatus.map(function (n) {
                    if (rol.accontInstId === n.accontInstId) {
                        rol.scriptList.map(function (s) {
                            if (s.scriptId === n.scriptId) {
                                s.execStatus = parseInt(n.result);
                            }
                        });
                    }
                });
            });

            for (var srolIndex = 0; srolIndex < $scope.resourceObjList.length; srolIndex++) {
                var resourceData = $scope.resourceObjList[srolIndex];
                for (var sIndex = 0; sIndex < resourceData.scriptList.length; sIndex++) {
                    var scriptData = resourceData.scriptList[sIndex];
                    if( sIndex === 0 ) {
                        resourceData.execStatus = scriptData.execStatus;
                    }
                    else {
                        switch ( resourceData.execStatus  ){
                            case 0:
                                resourceData.execStatus = scriptData.execStatus;
                                break;
                            case 1:
                                if( scriptData.execStatus === 4 ){
                                    resourceData.execStatus = scriptData.execStatus;
                                }
                                else if( scriptData.execStatus === 2 ){
                                    resourceData.execStatus = 2;
                                }
                                break;
                            case 2:
                                if( scriptData.execStatus === 4 ){
                                    resourceData.execStatus = scriptData.execStatus;
                                }
                                break;
                            case 3:
                                if( scriptData.execStatus === 4 ){
                                    resourceData.execStatus = scriptData.execStatus;
                                }
                                else if( scriptData.execStatus === 0 || scriptData.execStatus === 1 ){
                                    resourceData.execStatus = 1;
                                }
                                else if( scriptData.execStatus === 2 ){
                                    resourceData.execStatus = 2;
                                }
                                break;
                            case 4:
                            default:
                                break;

                        }
                    }
                }
            };

            for(var i = 0; i < $scope.resourceObjList.length; i++){
                for(var j = 0; j < $scope.resourceObjList[i].scriptList.length; j++) {
                    if ($scope.resourceObjList[i].scriptList[j].execStatus !== '3' || $scope.resourceObjList[i].scriptList[j].execStatus !== '4')
                        if(typeof ($scope.resourceObjList[i].scriptList[j].recvMsg)!=='undefined'){
                            if (typeof ($scope.resourceObjList[i].scriptList[j].recvMsg.recvMsg) !== 'undefined')
                                $scope.resourceObjList[i].scriptList[j].recvMsg = $scope.resourceObjList[i].scriptList[j].recvMsg.recvMsg;
                            if ($scope.resourceObjList[i].scriptList[j].recvMsg.length > 0) {
                                var recvMsgItem = $scope.resourceObjList[i].scriptList[j].recvMsg[0];
                                var recvMsgListHeader = [];
                                for (var key in recvMsgItem) {
                                    recvMsgListHeader.push(key);
                                    if ($scope.resourceObjList[i].scriptList[j].scriptType === '2') {
                                        if ($scope.resourceObjList[i].scriptList[j].execStatus !== '3' && $scope.resourceObjList[i].scriptList[j].execStatus !== '4') {
                                            var recvMsgList = recvMsgItem[key];
                                            recvMsgItem = recvMsgList[0];
                                            $scope.resourceObjList[i].scriptList[j].recvMsg = recvMsgList;
                                            recvMsgListHeader = [];
                                            for (var tip in recvMsgItem) {
                                                recvMsgListHeader.push(tip);
                                            }
                                        }
                                    }

                                }
                                $scope.resourceObjList[i].scriptList[j].recvMsgListHeader = recvMsgListHeader;
                            }
                        }
                }
            }
        });
    }
}]);










