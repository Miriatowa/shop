// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
try{
  const result = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      phrase2: {
        value: '评价完成'
      },
      thing3: {
        value: event.content
      }
    },
    templateId: 'ghEn9ZqdOH8tTeUBgvno2yo5uHlGUOuYKGx_JxvmYgM',
    formId: event.formId
  })
  return result
}catch(err){
 return err
}
}