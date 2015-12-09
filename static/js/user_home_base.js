$(document).ready(function(){
  var url='/home/projects';
    $.ajax({
      'url': url,
      'type': 'GET',
      'contentType': 'application/json',
      'headers':{
      	'Accept': 'json'
      }
    }).done(function (data) {
      $('#projects').html(data.length);
    });
    $.ajax({
      'url': '/home/recruitments',
      'type': 'GET',
      'contentType': 'application/json',
      'headers':{
      	'Accept': 'json'
      }
    }).done(function (data) {
      $('#recruitments').html(data.length);    
    });
    // $.ajax({
    //   'url': '/home/recruitments?publish=true',
    //   'type': 'GET',
    //   'contentType': 'application/json',
    //   'headers':{
    //     'Accept': 'json'
    //   }
    // }).done(function (data) {
    //   $('#recruitments_valid').html(data.length);     
    // });
    // $.ajax({
    //   'url': '/home/recruitments?publish=false',
    //   'type': 'GET',
    //   'contentType': 'application/json',
    //   'headers':{
    //     'Accept': 'json'
    //   }
    // }).done(function (data) {
    //   $('#recruitments_offline').html(data.length);     
    // });
});