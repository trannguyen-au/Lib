/**
*   WN Gallery v2.0
*   @copyright (C) 2011 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
*	@version 2.0	23/04/2012
	- add image pager
	- image can now be rotated automatically
	- no limit in number of the images
*	@version 1.0	22/12/2011
*/

(function($){ 
$.fn.wnGallery = function(options) {

    // Set default variables in an array
    var defaults = {
		//animationSpeed: 700,
		autoRotate:	true,
		timerInterval: 6000, // 3 sec each rotate,
		pagerImageSize: 80,
		withFullScreen: true,
		numberOfDisplayedImage : 5
    };

	var timer;
	var timerTest;
	
    // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);

	// get the container
    var container = $(this);
	var cId = $(this).attr('id');
	
	// get all the images inside the container 
	var imageList = $(this).find(".img-holder");
	var totalImage = imageList.size();
	
	// current active image index & current displayed index
	var activeIndex = 0;
	var currentDisplayedIndex=0;
	var numberOfDisplayedImage = options.numberOfDisplayedImage;
	
	var maxDisplayIndex = totalImage / numberOfDisplayedImage;
	if(totalImage % numberOfDisplayedImage>0) {
	  maxDisplayIndex = Math.floor(maxDisplayIndex);
	}
	
	// hold the main pager of this control
	var mainPager = null;
	var mainImage = null;
	
	var isRunning = true;
	
	var pagingInfoTag = container.find(".paging-info");
	
	// this function will run once to start up the control
	function init() {
	    container.removeClass("noscript");
		var thumbnailWrap = $(container.children(".thumbnail-wrap")[0]);
		
		// for ie 
		if($.browser.msie) {
		  container.find(".gallery-control").before("<div class='gallery-control-top'></div>");
		}
		
		if(options.withFullScreen)
		  SetupFullscreen();
		
		// display the first image as active image
		var firstImage = $(imageList[0]);
		$(container.children(".main-image")).html(firstImage.find("img").clone());
		firstImage.addClass("active");
		
		mainImage = $(container.children(".main-image").find("img")[0]);
		
		// expect size of the wrapper inner 
		var innerWrapWidth = totalImage* (80+10);
		
		var thumbnailWrapWidth = numberOfDisplayedImage*(80+10)+10;
		
		thumbnailWrap.wrapInner("<div class='thumbnail-wrap-clip' id='"+cId+"-wrap-clip' style='width:"+thumbnailWrapWidth+"px;height:60px; left:60px;position:relative;overflow:hidden'/>");
		$("#"+cId+"-wrap-clip").wrapInner("<div class='thumbnail-wrap-inner' id='"+cId+"-wrap-inner' style='position:absolute;left:0px;width:"+innerWrapWidth+"px'/>");
		mainPager = $("#"+cId+"-wrap-inner");
		imageList.each(function() {
		  // set index for all images
		  $(this).attr("rel",$(this).index());
		  
		  // cache images
		  new Image().src = $(this).find("img").attr("src");
		  
		  // handling click function on image thumbnails.
		  $(this).click(function() {
		    activeIndex = parseInt($(this).attr("rel"));
			DisplayImage(activeIndex);
		  });
		});
		
		// add navigation to thumbnail section
		thumbnailWrap.append("<a href='#' class='move-left' id='"+cId+"-move-left'></a>");
		thumbnailWrap.prepend("<a href='#' class='move-right' id='"+cId+"-move-right'></a>");
		
		// handling event of click to left or right button on thumbnail section
		$("#"+cId+"-move-left").click(function(event) {
		  event.preventDefault();
		  DisplayPreviousImage();
		});
		$("#"+cId+"-move-right").click(function(event) {
		  event.preventDefault();
		  DisplayNextImage();
		});
		
		// gallery controller event handling
		container.find("a.pre").click(function(event) {
		  event.preventDefault();
		  DisplayPreviousImage();
		});
		container.find("a.next").click(function(event) {
		  event.preventDefault();
		  DisplayNextImage();
		});
		container.find("a.play").click(function(event) {
		  event.preventDefault();
		  if(isRunning) {
		    $(this).addClass("pause");
		  }
		  else {
		    $(this).removeClass("pause");
		  }
		  isRunning = !isRunning;
		});
		container.find("a.full-screen").click(function(event) {
		  event.preventDefault();
		  container.find("a.play").click();
		  ShowFullScreen();
		});
		
		// paging information on gallery controller section
		container.find(".paging-info").html((activeIndex+1) + " of "+totalImage);
		
		
	}
	
	function DisplayNextImage() {
	  activeIndex++;
	  if(activeIndex == totalImage) {
	    // display the first image
	    activeIndex = 0;
	  }
	  
	  DisplayImage(activeIndex);
	  MoveViewPort(activeIndex,"right");
	}
	
	function DisplayPreviousImage() {
	  activeIndex--;
	  if(activeIndex == -1) {
	    // display the last image
	    activeIndex = totalImage-1;
	  }
	  
	  DisplayImage(activeIndex);
	  MoveViewPort(activeIndex,"left");
	}
	
	function DisplayImage(index) {
	  $(imageList).removeClass("active");
	  var currentImage = $(imageList.get(index));
	  currentImage.addClass('active');
	  mainImage.attr("src",currentImage.find("img").attr("src"));
	  pagingInfoTag.html((activeIndex+1) + " of "+totalImage);
	}
	
	function MoveViewPort(imageIndex, direction) {
	  if(direction == "left") {
	    // check if image is not in the displayed image range
		var startIndex = currentDisplayedIndex * numberOfDisplayedImage;
		var endIndex = startIndex + numberOfDisplayedImage;
		if(imageIndex < startIndex) {  // need to move left
		  currentDisplayedIndex--;
		  mainPager.animate({'left':-((options.pagerImageSize + 10)*currentDisplayedIndex * numberOfDisplayedImage)});
		}
		else if(imageIndex >= endIndex) { // need to move to the end of the list
		  currentDisplayedIndex = maxDisplayIndex-1;
		  mainPager.animate({'left':-((options.pagerImageSize + 10)*currentDisplayedIndex * numberOfDisplayedImage)});
		}
	  }
	  else if(direction == "right") {
	    var startIndex = currentDisplayedIndex * numberOfDisplayedImage;
	    var endIndex = currentDisplayedIndex * numberOfDisplayedImage + numberOfDisplayedImage;
		if(imageIndex >= endIndex) { // need to move right
		  currentDisplayedIndex++;
		  mainPager.animate({'left':-((options.pagerImageSize +10)*currentDisplayedIndex * numberOfDisplayedImage)});
		}
		else if(imageIndex < startIndex) {
		  currentDisplayedIndex=0;
		  mainPager.animate({'left':-((options.pagerImageSize+10)*currentDisplayedIndex * numberOfDisplayedImage)});
		}
	  }
	}
	
	function SetupFullscreen() {
	  var divOverlay = "<div id='"+cId+"-overlay' class='gallery-overlay' rel='"+cId+"-'></div>";
	  var divFullscreen = "<div id='"+cId+"-fullscreen-wrap' class='gallery-fullscreen-wrap'><div id='"+cId+"-fullscreen' class='gallery-fullscreen'></div></div>";
	  $("body").append(divOverlay+divFullscreen);
	  $("#"+cId+"-fullscreen").html(container.html());
	  $("#"+cId+"-fullscreen").find("a.full-screen").bind('click',function(event) {
	    event.preventDefault();
		CloseFullScreen();
	  });
	  $("#"+cId+"-fullscreen").wnGallery({withFullScreen:false, numberOfDisplayedImage:8});
	}
	
	function ShowFullScreen() {
	  $("#"+cId+"-overlay").show();
	  $("#"+cId+"-overlay").animate({opacity:0.7},400);
	  $("#"+cId+"-fullscreen-wrap").show();
	  $("#"+cId+"-fullscreen-wrap").animate({opacity:1},400);
	}
	
	function CloseFullScreen() {
	  $("#"+cId+"-fullscreen-wrap").hide();
	  $("#"+cId+"-overlay").animate({opacity:0},500, function() {
	    $("#"+cId+"-overlay").hide();
	  });
	}
	
	function run() {
	  if(isRunning) {
		DisplayNextImage();
	  }
	}
	
	// helper methods for img in Seamless CMS 
	function getImgSrc(img) {
		if(img.attr("src")!=null && img.attr("src")!="") {
			var src = img.attr("src");
			if(src.indexOf("?")>=0) {
				return src.substring(0, src.indexOf("?"));  // remove the get parameter if this is a generated image.
			}
			else {
				return src;
			}
		}
		return "";
	}
	
	var countIndex = 0;
	function runTest() {
	  if(isRunning) {
	   countIndex++;
	   container.children(".count-info").html(countIndex);
	   if(countIndex==100) {
	     countIndex = 0;
		 DisplayNextImage();
	   }
	  }
	}
	
	return this.each(function() {
	  init();
	  if(options.autoRotate) {
		timer = setInterval(run , options.timerInterval);
		//timer = setInterval(runTest, options.timerInterval/100)
	  }
	});
};
})(jQuery);