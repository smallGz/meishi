const Router = require('koa-router');
const Sequelize = require('sequelize');
const {CategoryModel} = require('../../models');
const Tree = require('../../libs/Tree');

const router = new Router();


/*
* get
* /admin/category
* 请求分类
*/
router.get('/',async (ctx) =>{
    let categories =  await CategoryModel.findAll();
    let data = categories.map(category =>{
        return {
            id:category.get('id'),
            name:category.get('name'),
            pid:category.get('pid')
        }
    });

    data = (new Tree(data)).getTree(0);
    
    ctx.body =  {
    	code : 0,
    	data
    }
});

/*
* post
* /admin/category/add
* 添加分类
*/
router.post('/add',async (ctx) =>{
	let body = ctx.request.body;
	let name = body.name || '';
	let pid = 0; 


	if(!isNaN(Number(body.pid))){
		pid = Number(body.pid);
	}

	if(name == ''){
		ctx.body = {
			code : 1,
			message : '分类名称不能为空'
		}
	}

	let newCategory = CategoryModel.build({
		name,
		pid
	});
	await newCategory.save();
	ctx.body = {
		code : 0,
		data : newCategory
	}

});

/*
* post
* /admin/category/eidt
* 修改分类
*/
router.post('/edit',async (ctx)=>{
	let body = ctx.request.body;
	let name = body.name || '';
	let id = body.id; 

	// console.log(name,id);

	if(name == ''){
		ctx.body = {
			code : 1,
			message : '分类名称不能为空'
		}
	}
	let newCategory = await CategoryModel.findById(id);
	if(!newCategory){
		return ctx.body = {
			code : 2,
			message : '不存在该分类'
		}
	}
	newCategory.set('name',name);
	await newCategory.save();
	ctx.body = {
		code : 0,
		data : newCategory
	}
});


/*
* post
* /admin/category/remove
* 删除分类
*/
router.post('/remove',async (ctx) =>{
	let body = ctx.request.body;
	let id = 0; 


	if(!isNaN(Number(body.id))){
		id = Number(body.id);
	}

	//单条数据删除
	// let newCategory = await category.findById(id);
	// if(!newCategory){
	// 	ctx.body = {
	// 		code : 1,
	// 		message : '不存在该分类'
	// 	}
	// }
	// await newCategory.destroy();

	//删除多条数据 考虑两层数据
	let newCategory = await CategoryModel.destroy({
		where:{
			[Sequelize.Op.or]:[
				{id:id},
				{pid:id}
			]
		}
	});

	ctx.body = {
		code : 0
	}
})

module.exports = router;