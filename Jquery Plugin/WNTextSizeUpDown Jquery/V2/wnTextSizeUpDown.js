/**
*   WN TextSizeUpDown v1.0
*   Copyright (C) 2011 Wery Nguyen
*	nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
	-- Since v1.0
		+ Smallest size = original size
		+ The current size will be stored in cookie
		+ fade effect for the text
*/

(function($){ 
$.fn.wnTextSizeUpDown = function(options) {
	var defaults = {
	    selector 		: ["font-size"],  // need to be an array of jquery selector, eg: ["div", "#largerText", "input[type='text']"] ....
		largerText		: "Larger Size",  // text to be displayed for larger text trigger
		smallerText 	: "Smaller Size",  // text to be displayed for smaller text trigger
    largerTrigger : "#larger",
    smallerTrigger: "#smaller",
		seperator		: "|",			// seperator between the 2 link buttons
		times			: 5,			// number of times that the font-size can be increased
		
		effect			: false,		// special effect during changing font-size
		effectSpeed		: 300		// speed for effect in ms
		
    };
	
	options = $.extend(defaults, options);

	// init the element array from the selector
	// init the element array from the selector
	var elementArray = new Array();
	for(var i=0;i<options.selector.length;i++) {
		elementArray[i] = $(options.selector[i]);
	}
	
	// the container itself
	var container = $(this);
	
	// the current size of the text (the times of size increased base on the original size) this value should be < maxsize  and >= 0
	var currentSize = 0;
	var isAnimated = false;
	
	function init() {
		// add the 2 link buttons to the container
		var htmlInject = "<a href='#' class='larger-text-link'>"+options.largerText+"</a> "+options.seperator+ "<a href='#' class='smaller-text-link'>"+options.smallerText+"</a> ";
		container.html(htmlInject);
		
		// listen to click event of those 2 link buttons
		$(".larger-text-link").click(function() {
		
			// cannot increase the text more than the maximum times
			if(currentSize == options.times || isAnimated ) return;
			
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
		
		$(".smaller-text-link").click(function() {
			// current size cannot be less than zero (cannot be smaller than the original size)
			if(currentSize==0 || isAnimated) return;

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
			isAnimated = true;
			jTag.css("opacity","0.3");
		
			jTag.animate({fontSize:newTextSizeValue},options.effectSpeed, function() {
				$(this).css("opacity","1");
				isAnimated = false;
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
			isAnimated = true;
			jTag.css("opacity","0.3");
		
			jTag.animate({fontSize:newTextSizeValue},options.effectSpeed, function() {
				$(this).css("opacity","1");
				isAnimated = false;
			});
			jTag.animate({lineHeight:newLineHeightText},options.effectSpeed);
		}
		else {
			jTag.css("font-size",newTextSizeValue);
			jTag.css("line-height",newLineHeightText);
		}
	}


	return this.each(function() {
		applyCurrentSize();
		init();
	});
};
})(jQuery);