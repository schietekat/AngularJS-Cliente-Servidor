var app = angular.module('app',['ngRoute']);

app.config(['$routeProvider', function($routeProvider){

  $routeProvider
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    }).
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'loginController'
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerController'
    }).
    when('/posts', {
      templateUrl: 'views/posts.html',
      controller: 'postsController'
    }).
    when('/posts/new',{
      templateUrl:'views/posts.new.html',
      controller: 'postsController'
    }).
    when('/posts/comments/:id',{
      templateUrl: 'views/comments.html',
      controller: 'commentsController'
    })
    .otherwise({
      redirectTo: '/home'
    });

}]); 

app.controller('logoutController', ['$scope', '$http', '$location', function($scope,$http,$location) {
  $scope.greeting = 'Hola!';

  $scope.logout = function() {
    alert('click logout');
    window.localStorage.setItem('token', '');
    window.localStorage.setItem('user_id', '');
    $location.path('/home');
  }

  $scope.checkLocalStorage = function() {
    return localStorage.getItem('token') != '';
  }

  $scope.getUserbyID = function() {
    $http.get('http://tuister.com/user/'+window.localStorage.getItem('user_id')).then(function (response){
      $scope.user = response.data[0];
      console.log($scope.user);
    }).catch(function(err) {
      console.log(err)
    });
  }

}]);

app.controller('commentsController', ['$scope', '$http', '$routeParams', '$route', function($scope,$http,$routeParams,$route) {
  $scope.getComments = function() {
    $http.get('http://tuister.com/comments')
      .then(function (response){
        $scope.comments = response.data[0];
        console.log($scope.comments);
      })
  }
  $scope.getComments();

  $scope.createComment = function() {
    // console.log({"body" : $scope.comment.body,
    //   "user_id" : window.localStorage.getItem('user_id'),
    //   "route params id" : $routeParams.id,
    //   "asd" : $scope.comment});
    $http.post('http://tuister.com/comment',{
      "body" : $scope.comment.body,
      "user_id" : window.localStorage.getItem('user_id'),
      "post_id" : $routeParams.id
    }).then(function (response){
      $scope.respuesta = response.data;
      console.log($scope.respuesta);
      console.log(response);
      $scope.comment.body = '';
      $route.reload()
    }).catch(function(err) {
        console.log(err)
      });
  }

  $scope.checkRouteparams = function() {
    return $routeParams.id;
  }

  $scope.getID = function() {
    return window.localStorage.getItem('user_id');
  }

  $scope.deleteComment =function(id) {
    // console.log(id);
    $http.delete('http://tuister.com/comment/'+id).then(function(response){
      $scope.respuesta = response.data;
      console.log($scope.respuesta);
      console.log(response);
      $route.reload()
    }).catch(function(err){
      console.log(err)
    });
  }

}]);

app.controller('HomeController', ['$scope', '$http', function($scope,$http) {

}]);

app.controller('postsController', ['$scope', '$http', '$location','$route', function($scope,$http,$location,$route) {

  $scope.getPosts = function() {
    $http.get('http://tuister.com/posts')
      .then(function (response){
        $scope.posts = response.data[0];
        console.log($scope.posts);
      })
  }
  $scope.getPosts();

  $scope.createPost = function() {
    alert('new post');
    console.log($scope.post)
    console.log(window.localStorage.getItem('user_id'));
    $http.post('http://tuister.com/post',{
      "title" : $scope.post.title,
      "body" : $scope.post.body,
      "user_id" : window.localStorage.getItem('user_id')
    })
      .then(function (response){
      $scope.respuesta = response.data;
      console.log($scope.respuesta);
      console.log(response);
      $location.path('/posts');      
      })
      .catch(function(err) {
        console.log(err)
      });
  }

  $scope.getID = function() {
    return window.localStorage.getItem('user_id');
  }

  $scope.deletePost =function(id) {
    // console.log(id);
    $http.delete('http://tuister.com/post/'+id).then(function(response){
      $scope.respuesta = response.data;
      console.log($scope.respuesta);
      console.log(response);
      $route.reload()
    }).catch(function(err){
      console.log(err)
    });
  }
  
}]);

app.controller('loginController', ['$scope', '$http', '$location', function($scope,$http,$location) {

  $scope.iniciarSesion = function () {
    $http.post("http://tuister.com/login", $scope.usuario).then(function (response) {
      $scope.respuesta = response.data;
      console.log($scope.respuesta);
      console.log(response);
      window.localStorage.setItem('token', $scope.respuesta.token);
      window.localStorage.setItem('user_id', $scope.respuesta.id);
      $location.path('/posts');
    }).catch(function(err){
      alert(err.data.error);
      console.log(err.data.error);
    });
  }

}]);

app.controller('registerController', ['$scope', '$http', '$location', function($scope,$http,$location) {
  
  $scope.register = function () {
    $http.post("http://tuister.com/user", $scope.usuario).then(function (response) {
      $scope.respuesta = response.data;
      console.log($scope.respuesta);
      console.log(response);
      alert('Usuario registrado correctamente');

      $scope.usuario.name = '';
      $scope.usuario.nickname = '';
      $scope.usuario.email = '';
      $scope.usuario.password = '';
      $location.path('/login');
    }).catch(function(err){
        console.log(err)
      });
  }

}]);