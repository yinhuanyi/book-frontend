<template>
  <detail :is-edit="false" />
</template>

<script>
import detail from './components/detail'
export default {
  name: 'Create',
  components: {
    detail: detail
  }
}

</script>

<style scoped>

</style>
