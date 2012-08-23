/**
*   WN TextSizeUpDown v1.0
*   Copyright (C) 2011 Wery Nguyen
*	nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
  -- Since v2.0
    + use larger trigger && smaller trigger
    + change structure from jquery plugin to non-jquery javascript plugin

	-- Since v1.0
		+ Smallest size = original size
		+ The current size will be stored in cookie
		+ fade effect for the text
*/

var WnLib = WnLib || {};

WnLib.TextSizeUpDown = function(options) {
  var defaults = {
    selector  : ["font-size-changable"],
    largerTrigger : "#larger-trigger",
    smallerTrigger : "#smaller-trigger",
    maxSize: 5,
    effect : false,
    effectSpeed : 300
  };
  
  var options = $.extend(defaults, options);
  var isAnimating = false; // avoid overlap of multiple clicking to the trigger link while animating
  
  // init the element array from the selector
	var elementArray = new Array();
	for(var i=0;i<options.selector.length;i++) {
		elementArray[i] = $(options.selector[i]);
	}
  
  // the current size of the text (the times of size increased base on the original size) this value should be < maxsize  and >= 0
	var currentSize = 0;
  
  function init() {
		// listen to click event of those 2 link buttons
		$(options.largerTrigger).click(function() {
		
			// cannot increase the text more than the maximum times
			if(currentSize == options.maxSize || isAnimating ) return;
			
			// increase the size of the selected tag from element array
			for(var i=0;i<elementArray.length;i++) {
				elementArray[i].each(function(){
					increaseTextSize($(this));
				});
			}

			// update the current size and save to cookie
			currentSize+=1;
			createCookie('text_size',currentSize,1);
		});
		
		$(options.smallerTrigger).click(function() {
			// current size cannot be less than zero (cannot be smaller than the original size)
			if(currentSize==0 || isAnimating) return;

			// increase the size of the selected tag from element array
			for(var i=0;i<elementArray.length;i++) {
				elementArray[i].each(function(){
					decreaseTextSize($(this));
				});
			}

			// update the current size and save to cookie
			currentSize -= 1;
			createCookie('text_size',currentSize,1);
		});
	}
	
	function applyCurrentSize() {
		if(readCookie("text_size")!=null) {
			currentSize = parseInt(readCookie("text_size"));
			if(currentSize>options.times ) {
				currentSize = options.times ;
			}
			
			for(var i=0;i<currentSize;i++) {
				for(var j=0;j<elementArray.length;j++) {
					elementArray[j].each(function(){
						increaseTextSize($(this));
					});
				}
			}
		}
	}
  
  // function to deal with cookie: save data to cookie and get data from cookie
	function createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}
		else var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}
	
	//implementation of increasing and decreasing text size
  
	function decreaseTextSize(jTag) {
		// calculate the text size
		var currentTextSize = jTag.css("font-size");
		var currentTextSizeValue = currentTextSize.replace("px","").replace("em","");
		var textSizeUnit = currentTextSize.replace(currentTextSizeValue,"");
		var newTextSize = 0;
		if(textSizeUnit=="px") {
			var newTextSize = parseInt(currentTextSize) - 2;
		} 
		else if(textSizeUnit=="em"){
			var newTextSize = parseInt(currentTextSize) - 0.125;
		}    
		var newTextSizeValue = newTextSize+textSizeUnit;

		// calculate the line-height
		var currentLineHeight = jTag.css("line-height");
		var currentLineHeightValue = currentLineHeight .replace("px","");
		var newLineHeightValue  = parseInt(currentLineHeightValue) - 1;
		var newLineHeightText =     newLineHeightValue+"px";
		
		
		if(options.effect) {
			isAnimating = true;
			jTag.css("opacity","0.3");
		
			jTag.animate({fontSize:newTextSizeValue},options.effectSpeed, function() {
				$(this).css("opacity","1");
				isAnimating = false;
			});
			jTag.animate({lineHeight:newLineHeightText},options.effectSpeed);
			
		}
		else {
			jTag.css("font-size",newTextSizeValue);
			jTag.css("line-height",newLineHeightText);
		}
	}

	function increaseTextSize(jTag) {
		// calculate the text size
		var currentTextSize = jTag.css("font-size");
		var currentTextSizeValue = currentTextSize.replace("px","").replace("em","");
		var textSizeUnit = currentTextSize.replace(currentTextSizeValue,"");
		var newTextSize = 0;
		if(textSizeUnit=="px") {
			var newTextSize = parseInt(currentTextSize) + 2;
		} 
		else if(textSizeUnit=="em"){
			var newTextSize = parseInt(currentTextSize) + 0.125;
		}    
		var newTextSizeValue = newTextSize+textSizeUnit;

		// calculate the line-height
		var currentLineHeight = jTag.css("line-height");
		var currentLineHeightValue = currentLineHeight .replace("px","");
		var newLineHeightValue  = parseInt(currentLineHeightValue) + 1;
		var newLineHeightText =     newLineHeightValue+"px";
		
		if(options.effect) {
			isAnimating = true;
			jTag.css("opacity","0.3");
		
			jTag.animate({fontSize:newTextSizeValue},options.effectSpeed, function() {
				$(this).css("opacity","1");
				isAnimating = false;
			});
			jTag.animate({lineHeight:newLineHeightText},options.effectSpeed);
		}
		else {
			jTag.css("font-size",newTextSizeValue);
			jTag.css("line-height",newLineHeightText);
		}
	}
  
  applyCurrentSize();
  init();
}