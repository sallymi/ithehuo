$(function () {
  $('#user-table .add').click(function () {
    var uid = $(this).parents('.user').attr('uid');
    var data = {
      'uid': uid
    };
    var type = $(this).attr('type');
    $.ajax({
      url: '/admin/users/' + type,
      type: 'post',
      data: data
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });

  $('#user-table .remove').click(function () {
    var uid = $(this).parents('.user').attr('uid');
    var data = {
      'uid': uid
    };
    var type = $(this).attr('type');
    $.ajax({
      url: '/admin/users/' + type,
      type: 'delete',
      data: data
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });
});