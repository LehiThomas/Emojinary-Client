emojinary.controller('appCtrl', function($scope, pushNotify){})

.controller('login', function ($scope, $ionicModal, $timeout, ngFB, $location, user) {
    $scope.fbLogin = function () {
        ngFB.login({
            scope: 'email,read_stream,publish_actions,user_friends'
        }).then(
            function (response) {
                if (response.status === 'connected') {
                    user.getFullUser();
                } else {
                    alert('Facebook login failed');
                }
            });
    };
})

.controller('MenuCtrl', function($scope) {
})

.controller('homeCtrl', function ($scope, user, createChallenge) {
    $scope.user = user;
    $scope.challenge = createChallenge;
})

.controller('friendsCtrl', function ($scope, friends, createChallenge) {
    $scope.friends = friends;
    $scope.chooseOpponent = function(opponent){
        createChallenge.data.opponent = opponent;
        window.location.href = "#/home";
    }
})


.controller('challengesCtrl', function($scope, challenge){
    $scope.data = {};

    $scope.data.challenge = challenge;

    $scope.data.challenges = challenge.getChallenges().success(function(challenges){
        $scope.data.challenges = challenges;

        $scope.data.totalChallenges = $scope.data.challenges.length;
    });
})

.controller('challengeCtrl', function ($scope, challenge, $http) {
    $scope.challenge = challenge;

    $scope.checkAnswer = function(answer){
        if(answer === challenge.selectedChallenge.answer){
            alert("Correct!");
            $http.post("http://127.0.0.1:3000/answer", {_id: challenge.selectedChallenge._id, opponent: challenge.selectedChallenge.opponent})
                .success(function(data){
                window.location = "#/home";
            });
        }else{
            alert("Sorry, try again.")
        }
    }
})


.controller('CreateChallangeCtrl', function ($scope, createChallenge) {
    if(!createChallenge.data.opponent || createChallenge.data.opponent == 'Random'){
        createChallenge.data.opponent = {
            name: 'Random',
            id: 0
        };
    }

    $scope.data = {};
    $scope.data.message = allEmojis;
    $scope.data.length = ($scope.data.message).length;
    $scope.data.min = 0;
    $scope.data.max = 196;
    $scope.data.caption = [];
    $scope.challenge = createChallenge;


    $scope.data.changeMinMax = function(element){
        switch(element) {
            case "people":
                $scope.data.min = 0;
                $scope.data.max = 196;
                break;
            case "nature":
                $scope.data.min = 195;
                $scope.data.max = 320;
                break;
            case "items":
                $scope.data.min = 319;
                $scope.data.max = 570;
                break;
            case "house":
                $scope.data.min = 569;
                $scope.data.max = 678;
                break;
            case "random":
                $scope.data.min = 677;
                $scope.data.max = 872;
                break;
            default:
                $scope.data.min = 0;
                $scope.data.max = 196;
        }
    }

    $scope.data.passEmojis = function(caption){
        console.log(caption);
        $scope.data.caption = caption;
    }

    $scope.data.delete = function(index){
        $scope.data.caption.splice(index, 1);
    }

    $scope.buildCaption = function(icon){
        $scope.$apply(function(){
            if($scope.data.caption.length <= 2) {
            $scope.data.caption.push(icon);
            }
        });
    }
})
