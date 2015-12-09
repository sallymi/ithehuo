$(function(){
	$('#details').on('click'){
		$.ajax({
			type:"get",
			url:"/project?pid=" + item.pid,
			async:true
		});
	};
});