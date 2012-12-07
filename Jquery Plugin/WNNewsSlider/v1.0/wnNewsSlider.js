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
$.fn.wnNewsSlider = function(options) {

    // Set default variables in an array
    var defaults = {
		//animationSpeed: 700,
		//autoRotate:	true,
		//timerInterval: 6000, // 3 sec each rotate,
		itemSize: 235,
		numberOfDisplayedItem : 3,
		pagingTag: ""
    };
	
    // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);

	// get the container
    var container = $(this);
	var cId = $(this).attr('id');
	
	var itemList = container.find(".news-item");
	var itemCount = itemList.size();
	
	var maxPageIndex = itemCount / options.numberOfDisplayedItem;
	if(itemCount % options.numberOfDisplayedItem >0) {
	  maxPageIndex = Math.floor(maxPageIndex);
	}
	
	var numberOfDisplayedItem = options.numberOfDisplayedItem;
	
	var currentPageIndex = 0;
	
	var viewPort = null;
	
	// this function will run once to start up the control
	function init() {
	  // set the width for the wrapper
	  var totalWidth = itemCount * options.itemSize;
	  viewPort = container.find(".news-slider-absolute");
	  viewPort.css("width",totalWidth+"px");
	  
	  
	  
	  // set the height for the container
	  $(itemList[0]).css("height");
	  
	  // add paging control
	  if(options.pagingTag!="") {
	    var pagingTag = "";
		for(var i=0;i<maxPageIndex ; i++) {
		  if(i==0) 
		    pagingTag+= "<a href='#' rel='"+i+"' class='active paging-button left'></a>";
		  else 
		    pagingTag+= "<a href='#' rel='"+i+"' class='paging-button left'></a>";
		}
		$(options.pagingTag).html(pagingTag);
		
		$(options.pagingTag).children("a.paging-button").click(function(event) {
		  event.preventDefault();
		  MoveViewPortToIndex(parseInt($(this).attr("rel")));
		  $(options.pagingTag).children("a.paging-button").removeClass("active");
		  $(this).addClass("active");
		});
		
		if(maxPageIndex>0) {
		  // add left and right
		  $(options.pagingTag).prepend("<a class='paging-left left' rel='left' href='#'></a>");
		  $(options.pagingTag).append("<a class='paging-right left' rel='right' href='#'></a>");
		  
		  $(options.pagingTag).children(".paging-left").click(function(event) {
		    event.preventDefault();
		    MoveViewPort("left");
		  });
		  $(options.pagingTag).children(".paging-right").click(function(event) {
		    event.preventDefault();
		    MoveViewPort("right");
		  });
		}
	    
	  }
	}
	
	function MoveViewPortToIndex(index) {
	  // if current index = input index then do nothing
	  if(index == currentPageIndex) return;
	  
	  currentPageIndex = index;
	  viewPort.animate({'left':-((options.itemSize)*currentPageIndex * numberOfDisplayedItem)});
	  /*
	  // find which direction
	  var direction = currentPageIndex<index?"right":"left";
	  if(direction == "left") {
	    currentPageIndex = index;
		if(currentPageIndex<0) 
		{ 
		  currentPageIndex = maxPageIndex;
		}
	    viewPort.animate({'left':-((options.itemSize)*currentPageIndex * numberOfDisplayedItem)});
	  }
	  else {
	    currentPageIndex++;
		if(currentPageIndex>maxPageIndex) 
		{ 
		  currentPageIndex = 0;
		}
	    viewPort.animate({'left':-((options.itemSize)*currentPageIndex * numberOfDisplayedItem)});
	  }*/
	}
	
	function MoveViewPort(direction) {
	  if(direction == "left") {
	    // check if image is not in the displayed image range
		currentPageIndex--;
		if(currentPageIndex<0) 
		{ 
		  currentPageIndex = maxPageIndex-1;
		}
	    viewPort.animate({'left':-((options.itemSize)*currentPageIndex * numberOfDisplayedItem)});
	  }
	  else if(direction == "right") {
	    currentPageIndex++;
		if(currentPageIndex==maxPageIndex) 
		{ 
		  currentPageIndex = 0;
		}
	    viewPort.animate({'left':-((options.itemSize)*currentPageIndex * numberOfDisplayedItem)});
	  }
	  
	  $(options.pagingTag).children("a.paging-button").removeClass("active");
	  $(options.pagingTag).children("a.paging-button[rel="+currentPageIndex+"]").addClass('active');
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
	  $("#"+cId+"-fullscreen").wnGallery({withFullScreen:false, numberOfDisplayedItem:8});
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
	  //if(options.autoRotate) {
		//timer = setInterval(run , options.timerInterval);
		//timer = setInterval(runTest, options.timerInterval/100)
	  //}
	});
};
})(jQuery);