<template>

  <!-- 如果item.hidden为true, 那么这个菜单就不会展示，item属性是$route，在router/index.js -->
  <div v-if="!item.hidden">
    <!-- 下面是判断只展示子路由到侧边栏，只显示template  -->
    <!--  下面的template和el-submenu是互斥的，只能显示一个  -->
    <!--  v-if的条件判断：hasOneShowingChild
            1：如果路由配置没有children和redirect：那么将当前路由配置作为一个el-menu-item显示
            2：如果路由配置只有一个children：那么将当前children路由配置作为一个el-menu-item显示
            3：如果路由配置有多个children：那么将当前多个children路由配置作为多个el-menu-item显示
    -->
    <!--  !onlyOneChild.children||onlyOneChild.noShowingChildren：如果子路由没有children返回 true  -->
    <!-- item.alwaysShow 如果路由配置了alwaysShow 返回false -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!-- app-link是在子路由有meta的时候进行展示， 如果子路由路径是a链接，那么显示a标签，如果不是显示router-link组件  -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <!--这是每一个菜单-->
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 下面是既展示路由也展示子路由到侧边栏，显示el-submenu   -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 这里又调用了自己 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>

  </div>

</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // 这个item是从父组件el-menu中传递过来的$route
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 默认children为空，parent是item
    hasOneShowingChild(children = [], parent) {
      // filter过滤children数组
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })

      // 当只有一个子路由不是hidden，那么返回ture
      if (showingChildren.length === 1) {
        return true
      }

      // 当所有的子路由是hidden，那么返回parent
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      // 如果有两个以上的children不是hidden，返回false，说明children都要显示
      return false
    },
    // routePath是子路由的path，
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
