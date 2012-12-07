/**
*   WN PlaceHolder v1.0
*   @copyright (C) 2012 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
*	@version 1.0	26/06/2012
*/

(function($){ 
$.fn.wnPlaceHolder = function(options) {
	var options = $.extend({
    content : '',
    submitButton: "input[type='submit']",
    holderColor: "#888",
    color: "#000"
    
  },options);
  
  // add trim function for String object
  if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, ''); 
    }
  }
  
  // for non html5 supported browser
	function init(currentItem) {
    
		var placeHolderText = (currentItem.attr("placeholder")==null || currentItem.attr("placeholder")=="") ? options.content : currentItem.attr("placeholder");
    // set placeholder text
    
    if(currentItem.val() == false) {
      currentItem.val(placeHolderText);
      currentItem.css('color',options.holderColor);
    }
    
    currentItem.focus(function() { // on focus
      if(currentItem.val() == placeHolderText) {
        currentItem.val("");
        currentItem.css('color', options.color);
      }
    });
    currentItem.blur(function() {  // on blur
      if(currentItem.val() == null || currentItem.val().trim().length==0) {
        currentItem.val(placeHolderText);
        currentItem.css('color', options.holderColor);
      }
    });
    
    // clean the text if submit button clicked with value = placeholder text
    if($(options.submitButton).size()>0) {
      $(options.submitButton).click(function() {
        if(currentItem.val()==placeHolderText) {
          currentItem.val('');
        }
      });
    }
	}
  
  // for html5 supportted browser
  function initHtml5(currentItem) {
    if(currentItem.attr("placeholder")!=null && currentItem.attr("placeholder")!="") return; // no need to do anything, browser does the work itself
    
    // if there is not placeholder attribute, update the element with placeholder attribute
    currentItem.attr("placeholder",options.content);
  }
	
	function isHtml5Support() {
		if(Modernizr!=null) return Modernizr.input.placeholder;
		else {
			return 'placeholder' in document.createElement('input');
		}
	}
	
	
	return this.each(function() {
    if($(this).is('input[type="text"],input[type="password"], textarea')) {
      var currentItem = $(this);
      if(isHtml5Support()) {
        initHtml5(currentItem);
      }
      else {
        init(currentItem);
      }
    }
    
    else if($(this).is("div") || $(this).is("span")) { // if this is a wrapper by div or span and has the placeholder property
      var tempOption = $.extend(options,{content: $(this).attr("placeholder")});
      $(this).find("input[type='text'], input[type='password'], textarea").wnPlaceHolder(tempOption);
    }
    else if($(this).is('select')) {  // for select item
    
    }
	});
};
})(jQuery);