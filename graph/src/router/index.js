import Vue from 'vue'
import Router from 'vue-router'
import test from '@/components/test'
import index from '@/components/index'
import paper from '@/components/paper'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: test
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/paper',
      name: 'paper',
      component: paper
    }


  ]
})
