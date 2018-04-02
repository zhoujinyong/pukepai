$(function(){
	var time=-1;
	var jc=0;
	var fengshu=0;
	var audio=$("audio").get(0);
	var musics=[{path:"image/月光下的凤尾竹.mp3"}];
	$(".btn").show();
	$(".btn").nextAll().hide();
	// 点击开始按钮进入游戏页面 并启动倒计时
	$(".kaishi").on("click",function(){
		audio.src=musics[0].path;
		audio.play()
		$(".btn").hide();
		$(".btn").nextAll().show();
		buju(fapai());
		t=setInterval(function(){
			time+=1;
			if (time<=181) {
				if(time==181){
					alert("对不起！你已超时了");
					audio.pause();
					time=-1
					fengshu=0;
					jc=0;
					$(".fenshu").text("得分:"+fengshu)
					$(".pai").remove();
					$(".btn").show();
					$(".btn").nextAll().hide();
					return;
				}
				$(".jishiqi").text("剩余:"+(180-time)+"s")
			};
		},1000)
	});
	
	var h=$(window).height()
	$(".beijing").height(h)
	$("window").on("resize",function(){
		$(".beijing").css("height",h)
	})
	
	var dact={1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:12,13:13}
function fapai(){
	var poker=[];
	var table={};
	var colors=["h","s","c","d"];
	while(poker.length!==52){
			var index=Math.floor(Math.random()*4)
			var c=colors[index]
			var n=Math.ceil(Math.random()*13)
			var v={color:c,number:n}
			if (!table[n+c]) {
				table[n+c]=true;
				poker.push(v)
			};
		}
		return poker
}

function buju(poker){
		var index=0;
		for (var i = 0,poke; i < 7; i++) {
			for (var j = 0; j < i+1; j++) {
				poke=poker[index]
				index+=1
			$("<div>")
				.attr("id",i+'_'+j)
				.attr("data-number",poke.number)
				.addClass("pai")
				.appendTo(".changjin")
				.css("backgroundImage","url(image/"+dact[poke.number]+poke.color+".png)")
				.delay(index*30)
				.animate({
					top:i*30,
					left:(6-i)*65+j*130+50,
					opacity:1
				})
			};
		};
	for (; index< poker.length; index++) {
		v=poker[index];
		$("<div>")
			.attr("data-number",v.number)
			.addClass("pai next")
			.appendTo(".changjin")
			.css("backgroundImage","url(image/"+dact[v.number]+v.color+".png)")
			.delay(index*20)
			.animate({
				top:400,
				left:250,
				opacity:1
			})
	};
}

			// buju(fapai())
	// ba左边的牌一张一张的移到右边
	var index=0;
	$(".changjin .left").on('click',(function(){
		return function(){
			$(".next").last()
				.css('z-index',index++)
				.animate({left:630})
				.queue(function(){
					$(this).removeClass("next")
					.addClass("first")
					.dequeue()
				})
		}
	}()));
	// 把左边的牌一次性移到右边
	
$(".changjin .right").on("click",(function(){
	return function(){
			// console.log($(".next").length)
		if ($(".next").length) {
			alert("对不起！左边还有牌");
			return;
		}
		if (jc>2) {
			alert("对不起！你的三次机会已经用完")
			audio.pause();
			return;
		};
			jc++;
			$(".first").each(function(i,v){
			$(this).css("z-index",'0')
			.delay(i*50)
			.animate({left:250})
			.queue(function(){
				$(this).removeClass("first")
					.addClass('next')
					.dequeue()
			})
		});	
	}
		
}()));	

//查看这个扑克有没有自定义属性
	function huoqu(el){
		return parseInt($(el).attr("data-number"))
	}
	// 查看扑克上面用没有被别的牌压住
		
	function chakan(el){
		var x=parseInt($(el).attr("id").split("_")[0]);
		var y=parseInt($(el).attr("id").split("_")[1]);
		if ($("#"+(x+1)+"_"+y).length||$("#"+(x+1)+"_"+(y+1)).length) {
			return false;
		}else{
			return true;
		};
	};
// 点击扑克的时候看看有没有两张加起来等于13 或者一张本身等于13的 有就消失 没有就抱错
	var prev
	$(".changjin").on("click",".pai",function(){
		if ($(this).attr("id")&&!chakan(this)) {
			alert("这张牌不能点击")
			return;
		}
		$(this).animate({marginTop:"-20"})
		var number=huoqu(this);
		if (number===13) {
			if($(this).attr("id")=="0_0"){
				alert("恭喜你！闯关成功")
				audio.pause();
				return
			}
			fengshu+=10;
			$(this).animate({top:-50,left:700})
				.queue(function(){
					$(this).detach()
						.dequeue();
				});
		};
		if (prev) {
			if (huoqu(prev)+huoqu(this)===13) {
				if($(this).attr("id")=="0_0"||$(prev).attr("id")=="0_0"){
					alert("恭喜你！闯关成功")
					audio.pause();
					return
				}
				fengshu+=10;
				$(prev).delay(400).animate({
					top:-50,
					left:700
				}).queue(function(){
					$(this).detach().dequeue()
				})
				$(this).animate({
					top:-50,
					left:700
				})
				.queue(function(){
					$(this).detach().dequeue()
				})
			}else{
				$(this).animate({marginTop:0})
				$(prev).delay(400).animate({marginTop:0})
			}
			prev=null
		}else{
			prev=this
		}
	$(".fenshu").text("得分:"+fengshu)
	})
		//重新开始游戏
	$(".chongqi").on("click",function(){
		if (confirm("你确定重新开始游戏？？")) {
			jc=0;
			time=-1
			fengshu=0;
			$(".fenshu").text("得分:"+fengshu)
			$(".pai").remove();
			buju(fapai());
		};
	}) 

	// 设置退出游戏
	$(".jieshu").on("click",function(){
		if(confirm("确定退出游戏？？？")){
			audio.pause();
			time=-1
			fengshu=0;
			jc=0;
			$(".fenshu").text("得分:"+fengshu)
			$(".pai").remove();
			$(".btn").show();
			$(".btn").nextAll().hide();
		}
	})
 })
