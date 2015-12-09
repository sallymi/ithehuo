$(function () {
  $('.question .delete').click(function () {
    var qid = $(this).parents('.question').attr('qid');
    $.ajax({
      url: '/admin/questions/' + qid,
      type: 'delete'
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });

  $('.question .edit').click(function () {
    var qid = $(this).parents('.question').attr('qid');
    var title = $(this).parents('.question').find('.title').text();
    var content = $(this).parents('.question').find('.content').text();

    $("#questionEditModal #qid").val(qid);
    $("#questionEditModal #title").val(title);
    $("#questionEditModal #content").val(content);

    $('#questionEditModal').modal('show');
  });

  $("#questionEditModal #submit").click(function () {
    var qid = $("#questionEditModal #qid").val();
    var title = $("#questionEditModal #title").val();
    var content = $("#questionEditModal #content").val();

    var update = {
      'title': title,
      'content': content
    };

    $.ajax({
      url: '/admin/questions/' + qid,
      type: 'PUT',
      data: update
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });

  });

});