function getDatas(datas) 
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
