$(document).ready(function() {
	// toggle table effect
	$(".toggle-header th").attr("rel", "off");
	$(".toggle-header tr:not(.row-header)").addClass("hidden");

	$(".toggle-header th").click(function() {
		if ($(this).attr("rel") == null || $(this).attr("rel") == "") {
		  $(this).parents("table.toggle-header").find("tr:not(.row-header)").addClass("hidden");
		  $(".toggle-header th").attr("rel", "off");
		}
		else {
		  $(this).parents("table.toggle-header").find("tr:not(.row-header)").removeClass("hidden");
		  $(".toggle-header th").attr("rel", "");
		}
	});

	// trigger the search button when hit enter.
    $(".filter-keyword-wrap input").keydown(function(event) {
        if (event.keyCode == '13') {
           if($(".filter-trigger input")!=null) {
             $(".filter-trigger input").click();
           }
           else {
             $(".filter-trigger a").click();
           }
           event.preventDefault();
        }
      
    });
	
	$("#slider").wnSlider({pagingType:"image"});
});