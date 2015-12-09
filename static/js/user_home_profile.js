$(function () {
  /**
   * Event handler for user profile form submit
   * will prevetn default form submit and submit via ajax
   *
   * @function
   * @param event - form submit event
   *
   */
  // $('#userProfileForm').submit(function (event) {
  //   event.preventDefault();
  //   //$('#userProfileForm #submitBtn').button('loading');
  //   var aFormData = $(this).serializeArray();
  //   var oUser = {};
  //   $.each(aFormData, function (index, field) {
  //     oUser[field.name] = field.value;
  //   });

  //   oUser.educations = [];
  //   $('.educations > .education').each(function (index, edu) {
  //     oUser.educations.push({
  //       'start_time': $(edu).find('.start_time').val(),
  //       'end_time': $(edu).find('.end_time').val(),
  //       'school': $(edu).find('.school').val(),
  //       'description': $(edu).find('.description').val()
  //     });
  //   });

  //   oUser.work_experiences = [];
  //   $('.works > .work').each(function (index, work) {
  //     oUser.work_experiences.push({
  //       'start_time': $(work).find('.start_time').val(),
  //       'end_time': $(work).find('.end_time').val(),
  //       'corporation': $(work).find('.corporation').val(),
  //       'title': $(work).find('.title').val(),
  //       'description': $(work).find('.description').val(),
  //     });
  //   });

  //   oUser.startup_experiences = [];
  //   $('.startups > .startup').each(function (index, startup) {
  //     oUser.startup_experiences.push({
  //       'start_time': $(startup).find('.start_time').val(),
  //       'end_time': $(startup).find('.end_time').val(),
  //       'role': $(startup).find('.role').val(),
  //       'name': $(startup).find('.name').val(),
  //       'description': $(startup).find('.description').val(),
  //     });
  //   });

  //   oUser.logo_img = $('#user_logo')[0].attributes["src"].value;

  //   var url = '/users/' + $('#uid').val();
  //   $.ajax({
  //     'url': url,
  //     'type': 'PUT',
  //     'contentType': 'application/json',
  //     'data': JSON.stringify(oUser)
  //   }).done(function () {
  //     globalNotify.success('保存成功');
  //   }).fail(function () {
  //     globalNotify.failed('操作失败，请稍后再试');
  //   }).always(function () {
  //     //$('#userProfileForm #submitBtn').button('reset');
  //   });
  // });

  $('a.thumbnail').on('click', function (event){
    console.log(event.currentTarget.children[0].attributes["src"].value);
    $('#user_logo')[0].attributes["src"].value=event.currentTarget.children[0].attributes["src"].value
    $('.user-logo-image').modal('hide');
  });

  // $('#field').tagEditor({
  //   //initialTags: ['互联网'],
  //   autocomplete: { delay: 0, position: { collision: 'flip' }, source: ["互联网","智能硬件","大数据","云计算","电子商务","O2O","移动互联网","社交","游戏","IOT","智能设备","3D打印","工具","可穿戴","视频娱乐","企业服务","云计算","云存储","云平台"] },
  //   forceLowercase: false,
  //   placeholder: '如 互联网，智能硬件，大数据，云计算'
  // });
  var availableTags = [
      '前端开发',
      "善于团队管理",
      "沟通能力强",
      "后端开发",
      "数据库开发",
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
  // $('#skill').bind("keydown", function(event){
  //   if ( event.keyCode === $.ui.keyCode.TAB &&
  //           $( this ).autocomplete( "instance" ).menu.active ) {
  //         event.preventDefault();
  //       }
  // })
  // .autocomplete({
  //   minLength: 0,
  //   source: function( request, response ) {
  //         // delegate back to autocomplete, but extract the last term
  //         response( $.ui.autocomplete.filter(
  //           availableTags, extractLast( request.term ) ) );
  //   },
  //   focus: function() {
  //         // prevent value inserted on focus
  //         return false;
  //       },
  //   select: function( event, ui ) {
  //         var terms = split( this.value );
  //         // remove the current input
  //         terms.pop();
  //         // add the selected item
  //         terms.push( ui.item.value );
  //         // add placeholder to get the comma-and-space at the end
  //         terms.push( "" );
  //         this.value = terms.join( ", " );
  //         return false;
  //       }
  //    }
  // );
  $('#skill').tagEditor({
    //initialTags: ['前端开发',"善于团队管理","沟通能力强","后端开发","数据库开发"],
    autocomplete: { delay: 0, position: { collision: 'flip' },
    source: ['ActionScript', 'AppleScript', 'Asp', 'BASIC', 'C', 'C++', 'CSS', 'Clojure', 'COBOL', 'ColdFusion', 'Erlang', 'Fortran', 'Groovy', 'Haskell', 'HTML', 'Java', 'JavaScript', 'Lisp', 'NodeJS','Perl', 'PHP', 'Python', 'Ruby', 'Scala', 'Scheme'],
    minLength: 0,
    mustMatch: true
    },
    maxTags: 3,
    forceLowercase: false,
    placeholder: '如 PHP PS JAVA，以回车分隔',
  });
  var cache = {};
  // $('#field').bind("keydown", function(event){
  //   if ( event.keyCode === $.ui.keyCode.TAB &&
  //           $( this ).autocomplete( "instance" ).menu.active ) {
  //         event.preventDefault();
  //       }
  // }).autocomplete({
  //     minLength: 0,
  //     source: function( request, response ) {
  //         // delegate back to autocomplete, but extract the last term
  //         response( $.ui.autocomplete.filter(
  //           availableTags, extractLast( request.term ) ) );
  //   },
  //   focus: function() {
  //         // prevent value inserted on focus
  //         return false;
  //       },
  //   select: function( event, ui ) {
  //         var terms = split( this.value );
  //         // remove the current input
  //         terms.pop();
  //         // add the selected item
  //         terms.push( ui.item.value );
  //         // add placeholder to get the comma-and-space at the end
  //         terms.push( "" );
  //         this.value = terms.join( ", " );
  //         return false;
  //       }
  //    }
  // );
  $('#field').tagEditor({
    // initialTags: ['互联网', '天使轮', '全职团队'],
    autocomplete: { delay: 0, position: { collision: 'flip' },
      minLength: 0,
      source: function(request, response) {
        var term = request.term;
        if ( term in cache ) {
          response( cache[ term ] );
          return;
        }

        $.getJSON( "field", request, function( data, status, xhr ) {
          cache[ term ] = data;
          response( data );
        });
      }
    },
    maxTags: 3,
    forceLowercase: false,
    placeholder: '搜索领域方向，以回车分隔'
  });

  /**
   * Bind click event handler for all experiences delete icon
   * @function
   * @private
   *
   */
  function bindDeleteEventForExperiences() {
    $('.experiences .fa-trash-o').one('click', function () {
      $(this).parentsUntil('.experiences').remove();
    });
  }

  /**
   * Event handler for add education icon
   *
   */
  $('.educations .fa-plus').click(function () {
    $('.educations').append($('#new_education_template').html());
    bindDeleteEventForExperiences();
  });

  /**
   * Event handler for add startup icon
   *
   */
  $('.startups .fa-plus').click(function () {
    $('.startups').append($('#new_startup_template').html());
    bindDeleteEventForExperiences();
  });

  /**
   * Event handler for add work icon
   *
   */
  $('.works .fa-plus').click(function () {
    $('.works').append($('#new_work_template').html());
    bindDeleteEventForExperiences();
  });

  bindDeleteEventForExperiences();
});
//validate mobile phone
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

$(document).ready(function(){
  var address = $('#location');
  if(address){
    var addlist = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('alias'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url:'/addr',
        cache: false
      },
      identify: function(obj) {return obj.value;}
    });
    function addlistWithDefaults(q, sync) {
      if (q === ''){
        sync(addlist.get(['北京','上海','广州']));
      }else{
        addlist.search(q, sync);
      }
    }
    address.typeahead({
      hint: true,
      highlight: true,
      minLength: 0
    },
      {
      name: 'location',
      source: addlistWithDefaults,
      display: 'value',
      templates: {
      // header: '<h3>输入城市</h3>',
      empty: [
        '<div class="empty-message">',
          '<i class="fa fa-warning">',
          '请输入目前所在城市，如：北京',
          '</i>',
        '</div>'
      ].join('\n'),
      suggestion: Handlebars.compile('<div><strong>{{value}}</strong> | {{alias}}</div>')
    }
    });
    $('#location').parent().css('display','block');
  }

  var hometown = $('#hometown');
  if(hometown){
    var provincelist = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('alias'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url:'/province',
        cache: false
      },
      identify: function(obj) {return obj.value;}
    });
    function homeTownWithDefaults(q, sync) {
      if (q === ''){
        sync(provincelist.get(['北京','上海','天津','重庆','河北','河南','山东','山西','湖南','湖北']));
      }else{
        provincelist.search(q, sync);
      }
    }
    hometown.typeahead({
      hint: true,
      highlight: true,
      minLength: 0
    },
      {
      name: 'hometown',
      source: homeTownWithDefaults,
      display: 'value',
      templates: {
      // header: '<h3>输入城市</h3>',
      empty: [
        '<div class="empty-message">',
          '<i class="fa fa-warning">',
          '请输入正确的籍贯城市，如：北京',
          '</i>',
        '</div>'
      ].join('\n'),
      suggestion: Handlebars.compile('<div><strong>{{value}}</strong> | {{alias}}</div>')
    }
    });
    $('#hometown').parent().css('display','block');
  }

  $('#userProfileForm').validate({
    errorElement : 'small',
    errorClass : 'error',
    focusInvalid : false,
    rules:{
      location:{
          remote: {
            url: "/validateAddr",
            type: "post",
            data: {
              city: function(){
                return $("#location").val();
              }
            }
          }
      },
      mobile_phone:{
        isMobile: true
      },
      age:{
        range:[0,99]
      },
      hometown:{
          remote: {
            url: "/validateProvince",
            type: "post",
            data: {
              province: function(){
                return $("#hometown").val();
              }
            }
          }
        }
    },
    message: {
      name:{
        reqired: "请输入姓名"
      },
      location:{
        reqired: "请输入所在地",
        remote: "请输入合法城市，如无匹配，请输入其他"
      },
      field:{
        reqired: "请输入专注的领域，以回车分隔"
      },
      age:{
        range:"请输入0-99之间数字"
      },
      hometown:{
          remote: "请输入合法籍贯，如无匹配，请输入其他"
      },
    },
    highlight : function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    success : function(label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
    },
    errorPlacement : function(error, element) {

        if ( element.is(":radio") )
            error.appendTo ( element.parent().parent().parent() );
        else if ( element.is(":checkbox") )
            error.appendTo ( element.parent() );
        else if (element.is("#location") || element.is("#hometown"))
            error.appendTo ( element.parent().parent('div') );
        else
            element.parent('div').append(error);

    },
    submitHandler:function(form){
      var aFormData = $(form).serializeArray();
      var oUser = {};
      $.each(aFormData, function (index, field) {
        if (field.value === 'true') {
          oUser[field.name] = true
        } else if (field.value === 'false') {
          oUser[field.name] = false
        } else {
          oUser[field.name] = field.value;
        }
      });

      oUser.educations = [];
      $('.educations > .education').each(function (index, edu) {
        oUser.educations.push({
          'start_time': $(edu).find('.start_time').val(),
          'end_time': $(edu).find('.end_time').val(),
          'school': $(edu).find('.school').val(),
          'description': $(edu).find('.description').val()
        });
      });

      oUser.work_experiences = [];
      $('.works > .work').each(function (index, work) {
        oUser.work_experiences.push({
          'start_time': $(work).find('.start_time').val(),
          'end_time': $(work).find('.end_time').val(),
          'corporation': $(work).find('.corporation').val(),
          'title': $(work).find('.title').val(),
          'description': $(work).find('.description').val(),
        });
      });
      oUser.work_experiences_tags = [];
      $("input[name='work_experiences_tag']:checked").each(function (index, tag){
          oUser.work_experiences_tags.push(tag.value);
      })

      oUser.startup_experiences = [];
      $('.startups > .startup').each(function (index, startup) {
        oUser.startup_experiences.push({
          'start_time': $(startup).find('.start_time').val(),
          'end_time': $(startup).find('.end_time').val(),
          'role': $(startup).find('.role').val(),
          'name': $(startup).find('.name').val(),
          'description': $(startup).find('.description').val(),
        });
      });

      oUser.logo_img = $('#user_logo')[0].attributes["src"].value;

      var url = '/users/' + $('#uid').val();
      $.ajax({
        'url': url,
        'type': 'PUT',
        'contentType': 'application/json',
        'data': JSON.stringify(oUser)
      }).done(function () {
        globalNotify.success('保存成功');
      }).fail(function () {
        globalNotify.failed('操作失败，请稍后再试');
      }).always(function () {
        //$('#userProfileForm #submitBtn').button('reset');
      });
    }
  });

  // field
  // var field = $('#field');
  // if(field){
  //   var fieldList = new Bloodhound({
  //     datumTokenizer: Bloodhound.tokenizers.obj.whitespace('alias'),
  //     queryTokenizer: Bloodhound.tokenizers.whitespace,
  //     prefetch: {
  //       url:'/field',
  //       cache: false
  //     },
  //     identify: function(obj) {return obj.value;}
  //   });
  //   function addlistWithDefaults(q, sync) {
  //     if (q === ''){
  //       sync(fieldList.get(['移动互联网','电子商务','O2O','游戏','社交网络','智能手机']));
  //     }else{
  //       fieldList.search(q, sync);
  //     }
  //   }
  //   field.typeahead({
  //     hint: true,
  //     highlight: true,
  //     minLength: 0
  //   },
  //     {
  //     name: 'filed',
  //     source: addlistWithDefaults,
  //     display: 'value',
  //     templates: {
  //     // header: '<h3>输入城市</h3>',
  //     empty: [
  //       '<div class="empty-message">',
  //         '<i class="fa fa-warning">',
  //         '请输入领域，如：可穿戴设备',
  //         '</i>',
  //       '</div>'
  //     ].join('\n'),
  //     suggestion: Handlebars.compile('<div><strong>{{value}}</strong></div>')
  //   }
  //   });
  //   $('#filed').parent().css('display','block');
  // }
})