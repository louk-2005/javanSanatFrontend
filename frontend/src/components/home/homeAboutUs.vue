<script setup>
// No script needed for static content
</script>

<template>
    <div class="about">
        <div class="about-box">
            <div class="about-content">
                <div class="about-summary">
                    <h2 class="about-title">درباره ما</h2>
                    <p class="about-text">
                        صنعت جوانان با هدف شکوفایی استعدادها و توانایی‌های نسل جدید شکل گرفته است. ما باور داریم که
                        جوانان موتور محرک پیشرفت و نوآوری در جامعه هستند و می‌توانند با ایده‌های خلاقانه و انرژی
                        بی‌پایان خود آینده‌ای روشن برای صنعت و اقتصاد کشور رقم بزنند.
                        در صنعت جوانان تلاش می‌کنیم تا پلی میان استعدادهای جوان و نیازهای واقعی بازار کار و صنعت ایجاد
                        کنیم. ما فضایی پویا برای یادگیری، تجربه و همکاری فراهم آورده‌ایم تا نسل جوان بتواند با بهره‌گیری
                        از آموزش‌های تخصصی، فناوری‌های نوین و کار تیمی، مسیر موفقیت خود را بسازد...
                    </p>
                    <router-link to="/about" class="cta-button">مشاهده بیشتر</router-link>
                </div>
                <div class="about-image">
                    <img
                        src="../../assets/aboutUs/Copilot_20250930_194559.png"
                        alt="Professional headshot"
                        class="profile-image"
                    >
                    <div class="image-decoration"></div>
                    <div class="floating-shapes">
                        <div class="shape shape-1"></div>
                        <div class="shape shape-2"></div>
                        <div class="shape shape-3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.about {
    padding: 80px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    position: relative;
    overflow: hidden;
}

.about::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%);
    border-radius: 50%;
    z-index: 0;
    animation: pulse 8s infinite alternate;
}

.about-box {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.about-content {
    display: flex;
    align-items: center;
    gap: 60px;
    flex-wrap: wrap;
    animation: fadeInUp 1s ease-out;
}

.about-summary {
    flex: 1;
    min-width: 300px;
    animation: slideInLeft 1s ease-out;
    animation-fill-mode: both;
}

.about-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 15px;
    animation: fadeIn 1.2s ease-out;
    animation-fill-mode: both;
}

.about-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 4px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    border-radius: 2px;
    animation: expandWidth 1.5s ease-out 0.5s forwards;
}

.about-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #475569;
    margin-bottom: 30px;
    animation: fadeIn 1.5s ease-out 0.3s;
    animation-fill-mode: both;
    opacity: 0;
}

.cta-button {
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    color: white;
    border: none;
    padding: 14px 32px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    position: relative;
    overflow: hidden;
    animation: fadeInUp 1.8s ease-out 0.6s;
    animation-fill-mode: both;
    z-index: 1;
}

.cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: left 0.5s ease;
    z-index: -1;
}

.cta-button:hover::before {
    left: 0;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.about-image {
    flex: 1;
    min-width: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    animation: slideInRight 1s ease-out;
    animation-fill-mode: both;
}

.profile-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 2;
    transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.about-image:hover .profile-image {
    transform: scale(1.03);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.image-decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: 400px;
    border: 4px solid #00F2FEFF;
    border-radius: 20px;
    top: 20px;
    left: 40px;
    z-index: 1;
    transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.about-image:hover .image-decoration {
    transform: translate(10px, 10px);
    box-shadow: 0 15px 30px rgba(0, 242, 254, 0.3);
}

.floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 0;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2));
}

.shape-1 {
    width: 80px;
    height: 80px;
    top: 10%;
    right: 5%;
    animation: float 6s ease-in-out infinite;
}

.shape-2 {
    width: 60px;
    height: 60px;
    bottom: 15%;
    left: 10%;
    animation: float 8s ease-in-out infinite 1s;
}

.shape-3 {
    width: 40px;
    height: 40px;
    top: 40%;
    right: 15%;
    animation: float 7s ease-in-out infinite 2s;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
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

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes expandWidth {
    from {
        width: 0;
    }
    to {
        width: 80px;
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.2;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.3;
    }
    100% {
        transform: scale(1);
        opacity: 0.2;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .about-content {
        flex-direction: column;
        text-align: center;
    }

    .about-title {
        font-size: 2rem;
    }

    .about-title::after {
        left: 50%;
        transform: translateX(-50%);
    }

    .about-highlights {
        justify-content: center;
    }

    .image-decoration {
        display: none;
    }

    .floating-shapes {
        display: none;
    }
}

@media (max-width: 480px) {
    .about {
        padding: 60px 15px;
    }

    .about-title {
        font-size: 1.8rem;
    }

    .about-text {
        font-size: 1rem;
    }

    .highlight-number {
        font-size: 1.5rem;
    }
}
</style>