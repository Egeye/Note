/**
 * [获取标签id，来改变该style]
 * @param  {[type]}  [description]
 * @return {[type]}  [description]
 */
document.getElementById('elemId').style.display = 'none';
$('#elemId').removeAttr('style');

if (testFlag) {
    $('#elemId').css('display', 'none');
    testFlag = false;
}
else {
    $('#elemId').css('display', 'block');
    testFlag = true;
}
