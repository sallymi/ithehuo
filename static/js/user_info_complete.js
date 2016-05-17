/**
 * Created by zhushihao on 2016/5/10.
 */
$(document).ready(function () {
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
    $('#userInfoForm1').validate({
        errorElement : 'small',
        errorClass : 'error',
        focusInvalid : false,
        rules:{
            name: {
                required : true
            },
            mobile_phone:{
                required: true
            },
            email:{
                required: true
            }
        },
        messages: {
            name:{
                required: "请输入姓名"
            },
            mobile_phone:{
                required: "请输入手机号"
            },
            email:{
                required: "请输入邮箱"
            }
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
                error.appendTo(element.parent().parent().children('.error'));
            // error.appendTo ( element.parent().parent().parent() );
            else if ( element.is(":checkbox") )
                error.appendTo ( element.parent() );
            else if (element.is("#location") || element.is("#hometown"))
                error.appendTo ( element.parent().parent('div') );
            else if(element.is("#technical_experience"))
                error.appendTo(element.parent().children('.error'));
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
            var url = '/complete/' + $('#uid').val();
            $.ajax({
                'url': url,
                'type': 'PUT',
                'contentType': 'application/json',
                'data': JSON.stringify(oUser)
            }).done(function () {
                window.location.href = '/complete?step=2';
                //globalNotify.success('保存成功');
            }).fail(function () {
                globalNotify.failed('操作失败，请稍后再试');
            }).always(function () {
                //$('#userProfileForm #submitBtn').button('reset');
            });
        }
    });
    $('#userInfoForm2').validate({
        errorElement : 'small',
        errorClass : 'error',
        focusInvalid : false,
        rules:{
            location:{
                required : true,
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
            fields:{
                required: true
            },
            skill: {
                required: true
            },
            status: {
                required: true
            },
            role: {
                required: true
            },
            prefer: {
                required: true
            }
        },
        messages: {
            location:{
                required: "请输入所在地",
                remote: "请输入合法城市，如无匹配，请输入其他"
            },
            fields:{
                required: "请输入专注的领域，以回车分隔"
            },
            skill:{
                required: "请输入技能，以回车分隔"
            },
            status: {
                required: "请选择状态"
            },
            role:{
                required:"请选择角色定位"
            },
            prefer:{
                required: "请选择创业倾向"
            }
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
                error.appendTo(element.parent().parent().children('.error'));
            // error.appendTo ( element.parent().parent().parent() );
            else if ( element.is(":checkbox") )
                error.appendTo ( element.parent() );
            else if (element.is("#location") || element.is("#hometown"))
                error.appendTo ( element.parent().parent('div') );
            else if(element.is("#technical_experience"))
                error.appendTo(element.parent().children('.error'));
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

            var url = '/complete/' + $('#uid').val();
            $.ajax({
                'url': url,
                'type': 'PUT',
                'contentType': 'application/json',
                'data': JSON.stringify(oUser)
            }).done(function () {
                window.location.href = '/complete?step=3';
            }).fail(function () {
                globalNotify.failed('操作失败，请稍后再试');
            }).always(function () {
                //$('#userProfileForm #submitBtn').button('reset');
            });
        }
    });
    $('#userInfoForm3').validate({
        errorElement : 'small',
        errorClass : 'error',
        focusInvalid : false,
        rules:{
            description: {
                required : true
            },
            technical_experience:{
                required: true
            },
            project_experience:{
                required: true
            }
        },
        messages: {
            description: {
                required : "请对自己做简单的介绍"
            },
            technical_experience:{
                required: "请详细填写您的技术经验和能力情况，展示您的实力，有利于更多公司预约您。"
            },
            project_experience:{
                required: "请详细填写您在工作和业余时间参与过的项目，以及您在项目中所做的具体工作，有利于更多公司预约您。"
            }
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
                error.appendTo(element.parent().parent().children('.error'));
            // error.appendTo ( element.parent().parent().parent() );
            else if ( element.is(":checkbox") )
                error.appendTo ( element.parent() );
            else if (element.is("#location") || element.is("#hometown"))
                error.appendTo ( element.parent().parent('div') );
            else if(element.is("#technical_experience"))
                error.appendTo(element.parent().children('.error'));
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

            var url = '/complete/' + $('#uid').val();
            $.ajax({
                'url': url,
                'type': 'PUT',
                'contentType': 'application/json',
                'data': JSON.stringify(oUser)
            }).done(function () {
                globalNotify.success('恭喜！已成功加入我们的人才库！');
                setTimeout(function(){
                    location.href = "/"
                },3000);
            }).fail(function () {
                globalNotify.failed('操作失败，请稍后再试');
            }).always(function () {
                //$('#userProfileForm #submitBtn').button('reset');
            });
        }
    });


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
})