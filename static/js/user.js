$(function () {
  // add following
  $('#addFollowing').click(function () {
    var uid = $('#user').val();
    var data = {
      'targetId': uid
    };
    $.ajax({
      'type': 'POST',
      'url': '/followings',
      'data': data
    }).done(function () {
      $('#addFollowing').hide();
      $('#removeFollowing').show();
      globalNotify.success('关注成功');
    }).fail(function (resp) {
      globalNotify.failed('关注失败');
      console.log(resp.responseText);
    });
  });

  // remove following
  $('#removeFollowing').click(function () {
    var targetId = $('#user').val();
    $.ajax({
      'type': 'DELETE',
      'url': '/followings/' + targetId
    }).done(function () {
      $('#removeFollowing').hide();
      $('#addFollowing').show();
      globalNotify.success('取消关注成功');
    }).fail(function (resp) {
      globalNotify.failed('取消关注失败');
      console.log(resp.responseText);
    });
  });

  // requset to add friend
  // $('#requestAddFriend').click(function () {
  //   var targetId = $('#user').val();
  //   var requestMsg = $('.requestMsg').val();
  //   var data = {
  //     'targetId': targetId,
  //     'requestMsg':requestMsg
  //   };
    
  //   $.ajax({
  //     'type': 'POST',
  //     'url': '/requests',
  //     'data': data
  //   }).done(function (data) {
  //   	console.log(data);
  //     $('#addFriend').text('再次发送好友申请');
  //     globalNotify.success('请求已发送');
  //     $('.user-request').modal('hide');
  //     socket.emit('add friend', $('#uid').val(), targetId, requestMsg, data.creation_time);
  //   }).fail(function (resp) {
  //     //globalNotify.failed('请求发送失败');
  //     alert("err");
  //   });
    
  // });
  $('#requestFriend').validate({
    errorElement : 'small',  
    errorClass : 'error',  
    focusInvalid : false,  
    rules : {  
      requestMsg : {  
          required : true  
      }
    },
    messages : {  
      requestMsg : {  
          required : "好友申请留言"  
      }
    },
    submitHandler:function(form){
      var targetId = $('#user').val();
	    var requestMsg = $('.requestMsg').val();
	    var data = {
	      'targetId': targetId,
	      'requestMsg':requestMsg
	    };
	    
	    $.ajax({
	      'type': 'POST',
	      'url': '/requests',
	      'data': data
	    }).done(function (data) {
	    	console.log(data);
	      $('#addFriend').text('再次发送好友申请');
	      globalNotify.success('请求已发送');
	      $('.user-request').modal('hide');
	      socket.emit('add friend', $('#uid').val(), targetId, requestMsg, data.creation_time);
	    }).fail(function (resp) {
	      globalNotify.failed('请求发送失败');
	    });
    }
  })
});

