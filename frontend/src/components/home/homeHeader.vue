<script setup>
import api from "../../api/index.js";
import { ref, onMounted, onUnmounted, computed } from "vue";

const HomeImages = ref([]);
const currentIndex = ref(0);
let slideInterval = null;
const isPaused = ref(false);

async function getHomeHeaderImage() {
    try {
        const response = await api.get("siteAssets/homeImages/");
        HomeImages.value = response.data;
        console.log(HomeImages.value);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات", error);
        // Fallback images in case API fails
        HomeImages.value = [
            { image: "/images/youth-industry-1.jpg" },
            { image: "/images/youth-industry-2.jpg" },
            { image: "/images/youth-industry-3.jpg" }
        ];
    }
}

function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(() => {
        if (!isPaused.value && HomeImages.value.length > 0) {
            currentIndex.value = (currentIndex.value + 1) % HomeImages.value.length;
        }
    }, 8000);
}

function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function goToSlide(index) {
    currentIndex.value = index;
    stopSlideShow();
    startSlideShow();
}

function nextSlide() {
    if (HomeImages.value.length > 0) {
        currentIndex.value = (currentIndex.value + 1) % HomeImages.value.length;
        stopSlideShow();
        startSlideShow();
    }
}

function prevSlide() {
    if (HomeImages.value.length > 0) {
        currentIndex.value = (currentIndex.value - 1 + HomeImages.value.length) % HomeImages.value.length;
        stopSlideShow();
        startSlideShow();
    }
}

function togglePause() {
    isPaused.value = !isPaused.value;
    if (!isPaused.value) {
        startSlideShow();
    }
}

function scrollToNextSection() {
    const nextSection = document.getElementById("youth-industry-intro");
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

const currentImage = computed(() => {
    return HomeImages.value[currentIndex.value]?.image || '';
});

onMounted(() => {
    getHomeHeaderImage();
    startSlideShow();
});

onUnmounted(() => {
    stopSlideShow();
});
</script>

<template>
    <div class="home-header">
        <div class="home-header-box">
            <div class="home-header-content">
                <div class="image-container">
                    <Transition name="slide-fade" mode="out-in">
                        <img
                            :key="currentIndex"
                            :src="currentImage"
                            alt="صنعت جوانان"
                            class="header-image"
                        />
                    </Transition>
                </div>
                <div class="content-overlay">
                    <div class="header-content">
                        <h1>صنعت جوانان: <span class="highlight">آینده‌سازان</span> فردا</h1>
                        <p>با همکاری جوانان خلاق و نوآور، صنعت را متحول کنیم</p>
                        <div class="cta-buttons">
                            <button class="cta-primary" @click="scrollToSection('youth-opportunities')">
                                دوره ها
                            </button>
                            <button class="cta-secondary" @click="scrollToSection('youth-projects')">
                                گردشگری صنعتی
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Navigation buttons -->
                <button class="nav-btn prev-btn" @click="nextSlide" aria-label="اسلاید قبلی">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button class="nav-btn next-btn" @click="prevSlide" aria-label="اسلاید بعدی">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <!-- Image indicators -->
                <div class="slide-indicators">
                    <button
                        v-for="(image, index) in HomeImages"
                        :key="index"
                        @click="goToSlide(index)"
                        :class="['indicator', { active: index === currentIndex }]"
                        :aria-label="`رفتن به اسلاید ${index + 1}`"
                    ></button>
                </div>

                <!-- Play/Pause button -->
                <button class="play-pause-btn" @click="togglePause" :aria-label="isPaused ? 'پخش اسلاید' : 'توقف اسلاید'">
                    <svg v-if="!isPaused" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>

                <!-- Scroll to next section button -->
                <button class="scroll-down-btn" @click="scrollToNextSection" aria-label="اسکرول به بخش بعدی">
                    <span>کشف کنید</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="7 13 12 18 17 13"></polyline>
                        <polyline points="7 6 12 11 17 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-header {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.home-header-box {
    width: 100%;
    height: 100%;
    position: relative;
}

.home-header-content {
    width: 100%;
    height: 100%;
    position: relative;
}

.image-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    filter: brightness(0.8);
    will-change: transform, opacity;
}

/* انیمیشن slide-fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 1.5s ease-in-out;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.slide-fade-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.content-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.header-content {
    text-align: center;
    color: white;
    padding: 0 20px;
    max-width: 900px;
    animation: slideUp 1.2s ease-out;
}

.header-content h1 {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
    line-height: 1.2;
}

.highlight {
    color: #4fc3f7;
    position: relative;
    display: inline-block;
}

.highlight::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #4fc3f7;
    border-radius: 2px;
}

.header-content p {
    font-size: 1.8rem;
    font-weight: 300;
    max-width: 700px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
    opacity: 0.95;
}

.cta-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.cta-primary, .cta-secondary {
    padding: 14px 32px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.cta-primary {
    background-color: #4fc3f7;
    color: #003366;
    box-shadow: 0 4px 15px rgba(79, 195, 247, 0.4);
}

.cta-primary:hover {
    background-color: #29b6f6;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(79, 195, 247, 0.6);
}

.cta-secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
}

.cta-secondary:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
}

/* Navigation buttons */
.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
}

.prev-btn {
    left: 30px;
}

.next-btn {
    right: 30px;
}

.nav-btn svg {
    stroke: white;
    fill: none;
    width: 24px;
    height: 24px;
}

/* Slide indicators */
.slide-indicators {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 3;
}

.indicator {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.indicator:hover {
    background-color: rgba(255, 255, 255, 0.7);
}

.indicator.active {
    background-color: #4fc3f7;
    transform: scale(1.3);
    box-shadow: 0 0 10px rgba(79, 195, 247, 0.8);
}

/* Play/Pause button */
.play-pause-btn {
    position: absolute;
    bottom: 100px;
    right: 30px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.play-pause-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

.play-pause-btn svg {
    stroke: white;
    fill: white;
    width: 24px;
    height: 24px;
}

/* Scroll down button */
.scroll-down-btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    animation: bounce 2s infinite;
    transition: all 0.3s ease;
}

.scroll-down-btn:hover {
    transform: translateX(-50%) translateY(5px);
}

.scroll-down-btn span {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 8px;
    letter-spacing: 1px;
}

.scroll-down-btn svg {
    width: 30px;
    height: 30px;
    stroke: white;
    stroke-width: 2;
}

@keyframes slideUp {
    from {
        transform: translateY(40px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
    }
    40% {
        transform: translateX(-50%) translateY(-15px);
    }
    60% {
        transform: translateX(-50%) translateY(-7px);
    }
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .header-content h1 {
        font-size: 3.5rem;
    }

    .header-content p {
        font-size: 1.6rem;
    }
}

@media (max-width: 768px) {
    .header-content h1 {
        font-size: 2.8rem;
    }

    .header-content p {
        font-size: 1.4rem;
    }

    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }

    .cta-primary, .cta-secondary {
        width: 80%;
        max-width: 300px;
    }

    .nav-btn {
        width: 45px;
        height: 45px;
    }

    .nav-btn svg {
        width: 20px;
        height: 20px;
    }

    .prev-btn {
        left: 15px;
    }

    .next-btn {
        right: 15px;
    }

    .slide-indicators {
        bottom: 90px;
    }

    .play-pause-btn {
        bottom: 90px;
        right: 20px;
        width: 45px;
        height: 45px;
    }

    .play-pause-btn svg {
        width: 20px;
        height: 20px;
    }
}

@media (max-width: 480px) {
    .header-content h1 {
        font-size: 2.2rem;
    }

    .header-content p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }

    .cta-primary, .cta-secondary {
        padding: 12px 24px;
        font-size: 1rem;
    }

    .nav-btn {
        width: 40px;
        height: 40px;
    }

    .nav-btn svg {
        width: 18px;
        height: 18px;
    }

    .slide-indicators {
        bottom: 80px;
        gap: 8px;
    }

    .indicator {
        width: 10px;
        height: 10px;
    }

    .play-pause-btn {
        bottom: 80px;
        right: 15px;
        width: 40px;
        height: 40px;
    }

    .scroll-down-btn span {
        font-size: 0.9rem;
    }

    .scroll-down-btn svg {
        width: 24px;
        height: 24px;
    }
}
</style>