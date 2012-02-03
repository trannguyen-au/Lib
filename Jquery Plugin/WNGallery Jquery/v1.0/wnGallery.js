/**
*   WN Gallery v1.0
*   @copyright (C) 2011 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
*	@version 1.0	22/12/2011
*/

(function($){ 
$.fn.wnGallery = function(options) {

    // Set default variables in an array
    var defaults = {
		animationSpeed: 500,
		effect: "fade", // 'none', 'slide', 'fade'
		canvasSize: {width:310, height:310},
    };

	var timer;
	
    // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);

	// get the container
    var container = $(this);
	var cId = $(this).attr('id');
	
	// get all the images inside the container 
	var imageList = $(this).find("img");
	
	// this function will run once to start up the control
	function init() {
		// add a new div container after the main div
		container.before("<div style='width:"+options.canvasSize.width+"px;height:"+options.canvasSize.height+"px; background:#ddd; overflow:hidden'><table style='border-collapse:collapse; width:"+options.canvasSize.width+"px;height:"+options.canvasSize.height+"px;' id='"+ cId +"_table' class='showarea'><tr><td style='width:"+options.canvasSize.width+"px;height:"+options.canvasSize.height+"px; vertical-align:middle; text-align:center'></td></tr></table></div>");
		
		// select the first image and display it
		if(imageList.length>0) {
			
			var firstItem = imageList.first();
			var src = getImgSrc(firstItem) ;
			var alt = firstItem.attr("alt");
			var title = firstItem.attr("title");
			//$("#"+cId+"_table td").html("<img src='"+src+"?w="+options.canvasSize.width+"&h="+options.canvasSize.height+"' style='width:"+options.canvasSize.width+"' alt='"+alt+"' title='"+title+"'/>");
			$("#"+cId+"_table td").html("<img src='"+src+"?w="+options.canvasSize.width+"&h="+options.canvasSize.height+"' style='width:"+options.canvasSize.width+"' alt='"+alt+"' title='"+title+"'/>");
		}		
		
		
		// handle the image click event
		container.find("img").click(function() {
			
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
			.attr("title",$(this).attr('title'));
			
			
		});
		
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
	});
};
})(jQuery);