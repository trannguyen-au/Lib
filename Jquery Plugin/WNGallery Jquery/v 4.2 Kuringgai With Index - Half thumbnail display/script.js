/* Author: */

$(document).ready(function() {

  $("#wn-gallery").wnGallery();
/*
  PredictiveSearch({
    'searchInput': '.search-wrapper .search-input',
    'searchButton': '.search-wrapper .search-button',
    'searchdlvname': 'DLV Feed Search',
    'resultItem': 'li',
    'outputdiv': '#predictiveResults',
    'textDiv': '.searchFeedAbstract',
    'titleDiv': '.searchFeedTitle a',
    'textLimit': 50,
    'titleLimit': 28
  });
  */
  /*$("#wn-news-slider").wnNewsSlider({
    pagingTag : "#news-paging"
    });
    
    $("#news-tab").wnTabs();
    
    $("#map-tab").wnTabs();
    
    $(".google-map.auto").wnGoogleMap();
  
  injectCss();
  initEnterPressedHandler();
  initPlaceHolder();
  
  initTableFormTemplate();
  
  maximisePopupEventOverlay();*/
  //$(window).resize(maximisePopupEventOverlay);
  //$(window).scroll(maximisePopupEventOverlay);
});

function maximisePopupEventOverlay() {
  $('.popupEventOverlay').css('width', $(document).width() + 'px').css('height', $(document).height() + 'px');
}

function initTableFormTemplate() {
  $(".form_container .matrix_row .field table tr:nth-child(n+1) td:nth-child(n+2)").addClass("grey-background");
}

function injectCss()
{
  $('ul.layout-list li:last-child').css('border-bottom', '0 none');
}

function initEnterPressedHandler()
{
  $('.filter-wrap').submitOnEnterPress({});
  $('.search-wrapper').submitOnEnterPress({});
}

function initPlaceHolder()
{
  $('.filter-keyword-wrap input').placeHolder({
    'text': 'Keyword',
    'submitButton': '.filter-trigger input'
  });
  
  $('.filter-wrap .doc-type select').placeHolder({
    'text': 'Document Type',
    'submitButton': '.filter-trigger input',
    'isDropDownList': true
  });  
  
  $('.feedback-box .feedback-comment').placeHolder({
    'text': 'Please provide your feedback here...',
    'submitButton': '.feedback-box .div-feedback-submit input'
  });
  
  $('.search-wrapper .search-input-button input[type="text"]').placeHolder({
    'text': 'I\'m looking for...',
    'submitButton': '.search-wrapper .search-input-button input[type="submit"]'
  });
}

/*********************LIBRARY*********************/
/**
 * jQuery EnterPressedHandler plugin
 * @developer Mike Le
 * @version 1.1
 * @date Apr 3, 2012
 * @usage: $("#divInput").submitOnEnterPress({}); 
 */
(function ($) {
    $.fn.submitOnEnterPress = function () {
        return this.each(function () {
            var $this = $(this);

            $this.keypress(function (e) {
                code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) //if Enter is pressed
                {
                    //find the submit button within the div
                    $submitButton = $this.find("input[type='submit']");
                    
          //if no submit button is found then search for the first button
          if ($submitButton.length == 0) {
                        $submitButton = $this.find("input[type='button']:first");
                    }
          
          if ($submitButton.length) {
                        $submitButton.click();
                        e.preventDefault();
                    }
                }
            });
        });
    };
})(jQuery);

/*
 * Place Holder JQuery Plugin
 * version 1.1.1
 * release date: 2012 Mar 15
 */
(function ($) {
    $.fn.placeHolder = function (options) {

        var settings = $.extend({
            'text': 'Please provide the input',
            'mColor': '#4d4d4d',
            'tColor': '#000',
            'submitButton': '.searchButton',
            'isDropDownList': false
        }, options);
    
    if(typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, ''); 
      }
    }

        return this.each(function () {
            var $this = $(this);

            if (settings.isDropDownList) {
                if ($this.children('option:first').text() == '') $this.children('option:first').text(settings.text);
                else $this.html("<option value=''>" + settings.text + "</option>" + $this.html());
            } else {
                if ($this.val() == false) //only set placeholder text if has no text
                {
                    $this.val(settings.text);
                    $this.css('color', settings.mColor);
                }

                $this.blur(function () {
                    if ($this.val().trim().length == 0) {
                        $this.val(settings.text);
                        $this.css('color', settings.mColor);
                    }
          else
          {
                        $this.css('color', settings.tColor);
          }
                });

                $this.focus(function () {
                    if ($this.val() == settings.text) {
                        $this.val('');
            $this.css('color', settings.tColor);
                    }
                });

                $(settings.submitButton).click(function () {
                    if ($this.val() == settings.text) {
                        $this.val('');
                    }
                });
            }
        });
    };
})(jQuery);