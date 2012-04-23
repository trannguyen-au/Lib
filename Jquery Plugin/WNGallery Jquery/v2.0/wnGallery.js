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
		animationSpeed: 700,
		effect: 	"fade", // 'none', 'slide', 'fade'
		canvasSize: {width:392, height:294},
		pagerSize: 	{width:400, height:100},
		pagerImageSize: 	136,
		autoRotate:	true,
		timerInterval: 6000, // 3 sec each rotate,
		
    };

	var timer;
	
    // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);

	// get the container
    var container = $(this);
	var cId = $(this).attr('id');
	
	// get all the images inside the container 
	var imageList = $(this).find("img");
	
	// current active image index & current displayed index
	var activeIndex;
	var currentDisplayedIndex=0;
	var numberOfDisplayedImage = 3;
	
	// hold the main pager of this control
	var mainPager = null;
	
	
	// this function will run once to start up the control
	function init() {
		// add a new div for the gallery before the div which contains images
		container.before("<div><table style='border-collapse:collapse; width:"+options.canvasSize.width+"px;height:"+options.canvasSize.height+"px; margin-bottom:5px;' id='"+ cId +"_table' class='showarea'><tr><td style='width:"+options.canvasSize.width+"px;height:"+options.canvasSize.height+"px; border:0px; padding:0px;margin:0px; vertical-align:middle; text-align:center'></td></tr></table></div>");
		container.before("<div id='"+cId+"-pager' class='wn-gallery-pager' style='position:relative;overflow:hidden;width:"+options.pagerSize.width+"px;height:"+options.pagerSize.height+"px'></div>")
		
		// copy all the image into the pager
		$("#"+cId+"-pager").html("<div id='"+cId+"-pager-inner' style='position:absolute;left:0px;'>"+container.html()+"</div>");
		
		// set the main pager
		mainPager = $("#"+cId+"-pager-inner");
		
		// calculate the width for the inner pager 
		var innerPagerWidth = imageList.size()*options.pagerImageSize;
		mainPager.css('width',innerPagerWidth);
		
		// hide the container away
		container.css('display','none');
		
		// add navigation for the images
		$("#"+cId+"-pager").prepend("<div class='pager-wrap' style='width:"+options.pagerSize.width+"px'>"
		+"<a class='ui-icon ui-icon-triangle-1-w wn-gallery-pager pager-left' rel='pre' href='#'></a>"
		+"<a class='ui-icon ui-icon-triangle-1-e wn-gallery-pager pager-right' rel='next' href='#'></a>"
		+"</div>");
		
		// select the first image and display it
		if(imageList.length>0) {
			var firstItem = imageList.first();
			activeIndex = 0;
			var src = getImgSrc(firstItem) ;
			var alt = firstItem.attr("alt");
			var title = firstItem.attr("title");
			$("#"+cId+"_table td").html("<img src='"+src+"?w="+options.canvasSize.width+"&h="+options.canvasSize.height+"' style='width:"+options.canvasSize.width+"px' alt='"+alt+"' title='"+title+"'/>");
		}
		
		// START EVENT HANDLING
		// handle the pager image clicked event
		mainPager.find("img").click(function() {
			$("#"+cId+"-pager img").removeClass("active");
			$(this).addClass('active');
			$("#"+cId+"_table td img").attr("src","").hide();
			$("#"+cId+"_table td img").load(function() {
				if(options.effect=="fade") {
					$(this).fadeIn(options.animationSpeed);
				}
				else if(options.effect=="slide") {
					$(this).slideDown(options.animationSpeed);
				}
				else if(options.effect=="none"){
					$(this).show();
				}
			}).attr('src',getImgSrc($(this))+"?w="+options.canvasSize.width+"&h="+options.canvasSize.height)
				.attr("alt",$(this).attr('alt'))
				.attr("title",$(this).attr('title'))
				.css("width",options.canvasSize+"px");
			
			// store the current active index
			activeIndex = $(this).index();
		});
		
		// handle navigation clicked event
		
		$("#"+cId+"-pager a.wn-gallery-pager").click(function(event) {
			if(event==null) event= window.event;
			event.preventDefault();
			var direction = $(this).attr('rel');
			if(direction=="pre") {
				MovePagerLeft();
			}
			else if(direction=="next") {
				MovePagerRight();
			}
		});
		
		// END EVENT HANDLING
	}
	
	function MovePagerLeft() {
		// if there is image in the left
		if(currentDisplayedIndex>0) {
			// move pager to the right
			currentDisplayedIndex--;
			mainPager.animate({'left':-(options.pagerImageSize*currentDisplayedIndex)});
		}
		// if currently standing on the first image
		else if(currentDisplayedIndex==0) {
			// move pager to display the last set of images
			if(imageList.size()>numberOfDisplayedImage) { //check if there is more images on the right hand side
				currentDisplayedIndex = imageList.size()-numberOfDisplayedImage;
				mainPager.animate({'left':-(options.pagerImageSize*(currentDisplayedIndex))});
			}
		}
	}
	
	function MovePagerRight() {
		if(currentDisplayedIndex<imageList.size()-numberOfDisplayedImage) {
			// move pager to the left
			currentDisplayedIndex++;
			mainPager.animate({'left':-(options.pagerImageSize*currentDisplayedIndex)});
		}
		// if currently standing on the last image
		else if(currentDisplayedIndex==imageList.size()-numberOfDisplayedImage) {
			// move pager to display the first set of images
			currentDisplayedIndex = 0;
			mainPager.animate({'left':-(options.pagerImageSize*(currentDisplayedIndex))});
		}
	}
	
	function MovePagerFirst() {
		currentDisplayedIndex = 0;
		mainPager.animate({'left':-(options.pagerImageSize*(currentDisplayedIndex))});
	}
	
	function run() {
		// ---Step 1: get the next active and display it		
		// if current active image is the last image
		if(activeIndex==imageList.size()-1) {
			activeIndex = 0; // set active to the first image
		}
		else {
			activeIndex++;
		}
		
		
		$("#"+cId+"-pager img").removeClass("active");
		var currentImage = $($("#"+cId+"-pager img").get(activeIndex));
		currentImage.addClass('active');
		
		
		$("#"+cId+"_table td img").attr("src","").hide();
		$("#"+cId+"_table td img").load(function() {
			if(options.effect=="fade") {
				$(this).fadeIn(options.animationSpeed);
			}
			else if(options.effect=="slide") {
				$(this).slideDown(options.animationSpeed);
			}
			else if(options.effect=="none"){
				$(this).show();
			}
		}).attr('src',getImgSrc(currentImage)+"?w="+options.canvasSize.width+"&h="+options.canvasSize.height)
			.attr("alt",currentImage.attr('alt'))
			.attr("title",currentImage.attr('title'))
			.css("width",options.canvasSize+"px");
		
		// store the current active index
		activeIndex = currentImage.index();
		
		// ---Step 2: Move the current display frame to show the active image:
		// check if the current active image is out of the display frame
		if(currentDisplayedIndex + numberOfDisplayedImage <= activeIndex) {
			// increase the current display index;
			MovePagerRight();
		}
		else if(currentDisplayedIndex>activeIndex) {
			MovePagerFirst();
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
	return this.each(function() {
		init();
		if(options.autoRotate) {
			timer = setInterval(run , options.timerInterval);
		}
	});
};
})(jQuery);