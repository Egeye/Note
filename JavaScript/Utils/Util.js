/*
* ALLOWED_IP_ADDRESS_FIRST_OCTET: '0-255',
* ALLOWED_IP_ADDRESS_SECOND_OCTET: '0-255',
* ALLOWED_IP_ADDRESS_THIRD_OCTET: '0-255',
* ALLOWED_IP_ADDRESS_FOURTH_OCTET: '1-254',
*/
function checkIPv4Address(value) {
    try {
        const pattern = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
        const result = pattern.test(value);
        return result;
    } catch (e) {
        console.log(err.stack);
    }
    return false;
}

/**
 * Single-byte lowercase check
 * @param   {string} value [[Description]]
 * @returns {boolean} Single-byte lowercase character: true, Otherwise: false
 */
function isAlphabeticLowerCase(value) {
    try {
        const pattern = /[a-z]+/;

        /** Single-byte uppercase character */
        // const pattern = /[A-Z]+/;

        /** Single-byte numbers */
            // const pattern = /[0-9]+/;

        const result = pattern.test(value);
        return result;
    } catch (err) {
        console.log(err.stack);
    }
    return false;
}

function getDate() {
    var date = new Date();
    var currentTime = date.Format("yyyy-MM-dd hh:mm:ss");

}

Date.prototype.Format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
