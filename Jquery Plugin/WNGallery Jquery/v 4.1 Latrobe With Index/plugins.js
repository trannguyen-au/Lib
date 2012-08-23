window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


/*!
* jQuery Predictive Search v1.1
*
* Copyright 2011, Seamless Solutions
* 
* Date: Wed Dec 14, 2011 04:00PM
*/
function PredictiveSearch (settings) {
    // Settings to configure the jQuery Predictive Search plugin how you like
    settings = jQuery.extend({
      //Seamless options
      'outputdiv':'#predictiveResults',
      'resultItem':'li',
      'searchInput':'',
      'searchButton':'',
      'searchdlvname':'',
       'textDiv': '.searchFeedAbstract',
       'titleDiv': '.searchFeedTitle a',
       'textLimit':100,
       'titleLimit':50
    },settings);
    
    var feedURL = '/feed.rss?listname='+settings.searchdlvname+'&dlv_'+settings.searchdlvname+'=(keyword=';
    var currentRequest=null;
    var thisObject = this;
    
      try {
        $(settings.searchInput)[0].setAttribute("autocomplete","off");
      }
      catch(ex) {
      }
    // 1. Listen to keystrokes in the textbox
      $(settings.searchInput).click(function() {
        this.value='';
        this.setAttribute("autocomplete","off");
      });
        
      $(settings.searchInput).blur(function(event) {
        $(settings.outputdiv).delay(5000).fadeOut(500, function() {
          this.innerHTML='';
        });
      });
        
      $(settings.searchInput).focus(function(event) {
        $(settings.outputdiv).clearQueue();
        /*$(settings.outputdiv).show();*/
      });
      
      $(settings.searchInput).keypress(function(event) {
        // Ping for result
        if(event.which != 13
          && event.which != 0)
          thisObject.fetchResults(this.value+String.fromCharCode(event.which));
        else
        {
          event.stopPropagation();
          event.preventDefault();
        }
      });
      
      $(settings.searchInput).keydown(function(event) {
        if(event.which == 13)
        {
          event.stopPropagation();
          event.preventDefault();
          event.cancelBubble = true;
          event.returnValue = false;
          return false;
        }
      });
      
      $(settings.searchInput).keyup(function(event) {
        if(event.which == 40)
        {
          // Down Arrow
          thisObject.moveBy(1);
        }
        else if(event.which == 38)
        {
          // Up Arrow
          thisObject.moveBy(-1);
        }
        else if(event.which == 8 || event.which == 46)
        {
          // Backspace
          thisObject.fetchResults(this.value);
        }
        else if(event.which == 13)
        {
          // Enter Key
          event.stopPropagation();
          event.preventDefault();
          if($(settings.outputdiv+' '+ 
               settings.resultItem+'.itemSelected').length > 0)
          {
            thisObject.navigateOut();
          }
          else
          {
            try {
              $(this).find(settings.searchButton)[0].click();
            }
            catch(ex) { }
          }
        }
      });
      
      thisObject.moveBy = function(diff) {
        var selectedItem = $(settings.outputdiv+' '+settings.resultItem+'.itemSelected');
        var selectedIndex = -1;
        var allItems = $(settings.outputdiv+' '+settings.resultItem)
        if(selectedItem.length > 0)
        {
          selectedIndex = $(settings.outputdiv+' '+settings.resultItem).index(selectedItem[0]);
        }
        var nextIndex = selectedIndex + diff;
        nextIndex += allItems.length;
        nextIndex %= allItems.length;
        thisObject.moveTo(allItems[nextIndex]);
      };
      
      thisObject.moveTo = function(item) {
        $(settings.outputdiv+' '+settings.resultItem).removeClass('itemSelected');
        item.className+=' itemSelected';
      }
      
      thisObject.navigateOut = function() {
        var selectedItem = $(settings.outputdiv+' '+ settings.resultItem+'.itemSelected');
        document.location = $(selectedItem[0]).find('a')[0].href;
      };

      thisObject.fetchResults = function (keyword) {
          if (currentRequest != null) {
              currentRequest.abort();
          }

          if (keyword.length < 3) {
              $(settings.outputdiv).html('');
              $(settings.outputdiv).hide();
              return;
          }

          $(settings.outputdiv).show();
          $(settings.outputdiv).html('<p class="loading">Loading...</p>');
          thisObject.currentIndex = 0;

          currentRequest = jQuery.ajax({
              url: feedURL + keyword + ')',
              type: "GET",
              dataType: "html",
              context: document.body,
              success: function (data) {
                  $(settings.outputdiv).html(data);
                if(data == "")
                {
                  $(settings.outputdiv).hide();
                  return;
                }
                  $(settings.outputdiv + ' ' + settings.resultItem).mouseover(function () {
                      thisObject.moveTo(this);
                  });
                  $(settings.outputdiv + ' ' + settings.textDiv).each(function (index, item) {
                      item.innerHTML = (item.innerHTML.length > settings.textLimit) ? item.innerHTML.substring(0, settings.textLimit) + "..." : item.innerHTML;
                  });
                  $(settings.outputdiv + ' ' + settings.titleDiv).each(function (index, item) {
                      item.innerHTML = (item.innerHTML.length > settings.titleLimit) ? item.innerHTML.substring(0, settings.titleLimit) + "..." : item.innerHTML;
                  });
              },
              error: function () {
                  $(settings.outputdiv).html('<p>Error retrieving results from server</p>');
              }
          });
      };
    };

  
/*!  SEARCH PAGING FOR DATA LIST VIEW 
* 
*
*/
var Seamless = Seamless || {};

//Shorten the paging list to a shorter page list
Seamless.SetPagingList = function (pagingListId, current, noPages, prevFunction, nextFunction) 
{
  var pagingList = $("ul#" + pagingListId); //ul
  var pagingListItems = pagingList.children("li");
  var totalPages = pagingListItems.size();
  var currentPage = current - 1;
  var firstPage = 0;
  var lastPage = totalPages - 1;
  
  //calculate the right and left bound of the display pages
  var leftBound = currentPage - noPages/2;
  var rightBound = currentPage + Math.ceil(noPages/2) - 1;
  if ( leftBound < firstPage ) {
    leftBound = firstPage;
    rightBound = firstPage + noPages - 1;
  } else if (rightBound > lastPage) {
    rightBound = lastPage;
    leftBound = lastPage - (noPages - 1);
  }
  
  //hide the paging list item that is not in the range
  pagingListItems.each( function(i) {
    if ( i < leftBound || i > rightBound ) {
      $(this).addClass("hidden");
    }
  });
  
  pagingListItems.eq(currentPage).addClass("current");//current page

  //prepend or append extra navigation if necessary
  var MORE_PAGE = "<li class=\"more-page\">...</li>";
  var PREV = "<li><a href=\"javascript:" + prevFunction +"\" class=\"paging-nav-ie pre-nav button arrow-left\"> <span> </span> Previous </a></li>";
  var NEXT = "<li><a href=\"javascript:" + nextFunction +"\" class=\"paging-nav-ie next-nav button\"> Next <span> </span></a></li>";
  
  if (currentPage > firstPage) {
  pagingList.prepend(PREV);
  }
  if ( leftBound > firstPage) {
  pagingList.prepend(MORE_PAGE);
  }
  if (rightBound < lastPage ) 
  pagingList.append(MORE_PAGE);
  if (currentPage < lastPage) {
  pagingList.append(NEXT);
  }
};


/**
*   WN Tabs v1.0
*   @copyright (C) 2012 Wery Nguyen
*  @author nguyennt86@gmail.com
*   Seamless CMS  
*  Change Log:
*  @version 1.0  25/06/2012
*/

(function($){ 
$.fn.wnTabs = function(options) {
  // Set default variables in an array
  var defaults = {
    
  //animationSpeed: 700,
  //autoRotate:  true,
  //timerInterval: 6000, // 3 sec each rotate,
    //itemSize: 235,
    //numberOfDisplayedItem : 3,
    //pagingTag: ""
  };
  
  options = $.extend(defaults, options);
  var container = $(this);
  var linkList = $(this).find("a");
  
  function init() {
    // hide all tab on the first load
    linkList.each(function() {
      var targetId = $(this).attr("rel");
      if(!$(this).hasClass("active"))
        $("#"+targetId).hide();
    });
    
    // handle tab click event
    $(linkList).click(function(event) {
      if(event==null) event=window.event; 
    event.preventDefault();
    var targetId = $(this).attr("rel");
    
    if(targetId == "" || targetId == null) return;
    
    var activeContentId = container.find("a.active").attr("rel");
    linkList.removeClass("active");
    $(this).addClass("active");
  
    $("#"+activeContentId).hide();
    $("#"+targetId).show();
    });
  }
  
  return this.each(function() {
  init();
  });
};
})(jQuery);