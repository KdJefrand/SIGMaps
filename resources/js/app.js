import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

// Leaflet
document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([-8.7962244, 115.176169], 18.5);

    // Tile Layer OSM (Standar)
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    });

    // Tile Layer Dark Mode
    var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });

    // Esri
    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: "Tiles &copy; Esri",
        maxZoom: 19
    });

    osm.addTo(map);

    fetch('/get-locations')
    .then(response => response.json())
    .then(dataList => {
        dataList.forEach(item => {
            console.log(item);
            const geojson = JSON.parse(item.geojson);

            let layer;

            if (geojson.properties?.type === 'Circle') {
                const coordinates = geojson.geometry.coordinates;
                const radius = geojson.properties.radius;

                layer = L.circle([coordinates[1], coordinates[0]], {
                    radius: radius
                });
            } else {
                layer = L.geoJSON(geojson);
            }

            if (item.popup_text) {
                layer.bindPopup(item.popup_text);
            }

            layer.options.locationId = item.id;
            layer.addTo(map);

            // Penanganan klik kanan (context menu) untuk hapus
            if (layer instanceof L.GeoJSON) {
                layer.eachLayer(function (subLayer) {
                    subLayer.options.locationId = item.id;

                    subLayer.on('contextmenu', function (e) {
                        const locationId = e.target.options.locationId;

                        if (!locationId) {
                            alert("ID lokasi tidak ditemukan!");
                            return;
                        }

                        if (confirm("Yakin ingin menghapus lokasi ini?")) {
                            map.removeLayer(e.target);

                            fetch(`/delete-location/${locationId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                                }
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('Berhasil dihapus:', data);
                                })
                                .catch(error => {
                                    console.error('Gagal hapus:', error);
                                });
                        }
                    });
                });
            } else {
                // Untuk layer Circle langsung (karena tidak dalam L.GeoJSON)
                layer.on('contextmenu', function (e) {
                    const locationId = e.target.options.locationId;

                    if (!locationId) {
                        alert("ID lokasi tidak ditemukan!");
                        return;
                    }

                    if (confirm("Yakin ingin menghapus lokasi ini?")) {
                        map.removeLayer(e.target);

                        fetch(`/delete-location/${locationId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Berhasil dihapus:', data);
                            })
                            .catch(error => {
                                console.error('Gagal hapus:', error);
                            });
                    }
                });
            }
        });
    });


    var baseMaps = {
        "Standar": osm,
        "Dark Mode": dark,
        "Satelit": satellite
    };

    L.control.layers(baseMaps).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Koordinat: " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polyline: true,
            polygon: true,
            rectangle: true,
            circle: true,
            marker: true
        }
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);

        let popupContent = prompt("Masukkan teks untuk pop-up:", "Lokasi Baru");
        if (popupContent) {
            layer.bindPopup(popupContent).openPopup();
        }

        let geojson;

        if (layer instanceof L.Circle) {
            const center = layer.getLatLng();
            const radius = layer.getRadius();

            geojson = {
                type: "Feature",
                properties: {
                    type: "Circle",
                    radius: radius,
                    popup_text: popupContent
                },
                geometry: {
                    type: "Point",
                    coordinates: [center.lng, center.lat]
                }
            };
        } else {
            geojson = layer.toGeoJSON();
        }

        fetch('/save-loc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                geojson: geojson,
                popup_text: popupContent,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Berhasil disimpan:', data);
        })
        .catch(error => {
            console.error('Gagal menyimpan:', error);
        });
    });

    var detailText = document.getElementById("detailText");

    // Reverse Geocoding with Nominatim
    function getAddress(lat, lon) {

        let apiKey = "pk.6bf7ec437629975854046fa8ce33f166";
        let url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let address = data.display_name || "Alamat tidak ditemukan";

                detailText.textContent = `Detail: ${address}`;
            })
            .catch(error => console.log("Gagal mendapatkan alamat:", error));
    }

    map.on('click', function(e) {
        let { lat, lng } = e.latlng;

        getAddress(lat, lng);
    });
});
