// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var emojinary = angular.module('emojinary', ['ionic', 'ngOpenFB', 
    'dbaq.emoji', 'ngSanitize', 'ngCordova'])

.run(function($ionicPlatform, ngFB) {
    ngFB.init({
        appId: '424194311096913'
    });
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('login', {
            url: '/',
            templateUrl: 'templates/login.htm',
            controller: 'login'
        })
        .state('home', {
            cache: false,
            url: "/home",
            templateUrl: "templates/home.htm",
            controller: "homeCtrl"
        })
        .state('createChallenge', {
            cache: false,
            url: "/createChallenge",
            templateUrl: "templates/createChallenge.htm",
            controller: "CreateChallengeCtrl"
        })
        .state('challenge', {
            cache: false,
            url: "/challenge",
            templateUrl: "templates/challenge.htm",
            controller: "challengeCtrl"
        })
        .state('challenges', {
            cache: false,
            url: "/challenges",
            templateUrl: "templates/challenges.htm",
            controller: "challengesCtrl"
        })
        .state('friends', {
            cache: false,
            url: "/friends",
            templateUrl: "templates/friends.htm",
            controller: "friendsCtrl"
        })
        .state('choose', {
            url: "/choose",
            templateUrl: "templates/choose.htm",
            controller: "friendsCtrl"
        })
        .state('buyCoins', {
            url: "/buyCoins",
            templateUrl: "templates/buyCoins.htm",
            controller: "buyCoinsCtrl"
        })

})

/*.run(function ($cordovaPush, $rootScope) {

    var androidConfig = {
        "senderID": "475608260286",
    };

    document.addEventListener("deviceready", function () {
        $cordovaPush.register(androidConfig).then(function (result) {},function (err) {});

    }, false);
})*/
