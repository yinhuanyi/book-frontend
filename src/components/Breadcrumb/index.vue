<template>
  <!-- 导航容器：分隔符为/ -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <!-- 循环遍历 -->
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">

        <!-- 最后一个匹配到的路由不需要链接跳转 -->
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!-- 如果需要导航，使用的是a标签跳转路由 -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>

      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    // 监听当前路由，当this.$route变化的时候，会调用getBreadcrumb方法，重新计算levelList的数据
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  // 组件创建后调用getBreadcrumb方法，初始化levelList变量
  created() {
    this.getBreadcrumb()
  },
  methods: {
    // 生成levelList的数据
    getBreadcrumb() {
      // this.$route.matched 表示匹配到的路由，对匹配到的路由进行过滤, 过滤的条件是【有meta且meta中有title】
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // 获取第一个匹配
      const first = matched[0]
      // 如果第一项匹配到的路由不是dashboard，那么直接加上一个dashborad到最前面
      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }
      // 最后再次过滤matched数组，再次确定每个路由都有meta、meta.title、item.meta.breadcrumb===true
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    // 判断route是否是dashboard
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    // 这个方法保证了最后跳转的路径是完整的
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },

    // 如果点击了某个面包屑，那么就跳转
    handleLink(item) {
      // 取出路由中的redirect，和path
      const { redirect, path } = item
      // 如果redirect存在，直接跳转
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      // 如果redirect不存在，跳转到path路径
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
