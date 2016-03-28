$(function(){
	// $("[rel=drevil]").popover({
	// 	trigger:'manual',
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
    	$(this).children().addClass('active')
    	$('#'+evt.currentTarget.attributes.getNamedItem('name').value).css({"top":evt.currentTarget.offsetTop});
    	$('#'+evt.currentTarget.attributes.getNamedItem('name').value).removeClass('dn');
    }).on("mouseleave", function(evt){
    	$(this).children().removeClass('active')
    	$('#'+evt.currentTarget.attributes.getNamedItem('name').value).addClass('dn');
    })
    $('.insvestemt p').each(function(){
		var _text = $(this).text();
		if(_text.length>35){
		$(this).text(_text.substring(0,35)+'...');
		}
	});
	$('i.like').click(function(){
		var id = this.id;
		var self =this;
		var curNum = Number(self.children[0].innerText);
		$.ajax({
			url:'/projects/addlike',
			data: {'pid':id},
			type: 'POST'
		}).done(function (res){
			//errorNotify.success(res)
			console.log(self.children[0].innerText);
			console.log("点赞成功");
			self.children[0].innerText = ++curNum;
		}).fail(function (err) {
			//errorNotify.failed(err)
			console.log("点赞失败！")
		});
	})
});