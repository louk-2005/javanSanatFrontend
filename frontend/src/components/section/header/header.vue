<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const isMenuOpen = ref(false);

const navigationItems = [
    {name: 'خانه', path: '/'},
    {name: 'درباره ما', path: '/about'},
    {name: 'مقالات', path: '/articles'},
    {name: 'ویدیو کست‌ها', path: '/podcasts'},
    {name: 'دوره‌ها', path: '/courses'},
    {name: 'گردشگری صنعتی', path: '/industrial-tourism'},
    {name: 'ارتباط با ما', path: '/contact'},
];

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({path: '/search', query: {q: searchQuery.value}});
        searchQuery.value = '';
    }
};

const toggleMobileMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
    <header class="header">
        <div class="header-container">
            <!-- Logo -->
            <div class="logo-container">
                <div class="logo">
                    <span class="logo-text">جوان صنعت</span>
                </div>
            </div>

            <!-- Desktop Navigation -->
            <nav class="desktop-nav">
                <ul class="nav-links">
                    <li v-for="item in navigationItems" :key="item.name">
                        <router-link :to="item.path">{{ item.name }}</router-link>
                    </li>
                </ul>
            </nav>

            <!-- Search Bar -->
            <div class="search-container">
                <div class="search-box">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="جستجو در سایت..."
                        @keyup.enter="handleSearch"
                    />
                    <button @click="handleSearch">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" @click="toggleMobileMenu">
                <div class="hamburger-icon" :class="{ 'open': isMenuOpen }">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
        </div>

        <!-- Mobile Navigation -->
        <transition name="mobile-menu">
            <div v-if="isMenuOpen" class="mobile-nav">
                <ul class="mobile-nav-links">
                    <li v-for="item in navigationItems" :key="item.name">
                        <router-link :to="item.path" @click="isMenuOpen = false">{{ item.name }}</router-link>
                    </li>
                </ul>
                <div class="mobile-search">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="جستجو در سایت..."
                        @keyup.enter="handleSearch"
                    />
                    <button @click="handleSearch">جستجو</button>
                </div>
            </div>
        </transition>
    </header>
</template>

<style scoped>
.header {
    background: linear-gradient(135deg, #1a2a6c, #2c3e50);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
}

.header-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
}

.logo-container {
    flex: 0 0 200px;
}

.logo {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1.5rem;
}

.logo-text {
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: 1.8rem;
    font-weight: 800;
}

.desktop-nav {
    flex: 1;
    display: flex;
    justify-content: center;
}

.nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1.5rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-links a:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    transition: width 0.3s ease;
}

.nav-links a:hover::after {
    width: 100%;
}

.search-container {
    flex: 0 0 300px;
}

.search-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    padding: 0.5rem 1rem;
    backdrop-filter: blur(10px);
}

.search-box input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    outline: none;
    font-size: 0.9rem;
}

.search-box input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search-box button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mobile-menu-btn {
    display: none;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
}

/* Hamburger Icon Animation */
.hamburger-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 18px;
}

.hamburger-icon span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.hamburger-icon.open span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
}

.hamburger-icon.open span:nth-child(2) {
    opacity: 0;
}

.hamburger-icon.open span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
}

.mobile-nav {
    display: none;
    background: rgba(26, 42, 108, 0.95);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-nav-links {
    list-style: none;
    margin: 0 0 1.5rem 0;
    padding: 0;
}

.mobile-nav-links li {
    margin-bottom: 0.75rem;
}

.mobile-nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.mobile-nav-links a:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.mobile-search {
    display: flex;
    gap: 0.5rem;
}

.mobile-search input {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    color: white;
    outline: none;
}

.mobile-search input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.mobile-search button {
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    padding: .3rem 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.mobile-search button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(79, 172, 254, 0.3);
}

/* Mobile Menu Animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
    transition: all 0.4s ease;
    max-height: 500px;
    opacity: 1;
    overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .search-container {
        flex: 0 0 250px;
    }

    .nav-links {
        gap: 1rem;
    }
}

@media (max-width: 768px) {
    .header-container {
        height: 70px;
    }

    .logo-text {
        font-size: 1.5rem;
    }

    .desktop-nav {
        display: none;
    }

    .search-container {
        display: none;
    }

    .mobile-menu-btn {
        display: block;
    }

    .mobile-nav {
        display: block;
    }
}

@media (max-width: 480px) {
    .header {
        padding: 0 1rem;
    }

    .logo-container {
        flex: 0 0 150px;
    }

    .mobile-search {
        flex-direction: column;
    }

    .mobile-search button {
        width: 100%;
    }
}
</style>