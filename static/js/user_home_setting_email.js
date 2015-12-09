$(function () {
  $('#settingEmailForm').submit(function (event) {
    event.preventDefault();

    var emailChange = {};
    var formData = $(this).serializeArray();
    $.each(formData, function (index, field) {
      emailChange[field.name] = field.value;
    });

    $.ajax({
      url: '/home/settings/email',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(emailChange)
    }).done(function (res) {
      globalNotify.success(res.msg);
    }).fail(function (resp) {
      globalNotify.failed(JSON.parse(resp.responseText).msg);
    });
  });

});