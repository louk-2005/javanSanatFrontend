import { createRouter, createWebHistory } from "vue-router"

const Home = () => import("../pages/home/home.vue")
const About = () => import("../pages/about/about.vue")
const ContactUs = () => import("../pages/contactUs/contactUs.vue")
const User = () => import("../pages/user/user.vue")




const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/about", name: "About", component: About },
    { path: "/contact", name: "ContactUs", component: ContactUs },
    { path: "/user", name: "User", component: User },


]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    }
})

export default router