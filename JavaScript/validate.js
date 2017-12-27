/**自定义模块*/
layui.define(['jquery'], function (exports) {
    var $ = layui.jquery;
    var validate = {
    	// ip地址
		ip: function(v, i) {
			var regex = "^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
	                    + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\." + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
	                    + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$";
	        return new RegExp(regex).test(v)
		},
		// 端口号
		port: function(v, i) {
			return (/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(v))
		},
		// 邮箱地址
		email: function (v, i) {
			return (/^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$|^1[3|4|5|7|8]\d{9}$/.test(v))
	  	},
	  	// qq
	  	qq: function (v, i) {
	  		return (/^[1-9]\d{4,8}$/.test(v))
		},
	  	// 手机号码
	  	phone: function (v, i) {
	  		return (/^1[3|4|5|7|8]\d{9}$/.test(v))
	  	},
	  	// 电话号码+手机号码
	  	telephone: function(v, i) {
	  		return this.fax(v) || this.phone(v)
	  	},
	  	// 传真号码  == 电话号码
	  	fax: function(v, i) {
	  		return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.exec(v))
	  	},
	  	// 经度
	  	longtitude: function (v, i) {
			return (/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(v))
		},
		// 纬度
		latitute: function(v, i) {
			return (/^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/.test(v))
		},
		// 判断是否为空
		isNull: function(v) {
			return (void 0 === v || null === v || '' === v)
		},
		// 输入的是中文
		isChinese: function(v, i) {
			return ('' !== v && /^[\u0391-\uFFE5]+$/.test(v))
		},
		// 字母
		isAlpha: function(v, i) {
			return ('' !== v && /^[a-zA-Z]*$/.test(v))
		},
		// 数字
		isNumber: function(v, i) {
			return ('' !== v && /^[0-9]+$/.test(v))
		},
		// 英文数字
		isAlphaNumber: function (v, i) {
			return ('' !== v && /^[0-9a-zA-Z]*$/.test(v))
		},
		// 整数
		isInt: function(v, i) {
			return ('' !== v && /^/d+$/.test(v))
		}
		
    };
    exports('validate', validate)
},

/**
 * 验证输入内容只为字母数字
 * @param value
 * @returns {boolean}
 */
function isAlphabetNumber(value) {
    return (/^[0-9a-zA-Z]+$/.test(value));
}




