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
  $('#settingMobileForm').submit(function (event) {
    event.preventDefault();

    var mobileChange = {};
    var formData = $(this).serializeArray();
    $.each(formData, function (index, field) {
      mobileChange[field.name] = field.value;
    });

    $.ajax({
      url: '/home/settings/mobile',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(mobileChange)
    }).done(function (res) {
      errorNotify.success(res.msg);
    }).fail(function (resp) {
      errorNotify.failed(JSON.parse(resp.responseText).msg);
    });
  });

});