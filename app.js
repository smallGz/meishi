const Koa = require('koa');
const Router = require('koa-router');
const KoaStaticCache = require('koa-static-cache');
const KoaSwig = require('koa-swig');
const Co = require('co');
const KoaBodyParser = require('koa-bodyparser');
const KoaSession = require('koa-session');
// const multer = require('koa-multer');
const {UserModel} = require('./models');

//加载子路由
const mainIndexRouter = require('./routers/main/index');
const mainUserRouter = require('./routers/main/user');
//后台管理
const apiCategoryRouter = require('./routers/admin/category');
const apiUserRouter = require('./routers/admin/user');

const app = new Koa();

//静态文件处理
app.use(KoaStaticCache(__dirname + '/static',{
    root:__dirname + '/static',//与上面的第一个参数效果一致
    dynamic: true,
    prefix:'/public',//如果当前请求的url是以 /public 开始 则作为静态资源请求
    // maxAge: 24 * 60 * 60
}));

//cookie
/*
	接收两个参数
	1.配置：包括httponly、maxAge
	2.当前app
*/
app.keys = ['meishi'];
app.use(KoaSession({},app));

app.use(async(ctx,next)=>{
	ctx.state.user = {};
	if(ctx.session.id){
		ctx.state.user = await UserModel.findById(ctx.session.id);
		if(!ctx.state.user.avatar){
			ctx.state.user.avatar = 'avatar.jpg'
		}
		
	}
	await next();
	
});

// app.use(async (ctx, next) => {
//     // 允许来自所有域名请求
//     ctx.set("Access-Control-Allow-Origin", "*");
//     // 这样就能只允许 http://localhost:8080 这个域名的请求了
//     // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080"); 

//     // 设置所允许的HTTP请求方法
//     ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

//     // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
//     ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

//     // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

//     // Content-Type表示具体请求中的媒体类型信息
//     ctx.set("Content-Type", "application/json;charset=utf-8");

//     // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
//     // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
//     ctx.set("Access-Control-Allow-Credentials", true);

//     // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
//     // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
//     // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
//     ctx.set("Access-Control-Max-Age", 300);

//     /*
//     CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
//         Cache-Control、
//         Content-Language、
//         Content-Type、
//         Expires、
//         Last-Modified、
//         Pragma。
//     */
//     // 需要获取其他字段时，使用Access-Control-Expose-Headers，
//     // getResponseHeader('myData')可以返回我们所需的值
//     ctx.set("Access-Control-Expose-Headers", "myData");

//     await next();
// })

//模板引擎
const render = KoaSwig({
    root:__dirname + '/views',
    autoescape:true,
    cache:false,
    ext:'html'
});

app.context.render = Co.wrap(render);
//body解析
app.use(KoaBodyParser());

//路由配置
const router = new Router();
router.use('',mainIndexRouter.routes());
router.use('/user',mainUserRouter.routes());
router.use('/api/admin/category',apiCategoryRouter.routes());
router.use('/api/admin/user',apiUserRouter.routes());

app.use(router.routes());


app.listen(8888);