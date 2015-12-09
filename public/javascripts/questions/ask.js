$(document).ready(function(){
  $('textarea.transperant').each(function(index,item){
    var $item = $(item);
    $item.height(item.scrollHeight);
  });
  var availableTags=[
  '创业','创业者','创业公司',
  '互联网创业','创业项目','创业团队',
  '创业法务','创业故事','创业难点',
  '创业想法','创始人','创业计划书',
  '创业导师','众筹','注册公司','加速器',
  '孵化器','创新工场','海归创业','创业融资'];
  var tags = $('#tags');
    if(tags){
    var taglist = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url:'/tags',
        cache: false
      }
    });
    function addlistWithDefaults(q, sync) {
      if (q === ''){
        sync(taglist.get(availableTags));
      }else{
        taglist.search(q, sync);
      }
    }
    tags.typeahead({
      hint: true,
      highlight: true,
      minLength: 0
    },
      {
      name: 'tags',
      source: addlistWithDefaults
    });
    $('.toggle-comment').parent().find('.panel-container').hide();
  }
});
$().ready(function(){
   $("#questionForm").validate({
    errorElement : 'small',
    errorClass : 'error',
    focusInvalid : false,
    messages : {
        question : {
            required : "请输入问题"
        },
        tags : {
            required : "请输入并选择所属话题"
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
        else if (element.is("#tags"))
            error.appendTo ( element.parent().parent('div') );
        else
            element.parent('div').append(error);

    },
    submitHandler:function(form){
      var title = $('#question').val();
    var content = $('#content').val();
    var tags = $('#tags').val().split(', ');
    var anonymous = $('#anonymous')[0].checked;
    var question = new QuestionModel(title,content,tags, anonymous);
    var data = $.toJSON(question);
    var result;
    console.log(data);
    if(!title){
      globalNotify.failed("请补充必填字段");
    }else{
      //console.log(data);
    $.ajax({
      type:'POST',
      url:'/questions',
      data: data,
      dataType: 'json',
      contentType: 'application/json',
      success: function(){
        window.location.href = '/questions';
      }
    });
    }
    }
   });
 //   $('#questionForm').submit(function(event){
 //     event.preventDefault();
 //    var formData = $(this).serializeArray();
 //    console.log(formData);
 //    $.each(formData, function (index, field) {
 //      recruitment[field.name] = field.value;
 //    });
 //    var title = $('#question').val();
  // var content = $('#content').val();
  // var tags = $('#tags').val().split(', ');
  // var anonymous = $('#anonymous')[0].checked;
  // var question = new QuestionModel(title,content,tags, anonymous);
  // var data = $.toJSON(question);
  // var result;
  // console.log(data);
  // // if(!title){
  // //   globalNotify.failed("请补充必填字段");
  // // }else{
  // //   //console.log(data);
  // // $.ajax({
  // //   type:'POST',
  // //   url:'/questions',
  // //   data: data,
  // //   dataType: 'json',
  // //   contentType: 'application/json',
  // //   success: function(){
  // //     window.location.href = '/questions';
  // //   }
  // // });
  // // }
 //   })
});
function showWholeAnswer(event){
  if(event.target.textContent == "收起"){
    event.target.parentNode.firstChild.textContent=event.target.parentNode.parentNode.children.namedItem('contents').textContent.substring(0,150)+'...';
    event.target.textContent="显示全部";
  }else{
    event.target.parentNode.firstChild.textContent=event.target.parentNode.parentNode.children.namedItem('contents').textContent;
    event.target.textContent="收起";
  }
}
function showComment(length,event){
  // if($('.toggle-comment').find('span').text() == "收起评论"){
  //  $('.toggle-comment').parent().find('.panel-container').hide();
  //  $('.toggle-comment').find('span').text(length+" 条评论");
  // }else{
  //  $('.toggle-comment').parent().find('.panel-container').show();
  //  $('.toggle-comment').find('span').text("收起评论");
  // }
  console.log(event.target);
  if(event.target.textContent == "收起评论"){
    event.target.parentNode.parentNode.children.namedItem('comments').style.display='none';
    event.target.textContent=length+" 条评论";
  }else{
    event.target.parentNode.parentNode.children.namedItem('comments').style.display='block';
    event.target.textContent="收起评论";
  }
}

function answerQuestion(qid){
  var content = $('#content').val();
  if(content){
    var answer = new AnswerModel(content, qid);
    var data = $.toJSON(answer);
    $.ajax({
      type:'POST',
      url:'/answers',
      data: data,
      dataType: 'json',
      contentType: 'application/json',
      success: function(){
        window.location.reload();
      }
    });
  }else{
    alert('请输入问题答案');
  }
}

function toggleQuestionComment(){
  $('#c_q').toggle();
}

function commentQuestion(qid){
  var content = $('#ta_q').val();
  if(content){
    var answer = new AnswerModel(content);
    var data = $.toJSON(answer);
    $.ajax({
      type:'POST',
      url:'/questions/'+qid+'/comments',
      data: data,
      dataType: 'json',
      contentType: 'application/json',
      success: function(){
        window.location.reload();
      }
    });
  }else{
    alert('请输入评论');
  }
}

function toggleAnswerComment(index){
  $('#c_a_'+index).toggle();
}

function commentAnswer(aid, index){
  var content = $('#ta_a_'+index).val();
  if(content){
    var comment = {
      'content': content
    };
    $.ajax({
      type:'POST',
      url:'/answers/'+aid+'/comments',
      data: JSON.stringify(comment),
      dataType: 'json',
      contentType: 'application/json',
      success: function(){
        window.location.reload();
      }
    });
  }else{
    alert('请输入评论');
  }
}

function showUpdateModal(){
  $('#updateQuestion').modal();
  $("#u_content").focus();
}

function updateQuestion(qid){
  var title = $('#u_question').val();
  var content = $('#u_content').val();
  var tags = $('#u_tags').val().split(', ');
  var question = new QuestionModel(title,content,tags);
  var data = $.toJSON(question);
  //console.log(data);
  $.ajax({
    type:'PUT',
    url:'/questions/'+qid,
    data: data,
    dataType: 'json',
    contentType: 'application/json',
    success: function(){
      window.location.reload();
    }
  });
}

function favoriteQuestion(qid) {
  var data = {
    'qid': qid
  };
  $.ajax({
    type:'POST',
    url:'/favquestions',
    data: data,
    success: function(){
      window.location.reload();
    }
  });
}

function cancelFavoriteQuestion(qid) {
  $.ajax({
    type:'DELETE',
    url:'/favquestions/' + qid,
    success: function(){
      window.location.reload();
    }
  });
}

function favoriteAnswer(aid){
  var data = {
    'aid': aid
  };
  $.ajax({
    type: 'POST',
    url: '/favanswers',
    data: data,
    success: function(){
      window.location.reload();
    }
  });
}

function cancelFavoriteAnswer(aid){
  $.ajax({
    type: 'DELETE',
    url: '/favanswers/' + aid,
    success: function(){
      window.location.reload();
    }
  });
}

function agreeAnswer(aid){
  $.ajax({
    type:'POST',
    url:'/answers/'+aid+'/agrees',
    dataType: 'json',
    contentType: 'application/json',
    success: function(){
      window.location.reload();
    }
  });
}

function cancelAgreeAnswer(aid){
  $.ajax({
    type:'Delete',
    url:'/answers/'+aid+'/agrees',
    dataType: 'json',
    contentType: 'application/json',
    success: function(){
      window.location.reload();
    }
  });
}

function bestAnswer(qid, aid){
  $.ajax({
    type:'POST',
    url:'/questions/'+qid+'/answers/'+aid+'/best',
    dataType: 'json',
    contentType: 'application/json',
    success: function(){
      window.location.reload();
    }
  });
}

function cancelBestAnswer(qid, aid){
  $.ajax({
    type:'DELETE',
    url:'/questions/'+qid+'/answers/'+aid+'/best',
    dataType: 'json',
    contentType: 'application/json',
    success: function(){
      window.location.reload();
    }
  });
}

function QuestionModel(title, content, tag, anonymous){
  this.title = title;
  this.content = content;
  this.tag = tag;
  this.anonymous = anonymous;
}

function AnswerModel(content, qid){
  this.content = content;
  this.question = qid;
}