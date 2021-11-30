<template>

  <div :class="classObj" class="app-wrapper">
    <!-- 这里是判断，如果访问设备是mobile，且打开了sidebar，显示这个遮罩层 -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!--  侧边栏  -->
    <sidebar class="sidebar-container" />
    <!-- 右边栏 -->
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <!-- 1：导航和标签 -->
      <div :class="{'fixed-header':fixedHeader}">
        <!-- 1.1：面包屑 -->
        <navbar />
        <!-- 1.2：菜单tag -->
        <tags-view v-if="needTagsView" />
      </div>
      <!-- 2：内容-->
      <app-main />
      <!-- 3：设置面板 -->
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>

  </div>

</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    // 用户自定义组件
    AppMain,
    // 面包屑组件
    Navbar,
    // 设置面板组件
    RightPanel,
    // 设置组件
    Settings,
    // 侧边栏组件
    Sidebar,
    // 标签组件
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    // 当在sidebar外面点击了遮罩层，那么会直接调用Vuex中的closeSideBar方法，关闭sidebar
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>

  @import "~@/styles/mixin.scss";
  // 导入自定义css变量
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix; // 加载~@/styles/mixin.scss文件中的clearfix样式
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #fd0707;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
