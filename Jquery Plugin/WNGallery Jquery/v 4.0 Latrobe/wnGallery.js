/**
*   WN Gallery v4.0
*   @copyright (C) 2012 Wery Nguyen
*  @author nguyennt86@gmail.com
*   Seamless CMS  
*  Change Log:
*  @version 4.0  3/07/2012
  - a thumbnail gallery on the side bar, on click will trigger a popup gallery
  - the gallery images on preview are chosen randomly.
  - add maxImageOnThumbnail configuration: number of images preview displayed on the sidebar
  - add allowRotate: set to true to allow rotating navigation on the thumbnail area
  - no auto rotating feature
*  @version 3.0  22/06/2012
  - add thumbnail of 5 images with left and right button
  - add full-screen feature which display the current image in full-screen (lightbox style)
  - add gallery control on top: pre/next/play/pause/full-screen aside with information box
*  @version 2.0  23/04/2012
  - add image pager
  - image can now be rotated automatically
  - no limit in number of the images
*  @version 1.0  22/12/2011
*/

(function($){ 
$.fn.wnGallery = function(options) {

    // Set default variables in an array
  var defaults = {
    //animationSpeed: 700,
    //autoRotate:  true,
    //timerInterval: 6000, // 3 sec each rotate,
    pagerImageSize: 90,
    numberOfDisplayedImage : 5,
    maxImageOnThumbnail: 6,
    allowRotate : false
  };

  var timer;
  
  // Extend default variable array using supplied options, making opional arguments possible
  options = $.extend(defaults, options);

  // get the container
  var container = $(this);
  var cId = $(this).attr('id');
  
  // get all the images inside the container 
  var imageList = $(this).find(".image-source img");
  var totalImage = imageList.size();
  
  // current active image index & current displayed index
  var activeIndex = 0;
  var currentDisplayedIndex=0;
  var numberOfDisplayedImage = options.numberOfDisplayedImage;
  
  var maxDisplayIndex = totalImage / numberOfDisplayedImage;
  if(totalImage % numberOfDisplayedImage>0) {
    maxDisplayIndex = Math.floor(maxDisplayIndex);
  }
  else if(maxDisplayIndex>0) {
    maxDisplayIndex--;
  }
  
  // hold the main pager of this control
  var mainPager = null;
  var mainImage = null;
  
  var isRunning = true;
  
  var imgHolderList ;
  
  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // this function will run once to start up the control
  function init() {
    // 1. Create a thumbnail look
    /*var maxImageCount = (options.maxImageOnThumbnail<(totalImage-1)) ? options.maxImageOnThumbnail : totalImage-1; 
    
    // select image for thumbnail randomly
    var shuffledImageList = $.shuffle(imageList.clone());
    // select first image to display as main image
    var firstImage = shuffledImageList[0];
    container.html(firstImage.outerHTML);
    
    // create thumbnail section:
    container.append("<div class='wnThumbnail clearfix' id='"+cId+"-wnThumbnail' />");
    for(var i=0;i<maxImageCount;i++) {
      $("#"+cId+"-wnThumbnail").append(shuffledImageList[i+1].outerHTML);
    }*/
    
    // setup popup Gallery
    InitPopupGallery();
    
    // add a trigger for popup gallery by clicking to the whole container
    /*container.css("cursor","pointer");
    container.click(function() {
      ShowPopupGallery();
    });*/
    
    // Update script: triggered by clicking to thumbnail preview images and display the clicked image as current image on popup screen
    $("#"+cId+" .wnThumbnail img").each(function() {
      $(this).css("cursor","pointer");
      $(this).click(function () {
        ShowPopupGallery();
        if($(this).attr("rel")!=null)
          var imgIndex = parseInt($(this).attr("rel"));
          MoveViewPort(imgIndex,"right");
          DisplayImage(imgIndex);
          activeIndex = imgIndex;
      });
    });
    $("#"+cId+" > img").click(function() {
      ShowPopupGallery();
      if($(this).attr("rel")!=null)
        var imgIndex = parseInt($(this).attr("rel"));
        MoveViewPort(imgIndex,"right");
        DisplayImage(imgIndex);
        activeIndex = imgIndex;
    });
  }
  
  function InitPopupGallery() {
    $("body").append("<div class='wnGallery-overlay' id='"+cId+"-wnGallery-overlay' />");
    $("#"+cId+"-wnGallery-overlay").css("height",$(document).height()+"px");
    
    $("body").append("<div class='wnGallery-popup-wrap' id='"+cId+"-wnGallery-popup-wrap'><div class='wnGallery-popup' id='"+cId+"-wnGallery-popup'></div></div>");
    var galleryWrap = $("#"+cId+"-wnGallery-popup");
    galleryWrap.append("<div class='wnGallery-popup-main-image' id='"+cId+"-wnGallery-popup-main-image' />");
    galleryWrap.append("<div class='wnGallery-popup-image-title' id='"+cId+"-wnGallery-popup-image-title' />");
    galleryWrap.append("<div class='wnGallery-popup-thumbnail-wrap' id='"+cId+"-wnGallery-popup-thumbnail-wrap' />");
    galleryWrap.append("<div class='wnGallery-popup-close-button' id='"+cId+"-wnGallery-popup-close-button'>Close</div>");
    
    // setup thumbnail wrap
    var thumbnailWrap = $("#"+cId+"-wnGallery-popup-thumbnail-wrap");
    var moveLeftButton = "<a href='#' class='move-left' id='"+cId+"-move-left'></a>";
    var moveRightButton = "<a href='#' class='move-right' id='"+cId+"-move-right'></a>";
    var thumbnailWrapClip = "<div class='thumbnail-wrap-clip' id='"+cId+"-thumbnail-wrap-clip'><div class='thumbnail-wrap-inner' id='"+cId+"-thumbnail-wrap-inner'></div></div>";
    thumbnailWrap.html(moveLeftButton+thumbnailWrapClip+moveRightButton);
    mainPager = $("#"+cId+"-thumbnail-wrap-inner");
    
    var totalSize = 0;
    for(var i=0;i<imageList.length;i++) {
      mainPager.append("<div class='img-holder left' rel='"+i+"'><div class='cover-background'></div>"+imageList[i].outerHTML+"</div>");
      totalSize += options.pagerImageSize;
    }
    mainPager.css("width",totalSize+"px");
    imgHolderList = mainPager.children(".img-holder");
    
    // EVENT HANDLING
    // clicking to overlay area will close the gallery
    $("#"+cId+"-wnGallery-overlay").click(function() {
      ClosePopupGallery();
    });
    
    // clicking to close button will close the gallery
    $("#"+cId+"-wnGallery-popup-close-button").click(function(event) {
      event.preventDefault();
      ClosePopupGallery();
    });
    
    // move left/right thumbnail button
    $("#"+cId+"-move-left").click(function(event) {
      event.preventDefault();
      DisplayPreviousImage();
    });
    $("#"+cId+"-move-right").click(function(event) {
      event.preventDefault();
      DisplayNextImage();
    });
    
    // event clicking to thumbnail image
    imgHolderList.each(function() {
      $(this).click(function(event) {
        if(event!=null) event.preventDefault();
        activeIndex = $(this).attr('rel');
        DisplayImage(parseInt(activeIndex));
      });
    });
    
    // load the first image and display it
    DisplayImage(0);
  }
  
  function ShowPopupGallery() {
    $("#"+cId+"-wnGallery-overlay").show();
    $("#"+cId+"-wnGallery-overlay").animate({opacity:0.7},300,function() {
      // load up gallery
      $("#"+cId+"-wnGallery-popup-wrap").show();
    });
  }
  
  function ClosePopupGallery() {
    $("#"+cId+"-wnGallery-popup-wrap").hide();
    $("#"+cId+"-wnGallery-overlay").animate({opacity:0},300,function() {
      $("#"+cId+"-wnGallery-overlay").hide();
    });
  }
  
  function DisplayNextImage() {
    activeIndex++;
    if(activeIndex == totalImage) {
      if(options.allowRotate) {
        // display the first image
        activeIndex = 0;
      }
      else {
        // keep it at the last image
        activeIndex = totalImage-1;
      }
    }
    
    DisplayImage(activeIndex);
    MoveViewPort(activeIndex,"right");
  }
  
  function DisplayPreviousImage() {
    activeIndex--;
    if(activeIndex == -1) {
      if(options.allowRotate) {
        // display the last image
        activeIndex = totalImage-1;
      }
      else {
        // keep it at the first image
        activeIndex = 0;
      }
    }
    
    DisplayImage(activeIndex);
    MoveViewPort(activeIndex,"left");
  }
  
  function DisplayImage(index) {
    imgHolderList.removeClass('active');
    var currentImageHolder = $(imgHolderList[index]);
    currentImageHolder.addClass("active");
    
    var currentImage = currentImageHolder.children("img");
    
    var title = currentImage.attr("alt")==null?(currentImage.attr("title")==null?"&nbsp;":currentImage.attr("title")):currentImage.attr("alt");
    $("#"+cId+"-wnGallery-popup-main-image").addClass("loading");
    $("<img alt='"+title+"'/>") // Make in memory copy of image to avoid css issues
    .load(function() {
        $("#"+cId+"-wnGallery-popup-main-image").html($(this).clone());
        $("#"+cId+"-wnGallery-popup-main-image").removeClass('loading');
        $("#"+cId+"-wnGallery-popup-image-title").html($(this).attr("alt"));
    }).attr("src", currentImage.attr("src"));
    
    
    // show hide navigation buttons
    if(!options.allowRotate) {
      if(index ==0 ) {
        $("#"+cId+"-move-left").hide();
        $("#"+cId+"-move-right").show();
      }
      else if(index==totalImage-1) {
        $("#"+cId+"-move-left").show();
        $("#"+cId+"-move-right").hide();
      }
      else {
        $("#"+cId+"-move-left").show();
        $("#"+cId+"-move-right").show();
      }
    }
  }
  
  function MoveViewPort(imageIndex, direction) {
    if(direction == "left") {
      // check if image is not in the displayed image range
    var startIndex = currentDisplayedIndex * numberOfDisplayedImage;
    var endIndex = startIndex + numberOfDisplayedImage;
    if(imageIndex < startIndex) {  // need to move left
      currentDisplayedIndex--;
      mainPager.animate({'left':-((options.pagerImageSize)*currentDisplayedIndex * numberOfDisplayedImage)});
    }
    else if(imageIndex >= endIndex) { // need to move to the end of the list
      currentDisplayedIndex = maxDisplayIndex;
      mainPager.animate({'left':-((options.pagerImageSize)*currentDisplayedIndex * numberOfDisplayedImage)});
    }
    }
    else if(direction == "right") {
      var startIndex = currentDisplayedIndex * numberOfDisplayedImage;
      var endIndex = currentDisplayedIndex * numberOfDisplayedImage + numberOfDisplayedImage;
    if(imageIndex >= endIndex) { // need to move right
      currentDisplayedIndex++;
      mainPager.animate({'left':-((options.pagerImageSize)*currentDisplayedIndex * numberOfDisplayedImage)});
    }
    else if(imageIndex < startIndex) {
      currentDisplayedIndex=0;
      mainPager.animate({'left':-((options.pagerImageSize)*currentDisplayedIndex * numberOfDisplayedImage)});
    }
    }
  }
  
  function ShowFullScreen() {
    // clear the image area before showing other image
    $("#"+cId+"-fullscreen .img-area").html("");
    $("#"+cId+"-fullscreen .img-area").addClass('loading');
    
    // overlay the background
    $("#"+cId+"-overlay").show();
      $("#"+cId+"-overlay").animate({opacity:0.7},400);
    
    // get the current image and display it on full screen
    var img = $(imageList[activeIndex]).find("img");
    var pic_real_width, pic_real_height;
    $("<img/>") // Make in memory copy of image to avoid css issues
    
    .load(function() {
      pic_real_width = this.width;   // Note: $(this).width() will not
      pic_real_height = this.height; // work for in memory images.
      $("#"+cId+"-fullscreen").animate({width:pic_real_width,height: pic_real_height},400);
          $("#"+cId+"-fullscreen-wrap").show();
          $("#"+cId+"-fullscreen-wrap").animate({opacity:1},400, function() {
        $("#"+cId+"-fullscreen .img-area").html(img.clone());
        $("#"+cId+"-fullscreen .img-area").removeClass('loading');
      });
    }).attr("src", $(img).attr("src"));
    
    
  }
  
  function CloseFullScreen() {
    $("#"+cId+"-fullscreen-wrap").hide();
    $("#"+cId+"-overlay").animate({opacity:0},500, function() {
      $("#"+cId+"-overlay").hide();
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


/*
 * jQuery shuffle
 *
 * Copyright (c) 2008 Ca-Phun Ung <caphun at yelotofu dot com>
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://yelotofu.com/labs/jquery/snippets/shuffle/
 *
 * Shuffles an array or the children of a element container.
 * This uses the Fisher-Yates shuffle algorithm <http://jsfromhell.com/array/shuffle [v1.0]>
 */
 
(function($){

  $.fn.shuffle = function() {
    return this.each(function(){
      var items = $(this).children().clone(true);
      return (items.length) ? $(this).html($.shuffle(items)) : this;
    });
  }
  
  $.shuffle = function(arr) {
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
  }
  
})(jQuery);