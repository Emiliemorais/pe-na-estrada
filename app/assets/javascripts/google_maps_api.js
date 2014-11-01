google.maps.event.addDomListener(window, 'load', initialize);
var map;
var stepDisplay;
// Gives to the map the option to drag it and change the route
var rendererOptions =
{
  draggable: true
};


var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();

function initialize()
{
  var mapOptions =
  {
    zoom: 5,
    center: new google.maps.LatLng(-15.453695287170715, -409.5702874999999),
    // Removes the default features of the map
    disableDefaultUI: true,

    // Chooses which elements are wanted in the map
  	panControl: false,
  	zoomControl: true,
  	mapTypeControl: true,
  	scaleControl: false,
  	streetViewControl: true,
  	overviewMapControl: false,

	mapTypeControlOptions:
	{
    	style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },

  	zoomControlOptions:
  	{
    	style: google.maps.ZoomControlStyle.SMALL
  	}

  };

  map = new google.maps.Map(document.getElementById('directions'), mapOptions);
  directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    computeTotalDistance(directionsDisplay.directions);
  });

stepDisplay = new google.maps.InfoWindow();

  calcRoute();


}

function calcRoute() {

  var origin      = $("#origin").val();
  var destination = $("#destination").val();
  var request = {
      origin:      origin,
      destination: destination,
	  travelMode:  google.maps.TravelMode.DRIVING
	 };

    directionsService.route(request, function(response, status) {

    if (status === google.maps.DirectionsStatus.OK) {
      var text = "<span class='label label-success'> Distância total: <span id='total'></span></span>";
      document.getElementById("distance").innerHTML = text;
     	directionsDisplay.setDirections(response);
      getInfoAboutRoute(directionsDisplay.directions);

   //  	directionsDisplay.setPanel(origin);
    	}
    else if (status === 'ZERO_RESULTS' || status === 'INVALID_REQUEST') {
      alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '"
            + destination + "'. \n Digite novamente.");
    }
    else if (status === 'UNKNOWN_ERROR' || status === 'REQUEST_DENIED') {
        alert('Erro inesperado');
    }
    else if(status === 'OVER_QUERY_LIMIT'){
        alert('Erro inesperado');
    }
    else if(status === 'NOT_FOUND'){
        if(origin  != ""){
          alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '"
                 + destination  + "'. \n Digite novamente.");
        }
        else{
          // Nothing to do
        }

    }
    else{
    	directionsDisplay.setDirections(response);
    	initialize();
    }
 });
}
function computeTotalDistance(result)
{
  var total = 0;
  var myroute = result.routes[0];
  for (i = 0; i < myroute.legs.length; i++)
  {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.
  document.getElementById("total").innerHTML = total + " km";
}

var handler = Gmaps.build('Google');
handler.buildMap({ internal: {id: 'directions'}}, function()
{
  directionsDisplay.setMap(handler.getMap());
  initialize();
});

function getInfoAboutRoute(result){

  var myroute = result.routes[0];
  var mylegs = myroute.legs[0];

  var length = mylegs.steps.length;
  var initialposition = 0;
  var endposition = 0;
  var coordinates = [];
  var brnumber = [];
  var j = 0; // Posição no array de brs e coordenadas da rota traçada

  for (i = 0; i < length; i++)
  {
    var instructions = mylegs.steps[i].instructions;
    if(instructions.indexOf("BR-") != -1){

      initialposition = instructions.indexOf("BR-");
      endposition = initialposition + 6;
      var substring = instructions.substring(initialposition,endposition);

      if(substring.indexOf("0") == 3){
        brnumber[j] = substring.substring(4,6);
      }
      else{
        brnumber[j] = substring.substring(3,6);
      }
      coordinates[j] = mylegs.steps[i].path[i];
      j++;

    }
  }
  getCoordinatesToMarkers(brnumber, coordinates);

}
function getCoordinatesToMarkers(brnumber, coordinates){

  var latitudeArray = gon.latitude;
  var longitudeArray = gon.longitude;
  var brArray = gon.br;

  var j = 0; // Posição no array de posições nas brs

  var position = [];


  for(x = 0; x < brnumber.length; x++){
    for(i = 0; i < brArray.length; i++){
      if (brArray[i] == brnumber[x]){
          position[j] = i;
          j++;
      }
    }
  }

  var p = 0; // Posição no array de posições
  var lat;
  var lng;

  while(p < position.length){
    lat = parseFloat(latitudeArray[position[p]]);
    lng = parseFloat(longitudeArray[position[p]]);
    markerTheAccidents(lat,lng);
    p++;
  }
}

function markerTheAccidents(lat,lng){

  var marker;

      marker = new google.maps.Marker({
      position:  new google.maps.LatLng(lat, lng),
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5
        },
      map: map
      });

}



