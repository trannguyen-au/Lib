/**
*   WN Slider v1.3
*   @copyright (C) 2011 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
	@version v1.4	WIP
	@version v1.3	2/12/2011
		+ Add pagingPosition below image option which show the paging below the images. Has prev/next/pause button wrap around the normal paging number
		+ Add below-image css. refer to the stylesheet for more updated on styling (reuse a few components from jquery ui smoothless theme)
		+ Ability to display title and abstract on the slider, add hyperlink to image and title <img src="link/to/src" title="the title" alt="the subtitle" rel="link to page" />
	@version v1.2	17/11/2011
		+ Add PagingNavigation & effect
	@version v1.1	4/11/2011
		+ Add more configuration: pagingType can be an image or none
		+ Auto Rotate?
		+ Styling fix for IE6
	@version 1.0	20/10/2011
*/

(function($){ 
$.fn.wnSlider = function(options) {

    // Set default variables in an array
    var defaults = {
	    style 			: "wn-slider",
		pagingType 		: "number", // "image" // "none" // need to have the appropriate css for the image paging type, default value is number
		pagingNavigation: true,
        timerInterval	: 60000,
		animationSpeed	: 500,
		effect			: "fade", // none
		autoRotate		: true,
		
		pagingPosition	: 'above-image', // 'below-image','above-image'  // from 1.3
		
		// from 1.4 add menu control to the slider
		showMenu		: true,
		menuPosition	: "left",	// left or right
		maxItemOnMenu	: 4
		
    };

	var timer;
	
    // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);

	// get the container
    var container = $(this);
	
	// get all the images inside the container 
	var imageList = $(this).find("img");//$("#"+$(this).attr("id")+" img");
	
	var currentIndex = 0;
	
	// this function will run once to start up the control
	function init() {
		// add a new div container after the main div
		if(options.pagingPosition=='above-image') {
			container.append("<div id='wn_pager'></div>");
		}
		else if(options.pagingPosition=="below-image"){
			container.after("<div id='wn_pager' class='below-image'></div>");
		}
		container.append("<div id='wn_image'></div>");
		container.append("<div id='wn_title_background'></div>");
		container.append("<div id='wn_title'></div>");
		container.children("img").css("display","none");
		
		//showCurrentImage();
		showFirstItem();
		
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
		
		// pager navigation
		if(options.pagingNavigation===true) {
			if(options.pagingPosition=="above-image") {
				container.append("<div id='wn_pre' style='position:absolute; left:0px; width:50%; height:100%;'><a href='#'></a></div>");
				container.append("<div id='wn_next' style='position:absolute; right:0px; width:50%; height:100%;'><a href='#'></a></div>");
				
				$("div#wn_pre a").click(function() {
					if(currentIndex===0)
						currentIndex = imageList.length-1;
					else 
						currentIndex--;
					
					showCurrentImage();
				});
				
				$("div#wn_next a").click(function() {
					if(currentIndex===imageList.length-1)
						currentIndex = 0;
					else 
						currentIndex++;
						
					showCurrentImage();
				});
			}
			else if(options.pagingPosition=="below-image"){
				$('#wn_pager').prepend("<a id='wn_pre' class='below-image wn-pager-item' href='#'></a>");
				$('#wn_pager').append("<a id='wn_next' class='below-image wn-pager-item' href='#'></a>");
				$('#wn_pager').append("<a id='wn_pause' class='below-image wn-pager-item' href='#'></a>");
				
				$("#wn_pre").click(function(event) {
					if(currentIndex===0)
						currentIndex = imageList.length-1;
					else 
						currentIndex--;
					
					showCurrentImage();
					return false;
				});
				
				$("#wn_next").click(function() {
					if(currentIndex===imageList.length-1)
						currentIndex = 0;
					else 
						currentIndex++;
						
					showCurrentImage();
					return false;
				});
				
				$("#wn_pause").click(function(){
					if(timer!=null) {
						// stop the timer
						clearInterval(timer);
						timer = null;
						
						// change the button style to pause
						$(this).addClass('pause-state');
					}
					else {
						// continue the timer
						timer = setInterval(run , options.timerInterval);
						$(this).removeClass('pause-state');
					}
					return false;
				});
			}
			else if(option.pagingPosition=="none") {
				
			}
		}
		
		// menu option 
		if(options.showMenu) {
			
			// wrap the main slider into a div with the float style opposite the position of the menu
			if(options.menuPosition=="left") {
				container.wrap("<div class='right' />");
			}
			else if(options.menuPosition=="right") {
				container.wrap("<div class='left' />");
			}
		
			var menuHtml = "<ul class='layout-list wn-slider-menu-list "+options.menuPosition+"' id='wn_slider_menu_list'></ul>";
			container.parent("div").before(menuHtml);
			
			// add li to each image item on the right base on the maximum item
			
			//var countMenuItem = options.maxItemOnMenu > imageList.length?imageList.length:options.maxItemOnMenu;
			
			// get the height of the area
			//var posibleHeight = parseInt(container.css("height"))/countMenuItem;
			for(var i=0; i<imageList.length; i++) {
				var liHtml = "<li><a href='#' rel='"+i+"'>"+imageList[i].title+"</a></li>"; // get the title of the image to display on the menu
				var liHtmlActive = "<li><a href='#' class='active' rel='"+i+"'>"+imageList[i].title+"</a></li>"; // active item
				if(i==currentIndex) {
					$("#wn_slider_menu_list").append(liHtmlActive);
				}
				else {
					$("#wn_slider_menu_list").append(liHtml);
				}
			}
			
			$("#wn_slider_menu_list a").click(function() {
				// show the item that is related to the link
				var targetItemIndex = parseInt($(this).attr('rel'));
				currentIndex = targetItemIndex;
				showCurrentImage();
				
				return false;
			});
		}
	}
	
	function showFirstItem() {
		// select the first image and display it. This method is for the first load of the plugin 
		if(imageList.length>0) {
			
			var firstItem = imageList.first();
			var src = firstItem.attr("src");
			var title = firstItem.attr("title");
			var link = firstItem.attr("rel");//imageList[currentIndex].attr('rel')!=null ? imageList[currentIndex].attr('rel') : "#";
			var subTitle = firstItem.attr("alt");//imageList[currentIndex].alt!=null ? imageList[currentIndex].alt : "";
			
			$("#wn_image").html("<a href='"+link+"'><img src='"+src+"' width='100%' height='100%' /></a>");
			$("#wn_title").html("<div id='wn_title_label'><a href='"+link+"' class='wn_title_header'>"+title+"</a> <div>"+subTitle+"</div> </div>");
		}
	}
	
	function showCurrentImage() {
		var src = imageList[currentIndex].src;
		var title = imageList[currentIndex].title;
		var link = imageList[currentIndex].attributes['rel'].value;
		var subTitle = imageList[currentIndex].alt;//imageList[currentIndex].alt!=null ? imageList[currentIndex].alt : "";
		
		
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
				$("#wn_title_background").fadeIn();
			});
			
		}
		else if(options.effect==="none"){ // just make it display
			$("#wn_image").html("<a href='"+link+"'><img src='"+src+"' width='100%' height='100%' /></a>");
			$("#wn_title").html("<div id='wn_title_label'><a href='"+link+"' class='wn_title_header'>"+title+"</a> <div>"+subTitle+"</div> </div>");
		}
		
		// change pager style
		$("#wn_pager a").removeClass("active");
		$("#wn_pager a[title=\""+currentIndex+"\"]").addClass("active");
		
		// change the menu style
		$("#wn_slider_menu_list a").removeClass("active");
		$("#wn_slider_menu_list a[rel=\""+currentIndex+"\"]").addClass("active");
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