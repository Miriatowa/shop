const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB.js')
const cloudStorage = require('../utils/callCloudStorage.js')

router.get('/list', async(ctx, next)=>{
    const params = ctx.request.query
    const query = `
        db.collection('tea-type').get()
    `
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: res.data
    }

})

router.post('/del', async(ctx, next)=>{
    const params = ctx.request.body
    const queryBlog = `db.collection('tea-type').doc('${params._id}').remove()`
    const delBlogRes = await callCloudDB(ctx, 'databasedelete', queryBlog)
    
    ctx.body = {
        code: 20000,
        data: {
            delBlogRes,
            delCommentRes,
            delStorageRes
        }
    }

})
router.get('/getById', async(ctx, next)=>{
    const query = `db.collection('tea-type').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})
router.post('/update', async(ctx, next)=>{
    const query = `
        db.collection('tea-type').doc('${ctx.request.body._id}').update({
            data: {
                type_name: '${ctx.request.body.type_name}',
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})

module.exports = router
