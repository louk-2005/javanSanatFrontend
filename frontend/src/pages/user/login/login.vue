<script setup>
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import api from "../../../api/index.js";

const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
    username: '',
    password: '',
    remember: false
});


const handleLogin = async () => {
    // Reset error state
    errorMessage.value = '';
    isLoading.value = true;

    try {
        // Use Vuex action for login
        await store.dispatch('login', {
            username: form.value.username,
            password: form.value.password
        });

        // Successful login
        console.log('Login successful');





        const user = computed(() => store.getters.user);
        const isAuthenticated = computed(() => store.getters.isAuthenticated);

        console.log('Is authenticated:', isAuthenticated.value);
        console.log('Logged-in user:', user.value);





        // Redirect to dashboard or home page
        router.push('/');
    } catch (error) {
        if (error.response && error.response.status === 401) {
            errorMessage.value = 'نام کاربری یا رمز عبور اشتباه است';
        } else {
            errorMessage.value = 'خطا در اتصال به سرور. لطفاً دوباره تلاش کنید';
        }
        console.error('Login error:', error);
    } finally {
        isLoading.value = false;
    }
};

const socialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
    // For example: window.location.href = `/api/auth/${provider}`;
};
</script>

<template>
    <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-header">
            <h2>ورود به حساب کاربری</h2>
            <div class="header-line"></div>
        </div>

        <div class="form-group">
            <label for="username">نام کاربری یا ایمیل</label>
            <input
                id="username"
                v-model="form.username"
                type="text"
                required
                placeholder="نام کاربری یا ایمیل خود را وارد کنید"
            />
        </div>

        <div class="form-group">
            <label for="password">رمز عبور</label>
            <input
                id="password"
                v-model="form.password"
                type="password"
                required
                placeholder="رمز عبور خود را وارد کنید"
            />
        </div>

        <div class="form-options">
            <label class="remember-me">
                <input type="checkbox" v-model="form.remember"/>
                مرا به خاطر بسپار
            </label>
            <a href="#" class="forgot-password">رمز عبور را فراموش کرده‌ام؟</a>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'در حال ورود...' : 'ورود' }}
        </button>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
    </form>
</template>


<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    border-radius: 12px;
}

.form-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
}

h2 {
    color: #0c4a6e;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    text-align: center;
    font-family: 'IRANSans', sans-serif;
}

.header-line {
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #0ea5e9, #0284c7);
    border-radius: 2px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

label {
    font-weight: 600;
    color: #0c4a6e;
    font-size: 14px;
    font-family: 'IRANSans', sans-serif;
}

input {
    padding: 14px 16px;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s ease;
    background-color: #f0f9ff;
    font-family: 'IRANSans', sans-serif;
}

input:focus {
    border-color: #0284c7;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

input::placeholder {
    color: #7dd3fc;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 14px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #0c4a6e;
    cursor: pointer;
    font-family: 'IRANSans', sans-serif;
}

.forgot-password {
    color: #0284c7;
    text-decoration: none;
    font-family: 'IRANSans', sans-serif;
}

.forgot-password:hover {
    text-decoration: underline;
}

.submit-btn {
    padding: 16px 24px;
    background: linear-gradient(90deg, #0ea5e9, #0284c7);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    font-family: 'IRANSans', sans-serif;
    box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2);
}

.submit-btn:hover:not(:disabled) {
    background: linear-gradient(90deg, #0284c7, #0c4a6e);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(2, 132, 199, 0.3);
}

.submit-btn:disabled {
    background: linear-gradient(90deg, #7dd3fc, #38bdf8);
    cursor: not-allowed;
    box-shadow: none;
}

.error-message {
    color: #e11d48;
    font-size: 14px;
    text-align: center;
    padding: 16px;
    background-color: #fef2f2;
    border-radius: 8px;
    margin-top: 20px;
    border: 1px solid #fecaca;
    font-family: 'IRANSans', sans-serif;
    font-weight: 500;
}

.divider {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #0284c7;
    font-size: 14px;
    margin: 20px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #bae6fd;
}

.social-login {
    display: flex;
    gap: 12px;
}

.social-btn {
    flex: 1;
    padding: 12px;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    background: #f0f9ff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
    font-weight: 500;
    font-family: 'IRANSans', sans-serif;
}

.social-btn:hover {
    background-color: #e0f2fe;
    border-color: #0ea5e9;
    transform: translateY(-2px);
}

.google {
    color: #0284c7;
}

.facebook {
    color: #0c4a6e;
}
</style>