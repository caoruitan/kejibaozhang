// JavaScript Document
$(function(){
	delInputValue($(".m-inputs"));
	function delInputValue(dom){
		var $inputs=dom.find("input"),
			$del=dom.find("i");
		//操作输入框
		$inputs.focus(function(){
			if($(this).val().length){
				showDel($(this));
			}
		})
		$inputs.bind('input',function(){
			if($(this).val().length){
				showDel($(this));
			}else{
				hideDel($(this));
			}
		}).blur(function(){
			var $this=$(this);
			setTimeout(function(){hideDel($this);},200);
		})
		$del.click(function(){
			 emptyInput();
		})
		function emptyInput(dom){
			dom.parent().children("input").val("");
		}
		function showDel(dom){
			dom.parent().children("i").show();
		}
		function hideDel(dom){
			dom.parent().children("i").hide();
		}
   }
})
