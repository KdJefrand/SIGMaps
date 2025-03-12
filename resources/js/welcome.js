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

    // Marker
    var marker = L.marker([-8.7964, 115.1764427]).addTo(map);
    marker.bindPopup("Ini Gedung TI.").openPopup();

    // Pop-Up
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Koordinat: " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);

    // Polygon
    var polygon = L.polygon([
        [-8.796422, 115.175455],
        [-8.796655, 115.177284],
        [-8.79507, 115.177655],
        [-8.794863, 115.17604]
    ]).addTo(map);
    polygon.bindPopup("Fakultas Teknik.");
});
