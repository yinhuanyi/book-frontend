<template>
  <!-- 这里的is-edit表示：:is-edit="true" -->
  <detail is-edit />
</template>

<script>
import detail from './components/detail'

export default {
  name: 'Edit',
  components: {
    detail: detail
  }
}
</script>

<style scoped>

</style>
