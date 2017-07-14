var map = L.map('map', {
    center: [42.419457, -71.1097323],
    zoom: 14,
    maxZoom: 20,
    zoomControl: false
});
var hash = new L.Hash(map);

var zoomControl = L.control.zoom({
    position: "topright"
}).addTo(map);

var layerGoogleRoads = L.gridLayer.googleMutant({
    type: 'roadmap',
    maxZoom: 20,
    maxNativeZoom: 18
});

layerGoogleRoads.addTo(map);

function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) * 0.000621371).toFixed(2);
};

// 23 West Street, Medford, MA, United States
// 12 Princeton Street, Medford, MA, United States
// 603 Hight Street, Medford, MA, United States
// [42.41746, -71.11932]

L.marker([42.41746, -71.11932]).bindPopup('23 West Street, Medford, MA, United States').addTo(map);

var geocodeSearchMarker = {};
var googleSearchControl = new L.Control.GPlaceAutocomplete({
    position: "topleft",
    callback: function (location) {
        if ('geometry' in location) {
            var lat = location.geometry.location.lat();
            var lng = location.geometry.location.lng();
            map.panTo([lat, lng]);
            map.fitBounds([
                [location.geometry.viewport.getSouthWest().lat(),
                    location.geometry.viewport.getSouthWest().lng()
                ],
                [location.geometry.viewport.getNorthEast().lat(),
                    location.geometry.viewport.getNorthEast().lng()
                ]
            ]);

            var dist = calcDistance(new google.maps.LatLng(42.41746, -71.11932), new google.maps.LatLng(lat, lng));

            map.removeLayer(geocodeSearchMarker);
            geocodeSearchMarker = L.circle([lat, lng], {
                color: '#FF0000',
                weight: 2,
                fillColor: '#008000',
                fillOpacity: 0.9,
                radius: 5
            }).addTo(map);
            geocodeSearchMarker.bindPopup(location.formatted_address + '<br>' + dist + ' miles').openPopup();
        };
    }
});
map.addControl(googleSearchControl);

map.on('click', function (e) {
    if (geocodeSearchMarker) {
        map.removeLayer(geocodeSearchMarker);
    };
});