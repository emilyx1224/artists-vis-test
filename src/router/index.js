import Vue from 'vue'
import Router from 'vue-router'
import menus from '@/config/menu-config'

Vue.use(Router)

var routes = []

menus.forEach((item) => {
  if (item.id == 'color') {
    routes.push({
      path: `/`,
      name: item.name,
      component: () => import(`@/components/${item.componentName}`)
    })
  }
  routes.push({
    path: `/${item.id}`,
    name: item.name,
    component: () => import(`@/components/${item.componentName}`)
  })
})

// const router = new Router({
//   mode: 'history',
//   routes: routes
// })

export default new Router({
  routes
})

// export default router