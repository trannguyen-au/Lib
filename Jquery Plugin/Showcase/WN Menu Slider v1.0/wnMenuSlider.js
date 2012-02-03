/**
*   WN Menu Slider v1.0
*   @copyright (C) 2011 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
*	@version v1.0	23/12/2011
*/

(function($){ 
$.fn.wnMenuSlider = function(options) {

    // Set default variables in an array
    var defaults = {
		pagingType : "number", // "image" // "none" // need to have the appropriate css for the image paging type, default value is number
        timerInterval: 6000,   // time to switch between each image
		animationSpeed: 500,   // time for fading animation
		effect: "fade", // none
		autoRotate: true
    };

	var timer;
	
    // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);

	// get the container
    var container = $(this);
	
	// get all the images inside the container 
	var imageList = $(this).find("img");//$("#"+$(this).attr("id")+" img");
	var currentIndex = 0;
	
	// hide all of the current image: 
	for(var i=0;i<imageList.length;i++) {
		imageList[i].style.display = "none";
	}
	
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
			
			var firstItem = imageList.first();
			var src = firstItem.attr("src");
			var title = firstItem.attr("title");
			var link = firstItem.attr("rel")==null? "" : firstItem.attr("rel");//imageList[currentIndex].attr('rel')!=null ? imageList[currentIndex].attr('rel') : "#";
			var subTitle = firstItem.attr("alt")==null? "":firstItem.attr("alt");//imageList[currentIndex].alt!=null ? imageList[currentIndex].alt : "";
			
			$("#wn_image").append("<a href='"+link+"'><img src='"+src+"' width='100%' height='100%' /></a>");
			$("#wn_title").append("<div id='wn_title_label'><a href='"+link+"' class='wn_title_header'>"+title+"</a> <div>"+subTitle+"</div> </div>");
			
			// styling for the first menu box
			$($(".menu-text").get(0)).addClass("active");
		}
		//showCurrentImage();
		
		// setup the pager
		if(options.pagingType!="none") {
			for(var i=0;i<imageList.length;i++) {
				var content = (i+1);
				if(options.pagingType==="image") {
					content = "&nbsp;";
				}
				
				if(i!=currentIndex) {
						$("#wn_pager").append("<a class='wn-pager-item' title='"+i+"'>"+content+"</a>");
					}
					else {
						$("#wn_pager").append("<a class='wn-pager-item active' title='"+i+"'>"+content+"</a>");
					}
			}
		}
		
		// handle the pager click event
		$("#wn_pager").children("a").click(function() {
			$("#wn_pager").children("a").removeClass("active");
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
		
		// handling the click event on the menu-text 
		$(".menu-text").each(function() {
			$(this).click(function(event) {
				event.preventDefault();
				currentIndex = parseInt(($(this).index()+1)/2);
				showCurrentImage();
			});
		});
	}
	
	function showCurrentImage() {
		var src = imageList[currentIndex].src;
		var title = imageList[currentIndex].title;
		var link = imageList[currentIndex].attributes['rel']!=null ? imageList[currentIndex].attributes['rel'].value : "";
		var subTitle = imageList[currentIndex].alt!=null ? imageList[currentIndex].alt : "";
		
		
		if(options.effect==="fade") { // using fade effect
			$("#wn_image").fadeOut(options.animationSpeed, function() {
				$("#wn_image").html("<a href='"+link+"'><img src='"+src+"' width='100%' height='100%' /></a>");
				$("#wn_image").fadeIn();
			});
			
			$("#wn_title").fadeOut(options.animationSpeed, function() {
				$("#wn_title").html("<div id='wn_title_label'><a href='"+link+"' class='wn_title_header'>"+title+"</a> <div>"+subTitle+"</div> </div>");
				$("#wn_title").fadeIn();
			});
			
			$("#wn_title_background").fadeOut(options.animationSpeed, function() {
				$("#wn_title_background").fadeTo('normal',0.7);
			});
		}
		else if(options.effect==="none"){ // just make it display
			$("#wn_image").html("<a href='"+link+"'><img src='"+src+"' width='100%' height='100%' /></a>");
			$("#wn_title").html("<div id='wn_title_label'><a href='"+link+"' class='wn_title_header'>"+title+"</a> <div>"+subTitle+"</div> </div>");
		}
		
		// change pager style
		$("#wn_pager a").removeClass("active");
		$("#wn_pager a[title=\""+currentIndex+"\"]").addClass("active");
		
		$(".menu-text").removeClass("active");
		$($(".menu-text").get(currentIndex)).addClass("active");
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
		showCurrentImage();
		
	}
	
	return this.each(function() {
		init();
		if(options.autoRotate) {
			timer = setInterval(run , options.timerInterval);
		}
	});
};
})(jQuery);