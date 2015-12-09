$(function(){
	$('#dowebok').fullpage({
		sectionsColor: ['#1bbc9b', '#ecf0f1', '#ffffff', '#F9F3DC']
	});
	setInterval(function(){
        $.fn.fullpage.moveSlideRight();
    }, 3000);
});


