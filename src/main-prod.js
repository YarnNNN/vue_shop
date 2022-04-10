import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'


import './assets/fonts/iconfont.css'

import './assets/css/global.css'

import axios from 'axios'

// 进度条 request展示 response 隐藏
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'


axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // 显示进度条
    NProgress.start()
        //为请求头对象，添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

axios.interceptors.response.use(config => {
    //隐藏进度条
    NProgress.done()
    return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')