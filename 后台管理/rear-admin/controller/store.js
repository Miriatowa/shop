const Router=require("koa-router");
const router=new Router();
const getAccessToken=require("../utils/getAccessToken.js")
const ENV="donghu-7y7sq"
const rp=require("request-promise")
const callCloudFn = require('../utils/callCloudFn.js')
const callCloudDB = require('../utils/callCloudDB.js')
router.get("/storedata",async(ctx,next)=>{
    const query = ctx.request.query
    const res = await callCloudFn(ctx, 'blog', {
        $url: 'index',
    })
    let data = []
    if (res.resp_data) {
        data = JSON.parse(res.resp_data).data
    }

        ctx.body={
            data,
            code:20000
        }
})
router.get('/getById', async(ctx, next)=>{
    const query = `db.collection('store').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})
router.post('/update', async(ctx, next)=>{
    const query = `
        db.collection('store').doc('${ctx.request.body._id}').update({
            data: {
                title: '${ctx.request.body.title}',
                address: '${ctx.request.body.address}',
                tel: '${ctx.request.body.tel}',
                time: '${ctx.request.body.time}'

            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})
router.get('/del', async(ctx, next)=>{
    const params = ctx.request.query
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})



module.exports=router