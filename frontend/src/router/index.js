import { createRouter, createWebHistory } from "vue-router"

const Home = () => import("../pages/home/home.vue")




const routes = [
    { path: "/", name: "Home", component: Home },



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