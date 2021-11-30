<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input
        v-model="listQuery.title"
        placeholder="书名称"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        :clearable="true"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />

      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        :clearable="true"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />

      <!-- 选择器：如果是表单提交，那么category:1， -->
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.text"
          :value="item.name"
        />

      </el-select>

      <!-- 查询按钮，负责根据input填写的数据，调用后台接口获取数据 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        查询
      </el-button>

      <!-- 新增按钮，负责调整到电子书新增页面 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >
        新增
      </el-button>

      <!-- 多选框 -->
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left: 5px"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>

    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableList"
      :border="true"
      :fit="true"
      :highlight-current-row="true"
      style="width: 100%"
      :default-sort="defaultSort"
      @sort-change="sortChange"
    >

      <!-- ID字段 -->
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />

      <!-- 书名字段: 为什么需要加template呢？【目的是为了让搜索的关键字高亮显示 】-->
      <el-table-column
        label="书名"
        prop="title"
        sortable="custom"
        align="center"
        width="150"
      >
        <!-- 获取到子组件的:row属性绑定的值，并且将其title进行解构，那么父组件就可以使用子组件的数据了 -->
        <template v-slot="{ row: { titleWrapper } }">
          <span v-html="titleWrapper" />
        </template>

      </el-table-column>

      <!-- 作者字段 -->
      <el-table-column
        label="作者"
        align="center"
        width="150"
      >
        <template v-slot="{ row: { authorWrapper } }">
          <span v-html="authorWrapper" />
        </template>

      </el-table-column>

      <!-- 出版社 -->
      <el-table-column
        label="出版社"
        prop="publisher"
        align="center"
        width="150"
      />

      <!-- 分类 -->
      <el-table-column
        label="分类"
        prop="category"
        align="center"
        width="80"
      />

      <!-- 语言：没有给宽度就是自适应 -->
      <el-table-column
        label="语言"
        prop="language"
        align="center"
      />

      <!-- 封面 -->
      <el-table-column
        v-if="showCover"
        label="封面"
        align="center"
        width="80"
      >
        <!-- 获取子组件所有的attribute对象集合，那么就可以获取到这一行数据的cover属性 -->
        <template v-slot="scope">
          <!-- 用于点击图片，打开新链接，显示大图 -->
          <a :href="scope.row.cover" target="_blank">
            <!-- 用于显示小图 -->
            <img :src="scope.row.cover" style="width: 60px; height: 90px" alt="封面图片">
          </a>
        </template>
      </el-table-column>

      <!-- 文件名称 -->
      <el-table-column
        label="文件名称"
        prop="fileName"
        align="center"
        width="150"
      />

      <!-- 文件路径：这里的template是对字段值进行过滤，有些字段是空的，那么显示【无】 -->
      <el-table-column
        label="文件路径"
        prop="filePath"
        align="center"
        width="150"
      >
        <template v-slot="{ row: { filePath } }">
          {{ filePath | valueFilter }}
        </template>
      </el-table-column>

      <!-- 封面路径 -->
      <el-table-column
        label="封面路径"
        prop="coverPath"
        align="center"
        width="100"
      />

      <!-- 解压路径 -->
      <el-table-column
        label="封面路径"
        prop="coverPath"
        align="center"
        width="100"
      />

      <!-- 上传人 -->
      <el-table-column
        label="上传人"
        prop="createUser"
        align="center"
        width="100"
      />

      <!-- 上传时间 -->
      <el-table-column
        label="上传时间"
        prop="createDate"
        align="center"
        width="100"
      >
        <template v-slot="{ row: { createDate } }">
          <span> {{ createDate | timeFilter }} </span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="120"
        align="center"
        fixed="right"
      >

        <!--对象解构获取row-->
        <template v-slot="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color: red" @click="handleDelete(row)" />
        </template>

      </el-table-column>

    </el-table>
    <!--
      <my-pagination
      v-show="total>0"  // 当total没有加载出来的时候，组件不显示，当选择了页码的时候
      :total="total"    // 页面的总数
      :page.sync="listQuery.page"  // 让组件的页面与数据绑定在一起
      :limit.sync="listQuery.pageSize" // 让页面多少页和数据绑定在一起
      @pagination="getList" // 当页码或者多少页发生改变，调用方法
    />
      -->
    <my-pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />

  </div>
</template>

<script>

// 这里是使用vue-elementui-admin自建的组件
import MyPagination from '@/components/Pagination'

// 这个是自定义
import waves from '@/directive/waves/waves'
import { bookCategoryList, deleteBook, listBook } from '@/api/book'
import { parseTime } from '@/utils'

export default {

  components: { MyPagination },
  // 注册自定义指令
  directives: { waves },
  filters: {
    valueFilter: function(value) {
      return value || '无'
    },
    timeFilter: function(time) {
      // 这个parseTime函数是vue-elementUI-admin自带的时间解析函数，可以将时间戳解析为时间字符串
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}') : '无'
    }
  },
  data: function() {
    return {
      listQuery: {},
      showCover: false,
      categoryList: [],
      // 当页面有多个table的时候，可以对table进行区分
      tableKey: 0,
      listLoading: false,
      tableList: [],
      total: 0,
      defaultSort: {}
    }
  },
  created() {
    console.log('created')
    this.parseQuery()
  },
  mounted() {
    console.log('mounted')
    this.getCategoryList()
    this.getList()
  },
  activated() {
    console.log('1激活activated钩子函数')
  },
  beforeRouteUpdate(to, from, next) { // 监控路由的变化
    console.log('beforeRouteUpdate')
    if (to.path === from.path) { // 如果路径一样，但是查询参数不一样的时候，
      const toQuery = Object.assign({}, to.query)
      const fromQuery = Object.assign({}, from.query)
      if (JSON.stringify(toQuery) !== JSON.stringify(fromQuery)) {
        this.getList() // 刷新表格
      }
    }
    // 这个next一定要调用
    next()
  },
  methods: {
    // 解析查询
    parseQuery: function() {
      // 获取查询参数对象
      const query = Object.assign({}, this.$route.query)
      let sort = '+id'

      const listQuery = {
        page: 1,
        pageSize: 10,
        sort: sort // 默认按照id字段的升序排序
      }

      if (query) {
        query.page && (query.page = +query.page) // 将page从字符串类型转换为number类型
        query.pageSize && (query.pageSize = +query.pageSize)

        query.sort && (sort = query.sort) // 获取当前的排序
      }

      const sortSymbol = sort[0]
      const sortColumn = sort.slice(1, sort.length)

      // 这个是让排序的图标亮起
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }

      // 让两个对象合并，
      this.listQuery = { ...listQuery, ...query }
    },
    refresh: function() {
      this.$router.push({
        path: '/book/list',
        query: this.listQuery // 跳转路由的时候，直接携带查询参数
      })
    },
    // 触发这个方法的条件有四个，点击查询按钮，在input框敲enter，选择器选择
    // 为了保存页面的参数，当条件过滤查询的时候，将查询参数保留咋URL路由上
    handleFilter: function() {
      // this.getList()
      // 每次过滤的时候，让page重置为1
      this.listQuery.page = 1
      // 这里直接让路由跳转
      this.refresh()
    },
    handleCreate: function() {
      this.$router.push('/book/create')
    },
    changeShowCover: function(value) {
      this.showCover = value
    },
    sortBy: function(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    // 当点击字段进行排序的时候，调用此方法
    sortChange: function(data) {
      // data === {order: "descending", prop: "name"}
      const { prop, order } = data
      // 将这两个字段合并为一个字段
      this.sortBy(prop, order)
    },
    // 让匹配到的字符串，插入到span标签中
    wrapperKeyword: function(key, value) {
      function hightLight(v) {
        return `<span style="color: #f67204">${v}</span>`
      }

      // 如果用户没有输入这个关键字, 那么让这个关键字直接原始显示即可
      if (!this.listQuery[key]) {
        return value
      } else { // 如果用户输入了查询关键字, 那么将这个关键字替换为对应的高亮标签即可
        // 字符串的正则表达式替换，i表示不区分大小写，g表示全文匹配
        return value.replace(new RegExp(this.listQuery[key], 'ig'), value => hightLight(value))
      }
    },
    getCategoryList: async function() {
      // 在这里会调用api接口，获取到分类数据，然后赋值给categoryList变量
      const { data } = await new Promise((resolve) => {
        const res = bookCategoryList()
        resolve(res)
      })
      this.categoryList = data
    },
    // 根据查询条件获取列表数据
    getList: async function() {
      // 先将表格转圈
      this.listLoading = true
      const { data: { list, total }} = await new Promise((resolve) => {
        const res = listBook(this.listQuery)
        resolve(res)
      })
      this.tableList = list
      this.total = total
      this.listLoading = false
      // 添加titleWrapper，authorWrapper两个属性，这里只针对title和author两个字段的数据进行高亮显示
      if (this.tableList && this.tableList.length > 0) {
        this.tableList.forEach((book) => {
          // 给每一row添加两个字段，titleWrapper，authorWrapper
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
      }
    },
    handleUpdate: function(row) {
      // 直接调整到编辑页面
      this.$router.push(`/book/edit/${row.fileName}`)
    },
    handleDelete: function(row) {
      this.$confirm('此操作将永久删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await new Promise((resolve) => {
          deleteBook(row.fileName)
          resolve()
        })

        this.$notify({
          title: '成功',
          message: '删除成功',
          duration: 2 * 1000
        })
        // 删除之后，让页面重新请求，刷新
        this.handleFilter()
      })
    }
  }

}

</script>

<style scoped lang="scss">

</style>
