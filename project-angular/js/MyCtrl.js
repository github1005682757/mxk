/**
 * Created by mengxk on 2015/7/22.
 */
angular.module("app", [])
    .controller('MyCtrl', function ($scope) {
        $scope.msg = "MyCtrl";
    })
    .controller("FirstCtrl", function ($scope) {
        $scope.msg = "FirstCtrl";
    })
    .controller("SecondCtrl", function ($scope) {
        $scope.msg = "SecondCtrl";
    })
    .controller("MyScope", function ($scope) {
        $scope.msg = "";
        $scope.errormsg = "";
        $scope.user = {
            uname: "",
            pwd: ""
        };
        $scope.reverse = function () {
            return $scope.msg.split("").reverse().join("");
        };
        $scope.login = function(){
            if($scope.user.uname == "admin" && $scope.user.pwd == "123"){
                alert("登录成功");
            }else{
                $scope.errormsg = "用户名或密码错误";
            }
        };
    });