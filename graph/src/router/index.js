import Vue from 'vue'
import Router from 'vue-router'
import test from '@/components/test'
import index from '@/components/index'
import graph from '@/components/graph'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: test
    },
    {
      path: '/graph',
      name: 'test',
      component: graph
    },
    {
      path: '/index',
      name: 'paper',
      component: index
    },
  ]
})
