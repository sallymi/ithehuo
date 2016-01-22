$(function () {
  $('#resetPasswordForm').submit(function (event) {
    event.preventDefault();

    var passChange = {};
    var formData = $(this).serializeArray();
    $.each(formData, function (index, field) {
      passChange[field.name] = field.value;
    });
    passChange['user'] = $('#user').val();

    $.ajax({
      url: '/signup/reset/password',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(passChange)
    }).done(function (res) {
      $.ajax({
        url: '/signin',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({username: $('#user').val(), password: passChange['new_pwd']})
      }).done(function(res){
        window.location='/'
      })
    }).fail(function (resp) {
      globalNotify.failed(JSON.parse(resp.responseText).msg);
    });
  });

});