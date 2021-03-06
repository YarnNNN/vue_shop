import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
// import Users from '../components/user/Users'

// import Rights from '../components/power/Rights'
// import Report from '../components/Report/Report'


// import Login from '../components/Login.vue'
const Login = () =>
    import ('../components/Login.vue')

// import Home from '../components/Home'
const Home = () =>
    import ('../components/Home')

// import Welcome from '../components/Welcome'
const Welcome = () =>
    import ('../components/Welcome')

// import Users from '../components/user/Users'
const Users = () =>
    import ('../components/user/Users')

// import Rights from '../components/power/Rights'
const Rights = () =>
    import ('../components/power/Rights')

// import Report from '../components/Report/Report'
const Report = () =>
    import ('../components/Report/Report')

const Roles = () =>
    import ('../components/power/Roles')

const Cate = () =>
    import ('../components/goods/Cate')


Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/reports', component: Report },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/reports', component: Report },
            { path: '/categories', component: Cate },
        ]
    }

]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login')
        return next();

    //获取token
    const tokenStr = window.sessionStorage.getItem('token');

    if (!tokenStr)
        return next('/login');

    next();

})

export default router