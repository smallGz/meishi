const Router = require('koa-router');
const Sequelize = require('sequelize');
const {UserModel,UserProfileModel} = require('../../models');
const Tree = require('../../libs/Tree');

const router = new Router();

/*
* get
* /admin/category
* 请求分类
*/
router.get('/',async (ctx) =>{

	let page = Number(ctx.query.page) || 1;
	let limit = 10;
	let offset = (page - 1) * limit ; 

	//关联数据表 要设置他们两个不同的表模型是通过什么字段进行的关联
	const Creator = UserModel.hasOne(UserProfileModel,{foreignKey:'userId'});

    let users = await UserModel.findAndCountAll({
    	attributes : {
    		exclude : ['password']
    	},
    	limit,
    	offset,
    	include:[Creator]
    });

    users.rows = users.rows.map((user)=>{
    	return Object.assign(user,{avatar:user.avatar == ''?'avatar.jpg' : user.avatar});
    })

    ctx.body = {
    	code : 0,
    	data : Object.assign(users,{
    		limit
    	})
    	// data : {...users,limit}

    }
});

/*
* post
* /admin/user/status
* 修改状态值
*/
router.post('/status',async (ctx)=>{
	let body = ctx.request.body;
	id = Number(body.id);

	let data = await UserModel.findById(id);
	if(!data){
		ctx.body = {
			code : 1,
			message : '该用户不存在'
		}
	};
	data.set('disabled',!data.get('disabled'));
	await data.save();
	ctx.body = {
		code : 0,
		data : {
			id : data.get('id'),
			disabled : data.get('disabled')
		}
	}
})

/*
* post
* /admin/user/profile
* 修改用户详细信息
*/

router.post('/profile',async (ctx)=>{
	let body = ctx.request.body;
		let id = body.id;
        let mobile = body.mobile;
        let email = body.email;
        let realname = body.realname;
        let gender = body.gender;
        let year = new Date(body.birthday).getFullYear();
        let month = new Date(body.birthday).getMonth() + 1;
        let date = new Date(body.birthday).getDate();

        // console.log(new Date(body.birthday).getFullYear());


        // console.log(year,month,date);
        /*
            获取当前用户的基本信息
        */

        let userProfile = await UserProfileModel.findOne({
            where:{
                userId:id
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
        ctx.body = {
            code : 0,
            data : userProfile
        };
})


module.exports = router;