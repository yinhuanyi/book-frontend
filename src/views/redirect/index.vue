<script>
export default {
  created() {
    // 获取params和query，params:/redirect/book/list, query: a=1&b=2
    const { params, query } = this.$route
    // path是动态路由匹配到的，就是path:book/list
    const { path } = params
    // 手动跳转，history不记录到/redirect/book/list中
    this.$router.replace({ path: '/' + path, query })
  },
  // 这个render方法基本没有用，主要是避免跳转错误用的
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
