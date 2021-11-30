<template>
  <div :class="{'has-logo':showLogo}">

    <!--  用来控制导航的logo显示和隐藏  -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!--  导航栏外面有个滚动组件，当菜单越来越多，就会出现滚动条  -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 在满足权限条件下，将permission_routes是constroute和asyncroute的合并，route是合并后的每一个路由 -->
        <!--  -->
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),

    activeMenu() {
      // 获取路由配置
      const route = this.$route
      // 从路由配置中，提取当前路由的meta和path信息
      const { meta, path } = route

      // 这个好像在meta中没有设置
      if (meta.activeMenu) {
        return meta.activeMenu
      }

      // 返回path，意思是<el-menu-item>组件的index是path字符串标识的
      return path
    },

    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.$store.getters.sidebar.opened
      // return !this.sidebar.opened
    }
  }
}
</script>
