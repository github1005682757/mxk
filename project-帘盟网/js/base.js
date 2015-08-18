var GLOBAL = GLOBAL || {};

GLOBAL.Methods = GLOBAL.Methods || {};
//事件绑定
GLOBAL.Methods.eventUtil = {
	addHandler:function(element, type, handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on" + type, handler);
		}else{
			element["on" + type] = handler;
		}
	},removeHandler:function(){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);	
		}else if(element.deathEvent){
			element.deathEvent("on" + type, handler);
		}else{
			element["on" + type] = null;
		}
	}
};

//创建xmlHttpRequest
GLOBAL.Methods.createXHR = function(){
	var xhr = null;
	if(typeof XMLHttpRequest != "undefined"){
		xhr = new XMLHttpRequest();
	}else if(typeof ActiveXObject != "undefined"){
		if(typeof arguments.callee.activeXString != "string"){
			var versions = ["MSXML2.XMLHttp.6.0","MSXMLK2.XMLHttp.3.0","MSXML2.XMLHttp"],
				len;
			for(i = 0, len = versions.length; i < len; i++){
				try{
					new ActiveXObject(versions[i]);
					arguments.callee.activeXString = versions[i];
				}catch(ex){}
			}
		}
		xhr = new ActiveXObject(arguments.callee.activeXString);
	}else{
		throw new Error("No XHR obejct available.");
	}
	return xhr;
};

//菜单导航
GLOBAL.Nav = GLOBAL.Nav || {};
//遮罩层
GLOBAL.Shade = GLOBAL.Shade || {};
GLOBAL.Shade.init = function(){	
	var $shade = $("#shade");
	if($shade.length == 0){
		var $body = $("body");
		var shade = "<div id='shade'></div>";
		$body.append(shade);
	}	
	GLOBAL.Shade.show();
	GLOBAL.Shade.hide();
};
GLOBAL.Shade.show = function(){3
	$(".shade").fadeIn("300");
	$("#shade").fadeIn("300").fadeTo("fast", 0.5);
};
GLOBAL.Shade.hide = function(){
	$(".jq_close").bind({
		click:function(){
			$(".shade").fadeOut("300");
			$("#shade").fadeOut("300");
		}	
	});
};

//表单校验
GLOBAL.Verify = GLOBAL.Verify || {};
GLOBAL.Verify.required = function(str){
	
}

  		