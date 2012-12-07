/**
*   WN Tabs v1.0
*   @copyright (C) 2012 Wery Nguyen
*  @author nguyennt86@gmail.com
*   Seamless CMS  
*  Change Log:
*  @version 2.0  07/12/2012
*	- accessibility compatible with js and no js
*	- multiple tabs in one page
*  @version 1.0  25/06/2012
*/

(function($){ 
$.fn.wnTabs = function(options) {
  // Set default variables in an array
  var defaults = {
    contentBlock: ".wn-tab-content",
	tabTitle : ".wn-tab-title",
    onTabClick : null
  };
  
  var keyCode = {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
  
  options = $.extend(defaults, options);
  var container = $(this);
  var cId = container.attr("id");
  var tabMenuWrap = null;
  var contentBlockList = $(container.find(options.contentBlock));
  
  function init() {
	// create the tabs list
	container.prepend("<div class='wn-tabs-wrap clearfix' id='"+cId+"-tabs-menu-wrap'></div>");
	tabMenuWrap = $("#"+cId+"-tabs-menu-wrap");
	
	contentBlockList.each(function() {
		var currentIndex = $(this).index();
		var currentBlockId = cId+"-tab-content-"+currentIndex;
		
		$(this).attr("id",currentBlockId);
		var $contentTitle = $(this).find(options.tabTitle);
		var contentTitle = $contentTitle.html();
		
		tabMenuWrap.append("<a href='#' class='wn-tab-button' rel='"+currentBlockId+"'>"+contentTitle+"<span></span></a>");
		$contentTitle.hide();
		$(this).removeClass("no-js-element").hide();
	});
	
	var tabButtonList = tabMenuWrap.find("a");
	
	// trigger click function
	tabButtonList.click(function(event) {
	  event.preventDefault();
	  $(contentBlockList).hide();
	  $(this).siblings("a").removeClass("active");
	  
	  var openningBlockId = $(this).attr("rel");
	  $("#"+openningBlockId).show();
	  $(this).addClass("active");
	  
	  return false;
	});
	
	// keyboard support : tab button
	tabButtonList.focus(function() {
	  $(contentBlockList).hide();
	  $(this).siblings("a").removeClass("active");
	  
	  var openningBlockId = $(this).attr("rel");
	  $("#"+openningBlockId).show();
	  $(this).addClass("active");
	});
	
	// keyboard support : left-right navigation
	tabButtonList.keyup(function(event) {
	  var currentIndex = $(this).index();
	  if(event.which == keyCode.LEFT || event.which == keyCode.UP) {
		if(currentIndex==0) return;
		
		// change focus to the next item
		tabButtonList.get(currentIndex-1).focus();
	  }
	  else if(event.which == keyCode.DOWN || event.which == keyCode.RIGHT) {
		if(currentIndex==tabButtonList.size()-1) return;
		
		// change focus to the next item
		tabButtonList.get(currentIndex+1).focus();
	  }
	});
	
	// show the first tab
	container.find(options.contentBlock+":first").show();
	tabMenuWrap.find("a:first").addClass("active");
  }
  
  return this.each(function() {
    init();
  });
};
})(jQuery);