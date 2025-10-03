// store/auth.js
import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  mutations: {
    SET_AUTH(state, { user, tokens }) {
      state.isAuthenticated = true;
      state.user = user;
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user)); // ذخیره کامل کاربر
    },
    CLEAR_AUTH(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        // axios بدون interceptor برای جلوگیری از logout اشتباه
        const apiNoInterceptor = axios.create({
          baseURL: 'http://localhost:8000/api/v1/',
          headers: { 'Content-Type': 'application/json' }
        });

        // گرفتن توکن
        const response = await apiNoInterceptor.post('/token/', credentials);

        // گرفتن اطلاعات کامل کاربر
        const userRes = await apiNoInterceptor.get('accounts/users/profile/', {
          headers: { Authorization: `Bearer ${response.data.access}` }
        });

        // ذخیره توکن و اطلاعات کاربر در state و localStorage
        commit('SET_AUTH', {
          user: userRes.data,
          tokens: response.data
        });

        return true;
      } catch (error) {
        commit('CLEAR_AUTH');
        throw error;
      }
    },

    logout({ commit }) {
      commit('CLEAR_AUTH');
    },

    // بازیابی کاربر بعد از رفرش
    async fetchUser({ commit }) {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return null;

      try {
        const apiNoInterceptor = axios.create({
          baseURL: 'http://localhost:8000/api/v1/',
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const userRes = await apiNoInterceptor.get('accounts/users/profile/');
        commit('SET_USER', userRes.data);
        return userRes.data;
      } catch (error) {
        commit('CLEAR_AUTH');
        return null;
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    isAdmin: state =>
      state.user?.role === 'SUPER_ADMIN' || state.user?.role === 'COMPANY_ADMIN'
  }
});