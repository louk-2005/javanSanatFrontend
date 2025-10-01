<script setup>
import {ref, onMounted} from "vue";
import api from "../../../api/index.js";

const mainBranchContact = ref(null);
const otherBranches = ref([]);
const socialLinks = ref([]);

// Map social media names to their icon names
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
    'توییتر': ['fab', 'twitter']
};

async function fetchContactInfo() {
    try {
        const response = await api.get("accounts/contacts");
        const contacts = response.data;

        // Find main branch
        mainBranchContact.value = contacts.find(
            contact => contact.name === 'Head Office' || contact.name === 'شعبه اصلی'
        );

        // Find other branches
        otherBranches.value = contacts.filter(
            contact => contact.name === 'Other Branches' || contact.name === 'سایر شعبه ها'
        );

        // 🟢 اگر شعبه اصلی پیدا شد، لینک‌هاشو بگیر
        if (mainBranchContact.value) {
            await getSocialLinks(mainBranchContact.value.id);
        }

    } catch (error) {
        console.error("خطا در دریافت اطلاعات تماس", error);
    }
}


async function getSocialLinks(contactId) {
    try {
        const response = await api.get(`accounts/contacts/${contactId}/get_social_links/`);
        socialLinks.value = response.data.filter(
            link => link.contact === contactId
        );
        console.log(socialLinks.value)
    } catch (error) {
        console.error("خطا در دریافت لینک‌های اجتماعی", error);
    }
}
// Function to get the appropriate icon for social media
function getSocialIcon(name) {
    const normalizedName = name.toLowerCase().trim();
    return socialMediaIcons[normalizedName] || ['fas', 'link'];
}

function formatDate(dateString) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString('fa-IR', options);
}

onMounted(async () => {
    await fetchContactInfo();
});
</script>

<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <!-- Contact Information Section -->
                <div class="footer-section">
                    <h3>ارتباط با ما</h3>
                    <div v-if="mainBranchContact">
                        <ul class="contact-info">
                            <li v-if="mainBranchContact.phone">
                                <font-awesome-icon :icon="['fas', 'phone']"/>
                                <span>{{ mainBranchContact.phone }}</span>
                            </li>
                            <li v-if="mainBranchContact.email">
                                <font-awesome-icon :icon="['fas', 'envelope']"/>
                                <span>{{ mainBranchContact.email }}</span>
                            </li>
                            <li v-if="mainBranchContact.address">
                                <font-awesome-icon :icon="['fas', 'map-marker-alt']"/>
                                <span>{{ mainBranchContact.address }}</span>
                            </li>
                        </ul>
                        <div class="cta-button">
                            <a href="/contact" class="btn">همین حالا با ما تماس بگیرید</a>
                        </div>
                    </div>
                    <div v-else>
                        <p>در حال بارگذاری اطلاعات تماس...</p>
                    </div>
                </div>

                <!-- Quick Links Section -->
                <div class="footer-section">
                    <h3>دسترسی سریع</h3>
                    <ul class="footer-links">
                        <li><a href="/">خانه</a></li>
                        <li><a href="/about">درباره ما</a></li>
                        <li><a href="/services">خدمات ما</a></li>
                        <li><a href="/courses">دوره های آموزشی</a></li>
                        <li><a href="/articles">مقالات</a></li>
                        <li><a href="/contact">تماس با ما</a></li>
                    </ul>
                </div>

                <!-- Social Media Section -->
                <div class="footer-section">
                    <h3>شبکه‌های اجتماعی</h3>
                    <div v-if="socialLinks.length > 0" class="social-links">
                        <a
                            v-for="link in socialLinks"
                            :key="link.id"
                            :href="link.url"
                            :title="link.name"
                            target="_blank"
                        >
                            <font-awesome-icon
                                :icon="getSocialIcon(link.name)"
                            />
                        </a>
                    </div>
                    <div class="newsletter">
                        <h4>عضو خبرنامه ما شوید</h4>
                        <p>برای دریافت آخرین اخبار و تخفیف‌ها</p>
                        <div class="newsletter-form">
                            <router-link to="/login" class="btn-second"> ثبت نام</router-link>
                        </div>
                    </div>
                </div>

                <!-- Logo Section -->
                <div class="footer-section">
                    <div v-if="mainBranchContact" class="logo-section">
                        <div v-if="mainBranchContact.logo" class="main-logo">
                            <img :src="mainBranchContact.logo" alt="لوگو صنعت جوانان">
                        </div>
                        <div class="company-info">
                            <h4>صنعت جوانان</h4>
                            <p>توانمندسازی نسل جوان برای آینده‌ای روشن</p>
                            <p>آخرین به‌روزرسانی: {{ formatDate(mainBranchContact.updated_at) }}</p>
                        </div>
                    </div>
                    <div v-else>
                        <p>در حال بارگذاری لوگو...</p>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom Section -->
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p>
                        © {{ new Date().getFullYear() }} صنعت جوانان. تمامی حقوق محفوظ است.
                    </p>

                </div>
                <div class="payment-methods">
                    <font-awesome-icon :icon="['fab', 'cc-visa']" title="ویزا"/>
                    <font-awesome-icon :icon="['fab', 'cc-mastercard']" title="مسترکارت"/>
                    <font-awesome-icon :icon="['fas', 'money-bill-wave']" title="پرداخت نقدی"/>
                    <font-awesome-icon :icon="['fas', 'mobile-alt']" title="پرداخت همراه"/>
                </div>
                <div class="developer-info">
                    <p>توسعه یافته توسط Loukzade — تماس: <span>۰۹۱۳۹۸۹۰۵۷۴</span></p>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    border-top: 3px solid #FF6B6B;
    padding: 60px 0 20px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1a2a6c 0%, #2c3e50 100%);
    color: #ffffff;
}

.footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #FF6B6B, #4ECDC4, #FFD166);
}

.container {
    width: 85%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
}

.footer-section h3 {
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 25px;
    position: relative;
    padding-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.footer-section h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
}

/* Contact Info Styles */
.contact-info {
    list-style: none;
    padding: 0;
}

.contact-info li {
    display: flex;
    color: #e0e0e0;
    align-items: center;
    margin-bottom: 15px;
    transition: transform 0.3s;
}

.contact-info li:hover {
    transform: translateX(5px);
    color: #ffffff;
}

.contact-info svg {
    color: #4ECDC4;
    font-size: 18px;
    margin-left: 15px;
    width: 25px;
    text-align: center;
}

.cta-button {
    margin-top: 20px;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    background: linear-gradient(90deg, #FF6B6B, #FF8E53);
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

/* Quick Links Styles */
.footer-links {
    list-style: none;
    padding: 0;
}

.footer-links li {
    margin-bottom: 12px;
}

.footer-links a {
    color: #e0e0e0;
    text-decoration: none;
    display: inline-block;
    position: relative;
    transition: all 0.3s;
    padding-right: 0;
}

.footer-links a::before {
    content: '›';
    position: absolute;
    right: -15px;
    top: 0;
    color: #4ECDC4;
    opacity: 0;
    transition: all 0.3s;
}

.footer-links a:hover {
    color: #4ECDC4;
    padding-right: 15px;
}

.footer-links a:hover::before {
    opacity: 1;
    right: 0;
}

/* Social Media Styles */
.social-links {
    display: flex;
    justify-content: start;
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 30px;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 50%;
    font-size: 20px;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-links a:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
    box-shadow: 0 8px 15px rgba(78, 205, 196, 0.4);
}

.social-links svg {
    font-size: 20px;
}

/* Newsletter Styles */
.newsletter {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter h4 {
    color: #ffffff;
    font-size: 16px;
    margin-bottom: 10px;
}

.newsletter p {
    color: #e0e0e0;
    font-size: 14px;
    margin-bottom: 15px;
}

.newsletter-form {
    display: flex;
}

.newsletter-form input {
    flex: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 30px 0 0 30px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
}

.newsletter-form input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.newsletter-form .btn-second {
    padding: 10px 60px;
    text-decoration: none;
    border: none;
    border-radius: 30px ;
    background: linear-gradient(90deg, #4ECDC4, #44A08D);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.newsletter-form .btn-second:hover {
    background: linear-gradient(90deg, #44A08D, #4ECDC4);
}

/* Logo Section Styles */
.logo-section {
    text-align: center;
}

.main-logo {
    margin-bottom: 25px;
}

.main-logo img {
    max-width: 180px;
    height: auto;
    border-radius: 15px;
    transition: transform 0.3s;
    background: white;
    padding: 10px;
}

.main-logo img:hover {
    transform: scale(1.05);
}

.company-info {
    margin-top: 20px;
}

.company-info h4 {
    color: #ffffff;
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: 700;
}

.company-info p {
    color: #e0e0e0;
    font-size: 14px;
    margin-bottom: 8px;
}

/* Footer Bottom Styles */
.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
    text-align: center;
    color: #e0e0e0;
    font-size: 14px;
}

.footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.footer-bottom-links {
    display: flex;
    gap: 15px;
}

.footer-bottom-links a {
    color: #e0e0e0;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-bottom-links a:hover {
    color: #4ECDC4;
}

.payment-methods {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 15px 0;
}

.payment-methods svg {
    font-size: 24px;
    color: #e0e0e0;
    transition: all 0.3s;
}

.payment-methods svg:hover {
    color: #4ECDC4;
    transform: scale(1.2);
}

.developer-info {
    margin-top: 10px;
    font-size: 13px;
}

.developer-info span {
    color: #4ECDC4;
    font-weight: 600;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .footer-bottom-content {
        flex-direction: column;
        gap: 15px;
    }

    .main-logo img {
        max-width: 150px;
    }

    .newsletter-form {
        flex-direction: column;
        gap: 10px;
    }

    .newsletter-form input,
    .newsletter-form button {
        border-radius: 30px;
        width: 100%;
    }
}
</style>