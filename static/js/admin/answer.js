$(function () {
  // comment admin
  $('.comment .delete').click(function () {
    var aid = $(this).parents('.answer').attr('aid');
    var cid = $(this).parents('.comment').attr('cid');
    $.ajax({
      url: '/admin/answers/' + aid + '/comments/' + cid,
      type: 'DELETE'
    }).done(function () {
      window.location.reload();
    }).fail(function (resp) {
      alert('操作失败，请稍后再试');
      console.log(resp.responseText);
    });
  });

  $('.comment .edit').click(function () {
    var aid = $(this).parents('.answer').attr('aid');
    var cid = $(this).parents('.comment').attr('cid');
    var content = $(this).parents('.comment').find('.content').text();

    $("#commentEditModal #aid").val(aid);
    $("#commentEditModal #cid").val(cid);
    $("#commentEditModal #content").val(content);

    $('#commentEditModal').modal('show');
  });

  $("#commentEditModal #submit").click(function () {
    var aid = $("#commentEditModal #aid").val();
    var cid = $("#commentEditModal #cid").val();
    var content = $("#commentEditModal #content").val();

    var update = {
      'content': content
    };

    $.ajax({
      url: '/admin/answers/' + aid + '/comments/' + cid ,
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