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
    		// $('#unreadMessagesCount').text(count);
        $('#unreadMessagesCount').show();
    	}else{
        $('#unreadMessagesCount').hide();
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
    		// $('#reminder').text('New');
      // 	$('#RequestCount').text('New');
        $('#reminder').show();
        $('#RequestCount').show();
      }else{
        $('#reminder').hide();
        $('#RequestCount').hide();
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
$(document).ready(function () {
  $('ul.nav > li').click(function (e) {
    //e.preventDefault();
  $('ul.nav > li').removeClass('active');
    $(this).addClass('active');
  });
  if(location.href.indexOf("recruitments") !== -1){
    $('.entry-btn').attr('href','/users');
    $('.entry-btn').text('进入企业版');
    $('.actionBtn a').attr('href','/new/recruitment');
    $('.actionBtn a').text('发布合伙需求')
    $('ul.nav > li.recruitments').addClass('active');
    $('.mobile-nav > a.recruitments').addClass('active');
  }
  if(location.href.indexOf("users") !== -1){
    $('.entry-btn').attr('href','/recruitments');
    $('.entry-btn').text('进入个人版');
    $('.actionBtn a').attr('href','/home');
    $('.actionBtn a').text('成为专业人才')
    $('ul.nav > li.users').addClass('active');
    $('.mobile-nav > a.users').addClass('active');
  }

  if(location.href.indexOf("projects") !== -1){
    $('.actionBtn a').attr('href','/new/project');
    $('.actionBtn a').text('发布项目');
    $('ul.nav > li.projects').addClass('active');
    $('.mobile-nav > a.projects').addClass('active');
  }
  if(location.href.indexOf("messages") !== -1){
    $('ul.nav > li.messages').addClass('active');
  }

});
$(function () {
  // update the unread messages
  var uid = $('#uid').val();
  if (uid) {
    updateUnreadMessagesCount();
    updateRequestListCount();
  }
  var socket = io.connect('http://119.81.189.157');
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
    //session storage

  });
  $('.caption p').each(function(){
    var _text = $(this).text();
    if(_text.length>35){
    $(this).text(_text.substring(0,35)+'...');
    }
  });
  var storage = window.sessionStorage;
  var localstorage = window.localStorage;
  var uid = $('#uid').val();
  var profile = $('#profile').val();
  if(!uid){
    storage.removeItem("reminder");
    storage.removeItem("intro");
    localstorage.removeItem("intro");
  }else{
    if(!localstorage.getItem("intro")){
      localstorage.setItem("intro", true);
    }
    if(localstorage.intro==="true"&& IsPC()){
      $('.guide').show();
      localstorage.intro = false;
    }
    if(!profile){
      if(!storage.getItem("reminder")){
        storage.setItem("reminder", 0);
      }
      if(storage.reminder==="0"){
        var notice = new PNotify({
            title:'完善个人信息！',
            text:'完善个人信息，让更多创业者找到你',
            icon: 'fa fa-envelope-o',
            type: 'info',
            hide: false,
            confirm: {
              confirm: true,
              buttons: [{
                text: '完善信息',
                addClass: 'btn-primary',
                click: function(notice){
                  window.location.href = '/home';
                }
              },
              {
                text: '稍后再说',
                click: function (notice){
                  notice.remove();
                }
              }]
            },
            buttons: {
              closer_hover: false,
              sticker: false
            },
            history: {
              history: false
            }
          });
        storage.reminder=1;
      }else{
        storage.reminder = parseInt(storage.getItem("reminder")) + 1;
      }
    }

  } 
  
  console.log(storage.reminder);
  $('.lend_img1').on('click', function(){
    $('.guide').hide();
  });
  $('.lend_img2').on('click', function(){
    $('.guide').hide();
  });
  $('.lend_img3').on('click', function(){
    $('.guide').hide();
  });
  $('.lend_about').on('click', function(){
    $('.guide').hide();
  });
  // $('[data-toggle="popover"]').popover();
  $('#login-button1').popover({   
      html : true,
      content: function() {  
        return $(".popover").html();  
      }  
  });
  $('#login-button1').on('shown.bs.popover', function(){
    var position = parseInt($('.popover').position().left);
    // var pos2 = parseInt($('#login-button').position().top) - 5;
    // var x = pos2 - position + 5;
    //  if ($('.popover').height < x)
    //  x = $('.popover').height;
     // $('.popover.left .arrow').css('top', x + 'px');
     // $('.popover .arrow').css('left', '90%');
     // var position2 = parseInt($('.popover .arrow').position().left);
     // $('.popover').css('left', position-position2/2);


  });
  $('ul.form_head > li').click(function (e) {
    e.preventDefault();
    $('ul.form_head > li').removeClass('active');
    $(this).addClass('active');
    if($(this).attr('name')=='by_email'){
      $('span.tab_active').css('left','218px');
      $('.by_phone').hide();
      $('.by_email').show();
    }else{
      $('span.tab_active').css('left','0');
      $('.by_email').hide();
      $('.by_phone').show();
    }
    
  });
  $('.reflash').click(function(e){
    $('img.captcha').attr("src", "/getCaptcha?rnd="+Math.random());
  });
  //获取短信验证码
  var seed = 60;
  var t1 = null;
  $('#getSmsCode').click(function(e){
    console.log("here");
    var phone = $("#phone").val();
    var patt1 = new RegExp(/^(\+?0?86\-?)?1[345789]\d{9}$/);
    if(!patt1.test(phone)){
      alert("手机号不合规范，请输入11位中国大陆手机号！");
      //setTimeout($("#phone"))
      return
    }
    $.ajax({
      'url': '/sms/' + phone,
      'method': 'GET'
    }).done(function (res) {
      $("#getSmsCode").attr("disabled","disabled");
      t1 = setInterval(tip,1000);
    }).fail(function (resp) {
      $()
    });
  });

  function tip() {
    seed--;
    if (seed < 1) {
      $("#getSmsCode").removeAttr("disabled").text("获取验证码");
      seed = 60;
      var t2 = clearInterval(t1);
    } else {
      $("#getSmsCode").text(seed+" s后重新发送");
    }
  }

  function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
      "SymbianOS", "Windows Phone",
      "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }



});

