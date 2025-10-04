<script setup>
import api from "../../api/index.js";
import {ref, onMounted, computed} from "vue";

const allVideoCasts = ref([]); // تمام ویدیوهای دریافت شده از API
const videoCasts = ref([]); // ویدیوهایی که در صفحه فعلی نمایش داده می‌شوند
const loading = ref(true);
const error = ref(null);
const currentVideo = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(9);
const totalVideos = ref(0);

async function fetchVideoCasts() {
    try {
        loading.value = true;
        error.value = null;

        // دریافت تمام ویدیوها بدون پارامترهای صفحه‌بندی
        const response = await api.get("articles/video/");
        console.log("API Response:", response); // برای دیباگ کردن

        // بررسی ساختار پاسخ API
        if (response && response.data) {
            // اگر پاسخ مستقیماً آرایه باشد
            if (Array.isArray(response.data)) {
                allVideoCasts.value = response.data;
                totalVideos.value = response.data.length;
            }
            // اگر پاسخ دارای ساختار صفحه‌بندی باشد
            else if (response.data.results && Array.isArray(response.data.results)) {
                allVideoCasts.value = response.data.results;
                totalVideos.value = response.data.count || response.data.results.length;
            }
            // اگر پاسخ ساختار دیگری دارد
            else {
                console.warn("Unexpected API response structure:", response.data);
                allVideoCasts.value = [];
                totalVideos.value = 0;
            }
        } else {
            console.warn("No data in API response");
            allVideoCasts.value = [];
            totalVideos.value = 0;
        }

        // به‌روزرسانی ویدیوهای نمایش داده شده در صفحه فعلی
        updateVideoCastsForCurrentPage();
    } catch (err) {
        console.error("خطا در دریافت اطلاعات", err);
        error.value = "خطا در بارگذاری ویدیوها";
        allVideoCasts.value = [];
        totalVideos.value = 0;
    } finally {
        loading.value = false;
    }
}

// تابعی برای به‌روزرسانی ویدیوهای نمایش داده شده در صفحه فعلی
function updateVideoCastsForCurrentPage() {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    videoCasts.value = allVideoCasts.value.slice(startIndex, endIndex);
}

function playVideo(video) {
    currentVideo.value = video;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeVideo() {
    currentVideo.value = null;
    // Restore body scroll
    document.body.style.overflow = '';
}

function goToPage(page) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    // به‌روزرسانی ویدیوهای نمایش داده شده بدون ارسال درخواست جدید به API
    updateVideoCastsForCurrentPage();
    // Scroll to top of video container
    const container = document.querySelector('.video-container');
    if (container) {
        container.scrollIntoView({behavior: 'smooth'});
    }
}

const totalPages = computed(() => Math.ceil(totalVideos.value / itemsPerPage.value));

// Generate page numbers for pagination
const pageNumbers = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;

    // اگر فقط یک صفحه وجود دارد یا اصلاً صفحه‌ای وجود ندارد
    if (total <= 1) return pages;

    // Always show first page
    pages.push(1);

    // Show ellipsis if needed
    if (current > 3) {
        pages.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        if (i !== 1 && i !== total) {
            pages.push(i);
        }
    }

    // Show ellipsis if needed
    if (current < total - 2) {
        pages.push('...');
    }

    // Always show last page if there is more than one page
    if (total > 1) {
        pages.push(total);
    }

    return pages;
});

onMounted(() => {
    fetchVideoCasts();
});
</script>

<template>
    <div class="video-container">
        <!-- Loading State -->
        <div class="section-header">
            <h3>ویدیو کست ها</h3>
            <div class="video-count" v-if="!loading && !error && totalVideos > 0">
                {{ totalVideos }} ویدیو
            </div>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="spinner-container">
                <div class="spinner"></div>
            </div>
            <p>در حال بارگذاری ویدیوها...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <p>{{ error }}</p>
            <button @click="fetchVideoCasts" class="retry-btn">
                <span>تلاش مجدد</span>
            </button>
        </div>

        <!-- No Videos State -->
        <div v-else-if="videoCasts.length === 0" class="empty-state">
            <div class="empty-icon">📹</div>
            <h3>هیچ ویدیویی یافت نشد</h3>
            <p>در حال حاضر هیچ ویدیویی برای نمایش وجود ندارد.</p>
            <button @click="fetchVideoCasts" class="retry-btn">
                <span>تلاش مجدد</span>
            </button>
        </div>

        <!-- Video Grid -->
        <div v-else>
            <div class="video-grid">
                <div
                    v-for="video in videoCasts"
                    :key="video.id || video.title"
                    class="video-card"
                    @click="playVideo(video)"
                >
                    <div class="video-preview-container">
                        <iframe
                            :src="video.embed_url || video.aparat_url"
                            frameborder="0"
                            allow="autoplay; fullscreen"
                            class="video-preview"
                        ></iframe>
                        <div class="play-overlay">
                            <div class="play-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">{{ video.title }}</h3>
                        <div class="video-meta">
                            <span class="video-date" v-if="video.created_at">
                                {{ new Date(video.created_at).toLocaleDateString('fa-IR') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="pagination-container" v-if="totalPages > 1">
                <div class="pagination">
                    <button
                        class="pagination-btn prev-btn"
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                        قبلی
                    </button>

                    <div class="page-numbers">
                        <button
                            v-for="(page, index) in pageNumbers"
                            :key="index"
                            class="page-number"
                            :class="{
                                'active': currentPage === page,
                                'ellipsis': page === '...'
                            }"
                            @click="typeof page === 'number' ? goToPage(page) : null"
                            :disabled="page === '...'"
                        >
                            {{ page }}
                        </button>
                    </div>

                    <button
                        class="pagination-btn next-btn"
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                    >
                        بعدی
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>

                    </button>
                </div>

                <div class="pagination-info">
                    صفحه {{ currentPage }} از {{ totalPages }}
                </div>
            </div>
        </div>

        <!-- Video Player Modal -->
        <Transition name="modal-fade">
            <div v-if="currentVideo" class="video-modal" @click.self="closeVideo">
                <div class="modal-content">
                    <button class="close-btn" @click="closeVideo">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"
                                  stroke-linecap="round"/>
                        </svg>
                    </button>
                    <div class="video-player">
                        <iframe
                            :src="currentVideo.embed_url || currentVideo.aparat_url"
                            frameborder="0"
                            allowfullscreen
                            class="video-iframe"
                        ></iframe>
                    </div>
                    <div class="modal-header">
                        <h2 class="modal-title">{{ currentVideo.title }}</h2>
                        <p class="modal-date" v-if="currentVideo.created_at">
                            {{
                                new Date(currentVideo.created_at).toLocaleDateString('fa-IR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.video-container {
    max-width: 1400px;
    margin: 100px auto;
    padding: 40px 20px;
    font-family: 'IRANSans', 'Vazirmatn', sans-serif;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.section-header h3 {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    position: relative;
    padding-bottom: 10px;
}

.section-header h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    border-radius: 2px;
}

.video-count {
    background: rgba(79, 70, 229, 0.1);
    color: #4f46e5;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 14px;
}

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #4f46e5;
}

.spinner-container {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
}

.spinner {
    width: 100%;
    height: 100%;
    border: 4px solid rgba(79, 70, 229, 0.1);
    border-top: 4px solid #4f46e5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* Error State */
.error-state {
    text-align: center;
    padding: 60px 20px;
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.05);
    border-radius: 16px;
    max-width: 500px;
    margin: 0 auto;
    border: 1px solid rgba(239, 68, 68, 0.1);
}

.error-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
    background-color: rgba(100, 116, 139, 0.05);
    border-radius: 16px;
    max-width: 500px;
    margin: 0 auto;
    border: 1px solid rgba(100, 116, 139, 0.1);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.empty-state h3 {
    margin: 0 0 12px;
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
}

.empty-state p {
    margin: 0 0 24px;
    font-size: 16px;
    line-height: 1.5;
}

.retry-btn {
    margin-top: 24px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.retry-btn:hover {
    background: linear-gradient(135deg, #4338ca, #6d28d9);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
}

/* Video Grid */
.video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.video-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    position: relative;
    border: 1px solid rgba(226, 232, 240, 0.8);
}

.video-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(79, 70, 229, 0.2);
}

.video-preview-container {
    position: relative;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    overflow: hidden;
    background: #000;
}

.video-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.video-card:hover .video-preview {
    transform: scale(1.03);
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.video-card:hover .play-overlay {
    opacity: 1;
}

.play-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #070707, #e10b0b);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(229, 70, 83, 0.4);
    transform: scale(0.85);
    transition: all 0.3s ease;
}

.video-card:hover .play-icon {
    transform: scale(1);
    background: linear-gradient(135deg, #050505, #e10b0b);
    box-shadow: 0 10px 25px rgba(243, 87, 87, 0.6);
}

.play-icon svg {
    width: 30px;
    height: 30px;
    margin-left: 4px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.video-info {
    padding: 20px;
    background: white;
}

.video-title {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.video-meta {
    display: flex;
    align-items: center;
    color: #64748b;
    font-size: 14px;
}

.video-date {
    position: relative;
    padding-left: 16px;
}

.video-date::before {
    content: "";
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #cbd5e0;
}

/* Pagination */
.pagination-container {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    padding: 8px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
}

.pagination-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: white;
    border: none;
    border-radius: 8px;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
    background: rgba(79, 70, 229, 0.1);
    color: #4f46e5;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-btn svg {
    width: 18px;
    height: 18px;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.page-number {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: white;
    border: none;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.page-number:hover:not(.ellipsis):not(.active) {
    background: rgba(79, 70, 229, 0.1);
    color: #4f46e5;
}

.page-number.active {
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    color: white;
    font-weight: 600;
}

.page-number.ellipsis {
    cursor: default;
    color: #94a3b8;
}

.pagination-info {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
}

/* Video Modal */
.video-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    position: relative;
    max-width: 900px;
    width: 100%;
    background: #141415;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    z-index: 10;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.close-btn:hover {
    background: rgba(239, 68, 68, 0.8);
    transform: rotate(90deg);
}

.close-btn svg {
    width: 20px;
    height: 20px;
}

.video-player {
    position: relative;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    background: #000;
}

.video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.modal-header {
    padding: 20px;
    background: black;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 600;
    color: white;
    line-height: 1.3;
}

.modal-date {
    margin: 0;
    font-size: 14px;
    color: #94a3b8;
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .video-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }

    .modal-content {
        max-width: 100%;
    }

    .video-title {
        font-size: 16px;
    }

    .modal-title {
        font-size: 18px;
    }

    .pagination {
        flex-wrap: wrap;
        justify-content: center;
    }

    .page-numbers {
        order: 1;
        width: 100%;
        justify-content: center;
    }

    .prev-btn {
        order: 0;
    }

    .next-btn {
        order: 2;
    }
}
</style>