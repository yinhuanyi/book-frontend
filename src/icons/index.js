import Vue from 'vue'
// 导入icon图标组件
import SvgIcon from '@/components/SvgIcon'

// 注册到全局
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
