$('form').on('submit',function(e){
	
	e.preventDefault();

	$.ajax({
		method : this.method,
		url : this.action,
		data:{
			username : this.username.value,
			password : this.password.value,
			repassword : this.repassword.value
		}
	}).done(data =>{
		if(data.code){
			$('.message').html(data.message).css('color','red');
		}else{
			$('.message').html(data.message).css('color','green');
		}
	})
})