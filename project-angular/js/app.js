var app = angular.module("app", []);

app.controller("AppCtrl", function($scope){
	$scope.loadMoreData = function(){
		alert("正在加载数据...");
	}
});

app.directive("enter", function(){
	return {
		link: function($scope, element, attrs){
			element.bind("mouseenter", function(){
				//$scope.loadMoreData();
				//$scope.$apply("loadMoreData()");
				$scope.$apply(attrs.enter);
			});
		}
	};
});

app.directive("food", function(){
	return {
		restrict:"E",
		controllers: function($scope){
			$scope.foods = [];
			this.addApple = function(){
				$scope.foods.push("apple");
			};
			this.addOrange = function(){
				$scope.foods.push("orange");l
			};
			this.addBanana = function(){
				$scope.foods.push("banana");
			};
		}
	};
});
