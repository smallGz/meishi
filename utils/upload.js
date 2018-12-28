const multer = require('koa-multer');
const mime = require('mime');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const storage = multer.diskStorage({


	destination(ctx,file,cb){
		let query = {};
		let type = 'avatar';
		let queryString = url.parse(ctx.url).query;
		if(queryString){
			query = querystring.parse(queryString)
		};
		switch(query.type){
			case 'cookbooks':
				type = 'cookbooks';
				break

		}
		cb(null,'static/uploads/'+ type +'/');
	},

  // destination:'static/uploads/avatar/'+new Date().getFullYear() + (new Date().getMonth()+1) + new Date().getDate(),
  filename(ctx,file,cb){
  	// console.log(file);
  	// console.log(mime.getExtension(file.mimetype)); 
    // const filenameArr = file.originalname.split('.');
    //file存储的是上传成功以前的
    cb(null,Date.now() + '.' + mime.getExtension(file.mimetype));
  }
});

const upload = multer({storage});

module.exports = upload;