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
  var PREV = "<li><a href=\"javascript:" + prevFunction +"\" class=\"paging-nav pre-nav\"> <img src='/files/0/6/paging-left-arrow.png' /> </a></li>";
  var NEXT = "<li><a href=\"javascript:" + nextFunction +"\" class=\"paging-nav next-nav\"> <img src='/files/0/6/paging-right-arrow.png' /> </a></li>";
  
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