$(function () {
  $('#project-table .add').click(function () {
    var pid = $(this).parents('.project').attr('pid');
    var data = {
      'pid': pid
    };
    var type = $(this).attr('type');
    $.ajax({
      url: '/admin/projects/' + type,
      type: 'post',
      data: data
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });

  $('#project-table .remove').click(function () {
    var pid = $(this).parents('.project').attr('pid');
    var data = {
      'pid': pid
    };
    var type = $(this).attr('type');
    $.ajax({
      url: '/admin/projects/' + type,
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