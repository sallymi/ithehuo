function showUnreadMessage() {
  $('.message-list').hide();
  $('.unread').show();
  $('#content_link').show();
  $('#content').hide();
  $('#unread_link').hide();
  $('#unread').show();
}
function showAllMessage() {
  $('.message-list').show();
  $('.unread').hide();
  $('#content_link').hide();
  $('#content').show();
  $('#unread_link').show();
  $('#unread').hide();
}
function onkey(e){
  console.log(e);
  if(e.keyCode == 13 && e.ctrlKey){
      $('#message').value += "\r\n";
  }else if(e.keyCode == 13 && !e.shiftKey && !e.ctrlKey && !e.altKey){
      // 避免回车键换行
      e.preventDefault();
      // 下面写你的发送消息的代码
     $('#submit').click();
  }
}
$(function () {
  showAllMessage();
  $('#submit').click(function () {
    var msg = {
      'to': $('#targetUser').val(),
      'from': $('#uid').val(),
      'msg': $('#message').val()
    };
    $.ajax({
      url: '/messages',
      type: 'POST',
      data: msg
    }).done(function (data) {
      // TODO， append messages to page
      $('.chat_ul').append('<li> <div class="chat_right"><p class="chat_time">'+data.timestamp+'</p><p class="chat_content line_break">'+data.msg+'</p></div></li>')
      $('#message').val("");
      $('.msg_chat').scrollTop(1000);
      socket.emit('private message', msg.from, msg.to, msg.msg, data.timestamp);
      
    }).fail(function (resp) {
      globalNotify.failed('消息发送失败，请稍后再试');
      console.log(resp.responseText);
    });
   });
  
});