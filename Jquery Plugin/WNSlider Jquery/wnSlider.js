/**
*   WN Slider v1.0
*   Copyright (C) 2011 Wery Nguyen
*	nguyennt86@gmail.com
*   Seamless CMS	
*/

(function($){ 
$.fn.wnSlider = function(options) {

    // Set default variables in an array
    var defaults = {
	    style : "wn-slider",
		pagingType : "number", // "image" // need to have the appropriate css for the image paging type
        timerInterval: 60000,
		animationSpeed: 500,
		effect: "fade", // none
		autoRotate: true,
    };

	var timer;
	
    // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);

	// get the container
    var container = $(this);
	
	// get all the images inside the container 
	var imageList = container.find("img");
	
	var currentIndex = 0;
	
	// this function will run once to start up the control
	function init() {
		// add a new div container after the main div
		container.append("<div id='wn_pager'></div>");
		container.append("<div id='wn_image'></div>");
		container.append("<div id='wn_title_background'></div>");
		container.append("<div id='wn_title'></div>");
		container.children("img").css("display","none");
		
		
		// select the first image and display it
		if(imageList.length>0) {
			var src = imageList[currentIndex].src;
			var title = imageList[currentIndex].title;
			$("#wn_image").append("<img src='"+src+"' width='100%' height='100%' />");
			$("#wn_title").append("<div id='wn_title_label'>"+title+"</div>");
		}
		
		// setup the pager
		for(var i=0;i<imageList.length;i++) {
			var content = (i+1);
			if(options.pagingType=="image") {
				content = "&nbsp;";
			}
			
			if(i!=currentIndex) {
					$("#wn_pager").append("<div class='wn-pager-item' title='"+i+"'>"+content+"</div>");
				}
				else {
					$("#wn_pager").append("<div class='wn-pager-item active' title='"+i+"'>"+content+"</div>");
				}
		}
		
		// handle the pager click event
		$("#wn_pager").children("div").click(function() {
			$("#wn_pager").children("div").removeClass("active");
			$(this).addClass("active");
			if(timer!=null) {
				// reset the timer
				clearInterval(timer);
				timer = setInterval(run , options.timerInterval);
			}
			currentIndex =  $(this).attr('title');
			if(currentIndex==0) currentIndex = imageList.length-1;
			else currentIndex--;
			run();
		});
	}
	
	// this function will run after each interval to slide the image
	function run() {
		// find the next image to be displayed
		var nextImage = 0;
		if(currentIndex!=imageList.length-1) {
			nextImage = ++currentIndex;
		}
		else {
			currentIndex = 0;
		}
		
		var src = imageList[currentIndex].src;
		var title = imageList[currentIndex].title;
		
		if(options.effect=="fade") { // using fade effect
			$("#wn_image").fadeOut(options.animationSpeed, function() {
				$("#wn_image").html("<img src='"+src+"' width='100%' height='100%' />");
				$("#wn_image").fadeIn();
				$("#wn_title").html("<div id='wn_title_label'>"+title+"</div>");
			});
		}
		else { // just make it display
			$("#wn_image").html("<img src='"+src+"' width='100%' height='100%' />");
			$("#wn_title").html("<div id='wn_title_label'>"+title+"</div>");
		}
		
		// change pager style
		$("#wn_pager div").removeClass("active");
		$("#wn_pager div[title=\""+currentIndex+"\"]").addClass("active");
	}
	
	return this.each(function() {
		init();
		if(options.autoRotate) {
			timer = setInterval(run , options.timerInterval);
		}
	});
};
})(jQuery);