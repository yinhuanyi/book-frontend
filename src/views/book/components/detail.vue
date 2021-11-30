<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <!--
      navbar+tagview==fix-header 高度是84px
      那么components-container相对定位10px,那么sticky组件是绝对定位，距离底部应该是94px
      只有当sticky的top为94，才能保证components-container随着滚动条向上过程中，sticky不会跳动
      -->
    <div class="components-container">
      <!-- sticky组件是用于吸顶的，90绝对定位，距离浏览器底部90 -->
      <!--
      sticky组件的class-name是一个属性，如果直接写class，会直接绑定到sticky组件的根元素，
      但是这里并不是把样式绑定到子组件的根元素，而是其他元素，所以这里使用class-name，作为一个属性传递到子组件
      -->
      <sticky :sticky-top="94" class-name="sub-navbar">
        <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
        <el-button
          v-loading="loading"
          type="success"
          style="margin-left: 10px;"
          @click="submitForm"
        >
          {{ isEdit ? '编辑电子书' : '保存' }}
        </el-button>
      </sticky>
    </div>

    <!-- 下面是表单容器 -->
    <div class="detail-container">
      <el-row>
        <warning />
        <!-- 撑满整个宽度24份 -->
        <el-col :span="24">
          <!--
            自己封装的组件
           :file-list="fileList"          // 显示已经上传的列表
            :disabled="isEdit"            // 如果是编辑状态，上传被禁用
            @onSuccess="onUploadSuccess"  // 监听子组件的onSuccess事件
            @onRemove="onUploadError"     // 监听子组件的onUploadError事件
           -->
          <ebook-upload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>

        <el-col :span="24">

          <!-- 文件名称 -->
          <el-row>
            <el-form-item prop="title">
              <!-- 这里使用一个vue-element-admin封装的组件 -->
              <md-input
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                :required="true"
              >
                文件名称
              </md-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="类别：" :label-width="labelWidth" prop="categoryName">
                <!-- v-model绑定的是这个select提交到后台的key，例如这里是 categoryName: 'shanghai' 到后台-->
                <el-select v-model="postForm.categoryName" placeholder="请选择类别">
                  <!--                    <el-option label="这个option可以作为类别标题" value="" disabled></el-option>-->
                  <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :label="item.text"
                    :value="item.name"
                  />
                  <!--                    <el-option label="情感类" value="shanghai"></el-option>-->
                  <!--                    <el-option label="社交类型" value="beijing"></el-option>-->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 作者、出版社 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="作者：" :label-width="labelWidth" prop="author">
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出版社：" :label-width="labelWidth" prop="publisher">
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 语言、根文件 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="语言：" :label-width="labelWidth">
                <el-input v-model="postForm.language" placeholder="语言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="根文件：" :label-width="labelWidth">
                <el-input v-model="postForm.rootFile" placeholder="根文件" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 文件路径、解压路径 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件路径：" :label-width="labelWidth">
                <el-input v-model="postForm.filePath" placeholder="文件路径" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="解压路径：" :label-width="labelWidth">
                <el-input v-model="postForm.unzipPath" placeholder="解压路径" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 封面路径、文件名称 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="封面路径：" :label-width="labelWidth">
                <!-- todo: v-model没有修改 -->
                <el-input v-model="postForm.coverPath" placeholder="封面路径" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 后台hash处理后的名称 -->
              <el-form-item label="文件名称：" :label-width="labelWidth">
                <!-- todo: v-model没有修改 -->
                <el-input v-model="postForm.fileName" placeholder="文件名称" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 封面 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面：" :label-width="labelWidth">
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <el-image :src="postForm.cover" class="preview-img" />
                </a>
                <span v-else> 无 </span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 目录树 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="目录：" :label-width="labelWidth">
                <div v-if="contentsNum && contentsNum > 0" class="contents-wrapper">
                  <el-tree :data="contentsTree" @node-click="onContentsClick" />
                </div>
                <span v-else> 无 </span>
              </el-form-item>
            </el-col>
          </el-row>

        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>

import sticky from '@/components/Sticky'
import Warning from '@/views/book/components/warning'
import EbookUpload from '@/components/EbookUpload'
import MdInput from '@/components/MDinput'
import { bookCategoryList, createBook, getBook, updateBook } from '@/api/book'

// 当一个对象不需要被视图模板使用的时候，就可以定义在这里
const defaultForm = {
  title: '',
  author: '',
  publisher: '',
  originalName: '',
  language: '',
  cover: '',
  coverPath: '',
  fileName: '',
  filePath: '',
  path: '',
  rootFile: '',
  unzipPath: '',
  unzipUrl: '',
  url: '',
  categoryName: ''
}

// 这个常量用于映射字段的中文名称与英文名称
const fields = {
  title: '文件名称',
  author: '作者',
  publisher: '出版社',
  categoryName: '类别'
}

export default {
  name: 'Detail',
  components: {
    MdInput,
    EbookUpload,
    Warning,
    sticky: sticky
  },
  props: {
    isEdit: Boolean
  },
  data: function() {
    // 自定义校验规则，这是一个具有通用性的功能
    const titleValidator = (rule, value, callback) => {
      // 如果value是undefined或者为空字符串
      if (value === undefined || value.trim().length === 0) {
        console.log(value, rule.field)
        // 这里抛出错误消息的时候，使用fields[rule.field]格式化一下，指定是哪个字段
        callback(new Error(fields[rule.field] + '不能为空'))
      } else {
        // 没有问题直接callback()，callback()一定要调用
        callback()
      }
    }

    const categoryNameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(fields[rule.field] + '不能为空'))
      } else {
        callback()
      }
    }

    const authorValidator = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        callback(new Error(fields[rule.field] + '不能为空'))
      } else {
        callback()
      }
    }

    const publisherValidator = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        callback(new Error(fields[rule.field] + '不能为空'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      postForm: {
        status: 'draft',
        cover: '',
        categoryName: ''
      },
      fileList: [],
      labelWidth: '120px',
      contentsNum: 0,
      contentsTree: [],
      rules: {
        // 这里校验一下字段
        title: [
          // 当字段失去焦点的时候，进行校验
          { validator: titleValidator, trigger: 'change' }
        ],
        categoryName: [
          { validator: categoryNameValidator, trigger: 'change' }
        ],
        author: [
          { validator: authorValidator, trigger: 'change' }
        ],
        publisher: [
          { validator: publisherValidator, trigger: 'change' }
        ]
      },
      categoryList: []
    }
  },
  async created() {
    // 获取后台的类别信息，在创建电子书和编辑电子书都需要
    // 获取类别列表, 这里使用await，没有使用then+catch获取拦截器的数据。由于请求失败，拦截器会弹出message，不需要catch获取了
    const { data } = await new Promise((resolve) => {
      const res = bookCategoryList()
      resolve(res)
    })
    this.categoryList = data
    // console.log({data})

    // 当前组件是编辑模式情况下
    if (this.isEdit) {
      // 获取到路由传递的fileName动态路由参数
      const fileName = this.$route.params.fileName
      // 获取fileName文件对应的数据, 由于getBookData是async函数，需要使用await调用
      // 函数调用没有返回值，在getBookData中处理数据
      await this.getBookData(fileName)
    }
  },
  methods: {
    // 获取fileName对应的文件信息
    getBookData: async function(fileName) {
      // 调用 axios获取后台的数据, 这里获取两种数据，一个是book信息，一个是book目录
      const { data } = await new Promise((resolve) => {
        const res = getBook(fileName)
        resolve(res)
      })

      this.setData(data)
    },

    // 清空表单数据
    setDefault: function() {
      // Object.assign 将defaultForm对象的数据追加到{}中，然后返回
      // this.postForm = Object.assign({}, defaultForm)

      // 这个就是重置表单数据，并且消除表单校验的warning提示，那么就不需要上面的重置表单数据方法了
      // 但是这个只会重置el-form-item标签中设置了prop的字段
      this.$refs.postForm.resetFields()

      this.contentsNum = 0
      this.contentsTree = []
    },

    // 填充表单数据
    setData: function(data) {
      const { contentsNum, contentsTree, category } = data

      this.postForm = {
        ...this.postForm,
        ...data,
        categoryName: category.name
      }

      // 由于contentsTree是目录数据，不需要提交到后台，不需要加入到postForm中，直接赋值就好
      this.contentsNum = contentsNum
      this.contentsTree = contentsTree
    },
    showGuide: function() {
      console.log('显示帮助...')
    },
    submitForm: function() {
      // 下面的逻辑具有通用性
      // 如果按钮还在loading，那么不进行提交逻辑
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate(async(isValid, fields) => {
          if (isValid) {
            // 提交表单字段，由于有些字段不需要传递到服务器端，那么就可以在这里剔除掉
            // 但是this.postForm的字段不能只能删除，那么需要拷贝一份
            // 拷贝一份
            const newPostForm = Object.assign({}, this.postForm)
            delete newPostForm.category
            delete newPostForm.categoryText
            delete newPostForm.contentsNum
            delete newPostForm.contentsTree
            delete newPostForm.status

            // 调用服务器端接口的时候，需要判断是新增还是编辑
            if (!this.isEdit) { // 新增电子书业务
              // todo: 试试 await和then catch两种写法的区别，这个是有很大区别的
              createBook(newPostForm).then(response => {
                // 如果代码走到then，说明通过了拦截器
                this.$notify({
                  title: '操作成功',
                  message: '新增成功',
                  type: 'success',
                  duration: 2 * 1000
                })

                // 清空表单显示的数据
                this.setDefault()
                this.fileList = []

                // 字段全部合法，取消loading
                this.loading = false
              }).catch((msg) => {
                // 由于拦截器拦截了错误，会抛出Message消息，这里就不需要msg了，不需要在此抛出消息
                this.loading = false
              })
            } else { // 编辑电子书业务
              // 这里只能获取到请求成功的结果，请求失败的结果无法获取到
              const { msg } = await new Promise((resolve) => {
                // 这里没有再获取Ajax的返回值，但是就算没有返回值，也需要调用resolve，否则会阻塞
                const res = updateBook(newPostForm)
                this.loading = false
                resolve(res) // 由于这里抛出的是成功的状态，那么失败的状态无法被外界获取到
              })

              if (msg && msg === 'Success') {
                this.$notify({
                  title: '编辑成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2 * 1000
                })
              }
            }
          } else {
            // 这里的错误获取的是第一个字段的错误提示，如果有两个字段都不合法，只会获取第一个字段的错误信息
            const errMsg = fields[Object.keys(fields)[0]][0].message
            this.$message({
              message: errMsg,
              type: 'error',
              duration: 2 * 1000
            })
            this.loading = false
          }
        })
      }
    },
    onUploadSuccess: function(data) {
      // console.log({data})

      this.setData(data)
    },
    onUploadRemove: function() {
      // console.log("onUploadRemove")
      this.setDefault()
    },
    onContentsClick: function(data) {
      console.log({ data })
    }
  }
}
</script>

<style scoped lang="scss">

/* stycky的样式 */
.components-container  {
  margin: 10px 50px;
  position: relative;
  /*background-color: yellow;*/
}

/* 上传表单的样式 */
.detail-container {
  padding: 30px 50px 20px;

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .preview-img {
      width: 200px;
      height: 270px;
    }

  }
}

</style>
