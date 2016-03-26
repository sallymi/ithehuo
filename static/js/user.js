

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
  //    console.log(data);
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
  $('body').delegate('.load-more','click',function(){
    if($(this).text().indexOf('加载中')>-1)return; //防止二次提交
    $(this).text('加载中。。。');
    var page = parseInt($(this).data('page'));
    var limit = parseInt($(this).data('limit'));
    var self = this;
    var url = '';
    if(!window.location.search)
      url = '/usersAjax?limit='+$(this).data('limit')+'&page=';
    else
      url = '/usersAjax'+window.location.search+'&limit='+$(this).data('page')+'&page='
    Loading.prototype.loadMore(url+(page+1),function(users){
      if(users.length<limit) {
        $('.load-more').remove();
      }else{
        $(self).text('加载更多');
      }
      users.forEach(function(item,idx){
        var user = item;
        var text = $.clone($('.panel-body li:first-child')[0]);
        $(text).find('.media-left a').attr('href','/users/'+item._id);
        var Arr = ["a6-160","a7-160","a8-160","a9-160","a10-160","a11-160","a12-160","a13-160","a14-160","a15-160"];
        var n = Math.floor(Math.random() * Arr.length + 1)-1;
        $(text).find('img.media-object').attr('src',user.logo_img?user.logo_img:'/images/avatars/'+Arr[n]+'.png');
        $(text).find('.media-heading a').attr('href','/users/'+item._id);
        $(text).find('.media-heading a strong').text(user.name?user.name:(user.email?user.email.split('@')[0]:(user.mobile_phone?user.mobile_phone.toString().substring(0,3)+"****"+user.mobile_phone.toString().substring(8,11):"ID:"+user.id)));
        $(text).find('.media-heading small').text(user.role);
        $(text).find('.media-heading .small:first-child').html('<strong>地址</strong>'+(user.location?user.location:'创业者暂未公布'));
        $(text).find('.media-heading .small:nth-child(2)').html('<strong>状态</strong>'+(user.status?user.status:'创业者暂未公布'));
        $(text).find('.media-heading .small:nth-child(3)').html('<strong>个人一句话描述</strong>'+(user.description?user.description:'创业者暂未公布'));
        $(text).appendTo('.panel-body');
      });
      
    });
    $(this).data('page',page+1);
  })
});
function cutString(str, len) {
  if(str.length*2 <= len) {
    return str;
  }
  var strlen = 0;
  var s = "";
  for(var i = 0;i < str.length; i++) {
    s = s + str.charAt(i);
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2;
      if(strlen >= len){
        return s.substring(0,s.length-1) + "...";
      }
    } else {
      strlen = strlen + 1;
      if(strlen >= len){
        return s.substring(0,s.length-2) + "...";
      }
    }
  }
  return s;
}

var Loading = function(){};
Loading.prototype.loadMore = function(query,render){
  $.ajax({
    url:query,
    success:function(res,status,xhr){
      render(res.users)
    }
  });
}

