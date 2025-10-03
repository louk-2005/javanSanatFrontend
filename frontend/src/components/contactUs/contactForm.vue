<script setup>
import {ref} from "vue";
import api from "../../api/index.js";

const full_name = ref('');
const email = ref('');
const phone = ref('');
const message = ref('');
const success = ref('');
const error = ref('');

let successTimeout = null;
let errorTimeout = null;

const resetForm = () => {
    full_name.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';
};

const validateForm = () => {
    const errors = [];

    // Full name validation (max 50 chars)
    if (!full_name.value) {
        errors.push('نام کامل الزامی است');
    } else if (full_name.value.length > 50) {
        errors.push('نام کامل نباید بیشتر از ۵۰ کاراکتر باشد');
    }

    // Email validation
    if (!email.value) {
        errors.push('ایمیل الزامی است');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.push('ایمیل معتبر نیست');
    }

    // Phone validation (11 digits)
    if (phone.value && !/^\d{11}$/.test(phone.value)) {
        errors.push('شماره تماس باید دقیقاً ۱۱ رقم باشد');
    }

    // Message validation
    if (!message.value) {
        errors.push('متن پیام الزامی است');
    }

    return errors;
};

const handleMessage = async () => {
    if (successTimeout) clearTimeout(successTimeout);
    if (errorTimeout) clearTimeout(errorTimeout);

    success.value = '';
    error.value = '';

    // Client-side validation
    const clientErrors = validateForm();
    if (clientErrors.length > 0) {
        error.value = clientErrors;
        errorTimeout = setTimeout(() => (error.value = ''), 5000);
        return;
    }

    try {
        await api.post('/contactUs/communication/with/us/', {
            full_name: full_name.value,
            email: email.value,
            phone: phone.value,
            message: message.value
        });

        success.value = '✅ پیام شما با موفقیت ارسال شد.';
        resetForm();

        successTimeout = setTimeout(() => (success.value = ''), 5000);
    } catch (err) {
        // Handle server validation errors
        if (err.response?.status === 400) {
            const serverErrors = [];
            const errors = err.response.data;

            if (errors.full_name) serverErrors.push(errors.full_name[0]);
            if (errors.email) serverErrors.push(errors.email[0]);
            if (errors.phone) serverErrors.push(errors.phone[0]);
            if (errors.message) serverErrors.push(errors.message[0]);
            if (errors.non_field_errors) serverErrors.push(errors.non_field_errors[0]);

            if (serverErrors.length > 0) {
                error.value = serverErrors;
            } else {
                error.value = ['ارسال پیام با خطا مواجه شد.'];
            }
        } else {
            error.value = ['ارسال پیام با خطا مواجه شد.'];
        }

        console.error(err);
        errorTimeout = setTimeout(() => (error.value = ''), 5000);
    }
};
</script>

<template>
    <div class="form">
        <div class="form-box">
            <form @submit.prevent="handleMessage" novalidate>

                <!-- ردیف سه فیلد اول -->
                <div class="row-inputs">
                    <div class="text-input">
                        <label for="full_name">نام و نام خانوادگی*</label>
                        <input type="text" id="full_name" v-model="full_name" required/>
                    </div>

                    <div class="text-input">
                        <label for="email">ایمیل*</label>
                        <input type="email" id="email" v-model="email" required/>
                    </div>

                    <div class="text-input">
                        <label for="phone">شماره تماس*</label>
                        <input type="text" id="phone" v-model="phone" required/>
                    </div>
                </div>

                <!-- پیام زیر -->
                <div class="text-input message-input">
                    <label for="message">پیام*</label>
                    <textarea rows="10" cols="50" id="message" v-model="message" required></textarea>
                </div>

                <div class="text-input">
                    <button type="submit">ارسال پیام</button>
                </div>

                <!-- Success Message -->
                <div v-if="success" class="success-container">
                    <div class="success-message">
                        <span class="success-icon">✅</span>
                        <span>{{ success }}</span>
                    </div>
                </div>

                <!-- Error Messages -->
                <div v-if="error && Array.isArray(error)" class="error-container">
                    <div v-for="(err, index) in error" :key="index" class="error-message">
                        <span class="error-icon">❌</span>
                        <span>{{ err }}</span>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.form {
    padding: 2rem 0;
}

.form-box {
    width: 100%;
    padding: 2rem 0;
}

.row-inputs {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}

.text-input {
    margin-bottom: 1rem;
    flex: 1;
    min-width: 200px;
}

.text-input label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.text-input input,
.text-input textarea {
    width: 100%;
    font-size: 1.1rem;
    padding: .7rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

.text-input input:focus, .text-input textarea:focus {
  outline: none;
  border: 1px solid #535252;
}

.text-input textarea{
    height: 290px;
}

.message-input {
    width: 100%;
}

.text-input button {
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
    max-width: 200px;
    display: block;
    transition: background-color .3s;
}

.text-input button:hover {
    background: linear-gradient(90deg,#00f2fe, #4facfe);
}

@media (max-width: 768px) {
    .row-inputs {
        flex-direction: column;
    }
}

/* Error and Success Styles */
.error-container, .success-container {
    margin-top: 1rem;
    width: 100%;
}

.error-message, .success-message {
    padding: 0.75rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}

.error-message {
    background-color: #fff8f8;
    border: 1px solid #ffcdd2;
    color: #d32f2f;
}

.success-message {
    background-color: #f8fff8;
    border: 1px solid #c8e6c9;
    color: #388e3c;
}

.error-icon, .success-icon {
    margin-left: 0.5rem;
    font-size: 1.2rem;
}
</style>