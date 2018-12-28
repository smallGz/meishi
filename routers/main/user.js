const Router = require('koa-router');
const {UserModel,UserProfileModel,cookbookModel,CategoryModel} = require('../../models');
const upload = require('../../utils/upload.js');
const md5 = require('md5');
const Tree = require('../../libs/Tree');

const router = new Router();

router.get('/register',async (ctx) =>{
    ctx.body = await ctx.render('./user/register')
});

/**
    method : get
    url : /user/logout
    用户退出
*/

router.get('/logout',async (ctx) =>{
    ctx.session = null;
    // console.log(ctx.req.headers.referer);
    if(ctx.req.headers.referer){
        ctx.redirect(ctx.req.headers.referer);
    }else{
        ctx.redirect('/');
    }
});

/**
    method : post
    url : /user/register
    用户注册提交
*/
router.post('/register',async (ctx) =>{
    let body = ctx.request.body;
    let username = body.username || '';
    let password = body.password || '';
    let repassword = body.repassword || '';

    //验证
    if(username.trim() === '' || password.trim() === ''){
       return ctx.body = {
            code : 1,
            message : '用户名或密码不能为空'
        }
    }
    if(password !== repassword){
       return ctx.body = {
            code : 2,
            message : '两次输入的密码不一致'
        }
    }

    //查询数据库，是否存在该用户
    let registerUser = await UserModel.findOne({
        where : {
            username
        }
    });
    if(registerUser){
       return ctx.body = {
            code : 3,
            message : '该用户名已经存在'
        }
    };
    registerUser = UserModel.build({
        username,
        password:md5(password),
        //一旦注册，该ip永远不会改变
        createdIpAt:ctx.ip,
        //每次登录都会更新
        updatedIpAt:ctx.ip

    });
    await registerUser.save();
    ctx.body = {
        code : 0,
        message : '注册成功'
    }

});

/*
    加载登录页面
*/
    router.get('/login',async (ctx) =>{
        ctx.body = await ctx.render('./user/login')
    });
/**
    method : post
    url : /user/login
    用户登录提交
*/
    router.post('/login',async (ctx) =>{
        let body = ctx.request.body;
        let username = body.username || '';
        let password = body.password || '';
        let rememberPass = body.rememberPass;

        //验证
        if(username.trim() === '' || password.trim() === ''){
           return ctx.body = {
                code : 1,
                message : '用户名或密码不能为空'
            }
        };

        //查询数据库 是否存在该用户
        let loginUser = await UserModel.findOne({
            where : {
                username
            }
        });
        if(!loginUser || md5(password) !== loginUser.get('password')){
            return ctx.body = {
                code : 2,
                message : '用户名不存在或密码错误'
            }
        };

        //该用户存在，验证是否被禁用
        if(loginUser.get('disabled')){
            return ctx.body = {
                code : 3,
                message : '该用户名已被禁用'
            }
        };

        //当用户登录成功后，把能够标识用户身份信息的值通过cookie/session发送给用户（浏览器）
        //默认情况下，cookie是会话结束（浏览器关闭）自动销毁，如果我们想保持cookie长期存在，则需要设置cookie的maxAge值，毫秒
        if(rememberPass){
            ctx.session.maxAge = 1000 * 60 * 60 * 24 * 10;
        }
        ctx.session.id = loginUser.get('id');
       ctx.body = {
            code : 0,
            message : '登录成功'
        }
    });
    /*
        用户个人中心
    */
    router.get('/',async (ctx)=>{
        if(ctx.session.id){
            ctx.body = await ctx.render('./user/user_index',{
                user : ctx.state.user,
                active : 'userIndex'
            });
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });

    /*
        用户头像上传
    */
    router.post('/avatar',upload.single('avatar'),async (ctx) =>{
        if(ctx.session.id){
            //avatar存储的是上传成功后的信息
            let avatar = ctx.req.file;
            // console.log(ctx.req.file);
            //处理文件夹名字
            // let fileNameArr = avatar.destination.split('/')
            // let fileName = fileNameArr[fileNameArr.length - 1];
            // let avatarUrl = fileName +'/' + avatar.filename;

            let userAvatar = await UserModel.findById(ctx.session.id);
            userAvatar.set('avatar',avatarUrl);
            await userAvatar.save();

            ctx.body = {
                code : 0,
                data : {
                    url : avatar.filename
                }
            };
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
    })


/*
* get
* /admin/user/profile
* 请求个人信息
*/
    router.get('/profile',async (ctx)=>{
        if(ctx.session.id){
            let userProfile = await UserProfileModel.findOne({
                where:{
                    userId:ctx.session.id
                }
            });
            if(userProfile != null){
                //如果当前用户存在
                ctx.body = await ctx.render('./user/user_profile',{
                    user : ctx.state.user,
                    active : 'profile',
                    profile : userProfile.toJSON()
                });
            }else{
                //新添加一条记录
                let newUserProfile = await UserProfileModel.build({
                   userId:ctx.session.id,
                   mobile:null,
                   email:null,
                   nickname : ctx.state.user.username,
                   realname : null,
                   gender : '保密',
                   birthday : null,
                   createdAt:new Date(),
                   updatedAt:new Date()
                }).save();

                ctx.body = await ctx.render('./user/user_profile',{
                    user : ctx.state.user,
                    active : 'profile',
                    profile : newUserProfile.toJSON()
                });
            }           
            
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    })
/*
* post
* /admin/user/profile
* 修改个人信息
*/
    router.post('/profile',async (ctx)=>{
        if(ctx.session.id){
            
            let body = ctx.request.body;
            let mobile = body.mobile;
            let email = body.email;
            let realname = body.realname;
            let gender = body.gender;
            let year = body.year;
            let month = body.month;
            let date = body.date;


            // console.log(year,month,date);
            /*
                获取当前用户的基本信息
            */

            let userProfile = await UserProfileModel.findOne({
                where:{
                    userId:ctx.session.id
                }
            });

            let userMobile = userProfile.get('mobile');
            let userEmail = userProfile.get('email');
            let userRealname = userProfile.get('realname');
            let userGender = userProfile.get('gender');
            let userBirthday = userProfile.get('birthday');
            //注意：请求发送过来的年月日是字符串信息，数据库中存储的是日期格式，所以
            //我们需要把用户传递过来的日期字符串编程日期对象
            let d = new Date(userBirthday);
            let userYear = d.getFullYear();
            let userMonth = d.getMonth() + 1;//用户请求的月份是从1开始的
            let userDate = d.getDate();

            if(year && year != userYear) d.setFullYear(year);
            if(month && month != userMonth) d.setMonth(month - 1);
            if(date && date != userDate) d.setDate(date);
            userProfile.set('birthday',d);

            // console.log(userMonth);

            /*
                验证更新数据库
            */

            if(mobile && mobile != userMobile) userProfile.set('mobile',mobile);
            if(email && email != userEmail) userProfile.set('email',email);
            if(realname && realname != userRealname) userProfile.set('realname',realname);
            if(gender && gender != userGender) userProfile.set('gender',gender);

            

            await userProfile.save();
            ctx.body = await ctx.render('./user/user_profile', {
                code : 0,
                data : userProfile
            })


        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
    })


    /*
        我的菜谱
    */
    router.get('/cookbook',async (ctx)=>{
        if(ctx.session.id){

            var cookbooks = await cookbookModel.findAndCountAll({
                where:{
                    userId : ctx.session.id
                },
                order:[['createdAt','DESC']]
            });

            ctx.body = await ctx.render('./user/user_cookbook',{
                user : ctx.state.user,
                active : 'cookbook',
                cookbooks
            });
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });

    /*
        菜谱删除
    */
    router.get('/cookbook/remove/:id',async (ctx)=>{
        if(ctx.session.id){
            let id = ctx.params.id;

            let cookbook = await cookbookModel.findById(id);
            await cookbook.destroy();

            ctx.redirect('/user/cookbook');
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });

    /*
        编辑菜谱
    */
    router.get('/cookbook/edit/:id',async (ctx)=>{
        if(ctx.session.id){
            let id = ctx.params.id;

            
            let categories =  await CategoryModel.findAll();
            //提取分类
            let data = categories.map(category =>{
                return {
                    id:category.get('id'),
                    name:category.get('name'),
                    pid:category.get('pid')
                }
            });
            data = (new Tree(data)).getTree(0);

            let rs = await cookbookModel.findById(id);
            //转成JSON数据
            let cookbook = rs.toJSON();
            cookbook.covers = JSON.parse(cookbook.covers);
            cookbook.cookers = JSON.parse(cookbook.cookers);
            cookbook.ingredients = JSON.parse(cookbook.ingredients);
            cookbook.steps = JSON.parse(cookbook.steps);

            ctx.body = await ctx.render('./user/user_edit',{
                user : ctx.state.user,
                active : 'cookbook',
                categories:data,
                cookbook
            });
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });

     /*
        发布新菜谱
    */
    router.get('/publish',async (ctx)=>{
        if(ctx.session.id){

            let categories =  await CategoryModel.findAll();
            //提取分类
            let data = categories.map(category =>{
                return {
                    id:category.get('id'),
                    name:category.get('name'),
                    pid:category.get('pid')
                }
            });
            data = (new Tree(data)).getTree(0);

            ctx.body = await ctx.render('./user/user_publish',{
                user : ctx.state.user,
                active : 'cookbook',
                categories:data
            });
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });

    /*
        发布新菜谱
    */
    router.post('/publish',async (ctx)=>{
        if(ctx.session.id){
    
        let body = ctx.request.body;
        let name = body.name || '';
        let categoryId =  body.categoryId || 0;
        let covers = body.covers || [];
        let description = body.description || '';
        let craft = body.craft || '';
        let level = body.level || '';
        let taste = body.taste || '';
        let needTime = body.needTime || '';
        let cookers = body.cookers || [];
        let ingredients = body.ingredients || {m:[],s:[]};
        let steps= body.steps || [];
        let tips = body.tips || '';


        if(name == ''){
            return ctx.body = {
                code : 1,
                message : '菜谱名称不能为空'
            }
        };

        let cookbook = cookbookModel.build({
            name,
            userId: ctx.session.id,
            categoryId,
            covers:JSON.stringify(covers),
            description,
            craft,
            level,
            taste,
            needTime,
            cookers:JSON.stringify(cookers),
            ingredients:JSON.stringify(ingredients),
            steps:JSON.stringify(steps),
            tips,
            createdAt:new Date(),
            updatedAt:new Date()
        });

        await cookbook.save();

        ctx.body = {
            code : 0,
            data : cookbook
        }
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });

    /*
        修改新菜谱
    */
    router.post('/cookbook/edit',async (ctx)=>{
        if(ctx.session.id){
    
        let body = ctx.request.body;
        let data = {
            id : body.id,
            name : body.name,
            categoryId :  body.categoryId,
            covers : body.covers,
            description : body.description,
            craft : body.craft,
            level : body.level,
            taste : body.taste,
            needTime : body.needTime,
            cookers : body.cookers,
            ingredients : body.ingredients,
            steps : body.steps,
            tips : body.tips
        };   

          console.log(data.cookers);  

        if(data.name == ''){
            return ctx.body = {
                code : 1,
                message : '菜谱名称不能为空'
            }
        };

        let cookbook = await cookbookModel.findById(data.id);
        
        data.name && cookbook.set("name",data.name);
        data.categoryId && cookbook.set("categoryId",data.categoryId);
        data.covers && cookbook.set("covers",JSON.stringify(data.covers));
        data.description && cookbook.set("description",data.description);
        data.craft && cookbook.set("craft",data.craft);
        data.level && cookbook.set("level",data.level);
        data.taste && cookbook.set("taste",data.taste);
        data.needTime && cookbook.set("needTime",data.needTime);
        data.cookers && cookbook.set("cookers",JSON.stringify(data.cookers));
        data.ingredients && cookbook.set("ingredients",JSON.stringify(data.ingredients));
        data.steps && cookbook.set("steps",JSON.stringify(data.steps));
        data.tips && cookbook.set("tips",data.tips);

        await cookbook.save();
        ctx.body = {
            code : 0,
            data : cookbook
        }
          
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });
/*
    成品图上传
*/
    router.post('/publish/cover',upload.single('cover'),async (ctx) =>{
        if(ctx.session.id){
            //avatar存储的是上传成功后的信息
            let covers = ctx.req.file;
            // console.log(ctx.req.file);

            //处理文件夹名字
            // let fileNameArr = covers.destination.split('/')
            // let fileName = fileNameArr[fileNameArr.length - 1];
            // let coverUrl = fileName +'/' + covers.filename;
            

            ctx.body = {
                code : 0,
                data : {
                    url : covers.filename
                }
            };
        }else{
            //因为请求可以通过浏览器发送，也可以通过ajax请求
            if(ctx.headers['x-requested-width'] === 'XMLHttpRequest'){
                ctx.body = {
                    code : 1,
                    message : '你还没有登录'
                }
            }else{
                ctx.redirect('/user/login');
            }
        }
        
    });


module.exports = router;