/**
*   WN Tabs v1.0
*   @copyright (C) 2012 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
*	@version 1.0	25/06/2012
*/

(function($){ 
$.fn.wnTabs = function(options) {
  // Set default variables in an array
  var defaults = {
    
	//animationSpeed: 700,
	//autoRotate:	true,
	//timerInterval: 6000, // 3 sec each rotate,
		//itemSize: 235,
		//numberOfDisplayedItem : 3,
		//pagingTag: ""
  };
  
  options = $.extend(defaults, options);
  var container = $(this);
  var linkList = $(this).find("a");
  
  function init() {
    // hide all tab on the first load
    linkList.each(function() {
      var targetId = $(this).attr("rel");
      if(!$(this).hasClass("active"))
        $("#"+targetId).hide();
    });
    
    // handle tab click event
    $(linkList).click(function(event) {
      if(event==null) event=window.event; 
	  event.preventDefault();
	  var targetId = $(this).attr("rel");
	  
	  if(targetId == "" || targetId == null) return;
	  
	  var activeContentId = container.find("a.active").attr("rel");
	  linkList.removeClass("active");
	  $(this).addClass("active");
	
	  $("#"+activeContentId).hide();
	  $("#"+targetId).show();
    });
  }
  
  return this.each(function() {
	init();
  });
};
})(jQuery);