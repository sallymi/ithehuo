/**
 * Bind click event to delete partner trash icon
 *
 * @function
 *
 */
function bindProjectPartnerDeleteEvent() {
  $('#projectPartner i.delete').one('click', function () {
    $(this).parentsUntil('#projectPartner').remove();
  });
}

/*
 * Project manager
 */
var projectManager = {
  getProjectId: function () {
    return $('#projectId').val();
  },
  getProject : function () {
    return {
      'status' : 'public', //状态， private：保存， public：公开
      'name': $('#projectName').val(), //名称
      'keyword' : $('#projectKeyword').val(), //关键,一句话描述
      'tag': $('#projectTags').tagEditor('getTags')[0].tags, //标签
      'stage': $('#projectStage').val(), //项目阶段
      'description': $('#projectDescription').val(), //描述
      'location': $('#projectLocation').val(), //城市
      'logo_img': $('#project_logo')[0].attributes["src"].value,
      'company': $('#projectCompany').val(), //公司名称
      'required_skills': $('#projectRequiredSkills').val(), //项目需要的技能
      'link': $('#projectLink').val(), //已有项目展示或下载链接
      'partners': this.getPartners(), //合作伙伴
      'funding': this.getFunding(), //融资
      'creator': this.getCreator() //项目创建人信息
    };
  },
  getPartners: function () {
    return [];
  },
  getFunding: function () {
    return {
      'current': $('#projectFundingCurrent').val(), //目前融资规模
      'next': {
        'need': $('#projectFundingNext').val(), //下一阶段融资需求（万）
        'return': $('#projectFundingReturn').val() //计划融资可以出让的股份比例（%）
      }
    };
  },
  getCreator: function () {
    return {
      'user': $('#uid').val(),
      'start_time': $('#projectCreatorStartTime').val(), //进入项目时间
      'role': $('input:radio[name="projectCreatorRole"]:checked').val() //在项目中的角色
    };
  }
};

$(function () {
  // $('#detailForm').submit(function (event) {
  //   event.preventDefault();
  //   var project = projectManager.getProject();
  //   var projectId = projectManager.getProjectId();
  //   var url = '/projects';
  //   var type = 'POST';
  //   if (projectId) {
  //     url = url + '/' + projectId;
  //     type = 'PUT';
  //   }
  //   $.ajax({
  //     url: url,
  //     type: type,
  //     contentType: 'application/json',
  //     data: JSON.stringify(project)
  //   }).done(function (resp) {
  //     $('#projectId').val(resp._id);
  //     globalNotify.success('项目保存并发布成功');
  //   }).fail(function (resp) {
  //     globalNotify.failed('操作失败，请稍后再试');
  //     console.log(resp.responseText);
  //   });
  // });
  $('a.thumbnail').on('click', function (event){
    console.log(event.currentTarget.children[0].attributes["src"].value);
    $('#project_logo')[0].attributes["src"].value=event.currentTarget.children[0].attributes["src"].value
    $('.bs-example-modal-sm').modal('hide');
  });
  var cache = {}
  $('#projectTags').tagEditor({
    // initialTags: ['互联网', '天使轮', '全职团队'],
    autocomplete: { delay: 0, minLength: 0,position: { collision: 'flip' }, 
    source: function(request, response) {
        var term = request.term;
        if ( term in cache ) {
          response( cache[ term ] );
          return;
        }
 
        $.getJSON( "/field", request, function( data, status, xhr ) {
          cache[ term ] = data;
          response( data );
        });
    }},   
    forceLowercase: false,
    placeholder: '如 移动互联网，智能硬件，电子商务，O2O，以回车分隔'
  });
  $('#projectRequiredSkills').tagEditor({
    autocomplete: { delay: 0, minLength: 0, position: { collision: 'flip' }, source: ['ActionScript', 'AppleScript', 'Asp', 'BASIC', 'C', 'C++', 'CSS', 'Clojure', 'COBOL', 'ColdFusion', 'Erlang', 'Fortran', 'Groovy', 'Haskell', 'HTML', 'Java', 'JavaScript', 'Lisp', 'NodeJS','Perl', 'PHP', 'Python', 'Ruby', 'Scala', 'Scheme'] },
    forceLowercase: false,
    placeholder: '如 PHP PS JAVA，以回车分隔'
  });
});
$(document).ready(function(){
  var address = $('#projectLocation');
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
      name: 'projectLocation',
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
    $('#projectLocation').parent().css('display','block');
  }

  $('#detailForm').validate({
    // onclick: function(event){
    //   alert("ok");
    // },
    errorElement : 'small',  
    errorClass : 'error',  
    focusInvalid : false,  
    rules : {  
        projectName : {  
            required : true  
        },  
        projectKeyword : {  
            required : true  
        },  
        projectDescription : {  
            required : true  
        },
        projectCreatorStartTime : {
            required : true
        },
        projectCreatorRole : {
            required : true
        },
        projectLocation:{
          remote: {
            url: "/validateAddr",
            type: "post",
            data: {
              city: function(){
                return $("#projectLocation").val();
              }
            }
          }
        }
    },  
    messages : {  
        projectName : {  
            required : "请输入项目名称"  
        },  
        projectKeyword : {  
            required : "请输入项目slogan"  
        },  
        projectDescription : {  
            required : "请输入项目介绍"  
        },
        projectCreatorStartTime : {
            required : "请选择进入项目的时间"
        },
        projectCreatorRole : {
            required : "请选择在项目的角色",
        },
        projectLocation:{
            remote:"请输入合法城市，如无匹配，请输入其他"
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
        else if (element.is("#projectLocation") || element.is("#hometown"))
            error.appendTo ( element.parent().parent('div') ); 
        else
            element.parent('div').append(error);
            
    },  
    submitHandler:function(form){
      var project = projectManager.getProject();
      var projectId = projectManager.getProjectId();
      var url = '/projects';
      var type = 'POST';
      if (projectId) {
        url = url + '/' + projectId;
        type = 'PUT';
      }
      $.ajax({
        url: url,
        type: type,
        contentType: 'application/json',
        data: JSON.stringify(project)
      }).done(function (resp) {
        $('#projectId').val(resp._id);
        //globalNotify.success('项目保存并发布成功！请立即发布你的合伙人招募信息');
        var notice = new PNotify({
	        title:'成功！',
	        text:'项目保存并发布成功！请立即发布你的合伙人招募信息',
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
	        			window.location.href = '/projects';
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
	      // notice.get().click(function(){
	      //   notice.remove();
	      //   window.location.href = '/new/recruitment';
	      // })
      }).fail(function (resp) {
        globalNotify.failed('操作失败，请稍后再试');
        console.log(resp.responseText);
      });
    }
  });
});

