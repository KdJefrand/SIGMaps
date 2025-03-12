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

    var baseMaps = {
        "Standar": osm,
        "Dark Mode": dark,
        "Satelit": satellite
    };

    L.control.layers(baseMaps).addTo(map);

    // Pop-Up
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
        if (event.layerType === 'marker') {
            var popupContent = prompt("Masukkan teks untuk pop-up:", "Lokasi Baru");
            if (popupContent) {
                layer.bindPopup(popupContent).openPopup();
            }
        }
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
