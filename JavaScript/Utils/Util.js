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
