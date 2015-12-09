$(function () {
  // comment admin
  $('.comment .delete').click(function () {
    var qid = $(this).parents('.question').attr('qid');
    var cid = $(this).parents('.comment').attr('cid');
    $.ajax({
      url: '/admin/questions/' + qid + '/comments/' + cid,
      type: 'DELETE'
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });

  $('.comment .edit').click(function () {
    var qid = $(this).parents('.question').attr('qid');
    var cid = $(this).parents('.comment').attr('cid');
    var content = $(this).parents('.comment').find('.content').text();

    $("#commentEditModal #qid").val(qid);
    $("#commentEditModal #cid").val(cid);
    $("#commentEditModal #content").val(content);

    $('#commentEditModal').modal('show');
  });

  $("#commentEditModal #submit").click(function () {
    var qid = $("#commentEditModal #qid").val();
    var cid = $("#commentEditModal #cid").val();
    var content = $("#commentEditModal #content").val();

    var update = {
      'content': content
    };

    $.ajax({
      url: '/admin/questions/' + qid + '/comments/' + cid ,
      type: 'PUT',
      data: update
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });

  // answer admin
  $('.answer .delete').click(function () {
    var aid = $(this).parents('.answer').attr('aid');
    $.ajax({
      url: '/admin/answers/' + aid,
      type: 'DELETE'
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });

  $('.answer .edit').click(function () {
    var aid = $(this).parents('.answer').attr('aid');
    var content = $(this).parents('.answer').find('.content').text();

    $("#answerEditModal #aid").val(aid);
    $("#answerEditModal #content").val(content);

    $('#answerEditModal').modal('show');
  });

  $("#answerEditModal #submit").click(function () {
    var aid = $("#answerEditModal #aid").val();
    var content = $("#answerEditModal #content").val();

    var update = {
      'content': content
    };

    $.ajax({
      url: '/admin/answers/' + aid,
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