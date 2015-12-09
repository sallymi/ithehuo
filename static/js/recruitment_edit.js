$(function () {

  // $('#recruitmentForm').submit(function (event) {
  //   event.preventDefault();
  //   var recruitment = {};
  //   var formData = $(this).serializeArray();
  //   $.each(formData, function (index, field) {
  //     recruitment[field.name] = field.value;
  //   });

  //   recruitment.creator = $('#uid').val();

  //   var url = '/recruitments';
  //   var type = 'POST';
  //   var recruitmentId = $('#recruitmentId').val();
  //   if (recruitmentId) {
  //     url = url + '/' + recruitmentId;
  //     type = 'PUT';
  //   }
  //   $.ajax({
  //     url: url,
  //     type: type,
  //     contentType: 'application/json',
  //     data: JSON.stringify(recruitment)
  //   }).done(function (res) {
  //     $('#recruitmentId').val(res._id);
  //     globalNotify.success('招募保存并发布成功');
  //   }).fail(function (resp) {
  //     globalNotify.failed('操作失败，请稍后再试');
  //     console.log(resp.responseText);
  //   });
  // });
  
});
jQuery.validator.addMethod("bigger", function(value, element, param){
      // bind to the blur event of the target in order to revalidate whenever the target field is updated
      // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
      var target = $(param);
      //alert(value + ':' + param + '-' + target.val());
      if(target.size()==0){
        target = $("input[name='" + param+"']");
      }

      if(target.size()==0){
        //input number we compare with number directly
        if(parseInt(param) == param){
          return parseInt(value) >= parseInt(param);
        }else{
          return false ;
        }
      }
      return parseInt(value) >= parseInt(target.val());
    }
    , "massage....");
jQuery.validator.addMethod("lessThanDouble", function(value, element, param){
      // bind to the blur event of the target in order to revalidate whenever the target field is updated
      // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
      var target = $(param);
      //alert(value + ':' + param + '-' + target.val());
      if(target.size()==0){
        target = $("input[name='" + param+"']");
      }

      if(target.size()==0){
        //input number we compare with number directly
        if(parseInt(param) == param){
          return parseInt(value) <= 2*parseInt(param);
        }else{
          return false ;
        }
      }
      return parseInt(value) <= 2*parseInt(target.val());
    }
    , "massage....");
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
          '请输入有效的所在城市，如：北京',
          '</i>',
        '</div>'
      ].join('\n'),
      suggestion: Handlebars.compile('<div><strong>{{value}}</strong> | {{alias}}</div>')
    }
    });
    $('#location').parent().css('display','block');
    $('#location').on('typeahead:selected', function (e, datum) {
        $('#location').val(datum.value);
    });
    $('#location').on('typeahead:cursorchanged', function (e, datum) {
        console.log(datum);
    });
  }
  //老乡
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

  $('#recruitmentForm').validate({
    errorElement : 'small',  
    errorClass : 'error',  
    focusInvalid : false,  
    rules : {  
        classify : {  
            required : true  
        },  
        project : {  
            required : true  
        },  
        work_nature : {  
            required : true  
        },
        payment_min : {
            required : true,
            range: [0, 99999999]
        },
        payment_max : {
            required : true,
            range: [0, 99999999],
            bigger: "#payment_min",
            lessThanDouble: "#payment_min"
        },
        hr_email :{
          email:true
        },
        location: {
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
    messages : {  
        classify : {  
            required : "请选择合伙需求"  
        },  
        project : {  
            required : "请选择目标项目"  
        },  
        work_nature : {  
            required : "请选择工作性质"  
        },
        payment_min : {
            required : "请输入最低薪酬",
            range: "请输入整数"
        },
        payment_max : {
            required : "请输入最高薪酬",
            range: "请输入整数",
            bigger: "最高月薪需大于最低月薪",
            lessThanDouble: "最高月薪需小于2倍最低月薪"

        },
        location : {
            required: "请输入工作城市",
            remote: "请输入合法城市，如无匹配，请输入其他"
        },
        address : {
            required: "请输入工作地址"

        },
        keyword: {
          required: "请输入合伙诱惑"
        },
        age:{
          required:"请选择要求的年龄"
        },
        hometown:{
          required: "请输入希望的籍贯",
          remote: "请输入合法籍贯，如无匹配，请输入其他"
        },
        school:{
          required:"请输入希望的毕业院校"
        },
        attitude:{
          required:"请选择希望的心态"
        },
        hr_email :{
          email:"请输入合法的邮箱地址"
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
            error.appendTo ( element.parent().parent().parent() ); 
        else if ( element.is(":checkbox") ) 
            error.appendTo ( element.parent() ); 
        else if (element.is("#location") || element.is("#hometown"))
            error.appendTo ( element.parent().parent('div') ); 
        else
            element.parent('div').append(error);
            
    },  
    submitHandler:function(form){
      var recruitment = {};
      var formData = $('#recruitmentForm').serializeArray();
      $.each(formData, function (index, field) {
        recruitment[field.name] = field.value;
      });
      recruitment.creator = $('#uid').val();

      var url = '/recruitments';
      var type = 'POST';
      var recruitmentId = $('#recruitmentId').val();
      if (recruitmentId) {
        url = url + '/' + recruitmentId;
        type = 'PUT';
      }
      $.ajax({
        url: url,
        type: type,
        contentType: 'application/json',
        data: JSON.stringify(recruitment)
      }).done(function (res) {
        $('#recruitmentId').val(res._id);
        //globalNotify.success('招募保存并发布成功');
        var notice = new PNotify({
          title:'成功！',
          text:'招募保存并发布成功！再发布一个合伙人招募信息',
          icon: 'fa fa-envelope-o',
          type: 'success',
          hide: false,
          confirm: {
            confirm: true,
            buttons: [{
              text: '发布招募',
              addClass: 'btn-primary',
              click: function(notice){
                window.location.href = '/new/recruitment';
              }
            },
            {
              text: '稍后再说',
              click: function (notice){
                window.location.href = '/recruitments';
              }
            }]
          },
          buttons: {
            closer: false,
            sticker: false
          },
          history: {
            history: false
          }
        });
      }).fail(function (resp) {
        globalNotify.failed('操作失败，请稍后再试');
        console.log(resp.responseText);
      });
    }
  });
  // form valid
  // $('#recruitmentForm').bootstrapValidator({
  //       message: '不能为空',
  //       submitButtons: $('#submit'),
  //       feedbackIcons: {
  //           valid: 'glyphicon glyphicon-ok',
  //           invalid: 'glyphicon glyphicon-remove',
  //           validating: 'glyphicon glyphicon-refresh'
  //       },
  //       fields: {
  //           location: {
  //               validators: {
  //                   notEmpty: {
  //                       message: '城市名称不可为空'
  //                   }
  //               }
  //           },
  //           hometown:{
  //             validators: {
  //                   notEmpty: {
  //                       message: '籍贯名称不可为空'
  //                   }
  //               }
  //             },
  //           hr_email: {
  //               validators: {
  //                   emailAddress: {
  //                       message: '非法的电子邮箱'
  //                   }
  //               }
  //           },
  //           payment_min: {
  //               validators: {
  //                   lessThan: {
  //                       value: 'payment_max',
  //                       inclusive: true,
  //                       message: '最低薪资需小于薪资上限'
  //                   },
  //                   greaterThan: {
  //                       value: 0,
  //                       inclusive: false,
  //                       message: '不小于0'
  //                   },
  //                   integer:{
  //                     message:'请输入整数'
  //                   }
  //               },
  //               onSuccess: function(e, data){
  //                 console.log(data);
  //                 if(!data.bv.isValidField('payment_max')){
  //                   data.bv.revalidateField('payment_max');
  //                 }
  //               }
  //           },
  //           payment_max: {
  //               validators: {
  //                   greaterThan: {
  //                       value: payment_min,
  //                       inclusive: false,
  //                       message: '最高薪资应大于薪资下限'
  //                   },
  //                   integer:{
  //                     message:'请输入整数'
  //                   }
  //               },
  //               onSuccess: function(e, data){
  //                 if(!data.bv.isValidField('payment_min')){
  //                   data.bv.revalidateField('payment_min');
  //                 }
  //               }
  //           }
  //         }
  //   }).on('success.form.bv',function(event){
  //       event.preventDefault();
  //       var recruitment = {};
  //       var formData = $(this).serializeArray();
  //       $.each(formData, function (index, field) {
  //         recruitment[field.name] = field.value;
  //       });

  //       recruitment.creator = $('#uid').val();

  //       var url = '/recruitments';
  //       var type = 'POST';
  //       var recruitmentId = $('#recruitmentId').val();
  //       if (recruitmentId) {
  //         url = url + '/' + recruitmentId;
  //         type = 'PUT';
  //       }
  //       $.ajax({
  //         url: url,
  //         type: type,
  //         contentType: 'application/json',
  //         data: JSON.stringify(recruitment)
  //       }).done(function (res) {
  //         $('#recruitmentId').val(res._id);
  //         globalNotify.success('招募保存并发布成功');
  //       }).fail(function (resp) {
  //         globalNotify.failed('操作失败，请稍后再试');
  //         console.log(resp.responseText);
  //       });
  //     })
});