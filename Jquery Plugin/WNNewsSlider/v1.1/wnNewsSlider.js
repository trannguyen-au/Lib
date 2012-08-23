/**
*   WN News Slider v1.2
*   @copyright (C) 2012 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
*	@version 1.2	13/7/2012
  - Add extra styling for navigation button when reach to the first or last item
*	@version 1.1	13/7/2012
	- Move one by one
  - Fix height issue for view port (require to call this plugin using window.load(function))
  - Fix issue with paging button
*	@version 1.0	22/6/2012
  - Move by each view port
*/

(function($){ 
$.fn.wnNewsSlider = function(options) {

    // Set default variables in an array
    var defaults = {
		//animationSpeed: 700,
		//autoRotate:	true,
		//timerInterval: 6000, // 3 sec each rotate,
    moveOneOnly : true,
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
	  maxPageIndex = Math.ceil(maxPageIndex);
	}
	
	var numberOfDisplayedItem = options.numberOfDisplayedItem;
	
	var currentPageIndex = 0;
  var currentDisplayOffset = 0;
	
	var viewPort = null;
	
	// this function will run once to start up the control
	function init() {
	  // set the width for the wrapper
	  var totalWidth = itemCount * options.itemSize;
	  viewPort = container.find(".news-slider-absolute");
	  viewPort.css("width",totalWidth+"px");
	  
    
    var itemClone = viewPort.clone();
    $("body").append(itemClone);
    var controlHeight = $(itemClone).height();
    itemClone.remove();
    
	  // set the height for the container based on the height of the absolute view port div item
	  //$("#"+cId).height($(".news-slider-absolute").height()+15);
    $("#"+cId).height(controlHeight+15);
	  
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
        if(options.moveOneOnly) {
          MoveBack();
        }
        else {
          MoveViewPort("left");
        }
		  });
		  $(options.pagingTag).children(".paging-right").click(function(event) {
		    event.preventDefault();
        if(options.moveOneOnly) {
          MoveNext();
        }
        else {
          MoveViewPort("right");
        }
		  });
		}
	  }
	}
  
  // move view port to one item forward. If there is no item, do nothing
  function MoveNext() {
    if(currentDisplayOffset+numberOfDisplayedItem<itemCount) {
      // can move forward
      currentDisplayOffset++;
      viewPort.animate({'left':-((options.itemSize)*currentDisplayOffset)});
      
      // change the button style
      var activeButtonIndex = Math.floor((currentDisplayOffset/numberOfDisplayedItem));
      $(options.pagingTag).children("a.paging-button").removeClass("active");
	    $(options.pagingTag).children("a.paging-button[rel="+activeButtonIndex+"]").addClass('active');
      
      NavigationStyling();
    }
  }
  
  function NavigationStyling() {
    // change styling of button
    var navLeft = $(options.pagingTag).find("a.paging-left");
    var navRight = $(options.pagingTag).find("a.paging-right")
    navRight.removeClass("inactive");
    navLeft.removeClass("inactive");
    
    if(currentDisplayOffset+numberOfDisplayedItem>=itemCount) {
      // add grey styling
      navRight.addClass("inactive");
    }
    else if(currentDisplayOffset<=0) {
      navLeft.addClass("inactive");
    }
  }
  
  function MoveBack() {
    if(currentDisplayOffset>0) {
      // can move forward
      currentDisplayOffset--;
      viewPort.animate({'left':-((options.itemSize)*currentDisplayOffset)});
      
      // change the button style
      var activeButtonIndex = Math.floor((currentDisplayOffset/numberOfDisplayedItem));
      $(options.pagingTag).children("a.paging-button").removeClass("active");
	    $(options.pagingTag).children("a.paging-button[rel="+activeButtonIndex+"]").addClass('active');
      
      NavigationStyling();
    }
  }
	
	function MoveViewPortToIndex(index) {
	  // if current index = input index then do nothing
	  currentPageIndex = index;
    currentDisplayOffset = currentPageIndex * numberOfDisplayedItem;
	  viewPort.animate({'left':-((options.itemSize)*currentPageIndex * numberOfDisplayedItem)});
    NavigationStyling();
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
    NavigationStyling();
	}
	
	return this.each(function() {
	  init();
	});
};
})(jQuery);


function debug(message) {
  $("#debug").html($("#debug").html()+" "+message);
}