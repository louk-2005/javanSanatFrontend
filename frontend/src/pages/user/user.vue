<script setup>
import {ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Login from "./login/login.vue";
import Register from "./register/register.vue";

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab || 'login'); // مقدار اولیه از URL یا لاگین

// تابع برای تغییر تب و به‌روزرسانی URL
const switchTab = (tab) => {
    activeTab.value = tab;
    router.push({query: {tab}});
};

// واکنش به تغییرات URL
watch(() => route.query.tab, (newTab) => {
    if (newTab && (newTab === 'login' || newTab === 'register')) {
        activeTab.value = newTab;
    }
});
</script>

<template>
    <div class="user">
        <div class="user-box">
            <!-- Tab Navigation -->
            <div class="tabs">
                <button
                    @click="switchTab('login')"
                    :class="{ active: activeTab === 'login' }"
                >
                    ورود
                </button>
                <button
                    @click="switchTab('register')"
                    :class="{ active: activeTab === 'register' }"
                >
                    ثبت نام
                </button>
            </div>

            <!-- Form Container -->
            <div class="user-content">
                <!-- Login Form -->
                <div v-if="activeTab === 'login'" class="form-container">
                    <Login/>
                </div>

                <!-- Register Form -->
                <div v-if="activeTab === 'register'" class="form-container">
                    <Register/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    padding: 100px 20px 100px 20px;
    font-family: 'IRANSans', sans-serif;
    direction: rtl;
}

.user-box {
    width: 100%;
    max-width: 900px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 15px 30px rgba(0, 50, 100, 0.1);
    overflow: hidden;
    border: 1px solid #e0f2fe;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #bae6fd;
    background-color: #f0f9ff;
}

.tabs button {
    flex: 1;
    padding: 20px;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 600;
    color: #0c4a6e;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    font-family: 'IRANSans', sans-serif;
}

.tabs button.active {
    color: #0284c7;
    background-color: white;
}

.tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #0ea5e9, #0284c7);
    border-radius: 4px 4px 0 0;
}

.tabs button:hover:not(.active) {
    color: #0284c7;
    background-color: #e0f2fe;
}

.user-content {
    padding: 40px;
}

.form-container {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .user-box {
        max-width: 100%;
    }

    .tabs button {
        padding: 16px 12px;
        font-size: 14px;
    }

    .user-content {
        padding: 24px;
    }
}
</style>