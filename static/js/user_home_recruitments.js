$(function () {
  $('.recruitment .delete').click(function () {
    var self = this;
    var rid = $(this).attr('rid');
    $.ajax({
      'url': '/recruitments/' + rid,
      'type': 'DELETE'
    }).done(function () {
      $(self).parents('.recruitment').remove();
      globalNotify.success('招募删除成功');
    }).fail(function () {
      globalNotify.failed('操作失败，请稍后再试');
    });
  });
})