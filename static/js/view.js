$('.food_img_thumb img').on('click',function(){

	$('.food_img_thumb img').removeClass('active');
	$('.food_img img').attr('src',this.src);
	$(this).addClass('active');
})