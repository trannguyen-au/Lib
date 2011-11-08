$(document).ready(function() {
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
});