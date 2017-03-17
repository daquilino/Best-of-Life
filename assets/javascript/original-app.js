$(document).ready(function(){
	$("#googleMap").hide();
	var googleAPI = "AIzaSyDr-DLJtSliHGOsZhoI76ETn6jsk8kVYGo";
	var topic = "";
	var coordinates = "";
	var chosenLat = "";
	var chosenLng = "";
	var listResults;

	// Triggers modal for instructions
	$("#myBtn").click(function(){
        $("#myModal").modal();
    });

	$("#submitTopic").on('click', function(event){
		event.preventDefault();
		$("#googleMap").show();

		topic = $("#searchInput").val().trim();
		var location = $("#locationInput").val().trim();
		console.log(topic);
		console.log(location);

		runGooglequery(location);

		return false;
	});

	function runGooglequery (location) 
	{	
		
		var addressRequest = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + googleAPI;
		$.ajax({
			url: addressRequest,
			method: "GET"

				}).done (function(response){
				console.log(response);

				var longitudeFirst = response.results[0].geometry.location.lng;
				console.log(longitudeFirst);
				var latitudeFirst = response.results[0].geometry.location.lat;
				console.log(latitudeFirst);

					coordinates = "&location=" + latitudeFirst + "," + longitudeFirst;

				// initMap2(latitude, longitude);

				console.log(topic);

				var googleSearch = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+ topic + coordinates +"&key=" + googleAPI;
				console.log(googleSearch);

					$.ajax({
					url: googleSearch,
					method: "GET"

					}).done (function(finalResponse){
					console.log(finalResponse.results[0].geometry.location.lat);

					chosenLat = finalResponse.results[0].geometry.location.lat;
					chosenLng = finalResponse.results[0].geometry.location.lng;
					return listResults = finalResponse.results;
					// console.log(listResults);

					// initMap2(chosenLat, chosenLng);
					myMap(listResults);

					});
			});

		console.log("hello");
	};


	// function initMap2(latitude, longitude) {
	// 	// console.log(longitude);
	//   var uluru = {lat: latitude, lng: longitude};
	//   var map = new google.maps.Map(document.getElementById('map'), {
	//     zoom: 15,
	//     center: uluru
	//   });
	//   var marker = new google.maps.Marker({
	//     position: uluru,
	//     map: map
	//   });
	// };

	// function initMap2(listResults) {
	// 	console.log(listResults);
	// 	var latitude1 = listResults[0].geometry.location.lat;
	// 	console.log(latitude1);
	// 	var longitude1 = listResults[1].geometry.location.lng;
	// 	console.log(longitude1);
	// 	// console.log(longitude);
	//   var uluru = {lat: latitude1, lng: longitude1};
	//   var map = new google.maps.Map(document.getElementById('map'), {
	//     zoom: 15,
	//     center: uluru
	//   });
	//   var marker = new google.maps.Marker({
	//     position: uluru,
	//     map: map
	//   });
	// };


	function myMap(listResults) {
		var latitude1 = listResults[0].geometry.location.lat;
		console.log(latitude1);
		var longitude1 = listResults[0].geometry.location.lng;
		console.log(longitude1);
		var mapProp= {
		    center:new google.maps.LatLng(latitude1,longitude1),
		    zoom:18,
		};
		var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
		 var marker = new google.maps.Marker({position:mapProp.center});
  			marker.setMap(map);
		}

});
// function initMap(latitude, longitude) {
// 	  var uluru = {lat: -25.363, lng: 131.044};
// 	  var map = new google.maps.Map(document.getElementById('map'), {
// 	    zoom: 4,
// 	    center: uluru
// 	  });
// 	  var marker = new google.maps.Marker({
// 	    position: uluru,
// 	    map: map
// 	  });
// 	};


function myMap() {
var mapProp= 
	{
	    center:new google.maps.LatLng(51.508742,-0.120850),
	    zoom:5,
	};
		var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
		 var marker = new google.maps.Marker({position:mapProp.center});
		  marker.setMap(map);
}

