import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main/index'
import Menu from '@/components/Menu'

import map3d from '@/components/map/3dmap'
//运维管理
import BMguanli from '@/components/manager/BMguanli'
import JSguanli from '@/components/manager/JSguanli'


import Form from '@/components/Form'
import NotFoundComponent from '@/views/404'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/yangzhou',
    routes: [{
            path: '*',
            component: NotFoundComponent
        }, {
            path: '/',
            redirect: '/login',
            hidden: true
        },
        {
            path: '/login',
            name: '登录页面',
            hidden: true,
            component: resolve => require(['../views/login/Login.vue'], resolve)
        }, {
            path: '/Main',
            name: '首页',
            hidden: true,
            component: resolve => require(['../views/Home/Home.vue'], resolve),
            children: [{
                name: 'Main',
                path: '/',
                meta: { title: 'Readme', icon: 'el-icon-menu' },
                component: Main
            }]
        }, {
            path: '/3Dmap',
            name: '三维场景',
            hidden: true,
            component: resolve => require(['../views/Home/Home.vue'], resolve),
            children: [{
                name: 'Main',
                path: '/',
                meta: { title: 'Readme', icon: 'el-icon-menu' },
                component: map3d
            }]
        }, {
            path: '/BMguanli',
            name: '组织管理',
            hidden: true,
            component: resolve => require(['../views/Home/Home.vue'], resolve),
            children: [{
                name: 'BMguanli',
                path: '/',
                meta: { title: 'BMguanli', icon: 'el-icon-menu' },
                component: BMguanli
            }]
        }, {
            path: '/JSguanli',
            name: '角色管理',
            hidden: true,
            component: resolve => require(['../views/Home/Home.vue'], resolve),
            children: [{
                name: 'JSguanli',
                path: '/',
                meta: { title: 'JSguanli', icon: 'el-icon-menu' },
                component: JSguanli
            }]
        }
    ]
})