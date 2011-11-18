/**
*   WN Google Map v1.2
*   Copyright (C) 2011 Wery Nguyen
*	nguyennt86@gmail.com
*   Seamless CMS
*   Ref: http://code.google.com/apis/maps/documentation/javascript/overlays.html#OverlaysOverview
*	     http://code.google.com/apis/maps/documentation/javascript/basics.html
*   v1.2 Note: 
		- Allow user to search by address, longitute/latitute or both.
		- The Marker point to the extract location if longitute and latitute provided.
	v1.1 Note: 
		- Add info window displaying the input address.
*/
(function($){ 
$.fn.wnGoogleMap = function(options) {

	// Set default variables in an array
    var defaults = {
		searchBy	:	"address", // "latlng" // "both"
	    address 	: 	"",
		startLatlng : 	"-37.813378,144.961681",
		latlng 		: 	"",
		zoom 		:	15,			// zoom level
		title		: 	""
    };
	
	var defaultAddress = "Melbourne CBD, Victoria 3000, Australia";
	
	// Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);
	
	// get the container
    var container = $(this);
	
	// get the address and latlong input
	var addr = options.address;
	if(addr == "" || addr == null) {
		addr = container.attr('rel'); // get from rel attribute if address is undefined;
		if(addr == "" || addr == null) {
			addr = defaultAddress;  // set to default address if no rel attribute specified
		}
	}
	
	var inputLat = options.latlng===""?0:options.latlng.substr(0, options.latlng.indexOf(",")).trim();
	var inputLng = options.latlng===""?0:options.latlng.substr(options.latlng.indexOf(",")+1,options.latlng.length).trim();
	
	var latlngInput = new google.maps.LatLng(inputLat, inputLng);
	
    // global "map" variable
    var marker = null;  // for the pointer on the map
	var geocoder;       // location geocoder
	var map;            // the map itself
	var infowindow = new google.maps.InfoWindow({   // information pop up.
		size: new google.maps.Size(50,50)
	});
	
	function init() {
		// create the map
		geocoder = new google.maps.Geocoder();
		
		var latitute = options.startLatlng.substr(0, options.startLatlng.indexOf(","));
		var longitute = options.startLatlng.substr(options.startLatlng.indexOf(",")+1,options.startLatlng.length);
		
		var latlng = new google.maps.LatLng(latitute, longitute);
		var myOptions = {
			zoom: options.zoom,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		map = new google.maps.Map(document.getElementById(container.attr('id')), myOptions);
		
		// close info window on click to the map
		google.maps.event.addListener(map, 'click', function() {
			infowindow.close();
		});
	}
 
	function MapSetup() {
		if(options.searchBy==="address") {
			geocoder.geocode( { address: addr }, GeocodeComplete);
		}
		else if(options.searchBy==="latlng") {
			geocoder.geocode( { latLng: latlngInput }, GeocodeComplete);
		}
		else if(options.searchBy === "both") {
			geocoder.geocode( { address: addr, latLng: latlngInput }, GeocodeComplete);
		}
	}	
	
	function GeocodeComplete(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			
			var markerPosition = (options.searchBy==="address")?  results[0].geometry.location : latlngInput;
			
			marker = new google.maps.Marker({
				map: map, 
				position: markerPosition
			});
			
			if(options.searchBy==="address") {
				infowindow.setContent("<div><h2>"+options.title+"</h2><br>Address: "+addr+"</div>"); 
			}
			else if(options.searchBy === "latlng") {
				infowindow.setContent("<div><h2>"+options.title+"</h2><br>"+options.latlng+"</div>"); 
			}
			else if(options.searchBy === "both") {
				infowindow.setContent("<div><h2>"+options.title+"</h2><br>Address: "+addr+"</div>"); 
			}
			//infowindow.open(map,marker);
			
			// show the info window when marker is clicked.
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
			});
			
		} else {
			// display error or display nothing
		}
	}

	return this.each(function() {
		init();
		MapSetup();
	});
	
  };
})(jQuery);