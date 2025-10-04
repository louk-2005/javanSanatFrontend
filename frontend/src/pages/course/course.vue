<template>
    <div class="course-detail">
        <div class="section-header">
            <h3>دوره‌های ما</h3>
      <div class="course-count" v-if="!loading && !error && courses.length > 0">
        {{ courses.length }} دوره
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <p>در حال بارگذاری دوره‌ها...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="getCourses" class="retry-btn">
        <span>تلاش مجدد</span>
      </button>
    </div>

    <!-- No course found -->
    <div v-else-if="courses.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>هیچ دوره‌ای یافت نشد</h3>
      <p>در حال حاضر هیچ دوره‌ای برای نمایش وجود ندارد.</p>
      <button @click="getCourses" class="retry-btn">
        <span>تلاش مجدد</span>
      </button>
    </div>

    <!-- Course content -->
    <div v-else>
      <div class="courses-grid">
        <div v-for="course in paginatedCourses" :key="course.id" class="course-card">
          <div class="card-inner">
            <div class="card-front">
              <div class="card-image">
                <img
                  v-if="course.base_image"
                  :src="course.base_image"
                  :alt="course.title"
                >
                <div v-else class="no-image">بدون تصویر</div>
              </div>
              <div class="card-title">{{ course.title }}</div>
            </div>

            <!-- Hover overlay with details -->
            <div class="card-back">
              <div class="overlay-content">
                <h3>{{ course.title }}</h3>
                <p class="teachers"><strong>اساتید:</strong> {{ course.teachers || 'نامشخص' }}</p>
                <div class="dates">
                  <p><strong>تاریخ شروع:</strong> {{ formatDate(course.start_date) }}</p>
                  <p><strong>تاریخ پایان:</strong> {{ formatDate(course.end_date) }}</p>
                </div>
                <p class="duration"><strong>مدت زمان:</strong> {{ course.duration_display }}</p>
                <div class="pricing">
                  <span v-if="course.discount" class="original-price">
                    {{ course.price_display }}
                  </span>
                  <span class="final-price">
                    {{ formatFinalPrice(course.final_price) }}
                  </span>
                </div>
              </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from "../../api/index.js";

const courses = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(9);

async function getCourses() {
  try {
    loading.value = true;
    error.value = null;
    const response = await api.get("/articles/course/info/");
    console.log("Courses API response:", response.data);
    courses.value = response.data;
  } catch (err) {
    console.error("Courses API error:", err);
    error.value = "خطا در دریافت اطلاعات دوره‌ها";
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return 'نامشخص';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fa-IR', options);
}

function formatFinalPrice(price) {
  if (!price) return 'رایگان';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fa-IR').format(numPrice) + ' تومان';
}

// Pagination functions
function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  // Scroll to top of course container
  const container = document.querySelector('.course-detail');
  if (container) {
    container.scrollIntoView({behavior: 'smooth'});
  }
}

const totalPages = computed(() => Math.ceil(courses.value.length / itemsPerPage.value));

const paginatedCourses = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return courses.value.slice(startIndex, endIndex);
});

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
    getCourses();
});
</script>

<style scoped>
.course-detail {
    max-width: 1400px;
    margin: 100px auto;
    padding: 40px 20px;
    font-family: 'Vazirmatn', sans-serif;
    direction: rtl;
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
    right: 0;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    border-radius: 2px;
}

.course-count {
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

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.course-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    height: 320px;
    background-color: white;
    border: 1px solid rgba(226, 232, 240, 0.8);
    perspective: 1000px; /* برای ایجاد افکت سه بعدی */
}

.course-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(79, 70, 229, 0.2);
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d; /* برای حفظ فضای سه بعدی */
}

.course-card:hover .card-inner {
    transform: rotateY(180deg); /* چرخش 180 درجه حول محور Y */
}

.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* برای مخفی کردن پشت کارت در مرورگرهای وب‌کیت */
    backface-visibility: hidden; /* برای مخفی کردن پشت کارت */
    border-radius: 16px;
    overflow: hidden;
}

.card-back {
    transform: rotateY(180deg); /* چرخش پشت کارت به حالت اولیه */
    background: rgba(0, 0, 0, 0.85);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow-y: auto;
}

.card-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background-color: #f5f5f5;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.course-card:hover .card-image img {
    transform: scale(1.03);
}

.card-title {
    padding: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
    color: #2c3e50;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    background-color: #f5f5f5;
}

.overlay-content {
    max-width: 100%;
    text-align: center;
}

.overlay-content h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.4rem;
    color: #fff;
}

.teachers, .dates, .duration {
    margin: 8px 0;
    font-size: 0.9rem;
}

.dates p {
    margin: 5px 0;
}

.pricing {
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.original-price {
    text-decoration: line-through;
    color: #ccc;
    font-size: 1rem;
}

.final-price {
    font-size: 1.3rem;
    font-weight: bold;
    color: #4caf50;
}

.description {
    margin-top: 15px;
    font-size: 0.9rem;
    line-height: 1.5;
    max-height: 100px;
    overflow-y: auto;
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

@media (max-width: 768px) {
    .courses-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }

    .course-card {
        height: 280px;
    }

    .card-image {
        height: 180px;
    }

    .card-title {
        height: 100px;
        font-size: 1rem;
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