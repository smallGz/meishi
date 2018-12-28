/*
	上传头像
*/
//当用户选择要上传的文件以后，会触发当前input的change事件
$('.avatarInput').on('change',function(){
	
	//图片的属性保存在files属性中
	//使用formData对象来构建formData
	let fd = new FormData();
	//第一个参数是后端接收的key，第二个参数是value
	fd.append('avatar',this.files[0]);

	$.ajax({
		method : 'POST',
		url : '/user/avatar?type=avatar',
		//jquery默认情况下会把数据处理成urlencoded格式，我们不要jq自动帮我们处理
		processData : false,
		//jq还会默认把content-type类型设置成‘application-x-www-form-urlencoded’
		contentType : false,
		data : fd
	}).done(data =>{
		// console.log(data);
		if(data.code == 0){
			$('.avatar').attr('src','/public/uploads/avatar/' + data.data.url);
		}
	})
});
$('.avatar').on('click',function(){
	//点击图片调用fileInput的click
	$('.avatarInput').click();
})