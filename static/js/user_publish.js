/*
	提交菜谱
*/

$('.addmenuform').on('submit',function(e){
	
	e.preventDefault();

	//判断是新增还是提交
	let id = this.cookbookId;
	let data = {};
	let url = '';
	if(id){
		url = '/user/cookbook/edit';
	}else{
		url = '/user/publish';
	}

	/*
		主料 辅料信息
	*/
	var ingredientsM = [];
	var ingredientsS = [];

	$('.foodlist.m li').each(function(index,li){
		var inputs = $(li).find('input');
		ingredientsM.push({
			k:$(inputs).eq(0).val(),
			v:$(inputs).eq(1).val()
		})
	});
	$('.foodlist.s li').each(function(index,li){
		var inputs = $(li).find('input');
		ingredientsS.push({
			k:$(inputs).eq(0).val(),
			v:$(inputs).eq(1).val()
		})
	});
	/*
		成品图信息
	*/
	var covers = [];
	$('.thumb_list img').each(function(index,img){
		covers.push($(img).attr('data-src'));
	});

	/*
		步骤信息
	*/
	var steps = [];
	$('.piclist li').each(function(index,li){
		steps.push({
			p:$(li).find('img').attr('data-src'),
			d:$(li).find('textarea').val()
		})
	});

	data = {
			name:this.menuname.value,
			categoryId:this.categoryId.options[this.categoryId.selectedIndex].value,
			covers,
			description:this.description.value,
			craft:$('#craft em').text(),
			level:$('#level em').text(),
			taste:$('#taste em').text(),
			needTime:$('#needTime em').text(),
			cookers:$('#cookers em').text().split(','),
			ingredients:{
				m:ingredientsM,
				s:ingredientsS
			},
			steps,
			tips:this.tips.value
		};
	if(id){
		data.id = id.value;
	}
	$.ajax({
		method : this.method,
		url,
		contentType:'application/json;chatset=utf-8',
		data:JSON.stringify(data)
		
	}).done(data =>{
		if(!data.data.code){
			if(id){
				//修改
				$('#message').html('修改成功').css('color','green');
				window.location.reload();
			}else{
				//新增
				$('#message').html('添加成功').css('color','green');
				setTimeout(function(){
					window.location = '/user/cookbook';
				},1000)
			}
		}else{
			$('#message').html(data.data.message).css('color',red);
		}
	})
});

/* 
	基本参数
	单选和多选
 */

$('.select').each(function(){
	var _this = $(this);
	$(this).find('i').click(function(e){
		//阻止冒泡
		e.stopPropagation();

		$('.selectoption').hide();
		_this.next().show();
	})
});

$('.selectoption').each(function(index){
	var spanText = [];
	$(this).find('span').each(function(){

		$(this).click(function(e){
			//阻止冒泡
			e.stopPropagation();

			
			if(index == 4){
				var obj = {};
				obj.dataValue = $(this).attr('data-value');
				obj.text = $(this).text();
				var txtStr = '';

				if(JSON.stringify(spanText).indexOf(JSON.stringify(obj)) == -1){

					spanText.push(obj);
					$(this).addClass("on");
				}else{

					spanText.splice($(spanText).index($(obj)), 1);
					$(this).removeClass('on');
				}


				$(spanText).each(function(index,el){
						if(index == spanText.length - 1){
							txtStr += el.text;
						}else{
							txtStr += el.text + ',';		}	
						
				 });
				$(this).parent().prev().find('em').text(txtStr);


				
			}else{
				spanText = $(this).text();
				$(this).parent().prev().find('em').text(spanText);

				$('.selectoption').eq(index).find('span').removeClass('on');
				$(this).addClass("on");
			}

			// var spanText = $(this).text();
			
		})
	})
});

$(document).click(function(){
	$('.selectoption').hide();
})


/*
	添加食材
*/

$('.addfoodgroup').each(function(){
	$(this).click(function(){
		var $li = $('<li>').addClass('foodnum clearfix');
		var $input1 = $('<input type="text">').attr('placeholder','食材组').appendTo($li);
		var $input2 = $('<input type="text">').attr('placeholder','用量').appendTo($li);
		var $button = $('<button>').addClass('hidden').html('X').appendTo($li).click(function(){
			$li.remove();
		});

		$(this).prev().append($li);
	})
})

/*
	上传成品图
*/
$('#uploadImg').on('change',function(){
	var files = [...this.files];
	files.forEach(file=>{
		//使用formData对象来构建formData
		let fd = new FormData();
		//第一个参数是后端接收的key，第二个参数是value
		fd.append('cover',file);

		$.ajax({
			method : 'POST',
			url : '/user/publish/cover?type=cookbooks',
			//jquery默认情况下会把数据处理成urlencoded格式，我们不要jq自动帮我们处理
			processData : false,
			//jq还会默认把content-type类型设置成‘application-x-www-form-urlencoded’
			contentType : false,
			data : fd
		}).done(data =>{
			// console.log(data);
			if(data.code == 0){
				//上传成功
				let $li = $('<li>');
				let $img = $('<img>').attr('data-src',data.data.url).attr('src','/public/uploads/cookbooks/'+data.data.url).appendTo($li);
				let $span = $('<span>').html('删除').on('click',function(){
					$(this).parent().remove();
				}).appendTo($li);
				$('.thumb_list').append($li);
			}
		})
	})
})

/*
	上传步骤图
*/

$('#stepUploadImg').on('change',function(){
	var files = [...this.files];
	files.forEach(file=>{
		//使用formData对象来构建formData
		let fd = new FormData();
		//第一个参数是后端接收的key，第二个参数是value
		fd.append('cover',file);

		$.ajax({
			method : 'POST',
			url : '/user/publish/cover?type=cookbooks',
			//jquery默认情况下会把数据处理成urlencoded格式，我们不要jq自动帮我们处理
			processData : false,
			//jq还会默认把content-type类型设置成‘application-x-www-form-urlencoded’
			contentType : false,
			data : fd
		}).done(data =>{
			// console.log(data);
			if(data.code == 0){
				//上传成功
				let $li = $('<li class="clearfix">').html(`
						<label>
                            <img data-src="${data.data.url}" src="/public/uploads/cookbooks/${data.data.url}" alt="">
                        </label>
                        <textarea name="miaoshu" placeholder="请输入做法说明菜谱描述，最多输入200字"></textarea>
                        <aside class="side_skill">
                            <span class="remove">X</span>
                            <span class="up">∧</span>
                            <span class="down">∨</span>
                        </aside>
					`);
				$('.piclist').append($li);
				
			}
		});
	})
});

/*
	事件委托
*/
$('.piclist').delegate('span.remove','click',function(){
	$(this).parent().parent().remove();
});
$('.piclist').delegate('span.up','click',function(){
	var liEl = $(this).parent().parent();
	$(liEl).insertBefore($(liEl).prev());
});
$('.piclist').delegate('span.down','click',function(){
	var liEl = $(this).parent().parent();
	$(liEl).insertAfter($(liEl).next());
});
