const Router = require('koa-router');
const {CategoryModel,cookbookModel,UserModel} = require('../../models');
const Tree = require('../../libs/Tree');

const router = new Router();

/*
    method:get
    api : /
    备注：提取分类
*/
router.get('/',async (ctx) =>{
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

    //关联数据表
    cookbookModel.belongsTo(UserModel,{
        //关联字段(外键)
        foreignKey : 'userId'
    });
    //提取菜谱
    let coobooks = await cookbookModel.findAll({
        include:[UserModel]
    });

    let cookbookData = coobooks.map((cookbook)=>{
        return {
            id: cookbook.get('id'),
            name : cookbook.get('name'),
            userId : cookbook.get('userId'),
            cover : cookbook.get('covers') == '' ? '' : JSON.parse(cookbook.get('covers'))[0],
            username : cookbook.get('UserModel').get('username')

        }
    });
    ctx.body =  await ctx.render('./index',{
        user : ctx.state.user,
        categories : data,
        cookbookData
        
    });
});

/*
    method:get
    api : /view/:id
    备注：美食详情

    ctx.params.id 拿到该值
*/
router.get('/view/:id',async (ctx)=>{

    let id = ctx.params.id;  

    let categories =  await CategoryModel.findAll();
    //关联数据表
    cookbookModel.belongsTo(UserModel,{
        //关联字段(外键)
        foreignKey : 'userId'
    }); 
    cookbookModel.belongsTo(CategoryModel,{
        //关联字段(外键)
        foreignKey : 'categoryId'
    });  

    let cookbookData = await cookbookModel.findById(id,{
         include:[UserModel,CategoryModel]
    });

    // console.log(cookbooksBase);
    //判断是非数字
    if(isNaN(id)){
        return ctx.body = '错误页面'
    }

    //转成对象形式
    cookbookData = Object.assign(cookbookData,{
        covers : cookbookData.get('covers') ? JSON.parse(cookbookData.get('covers')) : [],
        ingredients : cookbookData.get('ingredients') ? JSON.parse(cookbookData.get('ingredients')) : {m:[],s:[]},
        steps : cookbookData.get('steps') ? JSON.parse(cookbookData.get('steps')) : [],
        cookers : cookbookData.get('cookers') ? JSON.parse(cookbookData.get('cookers')) : [],
        username : cookbookData.get('UserModel').username,
        avatar : cookbookData.get('UserModel').avatar ? cookbookData.get('UserModel').avatar : 'avatar.jpg',
        categoryname : cookbookData.get('CategoryModel').name

    });

    
     ctx.body = await ctx.render('./view',{
        user : ctx.state.user,
        cookbook : cookbookData,
        categories
     });
})

/*
    method:get
    api : /list:categoryId
    备注：美食详情

    ctx.params.id 拿到该值
*/

router.get('/list/',async (ctx)=>{

    let categories =  await CategoryModel.findAll();
     //关联数据表
    cookbookModel.belongsTo(UserModel,{
        //关联字段(外键)
        foreignKey : 'userId'
    });
    
    let cookbooks = await cookbookModel.findAll({
        include:[UserModel]
    });

    let cookbooksData = cookbooks.map(cookbook=>{
        return {
            id:cookbook.get('id'),
            name : cookbook.get('name'),
            description : cookbook.get('description'),
            favoriteCount : cookbook.get('favoriteCount'),
            commentCount : cookbook.get('commentCount'),
            cover : cookbook.get('covers') == '' ? '' : JSON.parse(cookbook.get('covers'))[0],
            username : cookbook.get('UserModel').get('username'),
            ingredients : cookbook.get('ingredients') ? JSON.parse(cookbook.get('ingredients')) : {m:[],s:[]}
        }
    })

    ctx.body = await ctx.render('./list',{
        user : ctx.state.user,
        cookbooks : cookbooksData,
        categories,
        categoryname:'全部'
    })
})

/*
    method:get
    api : /list:categoryId
    备注：美食详情

    ctx.params.id 拿到该值
*/

router.get('/list/:categoryId',async (ctx)=>{

    let categories =  await CategoryModel.findAll();

    let categoryId = ctx.params.categoryId;

    let categoryCurrent = categories.filter(category => {
        return category.get('id') == categoryId
    });

     //关联数据表
    cookbookModel.belongsTo(UserModel,{
        //关联字段(外键)
        foreignKey : 'userId'
    });
    
    let cookbooks = await cookbookModel.findAll({
        where:{
            categoryId
        },
        include:[UserModel]
    });

    let cookbooksData = cookbooks.map(cookbook=>{
        return {
            id:cookbook.get('id'),
            name : cookbook.get('name'),
            description : cookbook.get('description'),
            favoriteCount : cookbook.get('favoriteCount'),
            commentCount : cookbook.get('commentCount'),
            cover : cookbook.get('covers') == '' ? '' : JSON.parse(cookbook.get('covers'))[0],
            username : cookbook.get('UserModel').get('username'),
            ingredients : cookbook.get('ingredients') ? JSON.parse(cookbook.get('ingredients')) : {m:[],s:[]}

        }
    })

    ctx.body = await ctx.render('./list',{
        user : ctx.state.user,
        cookbooks : cookbooksData,
        categories,
        categoryCurrent : categoryCurrent[0]
    })
})

module.exports = router;