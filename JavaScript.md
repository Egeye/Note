## JavaScript
#### 网址

1. http://blog.csdn.net/xuemoyao/article/details/19021659
2. http://www.tuicool.com/articles/VF3Uf2E 
> [译]ECMAScript 6: 使用 Object.assign() 合并对象

### 代码片段
1. 获取标签id，来改变该style
  ```JavaScript
  document.getElementById('k5Resource').style.display = 'none';
  $('#k5Resource').removeAttr('style');
  if(testFlag){
    $('#k5Resource').css('display','none');
    testFlag = false;
  }else{
  	$('#k5Resource').css('display','block');
    testFlag = true;
  }
    let testFlag = true;
  ```

2. 数组去重
  ```JavaScript
  function deviceResultGet(datas) 
  {
    // resourceDatas = [x,x,x,x,x,x]
    for (let i = 0; i < datas.length; i++)
    {
        let targetResource = datas[i];
        resourceDatas.push(targetResource);
    }

    let arrObj = {};
    resourceDatas.map((e) => {
      arrObj[e.id] = e;
    })

    let keys = [];
    for (let property in arrObj) 
    {
      keys.push(arrObj[property]);
    }

    // result
    resourceDatas = keys;
  }
  ```

3. 时间格式
  ```JavaScript
  let date = new Date();
  let seperator1 = '/';
  let seperator2 = ':';
  let month = date.getMonth() + 1;
  let strDate = date.getDate();

  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }

  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + ' ' + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();     
  ```

4. substring、substr 
	```JavaScript
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
	```
