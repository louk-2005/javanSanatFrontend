<script setup>
import {onMounted} from 'vue'
import * as L from 'leaflet'
import api from "../../api/index.js";
let map

// انواع لایه‌های نقشه
const baseLayers = {
    "ساده": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "روشن": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'),
    "تاریک": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'),
    "ماهواره‌ای": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
}

onMounted(async () => {
    map = L.map('map', {
        center: [32.6546, 51.6680],
        zoom: 5,
        layers: [baseLayers["ساده"]],
        zoomControl: true
    })

    // کنترل برای تعویض نوع مپ
    L.control.layers(baseLayers).addTo(map)

    // گرفتن موقعیت‌ها از API
    try {
        const response = await api.get('/contactUs/location/')
        const locations = response.data
        // console.log(locations)
        locations.forEach((loc) => {
            const lat = parseFloat(loc.latitude)
            const lng = parseFloat(loc.longitude)

            if (!isNaN(lat) && !isNaN(lng)) {
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(`
            <div style="text-align: start; max-width: 250px;">
              <h4>${loc.name}</h4>
              <p>${loc.description}</p>
              <img src="${loc.image}" alt="${loc.name}" />
            </div>
          `)
            }
        })
    } catch (error) {
        console.error('❌ Error loading locations:', error)
    }
})
</script>


<template>
    <div class="location">
        <div class="location-box">
            <div class="location-content">
                <div id="map" class="location-info"></div>
            </div>
        </div>
    </div>
</template>


<style scoped>



:deep(.leaflet-popup-content-wrapper),
:deep(.leaflet-popup-tip) {
    border-radius: 0 !important;
}

:deep(.leaflet-popup-content) {
    padding: 0 !important;
    margin: 15px 0 !important;
    overflow: hidden !important;
    border-radius: 0 !important;
    text-align: center;
    direction: rtl;
    font-family: "IRANSans", sans-serif;
}
:deep(.leaflet-popup-content) p{
    margin: 5px 15px 15px;
}
:deep(.leaflet-popup-content) h4{
    margin: 0 15px;
}
:deep(.leaflet-popup-content) img {
    display: block;
    margin: 0 auto !important;
    max-width: 220px;
    max-height: 150px;
}

.location-info {
    height: 500px;
}
</style>