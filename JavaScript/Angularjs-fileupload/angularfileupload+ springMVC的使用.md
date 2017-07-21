http://www.cnblogs.com/wangzun/p/6099884.html

最近项目中需要用到文件上传，使用了angular-file-upload插件完成

首先来介绍下这个插件的一些属性（参考官方文档）

### FileUploader
#### 属性

url {String}: 上传文件的服务器路径
alias {String}:  包含文件的名称，默认是file
queue {Array}: 上传队列
progress {Number}: 上传队列的进度，只读
headers {Object}: 上传的头文件信息， 浏览器需支持HTML5
formData {Array}: 与文件一起发送的表单数据
filters {Array}: 在文件加入上传队列之前应用过滤器.，如果过滤器返回true则文件加入队列中
autoUpload {Boolean}: 文件加入队列之后自动上传，默认是false
method {String}: 请求方式，默认是POST，浏览器需支持HTML5
removeAfterUpload {Boolean}: 文件上传成功之后从队列移除，默认是false
isHTML5 {Boolean}: 如果浏览器支持HTML5上传则返回true，只读
isUploading {Boolean}: 文件正在上传中返回true，只读
queueLimit {Number} : 最大上传文件数量（预定义）
withCredentials {Boolean} : 使用CORS，默认是false， 浏览器需支持HTML5

#### 方法

* addToQueue function(files[, options[, filters]]) {: Add items to the queue, where files is a {FileList|File|HTMLInputElement}, options is an {Object} andfilters is a {String}.  添加项到上传队列中，files 是 {FileList|File|HTMLInputElement}， options 是 {Object} 以及 filters 是 {String}
* removeFromQueue function(value) {: Remove an item from the queue, wherevalue is {FileItem} or index of item.  从上传队列移除项，value 可以是 {FileItem} 或者项的序号
* clearQueue function() {: Removes all elements from the queue.  移除上传队列所有的元素
* uploadItem function(value) {: Uploads an item, where value is {FileItem} or index of item.  上传项， value 可以是 {FileItem} 或者项的序号
* cancelItem function(value) {: Cancels uploading of item, where value is{FileItem} or index of item.  取消上传的项
* uploadAll function() {: Upload all pending items on the queue.  将上传队列中所有的项进行上传
* cancelAll function() {: Cancels all current uploads.  取消所有当前上传
* destroy function() {: Destroys a uploader. 
* isFile function(value) {return {Boolean};}: Returns true if value is {File}. 
* isFileLikeObject function(value) {return {Boolean};}: Returns true if value is{FileLikeObject}.
* getIndexOfItem function({FileItem}) {return {Number};}: Returns the index of the{FileItem} queue element.  返回项在上传队列中的序号
* getReadyItems function() {return {Array.<FileItems>};}: Return items are ready to upload.  返回准备上传的项
* getNotUploadedItems function() {return {Array.<FileItems>};}: Return an array of all pending items on the queue  返回上传队列中未上传的项

#### 回调函数

onAfterAddingFile function(item) {: 添加文件到上传队列后
onWhenAddingFileFailed function(item, filter, options) {: 添加文件到上传队列失败后
onAfterAddingAll function(addedItems) {: 添加所选的所有文件到上传队列后
onBeforeUploadItem function(item) {: 文件上传之前
onProgressItem function(item, progress) {: 文件上传中
onSuccessItem function(item, response, status, headers) {: 文件上传成功后
onErrorItem function(item, response, status, headers) {: 文件上传失败后
onCancelItem function(item, response, status, headers) { - 文件上传取消后
onCompleteItem function(item, response, status, headers) {: 文件上传完成后
onProgressAll function(progress) {: 上传队列的所有文件上传中
onCompleteAll function() {: 上传队列的所有文件上传完成后

***
使用
当然首先需要加入插件的js

1. bower
> bower install angular-file-upload

2. 在页面导入js
<script src="bower_components/angular-file-upload/dist/angular-file-upload.min.js"></script>

3. 加入angularFileUpload
var myapp = angular.module('add',['angularFileUpload'])
 
我这里是上传的图片所以代码如下：
```HTML
<div ng-controller="addProduct">
	<div>
		<lable>产品名称</lable>
		<input type="text" ng-model="productInfo.name">
	</div>
	<div>
		<lable>产品型号</lable>
		<input type="text" ng-model="productInfo.type">
	</div>
	<div>
		<lable>产品图片</lable>
		<input type="file" 
			   name="photo" 
			   nv-file-select=""  
			   uploader="uploader" 
			   accept="image/*" 
			   ngf-max-size="2MB" 
			   ngf-model-invalid="errorFile" />
	</div>
	<div>
		<button class="btn btn-info" ng-click="addProduct()">
	</div>
</div>
```

>> 这个是最简单的使用主要是uploader这个属性，其他的accept、ngf-max-size、ngf-model-invalid都是一些限制图片的属性

```JavaScript
myapp.controller('addProduct', ['$scope', '$http', 'FileUploader', function($scope, $http, FileUploader) {
	//在外围定义一个数组，赋值给formData,通过改变此数组，实现数据的改变
	var productInfo = [];
	var uploader = $scope.uploader = new FileUploader({
		url: 'add',
		formData: productInfo
	});

	uploader.onSuccessItem = function(fileItem, response, status, headers) {
		alert(response);
	};

	$scope.addProduct = function() {
		uploader.uploadAll();
	}
	
}])
```
 
```Java
@RequestMapping(value="add",method = RequestMethod.POST)
public ResponseEntity<Object> addProduct(@RequestParam("file") MultipartFile uploadFiles,ProductVo productVo) {
    String fileName=uploadFile.getOriginalFilename();
    String prefix="."+fileName.substring(fileName.lastIndexOf(".")+1);
    File dst=null;
    try {
        String root = System.getProperty("catalina.base");    //获取tomcat根路径
        File uploadDir = new File(root, "webapps/upload");    //创建一个指向tomcat/webapps/upload目录的对象
        if (!uploadDir.exists()) {
            uploadDir.mkdir();                                //如果不存在则创建upload目录
        }
        dst = new File(uploadDir, 
                UUID.randomUUID().toString()+prefix);                //创建一个指向upload目录下的文件对象，文件名随机生成    
        uploadFile.transferTo(dst);                            //创建文件并将上传文件复制过去
    } catch (Exception e) {
        e.printStackTrace();
    }
      //然后把路径set到productVo中 完成添加 "/upload/"+dst.getName();
}
```

主要问题
在Js中给formData赋值 因为formData的new生成的所以 就是固定不变的，如果直接写formData：[$scope.prodctInfo]，就会导致formData没有值，后台就获取不到其他数据了。
