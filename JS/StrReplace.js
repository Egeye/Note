function strReplace(str, num) 
{
	return str.replace(/\{([^{}]*)\}/g, function (a, b) 
	{
		let r = num[b];
		return typeof r === 'string' || typeof r === 'number' ? r : a;
	});
}
