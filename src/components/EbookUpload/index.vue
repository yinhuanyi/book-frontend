<template>
  <div class="upload-container">
    <!--
    <el-upload
      :action="action"                  // 指定上传到哪个接口
      :headers="headers"                // 自定义请求头
      :multiple="false"                 // 是否开启多文件上传
      :limit="1"                        // 一次上传多少个文件
      :before-upload="beforeUpload"     // 上传之前调用，可以判断文件大小和格式等
      :on-success="onSuccess"           // 上传成功调用
      :on-error="onError"               // 上传失败调用
      :on-remove="onRemove"             // 点击删除时调用
      :file-list="fileList"             // 获取上传文件的列表，当一个文件上传后，自动会在低下显示上传的文件
      :on-exceed="onExceed"             // 如果删除文件超过限制，就会被调用
      :disabled="disabled"              // 是否禁用上传
      drag                              // 是否可以拖入上传
      show-file-list                    // 是否显示文件列表
      accept="application/epub, application/zip, image/png, image/jpeg, image/jpg" // 可以上传的文件类型
      class="image-upload"              // 给一个样式
    >
     -->
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      :drag="true"
      :show-file-list="true"
      accept="application/epub+zip, application/zip, image/png, image/jpeg, image/jpg"
      class="image-upload"
    >

      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">
        将文件拖入或
        <em>点击上传</em>
      </div>

      <div v-else class="el-upload__text">图书已上传</div>

    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  props: {
    // 获取文件列表，当编辑文件之前，需要获取文件列表，那么才能在upload里面获取到已经上传的文件
    fileList: {
      type: Array,
      default: function() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },

  computed: {
    // 获取到token，如果getToken()获取的值变化了，那么headers的内容会更新
    headers: function() {
      return {
        'X-Token': `${getToken()}`
      }
    }
  },

  methods: {
    // 上传之前调用, file是一个文件的基本属性对象
    beforeUpload: function(file) {
      // console.log(file)
      // 抛出事件，让父组件可以自定义处理这个文件
      this.$emit('beforeUpload', file)
    },

    // 上传成功的时候调用
    onSuccess: function(response, file) {
      // console.log({response, file})
      // 这里的data是后台解析文件后返回的信息
      /*
      title: "Animal and the shaping"
      author: "abigail",
      language: "en"
      originalname: "2018_book_Me.epub"
      publisher: "SHANHAI"
      category: -1,
      categoryText: "",
      contents: [{},{},{}],
      cover: "https://book.yhyblog.cn/imgs/asdfadsfasdf.jpeg"
      coverPath: "/imgs/asdfadsfasdf.jpeg"
      fileName: "asdfadsfasdf"
      filePath: "/book/asdfadsfasdf.epub"
      path: "/book/asdfadsfasdf.epub"
      rootFile: "OEBPS/content.opf"
      unzipPath: "/unzip/asdfadsfasdf"  // 解压后的路径
      unzipUrl: "https://book.yhyblog.cn/unzip/asdfadsfasdf"
      url: "https://book.yhyblog.cn/book/asdfadsfasdf.epub"
      * */
      const { code, msg, data } = response
      if (code === 20000) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.$emit('onSuccess', data)
      } else { // 基本不会出现这个情况
        this.$message({
          message: (msg && `上传失败，原因：${msg}`) || '上传失败',
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },

    // 上传失败的时候调用
    onError: function(err) {
      // TODO: 如果有一个对象，你不只是什么类型，可以使用一个{}将其包裹一下，那么在浏览器就会这个对象打印出来，可以看到对象
      // console.log({err})
      const { message } = err
      // TODO：这个语法是判断语法，如果 || 前面没有表达式没有异常，那么获取前面的数据，否则获取后面的数据
      const errMsg = (message && JSON.parse(message).msg) || '上传失败'

      this.$message({
        message: `上传失败，失败原因：${errMsg}`,
        type: 'error'
      })

      // 抛出事件，让父组件可以自定义处理错误
      this.$emit('onError', err)
    },

    // 文件上传成功后，会有一个删除按钮，当点击删除按钮的时候调用
    onRemove: function() {
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.$emit('onRemove')
    },

    // 当用户传入超过limit的值，就会调用这个方法，在这个方法里面，可以给用户一些提示
    onExceed: function() {
      this.$message({
        message: '每次只能上传一个文件',
        type: 'warning'
      })
    }

  }
}
</script>

<style scoped>

</style>
