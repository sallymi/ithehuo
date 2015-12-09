$(function () {
  $('#settingPasswordForm').submit(function (event) {
    event.preventDefault();

    var passChange = {};
    var formData = $(this).serializeArray();
    $.each(formData, function (index, field) {
      passChange[field.name] = field.value;
    });

    $.ajax({
      url: '/home/settings/password',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(passChange)
    }).done(function (res) {
      globalNotify.success(res.msg);
    }).fail(function (resp) {
      globalNotify.failed(JSON.parse(resp.responseText).msg);
    });
  });

});