function initialize() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            infowindow = new google.maps.InfoWindow();
            var fenway = {lat: position.coords.latitude, lng: position.coords.longitude};
            var map = new google.maps.Map(document.getElementById('map'), {
                center: fenway,
                zoom: 20
            });
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer({
                draggable: true,
                map: map,
                panel: document.getElementById('right-panel')
            });
            var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), {
                position: fenway,
                pov: {
                    heading: 165,
                    pitch: 10
                }
                });
            var service = new google.maps.places.PlacesService(map);
            directionsDisplay.setMap(map);
            service.nearbySearch({
                location: fenway,
                radius: 500,
                type: ['store']
            }, callback);
            
            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            }

            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                google.maps.event.addListener(marker, 'click', function() {
                    directionsService.route({
                        origin: fenway,
                        destination: place.geometry.location,
                        travelMode: 'WALKING'
                    }, function(response, status) {
                        if (status === 'OK') {
                            directionsDisplay.setDirections(response);
                            computeTotalDistance(directionsDisplay.getDirections());
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });
            }            
            map.setStreetView(panorama);
        });

        function computeTotalDistance(result) {
            console.log(result);
            var total = 0;
            var myroute = result.routes[0];
            for (var i = 0; i < myroute.legs.length; i++) {
              total += myroute.legs[i].distance.value;
            }
            total = total / 1000;
            document.getElementById('total').innerHTML = total + ' km';
          }
    }
}