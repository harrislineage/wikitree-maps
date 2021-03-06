function opsmap() {
    $('#map').remove();
    $('body').append('<div id="map"></div>');
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'attribution: Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }),
        OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '<a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="OpenStreetMap-attrib">&copy; OpenStreetMap contributors</a> | <a href="https://www.wikitree.com" title="Data courtesy of WikiTree" target="_blank">&copy; WikiTree contributors</a>'
        });

    var tiles = L.layerGroup([OpenStreetMap_Mapnik, OpenStreetMap]);

    var baseMaps = {
        "OpenStreetMap": OpenStreetMap,
        "Mapnik": OpenStreetMap_Mapnik
    }

    var map = new L.map('map', {
        layers: [OpenStreetMap],
        center: new L.LatLng(0, 0),
        zoom: 2,
        loadingControl: true
    });

    var layerControl = L.control.layers(baseMaps).addTo(map);
    L.control.viewMeta({}).addTo(map);

    var markers = new L.MarkerClusterGroup({
        maxClusterRadius: 100,
        spiderfyDistanceMultiplier: 1
    });

    $.getJSON("https://wikitree.sdms.si/Categories/CIBOnePlaceStudy.json", function (data) {
        var marker = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                if (feature.properties.Default.Category.includes("Place Study") === true) {
                    layer.bindPopup('<span style="font-weight: bold;">' +
                        '<a target="_blank" href="https://www.wikitree.com/wiki/Category:' +
                        feature.properties.Default.Category + '">' + feature.properties.Default.Category + '</a></span>')
                }
            },
            pointToLayer: function (feature, latlng) {
                if (feature.properties.Default.Category.includes("Place Study") === true) {
                    if (latlng.alt == 1) {
                        var blackIcon = L.icon({
                            iconUrl: 'images/marker-icon-2x-black.png',
                            shadowUrl: 'images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        return L.marker(latlng, {
                            icon: blackIcon
                        });
                    }
                    else if (latlng.alt != 1) {
                        var redIcon = L.icon({
                            iconUrl: 'images/marker-icon-2x-red.png',
                            shadowUrl: 'images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        return L.marker(latlng, { icon: redIcon });
                    };
                }
            }
        });
        markers.addLayer(marker);
    })
    map.addLayer(markers);

    // Add WikiTree Logo
    L.Control.Watermark = L.Control.extend({
        onAdd: function (map) {
            var img = L.DomUtil.create('img');
            img.src = 'https://www.wikitree.com/images/wikitree-logo.png';
            img.style.width = '200px';
            return img;
        }, onRemove: function (map) { }
    });
    L.control.watermark = function (opts) {
        return new L.Control.Watermark(opts);
    };
    L.control.watermark({ position: 'bottomleft' }).addTo(map);

    // Add Legend
    L.control.Legend({
        position: "topleft",
        title: "Marker Legend",
        collapsed: true,
        legends: [
            {
                label: "One Place Study",
                type: "image",
                url: 'images/marker-icon-2x-black.png'
            }
        ]
    }).addTo(map);
}