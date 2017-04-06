1. 
```JavaScript
/*
* ALLOWED_IP_ADDRESS_FIRST_OCTET: '0-255',
* ALLOWED_IP_ADDRESS_SECOND_OCTET: '0-255',
* ALLOWED_IP_ADDRESS_THIRD_OCTET: '0-255',
* ALLOWED_IP_ADDRESS_FOURTH_OCTET: '1-254',
*/
checkIPv4Address(value) {
  try {
    const pattern = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
    const resPattern = new RegExp(pattern);
    const res = resPattern.test(value);
    return res;
  } catch (e) {
    Logger.error(e.stack);
  }
  return false;
}
```

2. 
```Java
/**
 * Single-byte lowercase check
 * @param   {string} value [[Description]]
 * @returns {boolean} Single-byte lowercase character: true, Otherwise: false
 */
isAlphabeticLowerCaseCharacter(value) {
  try {
    const pattern = /[a-z]+/;
    const resPattern = new RegExp(pattern);
    const res = resPattern.test(value);
    return res;
  } catch (err) {
    Logger.error(err.stack);
  }
  return false;
}
```
