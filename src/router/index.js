import Vue from 'vue'
import Router from 'vue-router'
// 导入组件
import Layout from '@/layout'

// 加载路由
Vue.use(Router)

// 固定路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true, // 不会展示到侧边栏
    children: [
      {
        // 这个(.*)表示匹配到后面的所有内容，不能丢
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // 这个条路由配置没hidden，会在侧边栏展示
  {
    name: 'home',
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard', // 这个为什么不是/dashboadrd
        // component可以是组件，局部注册的组件，也可以像这样简写，需要的时候再导入
        // 这个组件是dashborad导航的内容
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

// 动态路由
export const asyncRoutes = [
  {
    path: '/book',
    name: 'book',
    component: Layout,
    redirect: '/book/create',
    alwaysShow: true,
    meta: { title: '图书管理', icon: 'documentation', roles: ['admin', 'editor'] },
    children: [
      {
        name: 'create',
        path: '/book/create',
        component: () => import('@/views/book/create'),
        // affix表示tag不能被删除掉
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'], affix: true }
      },
      {
        name: 'edit',
        path: '/book/edit/:fileName',
        component: () => import('@/views/book/edit'),
        hidden: true,
        // activeMenu 的作用是：访问到edit的时候，侧边栏的图书列表显示高亮。
        // tag栏像一个数组，存储所有访问过的视图，由于<keep-alive>标签包裹了<router-view>，使得在tag上的视图都会被缓存
        meta: { title: '编辑图书', icon: 'edit', roles: ['admin'], activeMenu: '/book/list' }
      },
      {
        name: 'bookList',
        path: '/book/list',
        component: () => import('@/views/book/list'),
        meta: { title: '图书列表', icon: 'list', roles: ['editor'] }
        // hidden: true
      }
    ]
  },
  {
    name: 'test',
    path: '/test',
    component: Layout,
    meta: { title: '测试自建组件', icon: 'test' },
    children: [
      {
        name: 'sticky',
        path: '/test/sticky',
        component: () => import('@/views/components-demo/sticky'),
        meta: { title: '测试自建组件', icon: 'test' }
      }
    ]
  },
  { path: '*',
    redirect: '/404',
    hidden: true
  }
]

// 定义路由实例创建函数
const createRouter = () => new Router({
  // scrollBehavior 可以实现用户点击浏览器回退按钮的时候，会到y=0的位置，也就是顶部
  scrollBehavior: () => ({ y: 0 }),
  // 加载路由配置
  routes: constantRoutes
})

// 创建路由实例
const router = createRouter()

// Todo: 不知道干嘛
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 导出路由实例
export default router
