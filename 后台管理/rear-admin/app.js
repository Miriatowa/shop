const Koa = require('koa');
const app = new Koa();
const Router=require("koa-router");
const router=new Router();
const cors=require("koa2-cors");
const koabody=require("koa-body")
const ENV="donghu-7y7sq"
// 跨域处理
app.use(cors({
  origin:["http://localhost:9528"],
  credentials: true
}))
// 接收post参数
app.use(koabody({
  multipart:true
}))
app.use(async (ctx,next) => {
  ctx.state.env = ENV;
  await next()
});
const store=require("./controller/store.js")
const blog=require("./controller/blog.js")
const teaType=require("./controller/teaType.js")
const teaName=require("./controller/teaName.js")
router.use("/store",store.routes())
router.use("/blog",blog.routes())
router.use("/teaType",teaType.routes())
router.use("/teaName",teaName.routes())
app.use(router.routes())
app.use(router.allowedMethods())


app.listen(3000,()=>{
    console.log("koa is running at http://192.168.43.101:3000")
});