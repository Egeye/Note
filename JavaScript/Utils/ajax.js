$(document).ready(function () {
    $.ajax({
        type: "post",
        url: '${basePath}/sourceCode/detailUEditor',
        async: true,
        data: {"id": 'xx'},
        success: function (response) {
        }
    });
});