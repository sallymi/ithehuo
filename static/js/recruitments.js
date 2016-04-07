$(function(){
    // $("[rel=drevil]").popover({
    //  trigger:'manual',
 //        placement : 'right', //placement of the popover. also can use top, bottom, left or right
 //        title : '<div style="text-align:center; color:red; text-decoration:underline; font-size:14px;"> Muah ha ha</div>', //this is the top title bar of the popover. add some basic css
 //        html: 'true', //needed to show html of course
 //        content : '<div id="popOverBox"><img src="http://www.hd-report.com/wp-content/uploads/2008/08/mr-evil.jpg" width="251" height="201" /></div>', //this is the content of the html box. add the image here or anything you want really.
 //        animation: false
 //    }).on("mouseenter", function () {
 //        var _this = this;
 //        $(this).popover("show");
 //        $(this).siblings(".popover").on("mouseleave", function () {
 //            $(_this).popover('hide');
 //        });
 //    }).on("mouseleave", function () {
 //        // var _this = this;
 //        // setTimeout(function () {
 //        //     if (!$(".popover:hover").length) {
 //        //         $(_this).popover("hide")
 //        //     }
 //        // }, 100);
 //    });
    $("[rel=drevil]").on("mouseenter", function(evt){
        $(this).children().addClass('active');
        $('#'+evt.currentTarget.attributes.getNamedItem('name').value).css({"top":evt.currentTarget.offsetTop});
        $('#'+evt.currentTarget.attributes.getNamedItem('name').value).removeClass('dn');
    }).on("mouseleave", function(evt){
        $(this).children().removeClass('active')
        $('#'+evt.currentTarget.attributes.getNamedItem('name').value).addClass('dn');
    });


    $('body').delegate('.load-more','click',function(){
        if($(this).text().indexOf('加载中')>-1)return; //防止二次提交
        $(this).text('加载中。。。');
        var page = parseInt($(this).data('page'));
        var limit = parseInt($(this).data('limit'));
        var self = this;
        var url = '';
        if(!window.location.search)
            url = '/recruitmentsAjax?limit='+$(this).data('limit')+'&page=';
        else
            url = '/ '+window.location.search+'&limit='+$(this).data('page')+'&page='
        Loading.prototype.loadMore(url+(page+1),function(obj){
            if(obj.recruitments.length<limit) {
                $('.load-more').remove();
            }else{
                $(self).text('加载更多');
            }
            obj.recruitments.forEach(function(item,idx){
                var recruitment = item;
                var text = $.clone($('.panel-body li:first-child')[0]);
                $(text).find('.media-left a').attr('href','/recruitments/'+item._id);
                $(text).find('.media-left a .logo').text(item.project.name.substring(0,1));
                // var Arr = ["a6-160","a7-160","a8-160","a9-160","a10-160","a11-160","a12-160","a13-160","a14-160","a15-160"];
                // var n = Math.floor(Mathmedia.random() * Arr.length + 1)-1;
                $(text).find('.media-body:first-child').attr('onclick',"location.href='/recruitments/"+item._id+"'");
                $(text).find('.media-body:first-child .media-heading a').attr('href','/recruitments/'+item._id);
                $(text).find('.media-body:first-child .media-heading a strong').text(item.classify);
                $(text).find('.media-body:first-child .media-heading small').text(item.location+' | '+item.work_nature);
                $(text).find('.media-body:first-child > .small:first-child').html("<strong>月薪：</strong>"+recruitment.payment_min+'k-'+recruitment.payment_max+'k');
                $(text).find('.media-body:first-child > .small:nth-child(2)').html("<strong>期权：</strong>"+((item.share_option_min && item.share_option_max)?(recruitment.share_option_min+'% - '+recruitment.share_option_max+'%'):'暂无'));

                $(text).find('.media-body:first-child > .small:nth-child(3)').html("<strong>职位诱惑：</strong>"+recruitment.keyword);
                // var timestamp = new Date(creation_time);
                // $(text).find('.media-body:first-child > .small.c7').html((timestamp.getFullYear() + '-' + (timestamp.getMonth() + 1) + '-' + timestamp.getDate())+'发布');

                $(text).find('.media-body:last-child .media-heading large').text("所在项目："+(recruitment.project?recruitment.project.name:""));
                $(text).find('.media-body:last-child > small:first-child').text("<strong>Slogan：</strong>"+(recruitment.project&&recruitment.project.keyword));
                $(text).find('.media-body:last-child > small:nth-child(2)').text("<strong>阶段：</strong>"+(recruitment.project&&recruitment.project.stage?recruitment.project.stage:'暂未填写'));
                $(text).find('.media-body:last-child > small:nth-child(3)').text("<strong>项目标签：</strong>"+(recruitment.project&&recruitment.project.tag&&recruitment.project.tag.length>0?recruitment.project.tag:'创业项目'));
                $(text).find('.media-body:last-child > small:nth-child(4)').text("<strong>融资规模：</strong>"+(recruitment.project&&recruitment.project.funding&&recruitment.project.funding.current?recruitment.project.funding.current:'<创建者还没有填写>'));

                $(text).appendTo('.panel-body');
            });
        });
        $(this).data('page',page+1);
    })
});
