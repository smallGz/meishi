$('form').on('submit',function(e){
	//阻止默认行为
	e.preventDefault();

	$.ajax({
		method : this.method,
		url : this.action,
		contentType : 'application/json',
		data : JSON.stringify({
			username:this.username.value,
			password : this.password.value,
			rememberPass : this.rememberPass.checked
		})
	}).done(data =>{
		if(data.code){
			$('.message').html(data.message).css('color','red');
		}else{
			$('.message').html(data.message).css('color','green');
			setTimeout(function(){
				window.location = '/';
			},1000)
		}
	})
})