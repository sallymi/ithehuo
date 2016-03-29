function showFriends() {
  $('.friends').show();
  $('.sent-requests').hide();
  $('.received-requests').hide();
  $('#myfriends_link').hide();
  $('#myfriends').show();
  $('#myRequests_link').show();
  $('#myRequests').hide();
  $('#receivedRequests_link').show();
  $('#receivedRequests').hide();
}
function showRequests() {
  $('.friends').hide();
  $('.sent-requests').show();
  $('.received-requests').hide();
  $('#myfriends_link').show();
  $('#myfriends').hide();
  $('#myRequests_link').hide();
  $('#myRequests').show();
  $('#receivedRequests_link').show();
  $('#receivedRequests').hide();
}
function showReceivedReq() {
  $('.friends').hide();
  $('.sent-requests').hide();
  $('.received-requests').show();
  $('#myfriends_link').show();
  $('#myfriends').hide();
  $('#myRequests_link').show();
  $('#myRequests').hide();
  $('#receivedRequests_link').hide();
  $('#receivedRequests').show();
}
function reminderRequest(id, msg) {
  console.log(id);
  console.log(msg);
  var data = {
    'targetId': id,
    'requestMsg':msg
  };
  
  $.ajax({
    'type': 'POST',
    'url': '/requests/',
    'data': data
  }).done(function () {
    globalNotify.success('请求已发送');
  }).fail(function (resp) {
    globalNotify.failed('请求发送失败');
  });
}
function updateRequestListCount() {
  var uid = $('#uid').val();
  getFriendRequestCount(uid)
    .done(function (count) {
    	if (count >0){
      	$('#receivedRequestCount').text('New');
      }
    })
    .fail(function (err) {
      console.error(err);
    });
}
$(function () {
  showFriends();
  //updateRequestListCount();
  // accept, deny or ignore friend request
  $('.received-requests .action').click(function () {
    var requestId = $(this).parents('.request').attr('requestId');
    var action = $(this).attr('action');
    $.ajax({
        'url': '/requests/' + requestId + '/' + action,
        'type': 'PUT'
      }).done(function () {
        window.location.reload();
      }).fail(function () {
        globalNotify.failed('操作失败，请稍后再试');
      });
  });
  // terminate friend relation
  $('.friends .action.terminate').click(function () {
    var relationId = $(this).parents('.friends').attr('relationId');
    $.ajax({
        'url': '/relations/' + relationId + '/terminate',
        'type': 'PUT'
      }).done(function (data) {
      	console.log(data);
        window.location.reload();
      }).fail(function () {
        globalNotify.failed('操作失败，请稍后再试');
      });
  });
});