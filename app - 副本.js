const Koa = require('koa');
const Router = require('koa-router');
const KoaStaticCache = require('koa-static-cache');
const KoaSwig = require('koa-swig');
const Co = require('co');
const KoaBodyParser = require('koa-bodyparser');

//加载子路由
const mainRouter = require('./routers/main');
const apiRouter = require('./routers/api');
const adminRouter = require('./routers/admin');


const app = new Koa();
//body解析
app.use(KoaBodyParser());

//路由配置
const router = new Router();

router.use('',mainRouter.routes());
router.use('/api',apiRouter.routes());
router.use('/admin',adminRouter.routes());



app.use(router.routes());


//静态文件处理
app.use(KoaStaticCache(__dirname + '/static',{
    root:__dirname + '/static',//与上面的第一个参数效果一致
    prefix:'/public',//如果当前请求的url是以 /public 开始 则作为静态资源请求
}));


//模板引擎
const render = KoaSwig({
    root:__dirname + '/views',
    autoescape:true,
    cache:false,
    ext:'html'
});
app.context.render = Co.wrap(render);



app.listen(8888);