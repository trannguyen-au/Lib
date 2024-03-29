/**
*  WN Google Map v1.4
*  Copyright (C) 2012 Wery Nguyen
*  nguyennt86@gmail.com
*  Updated on: 20/4/2012
*  Seamless CMS
*   Ref: http://code.google.com/apis/maps/documentation/javascript/overlays.html#OverlaysOverview
*       http://code.google.com/apis/maps/documentation/javascript/basics.html
* v1.4 Note:
  - Add markerImage: link to the customized marker image
  - disableAll: turn to true to display the map as an image.

* v1.3 Note:
  - Add search by: "auto",
  - Fix bug string.trim() on IE
* v1.2 Note: 
    - Allow user to search by address, longitute/latitute or both.
    - The Marker point to the extract location if longitute and latitute provided.
* v1.1 Note: 
    - Add info window displaying the input address.
	- address is get from "rel" attribute of the element
*/
(function($){ 
$.fn.wnGoogleMap = function(options) {

  // Set default variables in an array
    var defaults = {
    searchBy  :  "auto", // "latlng" // "both" // "address" // "auto"
    address   :   "",
    startLatlng :   "-37.813378,144.961681", // default start up latlng location
    latlng     :   "",
    zoom     :  15,      // zoom level
    title    :   "",
    markerImage : "",
    disableAll : false,
    infoBoxWidth: 0
    };
  
  var defaultAddress = "Melbourne CBD, Victoria 3000, Australia";
  
  // Extend default variable array using supplied options, making opional arguments possible
    options = $.extend(defaults, options);
  
  // get the container
    var container = $(this);
	
  // get the title
  if(options.title=="" && $(this).attr("title")!=null) options.title = $(this).attr("title");
  
  // get the address and latlong input
  var addr = options.address;
  if(addr == "" || addr == null) {
    addr = container.attr('rel'); // get from rel attribute if address is undefined;
    if(addr == "" || addr == null) {
      addr = defaultAddress;  // set to default address if no rel attribute specified
    }
  }
  
  var inputLat = options.latlng===""?0:options.latlng.substr(0, options.latlng.indexOf(","));
  var inputLng = options.latlng===""?0:options.latlng.substr(options.latlng.indexOf(",")+1,options.latlng.length);
  
  var latlngInput = new google.maps.LatLng(inputLat, inputLng);
  
    // global "map" variable
    var marker = null;  // for the pointer on the map
  var geocoder;       // location geocoder
  var map;            // the map itself
  
  var infoW = options.infoBoxWidth!=0?options.infoBoxWidth : 50;
  
  var infowindow = new google.maps.InfoWindow({   // information pop up.
    size: new google.maps.Size(infoW,50)
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
    };
    
    if(options.disableAll) {
      myOptions = { zoomControl : false,
        scaleControl: false,
        panControl: false,
        mapTypeControl : false,
        overviewMapControl : false,
        streetViewControl : false,
        draggable: false,
        scrollwheel: false,
        zoom: 15,
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
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
    else if(options.searchBy === "auto") {
      if(addr !="" && options.latlng!="") {
        geocoder.geocode( { address: addr, latLng: latlngInput }, GeocodeComplete);
      }
      else if(addr !="" && options.latlng=="") {
        geocoder.geocode( { address: addr }, GeocodeComplete);
      }
      else if(addr =="" && options.latlng!="") {
        geocoder.geocode( { latLng: latlngInput }, GeocodeComplete);
      }
    }
  }  
  
  function GeocodeComplete(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      
      var markerPosition = (options.searchBy==="address"
                            || options.searchBy==="auto"
                           )?  results[0].geometry.location : latlngInput;
    if(options.markerImage!="") {
      marker = new google.maps.Marker({
        map: map, 
        position: markerPosition,
        icon : options.markerImage,
        title:"1"
      });
    }
    else {
      marker = new google.maps.Marker({
        map: map, 
        position: markerPosition
      });
    }
      
      if(options.searchBy==="address") {
        infowindow.setContent("<div><h2>"+options.title+"</h2><br>Address: "+addr+"</div>"); 
      }
      else if(options.searchBy === "latlng") {
        infowindow.setContent("<div><h2>"+options.title+"</h2><br>"+options.latlng+"</div>"); 
      }
      else if(options.searchBy === "both") {
        infowindow.setContent("<div><h2>"+options.title+"</h2><br>Address: "+addr+"</div>"); 
      }
      else if(options.searchBy === "auto") {
        infowindow.setContent("<div><h2>"+options.title+"</h2><br>Address: "+addr+"</div>"); 
      }
      //infowindow.open(map,marker);
      
      // show the info window when marker is clicked.
      google.maps.event.addListener(marker, 'click', function() {
        if(!options.disableAll) {
          infowindow.open(map,marker);
        }
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