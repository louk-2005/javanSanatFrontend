<script setup>
import {nextTick, onMounted, ref} from 'vue';
import api from "../../api/index.js";
import CommunicationWithUsForm from '../../components/contactUs/contactForm.vue'
import Location from '../../components/contactUs/location.vue'

const contacts = ref([]);
const isLoading = ref(true);
const showSuccess = ref(false);
const animationReady = ref(false);
const mainBranchContact = ref(null);
const mainBranchSocialLinks = ref([]);

// دریافت اطلاعات تماس از API
async function getContacts() {
    try {
        isLoading.value = true;
        const response = await api.get("/accounts/contacts/");

        // مرتب‌سازی شعب: ابتدا شعبه اصلی، سپس سایر شعب
        const sortedContacts = [...response.data].sort((a, b) => {
            // شعبه اصلی همیشه در اولویت اول
            if (a.name === 'Head Office') return -1;
            if (b.name === 'Head Office') return 1;
            // سایر شعب بر اساس نام مرتب می‌شوند
            return a.name.localeCompare(b.name);
        });

        contacts.value = sortedContacts;

        // پیدا کردن شعبه اصلی
        const mainBranch = sortedContacts.find(
            contact => contact.name === 'Head Office' || contact.name === 'شعبه اصلی'
        );

        if (mainBranch) {
            mainBranchContact.value = mainBranch;
            // بعد از گرفتن اطلاعات تماس، لینک‌های اجتماعی رو بخوان
            await getSocialLinks(mainBranch.id);
        }

        console.log("Contacts:", contacts.value);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات تماس:", error);
    } finally {
        isLoading.value = false;
        // اطمینان از اینکه انیمیشن‌ها پس از بارگذاری داده‌ها فعال می‌شوند
        nextTick(() => {
            animationReady.value = true;
            setupAnimations();
        });
    }
}

// تبدیل نام شعبه به فارسی
function getBranchName(name) {
    switch (name) {
        case 'Head Office':
            return 'دفتر مرکزی';
        case 'Other Branches':
            return 'شعب دیگر';
        default:
            return name;
    }
}

// مدیریت رویداد ارسال فرم
function handleFormSubmit() {
    showSuccess.value = true;
    // مخفی کردن پیام موفقیت بعد از 5 ثانیه
    setTimeout(() => {
        showSuccess.value = false;
    }, 5000);
}

// تنظیم انیمیشن‌ها
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
            }
        });
    }, observerOptions);
    // اطمینان از اینکه المان‌ها وجود دارند
    setTimeout(() => {
        document.querySelectorAll('.info-card, .contact-form-container, .contact-info-container').forEach(el => {
            observer.observe(el);
        });
    }, 100);
}

const socialMediaIcons = {
    'telegram': ['fab', 'telegram'],
    'تلگرام': ['fab', 'telegram'],
    'facebook': ['fab', 'facebook'],
    'فیس‌بوک': ['fab', 'facebook'],
    'whatsapp': ['fab', 'whatsapp'],
    'واتس‌اپ': ['fab', 'whatsapp'],
    'instagram': ['fab', 'instagram'],
    'اینستاگرام': ['fab', 'instagram'],
    'twitter': ['fab', 'twitter'],
    'توییتر': ['fab', 'twitter'],
    'linkedin': ['fab', 'linkedin'],
    'لینکدین': ['fab', 'linkedin']
};

async function getSocialLinks(contactId) {
    try {
        const response = await api.get(`accounts/contacts/${contactId}/get_social_links/`);
        mainBranchSocialLinks.value = response.data.filter(
            link => link.contact === contactId
        );
    } catch (error) {
        console.error("خطا در دریافت لینک‌های اجتماعی", error);
    }
}

function getSocialIcon(name) {
    const normalizedName = name.toLowerCase().trim();
    return socialMediaIcons[normalizedName] || ['fas', 'envelope'];
}

onMounted(() => {
    getContacts();
});
</script>

<template>
    <div class="contact-page">
        <!-- Hero Section -->
        <section class="contact-hero">
            <div class="hero-overlay">
                <div class="container">
                    <h1>ارتباط با جوان صنعت</h1>
                    <p>برای همکاری‌های تجاری و ارائه خدمات با ما در تماس باشید</p>
                </div>
            </div>
        </section>

        <!-- Contact Form & Info Section -->
        <section class="contact-section">
            <div class="container">
                <div class="contact-grid">
                    <!-- Contact Form Component -->
                    <div class="contact-form-container" :class="{ 'animate-in': animationReady }">
                        <h2>ارسال درخواست</h2>
                        <p class="form-description">برای دریافت مشاوره تخصصی یا ارسال پیشنهادات خود، فرم زیر را تکمیل
                            کنید</p>
                        <CommunicationWithUsForm @form-submitted="handleFormSubmit"/>
                    </div>

                    <!-- Contact Info -->
                    <div class="contact-info-container" :class="{ 'animate-in': animationReady }">
                        <h2>اطلاعات تماس جوان صنعت</h2>
                        <p class="info-description">دفاتر ما در سراسر کشور آماده ارائه خدمات به شما هستند</p>

                        <!-- Loading State -->
                        <div v-if="isLoading" class="loading-container">
                            <div class="spinner"></div>
                            <p>در حال بارگذاری اطلاعات...</p>
                        </div>

                        <!-- Contact Info Cards -->
                        <div v-else-if="contacts.length > 0" class="info-cards">
                            <div v-for="contact in contacts" :key="contact.id" class="info-card"
                                 :class="{ 'animate-in': animationReady }">
                                <div class="card-header">
                                    <div class="branch-logo" v-if="contact.logo">
                                        <img :src="contact.logo" :alt="contact.name">
                                    </div>
                                    <div class="branch-title">
                                        <h3>{{ getBranchName(contact.name) }}</h3>
                                        <p v-if="contact.description" class="branch-description">{{
                                                contact.description
                                            }}</p>
                                    </div>
                                </div>
                                <div class="info-items">
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <font-awesome-icon class="icon" :icon="['fas', 'phone']"/>
                                        </div>
                                        <div class="info-text">
                                            <h4>تلفن تماس</h4>
                                            <p>{{ contact.phone || 'شماره تلفن موجود نیست' }}</p>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <font-awesome-icon class="icon" :icon="['fas', 'envelope']"/>
                                        </div>
                                        <div class="info-text">
                                            <h4>پست الکترونیک</h4>
                                            <p>{{ contact.email || 'ایمیل موجود نیست' }}</p>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <font-awesome-icon class="icon" :icon="['fas', 'map-marker-alt']"/>
                                        </div>
                                        <div class="info-text">
                                            <h4>آدرس</h4>
                                            <p>{{ contact.address || 'آدرس موجود نیست' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- No Contacts State -->
                        <div v-else class="no-contacts">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>اطلاعات تماسی یافت نشد</p>
                        </div>

                        <!-- Social Media -->
                        <div class="social-media">
                            <h3>شبکه‌های اجتماعی جوان صنعت</h3>
                            <div class="social-icons">
                                <a v-for="link in mainBranchSocialLinks"
                                   :key="link.id"
                                   :href="link.url"
                                   target="_blank"
                                   class="social-icon">
                                    <font-awesome-icon :icon="getSocialIcon(link.name)"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Map Section with Location Component -->
        <section class="map-section">
            <div class="container">
                <div class="map-header">
                    <h2>موقعیت مکانی دفاتر جوان صنعت</h2>
                    <p>برای مشاهده آدرس دقیق و مسیریابی، نقشه زیر را بررسی کنید</p>
                </div>
                <div class="map-container">
                    <Location/>
                </div>
            </div>
        </section>

        <!-- Success Message -->
        <div v-if="showSuccess" class="success-message show">
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>درخواست شما با موفقیت ارسال شد!</h3>
                <p>کارشناسان جوان صنعت به زودی با شما تماس خواهند گرفت</p>
                <button @click="showSuccess = false" class="btn-close">بستن</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* استایل اصلی */
.contact-page {
    font-family: 'IRANSans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #2c3e50;
    line-height: 1.6;
    background-color: #ffffff;
    overflow-x: hidden;
}

/* Hero Section */
.contact-hero {
    position: relative;
    height: 60vh;
    background: linear-gradient(rgba(0, 51, 102, 0.5), rgba(0, 102, 204, 0.5)),
    url('../../assets/aboutUs/Copilot_20250930_200936.png') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #ffffff;
    border-bottom: 4px solid #0066cc;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 15px;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.contact-hero h1 {
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: fadeInDown 1s ease;
    position: relative;
    display: inline-block;
}

.contact-hero h1::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #3498db;
}

.contact-hero p {
    font-size: 1.4rem;
    max-width: 700px;
    margin: 0 auto;
    animation: fadeInUp 1s ease 0.3s;
    animation-fill-mode: both;
    font-weight: 300;
}

/* Contact Section */
.contact-section {
    padding: 100px 0;
    background: linear-gradient(135deg, #f8fbff 0%, #e6f2ff 100%);
}

.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
}

/* Contact Form */
.contact-form-container {
    background: #ffffff;
    border-radius: 12px;
    padding: 45px;
    box-shadow: 0 15px 35px rgba(0, 51, 102, 0.08);
    border: 1px solid #e0f0ff;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
    position: relative;
    overflow: hidden;
}

.contact-form-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(to bottom, #0066cc, #3498db);
}

.contact-form-container.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.contact-form-container h2 {
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 2.2rem;
    margin-bottom: 15px;
    color: #0066cc;
    position: relative;
    padding-bottom: 15px;
}

.form-description {
    color: #5d6d7e;
    margin-bottom: 30px;
    font-size: 1.1rem;
    line-height: 1.7;
}

.contact-form-container h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 70px;
    height: 3px;
    background-color: #3498db;
}

/* Contact Info */
.contact-info-container {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.contact-info-container.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.contact-info-container h2 {
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 2.2rem;
    margin-bottom: 15px;
    color: #0066cc;
    position: relative;
    padding-bottom: 15px;
}

.info-description {
    color: #5d6d7e;
    margin-bottom: 30px;
    font-size: 1.1rem;
    line-height: 1.7;
}

.contact-info-container h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 70px;
    height: 3px;
    background-color: #3498db;
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    color: #5d6d7e;
}

.loading-container .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(0, 102, 204, 0.2);
    border-radius: 50%;
    border-top-color: #0066cc;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
}

.loading-container p {
    font-size: 1.1rem;
    color: #5d6d7e;
}

/* No Contacts State */
.no-contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    color: #5d6d7e;
}

.no-contacts i {
    font-size: 3.5rem;
    color: #3498db;
    margin-bottom: 20px;
}

.no-contacts p {
    font-size: 1.2rem;
    color: #5d6d7e;
}

/* Info Cards */
.info-cards {
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-bottom: 40px;
}

.info-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 25px rgba(0, 51, 102, 0.06);
    transition: all 0.4s ease;
    opacity: 0;
    transform: translateY(20px);
    border-left: 4px solid #3498db;
}

.info-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 51, 102, 0.1);
}

/* Card Header */
.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0f0ff;
}

.branch-logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 20px;
    flex-shrink: 0;
    border: 2px solid #e0f0ff;
    background-color: #f8fbff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.branch-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.branch-title h3 {
    font-size: 1.5rem;
    color: #0066cc;
    margin: 0 0 8px;
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.branch-description {
    font-size: 1rem;
    color: #5d6d7e;
    margin: 0;
    line-height: 1.5;
}

/* Info Items */
.info-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.info-item {
    display: flex;
    align-items: flex-start;
}

.info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #0066cc 0%, #3498db 100%);
    border-radius: 50%;
    margin-left: 20px;
    flex-shrink: 0;
}

.icon {
    color: white;
    font-size: 1.3rem;
}

.info-text h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 8px;
    color: #2c3e50;
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.info-text p {
    margin: 0;
    color: #5d6d7e;
    font-size: 1rem;
    line-height: 1.6;
}

/* Social Media */
.social-media {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 51, 102, 0.06);
    text-align: center;
    border-top: 4px solid #3498db;
}

.social-media h3 {
    font-size: 1.4rem;
    margin-bottom: 25px;
    color: #0066cc;
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 25px;
}

.social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 55px;
    background: linear-gradient(135deg, #0066cc 0%, #3498db 100%);
    border-radius: 50%;
    color: #ffffff;
    font-size: 1.6rem;
    transition: all 0.4s ease;
    text-decoration: none;
}

.social-icon:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 102, 204, 0.3);
}

/* Map Section */
.map-section {
    padding: 90px 0;
    background-color: #f8fbff;
}

.map-header {
    text-align: center;
    margin-bottom: 50px;
}

.map-header h2 {
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 2.5rem;
    color: #0066cc;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
}

.map-header h2::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 4px;
    background-color: #3498db;
}

.map-header p {
    font-size: 1.2rem;
    color: #5d6d7e;
    max-width: 700px;
    margin: 25px auto 0;
    line-height: 1.7;
}

.map-container {
    background: #ffffff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 51, 102, 0.08);
    border: 1px solid #e0f0ff;
    height: 500px;
}

/* Success Message */
.success-message {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 51, 102, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.success-message.show {
    opacity: 1;
    visibility: visible;
}

.success-content {
    background: #ffffff;
    padding: 50px;
    border-radius: 15px;
    text-align: center;
    max-width: 550px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transform: scale(0.8);
    transition: transform 0.3s ease;
    border-top: 5px solid #3498db;
}

.success-message.show .success-content {
    transform: scale(1);
}

.success-content i {
    font-size: 4.5rem;
    color: #3498db;
    margin-bottom: 25px;
}

.success-content h3 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #0066cc;
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.success-content p {
    margin-bottom: 30px;
    color: #5d6d7e;
    font-size: 1.2rem;
    line-height: 1.6;
}

.btn-close {
    padding: 14px 35px;
    background: linear-gradient(135deg, #0066cc 0%, #3498db 100%);
    color: #ffffff;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease;
    font-family: 'IRANSansBold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.btn-close:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 102, 204, 0.3);
}

/* Animations */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 992px) {
    .contact-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .contact-hero h1 {
        font-size: 3rem;
    }

    .contact-hero p {
        font-size: 1.2rem;
    }
}

@media (max-width: 768px) {
    .contact-hero {
        height: 50vh;
    }

    .contact-hero h1 {
        font-size: 2.5rem;
    }

    .contact-hero p {
        font-size: 1.1rem;
    }

    .contact-form-container,
    .contact-info-container {
        padding: 30px 20px;
    }

    .map-header h2 {
        font-size: 2rem;
    }

    .card-header {
        flex-direction: column;
        text-align: center;
    }

    .branch-logo {
        margin: 0 0 20px;
    }

    .info-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .info-icon {
        margin-left: 0;
        margin-bottom: 15px;
    }
}

@media (max-width: 576px) {
    .contact-hero {
        height: 45vh;
    }

    .contact-hero h1 {
        font-size: 2.2rem;
    }

    .contact-section {
        padding: 70px 0;
    }

    .map-section {
        padding: 60px 0;
    }

    .map-container {
        height: 350px;
    }

    .social-icons {
        gap: 15px;
    }

    .social-icon {
        width: 45px;
        height: 45px;
        font-size: 1.3rem;
    }

    .success-content {
        padding: 40px 25px;
    }

    .success-content h3 {
        font-size: 1.7rem;
    }

    .success-content p {
        font-size: 1.1rem;
    }
}
</style>