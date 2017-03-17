
/*==============================================================================
================================ Variables ====================================
===============================================================================*/


var latitude;
var longitude;
var radius;
var postalCode;

//This is the map on the page.
var map; 
var geoFlag = false;
var googleAPI = "AIzaSyBs9H9VBPWswqQbEfhd3Z-mY6-5OP4QX7M";
var cityLatitude;
var cityLongitude;
var markersArray=[];

/*==============================================================================
================================ Functions ====================================
===============================================================================*/

$(document).ready(function()
{
	
	$("#googleMap").hide();
	
	$("#submitTopic").on('click', function(event){
		
		event.preventDefault();

		$("#googleMap").show();

		//Clears markers from map.
		deleteMarkers(); 

		//NEED TO CHECK INPUTS FOR VALIDITY
		var searchTerm = $("#searchInput").val().trim();
		var locationInput = $("#locationInput").val().trim();        
		var radius = parseInt($("#radius").val());


		//if locationInput is blank, use zip from geolocation in search.
		if(locationInput === "")
		{
			place = postalCode;
			geoFlag = true;
		}
		else
		{
			place = locationInput;
			geoFlag = false;
		}
		
		runGooglequery(searchTerm, place, radius);			

		$("#searchInput").val("");

	});//END #submitTopic.on("click")


	// Triggers modal for instructions
	$("#instructionsBtn").click(function(){
        $("#instructionsModal").modal();
    });
    $("#howItWorksBtn").click(function(){
        $("#howItWorksModal").modal();
    });
    $("#examplesBtn").click(function(){
        $("#examplesModal").modal();
    });

});//END document.ready

// runGooglequery is called to get the location of the city entered and use its coordinate as a center point 
// when the map is drawn.
function runGooglequery (searchTerm, location, radius) 
	{	
		var searchTerm = searchTerm;
		var radius = radius;
		var addressRequest = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + googleAPI;
		$.ajax({
			url: addressRequest,
			method: "GET"

				}).done (function(response){
				console.log(response);

				var cityLatitude = response.results[0].geometry.location.lat;
				console.log(cityLatitude);
				var cityLongitude = response.results[0].geometry.location.lng;
				console.log(cityLongitude);

	    	if(!geoFlag)
	    	{
	    		drawMap(cityLatitude, cityLongitude, radius); 
	    	}
				queryYelp(searchTerm, place, radius);
			});
	};
//========================================= runGoogle Query ===============================
	
	/*Yelp search query is sorted by 'rating' in which "The rating sort is not strictly sorted by 
	the rating value, but by an adjusted rating value that takes into account the number of 
	ratings, similar to a bayesian average. This is so a business with 1 rating of 5 stars 
	doesn’t immediately jump to the top.". 
	*/
	function queryYelp(searchTerm, place, radius) 
	{	

		const YELP_HEROKU_ENDPOINT = "https://floating-fortress-53764.herokuapp.com/"

		var queryURL = YELP_HEROKU_ENDPOINT + "?term=" + searchTerm + "&location="+ place + "&radius="+ radiusToMeters(radius);
	
console.log("queryURL: " + queryURL);

		$.ajax({
		      url: queryURL,
		      method: "GET"
	    }).done(function(response) {

	    	//Array of all busnisesses from Yelp query
	    	var yelpResults = JSON.parse(response).businesses;
console.log(yelpResults);
//testAddress(yelpResults);
  	
	    	addMarker(yelpResults, searchTerm);

	    });
	}//END queryYelp()
//============================= drawMap =============================================


// Use Google Maps API to display a map of given parameters.
function drawMap(latitude, longitude, radius) 
{	console.log("hello5");
	var uluru = {lat: latitude, lng: longitude};
	
	var zoom = radiusToZoom(radius);

	map = new google.maps.Map(document.getElementById('googleMap'),
	{
		zoom: zoom,
		center: uluru
	});

}//END drawMap()

//============================= drawMap =============================================

//When page first loads this is called via <script> tag in html.
//Initally generic map is displayed of center USA showing whole country.
//If geolocation is detected map is displayed based on that location
//with a radius of about 5 miles.
function initMap() 
{
console.log("hello4");
	//Inital map displayed coordinates of center of US.
	latitude = 39.8282;
	longitude = -98.5795;
	radius = 1000;
	drawMap(latitude, longitude, radius);

	//If goeloaction is detected display map of users locaction.
	if(navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position)
		{
			latitude = position.coords.latitude;
          	longitude = position.coords.longitude;
          	radius = 5;
          	revGeoCode();
console.log("revGeoCode DONE!");          	
          	drawMap(latitude, longitude, radius); 

        });  
    }    

}//END initMap()

//=============================================================

//Converts radius in miles to approx zoom #
function radiusToZoom(radius)
{console.log("hello2");
    return Math.round(14-Math.log(radius)/Math.LN2);
}

//=============================================================

//Converts miles to meters for radius
function radiusToMeters(radius)
{console.log("hello3");
	return parseInt((radius * 1000)/.62);
}

//====================================================================

//Used Google API geocode to return a zip code from latitue and longitude.
function revGeoCode()
{
	console.log("hello6");
	const GOOGLE_GEOCODE_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
	const GOOGLE_API_KEY = "&key=AIzaSyDr-DLJtSliHGOsZhoI76ETn6jsk8kVYGo";
	
	//corrdinates string used in endpoint from latitude and longitude
	var coordinates = latitude + "," + longitude;
	console.log(coordinates);

	//REVERSE GEOCODE LOOK UP 
	var geocodeUrl = GOOGLE_GEOCODE_ENDPOINT + coordinates + "&result_type=postal_code" + GOOGLE_API_KEY;

	$.ajax(
	{
		url: geocodeUrl,
		method: "GET"

	})
	.done (function(response)
	{			
		postalCode = response.results[0].address_components[0].long_name;	
console.log(postalCode);				
	});//END ajax geocodeUrl
		
}// END revGeoCode()

//=============================================================================



//
function addMarker(yelpResults, searchTerm)
{
	console.log("hello1");

	var icons = ["assets/images/Ribbon_1.png","assets/images/Ribbon_2.png","assets/images/Ribbon_3.png"];


	for (var i = 0; i < 3; i++)
	{
		if (yelpResults[i] !== undefined)
		{	
			var uluru = {
				lat: yelpResults[i].coordinates.latitude,
				lng: yelpResults[i].coordinates.longitude
			};
		
			var icon = {
				url: icons[i],
				size: new google.maps.Size(71, 71),
		   		scaledSize: new google.maps.Size(30, 50)
			};

			var marker = new google.maps.Marker({
	   
			    position: uluru,
			    map: map,
			    icon: icon,
			    animation: google.maps.Animation.DROP
			    
			});

			markersArray.push(marker);
				
			marker.content = 
	    	"<div class='infoWindow'>"+
		    	"<h1 class='infoHeading'>The BEST "  + "'" + searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase() + "'" + "</h1>" +
		    	"<br>" +
		    	"<address class='infoAddress'>" +
		     		"<h3 class='infoName'>" + yelpResults[i].name + "</h3>"+
		     		yelpResults[i].location.address1 + "<br>" +
		    		yelpResults[i].location.city + ", " + yelpResults[i].location.state + 
		    		" " + yelpResults[i].location.zip_code + 
		    		"<br>" +
		     		yelpResults[i].display_phone + "</p>" +   	    		
		   			"<p>" + 
		   				"<a href=" + yelpResults[i].url + ">" + "Visit On Yelp</a>" + 
		   			"</p>" +
		   		"</address>"+	
			"</div>";


			var infoWindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function () 
			{
                infoWindow.setContent(this.content);
                infoWindow.open(this.getMap(), this);
            });
			

		}//END if

	}//END for

}//END addMarker()


//==================================================================================
   
// Deletes all markers in the array by removing references to them.
function deleteMarkers() 
{
	for (var i = 0; i < markersArray.length; i++)
	{
	  markersArray[i].setMap(null);
	}
	markersArray = [];
}//END deleteMarkers()
//=================================== THE END =======================================