/**
*   WN Slider SIMPLE v1.0
*   @copyright (C) 2012 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
* @version v1.0 19/7/2012
    SIMPLE!! SIMPLE MODE ONLY IMAGE

*	@version v1.4	9/05/2012
*		+ Add pagingPosition: bottom-right (styling for cambridge library website)
*	@version v1.3.3	22/12/2011
*		+ Add target attribute to the link.
*	@version v1.3.2	22/12/2011
*		+ Quick fix display error cause the title background fade to opacity 1 in IE.
*	@version v1.3.1	13/12/2011
*		+ Quick fix an error cause js to stop if rel or alt are not specified for the image.
*	@version v1.3	2/12/2011
*		+ Add pagingPosition below image option which show the paging below the images. Has prev/next/pause button wrap around the normal paging number
*		+ Add below-image css. refer to the stylesheet for more updated on styling (reuse a few components from jquery ui smoothless theme)
*		+ Ability to display title and abstract on the slider, add hyperlink to image and title <img src="link/to/src" title="the title" alt="the subtitle" rel="link to page" />
*	@version v1.2	17/11/2011
*		+ Add PagingNavigation & effect
*	@version v1.1	4/11/2011
*		+ Add more configuration: pagingType can be an image or none
*		+ Auto Rotate?
*		+ Styling fix for IE6
*	@version 1.0	20/10/2011
*/

(function($) {
    $.fn.wnSimpleSlider = function(options) {

        // Set default variables in an array
        var defaults = {
            pagingType: "number", // "image" // "none" // need to have the appropriate css for the image paging type, default value is number
            pagingNavigation: true,
            timerInterval: 6000,
            animationSpeed: 500,
            effect: "fade", // none
            autoRotate: true,
            pagingPosition: 'below-image' // 'below-image','above-image'  // from 1.3     'bottom-right'  from 1.4
        };
        
        var fadeSpeed = 400;

        var timer;

        // Extend default variable array using supplied options, making opional arguments possible
        options = $.extend(defaults, options);

        // get the container
        var container = $(this);
        var cId = $(this).attr("id");
        // if(cId==null) cId = randomId  // TODO: generate random ID if this id is null and assign that id to the current selector
        if(cId == null) {
          alert("Please give the slider an ID attribute");
          return;
        }
        
        // get all the images inside the container 
        var imageList = $(this).find("img"); //$("#"+$(this).attr("id")+" img");
        var imageCount = imageList.size(); 
        
        var currentIndex = 0;

        // this function will run once to start up the control
        function init() {
            // add a new div container after the main div
            if (options.pagingPosition == 'above-image') {
                container.append("<div id='"+cId+"-pager' class='wn-pager'></div>");
            }
            else if (options.pagingPosition == "below-image") {
                container.after("<div id='"+cId+"-pager' class='wn-pager below-image'></div>");
            }
            else if (options.pagingPosition == "bottom-right") {
                container.append("<div id='"+cId+"-pager' class='wn-pager bottom-right'><span class='corner-left'>&nbsp;</span></div>");
            }
            imageList.removeClass("active");
            imageList.css("display", "none");
            
            // select the first image and display it
            if (imageList.length > 0) {
              var firstItem = imageList.first();
              firstItem.fadeIn(fadeSpeed,function() {
                $(this).addClass("active");
              });
            }
            
            // setup the pager
            if (options.pagingType != "none") {
              var content = "";
              for (var i = 0; i < imageCount; i++) {
                if (options.pagingType === "number") {
                    content = (i + 1)+"";
                }

                if (i != currentIndex) {
                    $("#"+cId+"-pager").append("<a class='wn-pager-item' rel='" + i + "' href='#'>" + content + "</a>");
                }
                else {
                    $("#"+cId+"-pager").append("<a class='wn-pager-item active' rel='" + i + "' href='#'>" + content + "</a>");
                }
              }
            }
            
            var pagerButton = $("#"+cId+"-pager a.wn-pager-item");

            // handle the pager click event
            pagerButton.click(function(event) {
              event.preventDefault();
              pagerButton.removeClass("active");
              $(this).addClass("active");
              DisplayImage(parseInt($(this).attr('rel')));
              if (timer != null) {
                // reset the timer
                clearInterval(timer);
                timer = setInterval(run, options.timerInterval);
              }
            });
        }
        
        function DisplayImage(index) {
          var image = $(imageList[index]);
          var currentImage = $(imageList[currentIndex]);
          
          // fade the current image out
          currentImage.fadeOut(fadeSpeed, function() {
            $(this).removeClass("active");
          });
          
          // fade the next image in
          image.fadeIn(fadeSpeed, function() {
            image.addClass("active");
          });
          
          $("#"+cId+"-pager .wn-pager-item.active").removeClass("active");
          $("#"+cId+"-pager .wn-pager-item[rel='"+index+"']").addClass("active");
          
          currentIndex = index; // set the index;
        }
        
        // this function will run after each interval to slide the image
        function run() {
            // find the next image to be displayed
            var nextIndex = currentIndex;
            if (nextIndex >= imageList.length - 1) {
                nextIndex = 0;
            }
            else {
                nextIndex++;
            }
            DisplayImage(nextIndex);
        }

        return this.each(function() {
            init();
            if (options.autoRotate) {
                timer = setInterval(run, options.timerInterval);
            }
        });
    };
})(jQuery);