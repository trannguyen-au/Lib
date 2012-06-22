/**
*   WN Menu Slider v1.0
*   @created 2012 
*	@author Wery Nguyen 
*	@contact nguyennt86@gmail.com
*   @company Seamless CMS	
*	Change Log:
*	@version 1.0	12/06/2012
*/

(function($) {
  $.fn.wnMenuSlider = function(options) {

    // Set default variables in an array
    var defaults = {
      autoRotate: true,
	  timerInterval :2000
    };
	
	var timer;

	// Extend default variable array using supplied options, making opional arguments possible
	options = $.extend(defaults, options);
	
	var container = $(this);
	
	function init() {
	  var imgList = container.children("img");
	  for(var i=0;i<imgList.size() ; i++) {
	    $(imgList[i]).attr("rel",i);
		if(!$(imgList[i]).hasClass("current")) {
		  $(imgList[i]).hide();
		}
	  }
	};
	
	function run() {
	  showNextImage();
	}
	
	function showNextImage() {
	  var currentActiveImage = container.find("img.current");
	  
	  if(currentActiveImage.size()>0) {
	    currentActiveImage = currentActiveImage[0];
	  }
	  else return;
	  
	  var currentIndex = $(currentActiveImage).attr("rel");
	  $(currentActiveImage).removeClass("current").fadeOut();
	  
	  if(parseInt(currentIndex)>=3) {
	    currentIndex = 0;
	  }
	  else {
	    currentIndex++;
	  }
	  $(container.find("img")[currentIndex]).addClass("current").fadeIn();
	  
	  // sync with the menu
	  $(".menu-content a").removeClass("current");
	  $($(".menu-content a")[currentIndex]).addClass("current");
	}
	
	return this.each(function() {
      init();
        if (options.autoRotate) {
          timer = setInterval(run, options.timerInterval);
        }
      });
    };
})(jQuery);