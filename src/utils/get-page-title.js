import defaultSettings from '@/settings'

const title = defaultSettings.title || '项目名称'

// 拼接页面的title
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // js 模板字符串拼接方法
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
