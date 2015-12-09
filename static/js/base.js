/**
 * Query user's unread messages count
 *
 * @function
 * @param {String} uid - user id to query unread messages count
 * @return {JQuery Promise} promise
 *
 */
function getUnreadMessagesCount(uid) {
  var dfd = $.Deferred();

  if (!uid) {
    dfd.reject(new Error('uid is a must to query unread messages count'));
    return;
  }

  $.ajax({
    'url': '/users/' + uid + '/messagescount?read=false',
    'method': 'GET'
  }).done(function (res) {
    dfd.resolve(res.count);
  }).fail(function (resp) {
    dfd.reject(resp);
  });

  return dfd.promise();
}

/**
 * Query user's friend request count
 *
 * @function
 * @param {String} uid - user id to query unread messages count
 * @return {JQuery Promise} promise
 *
 */
function getFriendRequestCount(uid) {
  var dfd = $.Deferred();

  if (!uid) {
    dfd.reject(new Error('uid is a must to query unread messages count'));
    return;
  }

  $.ajax({
    'url': '/users/' + uid + '/todos',
    'method': 'GET'
  }).done(function (res) {
    dfd.resolve(res.needAction);
  }).fail(function (resp) {
    dfd.reject(resp);
  });

  return dfd.promise();
}

/**
 * Update the unread messages count in navigation bar
 *
 */
function updateUnreadMessagesCount() {
  var uid = $('#uid').val();
  getUnreadMessagesCount(uid)
    .done(function (count) {
    	if (count > 0) {
    		$('#unreadMessagesCount').text(count);
    	}
    })
    .fail(function (err) {
      console.error(err);
    });
}
/**
* Update the request
*
*/
function updateRequestListCount() {
  var uid = $('#uid').val();
  getFriendRequestCount(uid)
    .done(function (count) {
    	if (count >0){
    		$('#reminder').text('New');
      	$('#RequestCount').text('New');
      }
    })
    .fail(function (err) {
      console.error(err);
    });
}
/**
* Handle message
*
*/
function processMessage(msg) {
  //if msg is sent by me, just print on chat page
  //if user is on chat page to chat with user x and the msg if from x
  //the message should print on chat page and not be show on messgae notification
  //if user is on chat page, but the msg is from another user
  //the message should be shown on message notification
  //if user is not on chat page, the message should show on notification 
  var result = {};
  if (msg.from === $('#uid').val()) {
    result.print = true;
    result.notify = false;
    result.read = false;
  } else if (window.location.pathname.split('/')[1] === 'chat'
      && msg.from === window.location.pathname.split('/')[2]) {
    result.print = true;
    result.notify = false;
    result.read = true;
  } else {
    result.print = false;
    result.notify = true;
    result.read = false;
  }
  return result;
}

$(function () {
  // update the unread messages
  var uid = $('#uid').val();
  if (uid) {
    updateUnreadMessagesCount();
    updateRequestListCount();
  }
  var socket = io.connect('http://119.81.189.152');
  socket.on('connect', function (data) {
      console.log(data);  
  });
  socket.on('to'+$('#uid').val(), function (data) {
    console.log(data);
    var result=processMessage(data);
    console.log(result);
    if (result.notify) {
      var notice = new PNotify({
        title:'from ' + data.from,
        text:data.msg,
        icon: 'fa fa-envelope-o',
        nonblock: {
          nonblock:true,
          nonblock_opacity:.2
        },
        buttons:{
          closer: false,
          sticker: false
        }
      });
      notice.get().click(function(){
        notice.remove();
      })
    }
    if(result.print) {
      $('.chat_ul').append('<li> <div class="chat_left"><p class="chat_time">'+data.timestamp+'</p><p class="chat_content line_break">'+data.msg+'</p></div></li>')
    }
    if(result.read) {
      //TODO
    }
  });
  socket.on('add friend'+$('#uid').val(), function (data) {
    var result=processMessage(data);
    $('#reminder').text('New');
    $('#RequestCount').text('New');
    $('#receivedRequestCount').text('New');
    if (result.notify) {
      var notice = new PNotify({
        title: data.from + ' 申请成为好友',
        text:data.msg,
        icon: 'fa fa-envelope-o',
        nonblock: {
          nonblock:true,
          nonblock_opacity:.2
        },
        buttons:{
          closer: false,
          sticker: false
        }
      });
      notice.get().click(function(){
        notice.remove();
      })
    }
    if(result.print) {
      $('.chat_ul').append('<li> <div class="chat_left"><p class="chat_time">'+data.timestamp+'</p><p class="chat_content line_break">'+data.msg+'</p></div></li>')
    }
    if(result.read) {
      //TODO
    }
    if (window.location.pathname.split('/')[1] === 'home' && window.location.pathname.split('/')[2] === 'friends'){
    	window.location.reload();
    }
  });
  $('.caption p').each(function(){
    var _text = $(this).text();
    if(_text.length>35){
    $(this).text(_text.substring(0,35)+'...');
    }
  });
});

