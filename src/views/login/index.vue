<template>
  <div class="login-container">
    <!--
    <el-form
      ref="loginForm"        // 为了获取form实例对象
      :model="loginForm"     // 绑定的数据
      :rules="loginRules"    // form绑定的规则
      class="login-form"     // 样式
      autocomplete="on"      // 没有效果
      label-position="left"  // 没有用到label，没有效果
    >

-->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <!-- 1：登录标题 -->
      <div class="title-container">
        <h3 class="title">管理平台</h3>
      </div>

      <!-- 2：用户名 -->
      <el-form-item prop="username">
        <!-- 字体图标 -->
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- 输入框 -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <!-- 3：密码 -->
      <!-- v-model：是否显示提示，content：提示内容， placement：提示的位置，manual：手动控制模式-->
      <el-tooltip v-model="capsTooltip" content="大写已打开" placement="right" :manual="true">
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <!--
          <el-input
            :key="passwordType"   //
            ref="password"        // 引用id
            v-model="loginForm.password" // 绑定数据
            :type="passwordType"         // 类型
            placeholder="密码"
            name="password"
            tabindex="2"             // tab按键次序
            autocomplete="on"
            @keyup.native="checkCapslock"  // 监听键盘按键
            @blur="capsTooltip = false"    // 监听光标离开，关闭提示
            @keyup.enter.native="handleLogin" // 监听enter键
          />
-->
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />

          <span class="show-pwd" @click="showPwd">
            <!-- 眼睛图标 -->
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- 4：登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px"
        @click.native.prevent="handleLogin"
      >登录
      </el-button>

    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    // 对username的合法校验
    const validateUsername = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    // 对password的合法校验
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码不能小于4位字符'))
      } else {
        callback()
      }
    }

    return {
      // form绑定的默认数据
      loginForm: {
        username: 'yinhuanyi',
        password: '123456'
      },
      // form的字段的合法检查，username、password与<el-form-item>标签的prop名称对应
      loginRules: {
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }]
      },

      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  // 侦听器，监听路由，当请求进来的时候，route就会变好，调用handler方法
  watch: {
    $route: {

      handler: function(route) {
        // 获取查询字符串
        const query = route.query

        if (query) {
          // 给redirect赋值
          this.redirect = query.redirect
          // 获取其他的查询对象
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      // immediate 当路由第一次赋值的时候，就会调用handler，否则需要当$route变化才会调用
      immediate: true
    }
  },
  // 当组件挂载完毕调用, 如果username和password为空，让input聚焦
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    // 检查用户输入的字符，如果是大写字符，打开消息提醒
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 控制字体图标 和 input类型(两个一起控制)
    showPwd() {
      // 控制字体图标 和 input类型(两个一起控制)
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      // 下次下次Dom变化的时候，密码输入框出现光标
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 用户点击登录
    handleLogin() {
      // 获取form表单实例，调用validate方法
      this.$refs.loginForm.validate(valid => {
        // 如果valid验证通过，说明用户输入合法
        if (valid) {
          // 让按钮转圈
          this.loading = true
          // 验证用户名和密码，这里应该是调用后台接口
          // 这里需要注意：由于 vuex 中的 user 指定了 namespaced 为 true，所以 dispatch 时需要加上 namespace，否则将无法调用 vuex 中的 action
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // 如果登录成功，且cookie写入成功，跳转到redirect或者/, 那么会再次进入到路由守卫
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              // 且关闭loading
              this.loading = false
            })
            .catch(() => {
              // 如果请求过程有问题，那么关闭loading
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取其他的查询对象，如果还有其他的query，就做成对象返回，没有就返回{}
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}

</script>

<!-- Todo: 为什么有两个style，一个没有scoped -->
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
