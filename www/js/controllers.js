emojinary.controller('appCtrl', function($scope, pushNotify){})
    
.controller('login', function ($scope, $ionicModal, $timeout, ngFB, $location) {
    $scope.fbLogin = function () {
        ngFB.login({
            scope: 'email,read_stream,publish_actions,user_friends'
        }).then(
            function (response) {
                if (response.status === 'connected') {
                    $location.path('/home');
                } else {
                    alert('Facebook login failed');
                }
            });
    };
})

.controller('homeCtrl', function ($scope, user, createChallenge) {
    $scope.user = user;
    $scope.challenge = createChallenge;
})

.controller('friendsCtrl', function ($scope, friends, createChallenge) {
    $scope.friends = friends;
    $scope.chooseOppenent = function(oppenent){
        createChallenge.data.oppenent = oppenent;
        window.location.href = "#/home";
    }
})


.controller('challengesCtrl', function($scope, challenge){
    $scope.data = {};
    
    $scope.data.challenge = challenge;
    
    $scope.data.challenges = challenge.getChallenges().success(function(challenges){
        $scope.data.challenges = challenges;
    });
})

.controller('challengeCtrl', function ($scope, challenge, $http) {
    $scope.challenge = challenge;
    
    $scope.checkAnswer = function(answer){
        if(answer === challenge.selectedChallenge.answer){
            alert("Correct!");
            $http.post("http://104.131.161.4:3000/answer", {_id: challenge.selectedChallenge._id, oppenent: challenge.selectedChallenge.oppenent})
                .success(function(data){
                window.location = "#/home";
            });
        }else{
            alert("Sorry, try again.")
        }
    }
})


.controller('CreateChallangeCtrl', function ($scope, createChallenge) {
    if(!createChallenge.data.oppenent){
        createChallenge.data.oppenent = {
            name: 'Random',
            id: 0
        };
    }
    $scope.data = {};
    $scope.data.message = allEmojis;
    $scope.data.min = 0;
    $scope.data.max = 25
    $scope.data.caption = [];
    $scope.challenge = createChallenge;
    
    $scope.data.increase = function(){
        if($scope.data.max > allEmojis.length) return;
        $scope.data.min = $scope.data.min + 50;
        $scope.data.max = $scope.data.max + 50;
    }
    $scope.data.decrease = function(){
        if($scope.data.min <= 0) return;
        $scope.data.min = $scope.data.min - 50;
        $scope.data.max = $scope.data.max - 50;
    }
    $scope.buildCaption = function(icon){
        $scope.$apply(function(){
            $scope.data.caption.push(icon);
        });
    }
})