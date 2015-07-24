var app = angular.module("app", []);
app.directive("hello", function(){
	return {
		restrict: "E",//Element
		replace: true,
		template: "<div>Hello Angular</div>"
	};
})
.directive("alert", function(){
	return {
		restrict: "A",//Attr
		link:function(){
			alert("我在这里");
		}
	};
})
.directive("class", function(){
	return {
		restrict: "C",	//class
		link:function(){
			alert("我是class");
		}
	};
});
