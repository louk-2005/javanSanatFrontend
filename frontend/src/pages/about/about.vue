<script setup>
import {ref} from 'vue';

const teamMembers = ref([
    {
        name: "سارا احمدی",
        position: "مدیرعامل",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "رضا محمدی",
        position: "مدیر فنی",
        image: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "مریم رضایی",
        position: "مدیر بازاریابی",
        image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "علی حسینی",
        position: "مدیر مالی",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    }
]);

const milestones = ref([
    {year: "2010", title: "تأسیس شرکت", description: "آغاز فعالیت با ۳ نفر founding team"},
    {year: "2015", title: "رشد سریع", description: "رسیدن به ۱۰۰ کارمند و ۵۰۰ مشتری"},
    {year: "2018", title: "بین‌المللی شدن", description: "افتتاح اولین شعبه خارج از کشور"},
    {year: "2023", title: "رهبر بازار", description: "تبدیل شدن به بزرگترین شرکت در صنعت خود"}
]);

const stats = ref([
    {value: "500+", label: "مشتریان راضی"},
    {value: "150+", label: "پرسنل متخصص"},
    {value: "12", label: "سال سابقه فعالیت"},
    {value: "98%", label: "رضایت مشتریان"}
]);
</script>

<template>
    <div class="about">
        <div class="about-box">
            <div class="about-content">
                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="hero-content">
                        <h1 class="hero-title">درباره شرکت ما</h1>
                        <p class="hero-subtitle">رهبری نوآورانه در صنعت با تمرکز بر کیفیت و رضایت مشتری</p>
                        <p class="hero-description">
                            صنعت جوانان با هدف شکوفایی استعدادها و توانایی‌های نسل جدید شکل گرفته است. ما باور داریم که
                            جوانان موتور محرک پیشرفت و نوآوری در جامعه هستند و می‌توانند با ایده‌های خلاقانه و انرژی
                            بی‌پایان خود آینده‌ای روشن برای صنعت و اقتصاد کشور رقم بزنند. در صنعت جوانان تلاش می‌کنیم تا
                            پلی میان استعدادهای جوان و نیازهای واقعی بازار کار و صنعت ایجاد کنیم. ما فضایی پویا برای
                            یادگیری، تجربه و همکاری فراهم آورده‌ایم تا نسل جوان بتواند با بهره‌گیری از آموزش‌های تخصصی،
                            فناوری‌های نوین و کار تیمی، مسیر موفقیت خود را بسازد.
                        </p>
                    </div>
                    <div class="hero-image">
                        <img
                            src="../../assets/aboutUs/Copilot_20250930_200936_1f0b2CB.webp"
                            alt="درباره ما">
                    </div>
                </section>

                <!-- Mission & Vision -->
                <section class="mission-vision">
                    <div class="mission">
                        <div class="icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h2>مأموریت ما</h2>
                        <p>
                            ارائه راهکارهای نوآورانه و پایدار برای بهینه‌سازی فرآیندهای کسب‌وکار با استفاده از
                            آخرین فناوری‌ها و بهترین متخصصان صنعت.
                        </p>
                    </div>
                    <div class="vision">
                        <div class="icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </div>
                        <h2>چشم‌انداز ما</h2>
                        <p>
                            تبدیل شدن به مرجع اصلی و مورد اعتماد در ارائه راهکارهای دیجیتال در سطح ملی و بین‌المللی
                            با تأکید بر کیفیت و نوآوری مستمر.
                        </p>
                    </div>
                </section>

                <!-- Core Values -->
                <section class="core-values">
                    <h2 class="section-title">ارزش‌های اصلی ما</h2>
                    <div class="values-grid">
                        <div class="value-card">
                            <div class="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3>نوآوری</h3>
                            <p>همواره در جستجوی راه‌های جدید و بهتر برای حل مشکلات</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <h3>اعتماد</h3>
                            <p>پایه‌گذاری روابط بر اساس صداقت و شفافیت</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            <h3>تیم‌محوری</h3>
                            <p>باور به قدرت همکاری و کار گروهی</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </div>
                            <h3>مشتری‌محوری</h3>
                            <p>تمرکز بر نیازها و رضایت مشتریان</p>
                        </div>
                    </div>
                </section>

                <!-- Team Section -->
<!--                <section class="team-section">-->
<!--                    <h2 class="section-title">تیم متخصص ما</h2>-->
<!--                    <p class="team-intro">-->
<!--                        تیم ما از متخصصان باتجربه و خلاق تشکیل شده که با اشتیاق به کار خود، بهترین نتایج را برای مشتریان-->
<!--                        خلق می‌کنند.-->
<!--                    </p>-->
<!--                    <div class="team-grid">-->
<!--                        <div v-for="(member, index) in teamMembers" :key="index" class="team-member">-->
<!--                            <div class="member-image">-->
<!--                                <img :src="member.image" :alt="member.name">-->
<!--                            </div>-->
<!--                            <h3>{{ member.name }}</h3>-->
<!--                            <p class="member-position">{{ member.position }}</p>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </section>-->

                <!-- CTA -->
                <section class="cta-section">
                    <h2>آماده همکاری هستید؟</h2>
                    <p>با ما تماس بگیرید تا بهترین راهکارها را برای کسب‌وکار شما ارائه دهیم</p>
                    <router-link to="/contact" class="cta-button">تماس با ما</router-link>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
.about {
    font-family: 'IRANSans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    line-height: 1.6;
    direction: rtl;
}

.about-box {
    max-width: 1400px;
    margin: 0 auto;
    padding: 100px 20px;
}

.about-content {
    padding: 40px 0;
}

/* Hero Section */
.hero-section {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 80px;
}

.hero-content {
    flex: 1;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: #1a365d;
    margin-bottom: 20px;
}

.hero-subtitle {
    font-size: 1.5rem;
    color: #4a5568;
    margin-bottom: 20px;
}

.hero-description {
    font-size: 1.1rem;
    color: #718096;
    max-width: 600px;
}

.hero-image {
    flex: 1;
    border-radius: 12px;
    overflow: hidden;
    max-height: 500px;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.hero-image img {
    width: 100%;
    height: auto;
    display: block;
}

/* Mission & Vision */
.mission-vision {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 80px;
}

.mission, .vision {
    background: #f8fafc;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
}

.mission:hover, .vision:hover {
    transform: translateY(-5px);
}

.icon-container {
    background: #e2e8f0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: #2d3748;
}

.mission h2, .vision h2 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: #2d3748;
}

.mission p, .vision p {
    color: #4a5568;
    font-size: 1.1rem;
}

/* Core Values */
.core-values {
    margin-bottom: 80px;
}

.section-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 50px;
    color: #1a365d;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.value-card {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: all 0.3s ease;
}

.value-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.value-icon {
    background: #ebf8ff;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: #3182ce;
}

.value-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #2d3748;
}

.value-card p {
    color: #718096;
}

/* Team Section */
.team-section {
    margin-bottom: 80px;
}

.team-intro {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 50px;
    color: #4a5568;
    font-size: 1.1rem;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.team-member {
    text-align: center;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
}

.team-member:hover {
    transform: translateY(-10px);
}

.member-image {
    height: 250px;
    overflow: hidden;
}

.member-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.team-member:hover .member-image img {
    transform: scale(1.05);
}

.team-member h3 {
    margin: 20px 0 10px;
    font-size: 1.4rem;
    color: #2d3748;
}

.member-position {
    color: #718096;
    margin-bottom: 20px;
    font-weight: 500;
}

/* Timeline */
.timeline-section {
    margin-bottom: 80px;
}

.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

.timeline::before {
    content: '';
    position: absolute;
    width: 4px;
    background: #e2e8f0;
    top: 0;
    bottom: 0;
    right: 50%;
    margin-right: -2px;
}

.timeline-item {
    padding: 10px 40px;
    position: relative;
    width: 50%;
}

.timeline-item::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border: 4px solid #3182ce;
    top: 15px;
    border-radius: 50%;
    z-index: 1;
}

.timeline-item:nth-child(odd) {
    right: 0;
}

.timeline-item:nth-child(even) {
    left: 0;
}

.timeline-item:nth-child(odd)::after {
    right: -10px;
}

.timeline-item:nth-child(even)::after {
    left: -10px;
}

.timeline-content {
    padding: 20px 30px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.timeline-year {
    display: inline-block;
    background: #3182ce;
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}

.timeline-content h3 {
    margin-bottom: 10px;
    color: #2d3748;
}

/* Stats */
.stats-section {
    background: linear-gradient(135deg, #1a365d, #2c5282);
    border-radius: 12px;
    padding: 60px 40px;
    margin-bottom: 80px;
    color: white;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    text-align: center;
}

.stat-value {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 10px;
}

.stat-label {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* CTA */
.cta-section {
    text-align: center;
    padding: 60px 0;
    background: #f8fafc;
    border-radius: 12px;
}

.cta-section h2 {
    font-size: 2.2rem;
    margin-bottom: 20px;
    color: #1a365d;
}

.cta-section p {
    font-size: 1.2rem;
    color: #4a5568;
    max-width: 600px;
    margin: 0 auto 30px;
}

.cta-button {
    background: #3182ce;
    color: white;
    text-decoration: none;
    border: none;
    padding: 15px 40px;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.cta-button:hover {
    background: #2c5282;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(49, 130, 206, 0.3);
}

/* Responsive */
@media (max-width: 992px) {
    .hero-section {
        flex-direction: column;
    }

    .mission-vision {
        grid-template-columns: 1fr;
    }

    .timeline::before {
        right: 20px;
    }

    .timeline-item {
        width: 100%;
        padding-left: 70px;
        padding-right: 25px;
    }

    .timeline-item::after {
        right: 10px;
    }

    .timeline-item:nth-child(even) {
        left: 0;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.2rem;
    }

    .hero-subtitle {
        font-size: 1.2rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .stats-section {
        padding: 40px 20px;
    }

    .stat-value {
        font-size: 2.2rem;
    }
}
</style>