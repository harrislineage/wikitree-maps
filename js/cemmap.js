function cemmap() {
    $('#map').remove();
    $('body').append('<div id="map"></div>');
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
        OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

    var tiles = L.layerGroup([OpenStreetMap_Mapnik, OpenStreetMap]);

    var baseMaps = {
        "OpenStreetMap": OpenStreetMap,
        "Mapnik": OpenStreetMap_Mapnik
    }

    map = new L.map('map', {
        layers: [OpenStreetMap],
        center: new L.LatLng(0, 0),
        zoom: 2,
        loadingControl: true
    });

    var layerControl = L.control.layers(baseMaps).addTo(map);
    L.control.viewMeta({}).addTo(map);

    var markers = new L.MarkerClusterGroup({
        maxClusterRadius: 120,
        spiderfyDistanceMultiplier: 1
    });

    $.getJSON("https://wikitree.sdms.si/Categories/CIBCemetery.json", function (data) {
        var marker = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {

                if (feature.properties.Default['Profiles Nr.'] > 1) { var s = 's' } else { var s = '' };
                layer.bindPopup('<span style="font-weight: bold;">' + feature.properties.Default.name + '</span><br>' +
                    '&nbsp;&nbsp;&rarr; <a target="_blank" href="https://www.wikitree.com/wiki/Category:' + feature.properties.Default['Category Wiki'] + '">' + feature.properties.Default['Profiles Nr.'] + ' Documented Burial' + s + '</a><br>' +
                    '&nbsp;&nbsp;&rarr; <a target="_blank" href="https://wikitree.sdms.si/findmap.htm?aid=' + feature.properties.Default.Category + '&grouptype=C"> WikiTree+ Profile Map</a>'
                )

            },
            pointToLayer: function (feature, latlng, title) {
                if (latlng.alt == 1) {
                    var goldIcon = L.icon({
                        iconUrl: 'images/marker-icon-2x-gold.png',
                        shadowUrl: 'images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    var redIcon = L.icon({
                        iconUrl: 'images/marker-icon-2x-red.png',
                        shadowUrl: 'images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    var greenIcon = L.icon({
                        iconUrl: 'images/marker-icon-2x-green.png',
                        shadowUrl: 'images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    var orangeIcon = L.icon({
                        iconUrl: 'images/marker-icon-2x-orange.png',
                        shadowUrl: 'images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    var violetIcon = L.icon({
                        iconUrl: 'images/marker-icon-2x-violet.png',
                        shadowUrl: 'images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    var blackIcon = L.icon({
                        iconUrl: 'images/marker-icon-2x-black.png',
                        shadowUrl: 'images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    if (feature.properties.Default['Profiles Nr.'] >= 1 && feature.properties.Default['Profiles Nr.'] <= 5) {
                        return L.marker(latlng, {
                            'title': feature.properties.Default.Category,
                            icon: redIcon
                        });
                    }
                    else if (feature.properties.Default['Profiles Nr.'] >= 6 && feature.properties.Default['Profiles Nr.'] <= 10) {
                        return L.marker(latlng, {
                            'title': feature.properties.Default.Category,
                            icon: orangeIcon
                        });
                    }
                    else if (feature.properties.Default['Profiles Nr.'] >= 11 && feature.properties.Default['Profiles Nr.'] <= 50) {
                        return L.marker(latlng, {
                            'title': feature.properties.Default.Category,
                            icon: goldIcon
                        });
                    }
                    else if (feature.properties.Default['Profiles Nr.'] >= 51 & feature.properties.Default['Profiles Nr.'] <= 100) {
                        return L.marker(latlng, {
                            'title': feature.properties.Default.Category,
                            icon: greenIcon
                        });
                    }
                    else if (feature.properties.Default['Profiles Nr.'] >= 101) {
                        return L.marker(latlng, {
                            'title': feature.properties.Default.Category,
                            icon: violetIcon
                        });
                    }
                    else return L.marker(latlng, {
                        'title': feature.properties.Default.Category,
                        icon: blackIcon
                    });
                }
                else if (latlng.alt == 2) {
                    var xIcon = L.icon({
                        iconUrl: 'images/wikidata.png',
                        shadowUrl: 'images/marker-shadow.png',
                        iconSize: [50, 50],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    return L.marker(latlng, { icon: xIcon });
                };
            }
        });
        markers.addLayer(marker);
    })
    map.addLayer(markers);

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
                label: "0 Documented Burials",
                type: "image",
                url: 'images/marker-icon-2x-black.png'
            },
            {
                label: "1-5 Documented Burials",
                type: "image",
                url: 'images/marker-icon-2x-red.png'
            },
            {
                label: "6-10 Documented Burials",
                type: "image",
                url: 'images/marker-icon-2x-orange.png'

            },
            {
                label: "11-50 Documented Burials",
                type: "image",
                url: 'images/marker-icon-2x-gold.png'

            },
            {
                label: "51-100 Documented Burials",
                type: "image",
                url: 'images/marker-icon-2x-green.png'

            },
            {
                label: "100+ Documented Burials",
                type: "image",
                url: 'images/marker-icon-2x-violet.png'

            },
            {
                label: "Coordinates by WikiData",
                type: "image",
                url: 'images/wikidata.png'
            },
        ]
    }).addTo(map);
}