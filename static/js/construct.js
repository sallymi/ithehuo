$(function () {
	var progress = $('.progressbar')[0];
	var percent = $('span.text')[0];
	// Pause the animation for 100 so we can animate from 0 to x%
	setTimeout(
	  function() {
	    progress.style.width = "100%";
	    // PHP Version:
	    // progress.style.width = <?php echo round($percentage150,2); ?>+"%";
	    // progress.style.backgroundColor = "green";
	    
	    setTimeout(function() {
	      percent.style.display = "block";
	    }, 4100);
	    
	    
	  }, 100);
})
