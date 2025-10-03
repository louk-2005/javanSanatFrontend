<script setup>
import {computed, onMounted, ref} from "vue";
import api from "../../api/index.js";

const articles = ref([]);
const currentIndex = ref(0);
const itemsPerPage = ref(3);
const isLoading = ref(true);
const touchStartX = ref(0);
const touchEndX = ref(0);

// تنظیم تعداد آیتم‌ها بر اساس اندازه صفحه
const updateItemsPerPage = () => {
    if (window.innerWidth < 768) {
        itemsPerPage.value = 1; // در موبایل فقط یک مقاله نمایش داده شود
    } else if (window.innerWidth < 1024) {
        itemsPerPage.value = 2; // در تبلت دو مقاله
    } else {
        itemsPerPage.value = 3; // در دسکتاپ سه مقاله
    }
};

async function getArticles() {
    try {
        const response = await api.get("articles/articles/", {
            params: { show: true }
        });
        articles.value = response.data;
        // console.log("مقالات دریافت شده:", articles.value);
    } catch (error) {
        console.error("خطا در دریافت مقالات", error);
    } finally {
        isLoading.value = false;
    }
}


const totalSlides = computed(() => Math.ceil(articles.value.length / itemsPerPage.value));

const nextSlide = () => {
    if (currentIndex.value < totalSlides.value - 1) {
        currentIndex.value++;
    }
};

const prevSlide = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

const goToSlide = (index) => {
    currentIndex.value = index;
};

const getArticlesForSlide = (slideIndex) => {
    const start = slideIndex * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return articles.value.slice(start, end);
};

// مدیریت حرکات لمسی برای موبایل
const handleTouchStart = (e) => {
    touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchMove = (e) => {
    touchEndX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = () => {
    if (touchStartX.value - touchEndX.value > 50) {
        // swipe به چپ (رفتن به مقاله بعدی)
        nextSlide();
    }
    if (touchEndX.value - touchStartX.value > 50) {
        // swipe به راست (رفتن به مقاله قبلی)
        prevSlide();
    }
};

onMounted(async () => {
    await getArticles();
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
});
</script>

<template>
    <div class="articles-box">
        <div class="business-articles" dir="rtl">
            <div class="section-header">
                <h2 class="section-title">مقالات</h2>
                <p class="section-subtitle">آخرین اخبار و تحلیل‌های تخصصی ما</p>
            </div>

            <!-- Loading State -->
            <!-- Loading State -->
            <div v-if="isLoading || articles.length === 0" class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">در حال بارگذاری مقالات...</p>
            </div>

            <!-- Articles Carousel -->
            <div v-else class="carousel-container">
                <!-- Navigation Controls -->
                <button
                    @click="prevSlide"
                    :disabled="currentIndex === 0"
                    class="nav-button prev-button"
                    aria-label="مقالات قبلی"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>

                <button
                    @click="nextSlide"
                    :disabled="currentIndex === totalSlides - 1"
                    class="nav-button next-button"
                    aria-label="مقالات بعدی"
                >

                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>

                <!-- Carousel Track -->
                <div class="carousel-viewport"
                     @touchstart="handleTouchStart"
                     @touchmove="handleTouchMove"
                     @touchend="handleTouchEnd">
                    <div
                        class="carousel-track"
                        :style="{ transform: `translateX(${currentIndex * 100}%)` }"
                    >
                        <!-- اسلایدها -->
                        <div
                            v-for="(slide, slideIndex) in totalSlides"
                            :key="slideIndex"
                            class="slide"
                        >
                            <!-- مقالات هر اسلاید -->
                            <div
                                v-for="article in getArticlesForSlide(slideIndex)"
                                :key="article.id"
                                class="article-card"
                            >
                                <div class="card-image-container">
                                    <img
                                        :src="article.featured_image"
                                        :alt="article.title"
                                        class="article-image"
                                    />
                                    <div class="image-overlay"></div>
                                </div>
                                <div class="card-content">
                                    <h3 class="article-title">{{ article.title }}</h3>
                                    <div class="card-action">
                                        <button class="read-more-btn">
                                            مطالعه بیشتر
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination Indicators -->
                <div class="pagination-dots">
                    <button
                        v-for="(_, index) in totalSlides"
                        :key="index"
                        @click="goToSlide(index)"
                        :class="['dot', { active: currentIndex === index }]"
                        :aria-label="`رفتن به اسلاید ${index + 1}`"
                    ></button>
                </div>
            </div>

            <!-- View All Button -->
            <div class="view-all-container">
                <button class="view-all-btn">
                    مشاهده تمام مقالات
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped>
.articles-box {
    background-color: #f8fafc;
    width: 100%;
    overflow-x: hidden; /* جلوگیری از اسکرول افقی */
}

.business-articles {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 80px 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    direction: rtl;
    box-sizing: border-box;
}

/* Section Header */
.section-header {
    text-align: center;
    margin-bottom: 60px;
}

.section-title {
    font-size: 2.75rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 16px;
    letter-spacing: -0.025em;
}

.section-subtitle {
    font-size: 1.25rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    border-radius: 16px;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 24px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    color: #475569;
    font-size: 1.125rem;
    font-weight: 500;
}

/* Carousel Container */
.carousel-container {
    position: relative;
    margin-bottom: 60px;
    width: 100%;
}

.carousel-viewport {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    touch-action: pan-y pinch-zoom;
    width: 100%;
}

.carousel-track {
    display: flex;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    direction: rtl;
}

.slide {
    flex: 0 0 100%;
    display: flex;
    gap: 24px;
    box-sizing: border-box;
    width: 100%;
}

/* Article Card */
.article-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    min-width: 0; /* جلوگیری از overflow */
}

.article-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #e2e8f0;
}

.card-image-container {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: #f8fafc;
    width: 100%;
}

.article-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.article-card:hover .article-image {
    transform: scale(1.03);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.article-card:hover .image-overlay {
    opacity: 1;
}

.card-content {
    padding: 24px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.article-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 20px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: right;
    word-wrap: break-word;
}

.card-action {
    margin-top: auto;
    text-align: left;
}

.read-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    color: #3b82f6;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 10px 0;
    font-size: 1rem;
}

.read-more-btn:hover {
    color: #1d4ed8;
    transform: translateX(4px);
}

.read-more-btn svg {
    width: 18px;
    height: 18px;
}

/* Navigation Buttons */
.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background-color: white;
    color: #475569;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.nav-button:hover {
    background-color: #f8fafc;
    color: #0f172a;
    border-color: #cbd5e1;
}

.nav-button:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
    border-color: #f1f5f9;
}

.prev-button {
    right: -24px;
}

.next-button {
    left: -24px;
}

.nav-button svg {
    width: 20px;
    height: 20px;
}

/* Pagination Dots */
.pagination-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #cbd5e1;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot:hover {
    background-color: #94a3b8;
}

.dot.active {
    width: 32px;
    border-radius: 4px;
    background-color: #3b82f6;
}

/* View All Button */
.view-all-container {
    text-align: center;
}

.view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #3b82f6;
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.view-all-btn:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
}

.view-all-btn svg {
    width: 20px;
    height: 20px;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .business-articles {
        padding: 70px 16px;
    }

    .article-card {
        flex: 0 0 calc(50% - 12px);
    }

    .slide {
        gap: 16px;
        padding: 8px;
    }

    .card-image-container {
        height: 200px;
    }

    .nav-button {
        width: 40px;
        height: 40px;
    }

    .prev-button {
        right: -8px;
    }

    .next-button {
        left: -8px;
    }
}

@media (max-width: 768px) {
    .business-articles {
        padding: 60px 12px;
    }

    .section-title {
        font-size: 2.25rem;
    }

    .section-subtitle {
        font-size: 1.125rem;
    }

    .article-card {
        flex: 0 0 100%;
    }

    .nav-button {
        width: 36px;
        height: 36px;
    }

    .prev-button {
        right: 8px; /* تغییر به داخل کانتینر */
    }

    .next-button {
        left: 8px; /* تغییر به داخل کانتینر */
    }

    .carousel-viewport {
        border-radius: 16px;
    }

    .slide {
        gap: 0;
        padding: 0;
    }

    .card-image-container {
        height: 180px;
    }

    .article-title {
        font-size: 1.25rem;
    }

    .card-content {
        padding: 16px;
    }

    .view-all-btn {
        padding: 14px 24px;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .business-articles {
        padding: 50px 10px;
    }

    .section-title {
        font-size: 1.875rem;
    }

    .section-subtitle {
        font-size: 1rem;
    }

    .slide {
        padding: 0;
    }

    .card-image-container {
        height: 160px;
    }

    .article-title {
        font-size: 1.125rem;
    }

    .card-content {
        padding: 14px;
    }

    .nav-button {
        width: 32px;
        height: 32px;
    }

    .view-all-btn {
        padding: 12px 20px;
        font-size: 0.875rem;
    }
}
</style>