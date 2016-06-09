emojinary.controller('appCtrl', function($scope, pushNotify) {})

.controller('login', function($scope, $ionicModal, $timeout, ngFB, $location, user) {
    $scope.fbLogin = function() {
        ngFB.login({
            scope: 'email,read_stream,publish_actions,user_friends'
        }).then(
            function(response) {
                if (response.status === 'connected') {
                    user.getFullUser();
                } else {
                    alert('Facebook login failed');
                }
            },
            function(err){
                console.log(err);
            });
    };
})

.controller('homeCtrl', function($scope, user, createChallenge) {
    $scope.user = user;
    console.log($scope.user.data);
    $scope.challenge = createChallenge;
})

.controller('buyCoinsCtrl', function($scope, user) {
    $scope.user = user;
})

.controller('friendsCtrl', function($scope, friends, createChallenge, $http, user) {
    $scope.friends = friends;
    $scope.chooseOpponent = function(opponent) {
        if(opponent == "Random"){
            var me = user.data.id;
            $http.get("http://192.168.1.67:3000/random?uid="+me).then(function(res){
                var opponents = res.data;
                var size = opponents.length - 1;
            	var randomIndex = Math.floor( Math.random() * size );
                opponent = opponents[randomIndex];
                createChallenge .data.opponent =opponent;
                window.location.href = "#/createChallenge";
            });
        }
        createChallenge.data.opponent = opponent;
        window.location.href = "#/createChallenge";
    }
})

.controller('challengesCtrl', function($scope, challenge) {
    $scope.data = {};
    $scope.data.challenge = challenge;

    $scope.data.challenges = challenge.getChallenges().then(function(challenges) {
        $scope.data.challenges = challenges.data;
        $scope.data.totalChallenges = $scope.data.challenges.length;
    });

    $scope.doRefresh = function() {
        // Do Something
        console.log("It’s working!");
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };
})

.controller('challengeCtrl', function($scope, challenge, user, $http, $ionicModal, $sce, $sanitize) {
    $scope.challenge = challenge;
    $scope.isLetterDisabled = false;    
    $scope.clueGiven = false;
    $scope.guess = [];
    $scope.coins = user.data.coins;

    if(challenge.selectedChallenge.clue.length > 0){
        $scope.isEmojiDisabled = false;
    } else {        
        $scope.isEmojiDisabled = true;
    }

    $scope.giveUnderscores = function() {
        var answer = challenge.selectedChallenge.answer;
        // var answer = underscore.replace(/[a-z, 0-9]/ig, '_');
        var underscore = '';
        for (var i = 0; i < answer.length; i++) {
            if(answer[i+1] == ' '){
              underscore += '<input type="text" style="margin-right:1em;" maxlength="1" ng-model="guess['+ i +']" class="underscore">';  
            } else if (answer[i] != ' ') {
                underscore += '<input type="text" maxlength="1" ng-model="guess['+ i +']" class="underscore">';
            } else {
                $scope.user = user;    
                underscore += '<span></span>';
            }
        }

        return underscore;
    }

    $scope.boxes = challenge.selectedChallenge.answer;

    $scope.usePoints = function() {
        $http.post("http://192.168.1.67:3000/takePoints", {
            id: user.data.id
        }).success(function(data) {
            $scope.coins -= 5;
            user.data.coins -= 5;
        });  
    }

    $scope.letterClue = function() {
        var answer = challenge.selectedChallenge.answer;
        var clue = answer[Math.floor(Math.random() * answer.length)];
        while (clue == ' ') {
            clue = answer[Math.floor(Math.random() * answer.length)];
        }
        var getIndex = answer.indexOf(clue);
        var id = "box" + getIndex;
        if($scope.coins >= 5){
            $scope.usePoints();
            $scope.guess[getIndex] = clue;
            document.getElementById(id).readOnly = true;
        } else {
            alert("You don't have enough coins for this hint!");
        }
    }

    $scope.giveEmojiClue = function(){
        if($scope.coins >= 5){
            $scope.clueGiven = true;
            $scope.usePoints();
        } else {
            alert("You don't have enough coins for this hint!");
        }
    }

    $scope.checkAnswer = function(guess) {
        var answer = challenge.selectedChallenge.answer;
        answer = answer.replace(/\s+/g, '');
        var usersGuess = guess.join("");
        
        if (usersGuess.toUpperCase() === answer.toUpperCase()) {
            $scope.coins += 5;
            user.data.coins = $scope.coins;
            $scope.success.show();
        } else {
            $http.post("http://192.168.1.67:3000/try", {
                _id: challenge.selectedChallenge._id
            }).success(function(data) {});
            challenge.selectedChallenge.tries += 1;
            if (challenge.selectedChallenge.tries >= 3) {
                $scope.fail.show()
            } else {
                $scope.modal.show();
            }
        }
    }

    $scope.autoTab = function(index) {
        var current = '#box' + (index);
        var next = '#box' + (index + 1);

        current = document.querySelector(current);
        next = document.querySelector(next);

        if(next != null){
            if(next.tagName != 'INPUT' || next.readOnly){
                next = '#box' + (index + 2);
                next = document.querySelector(next);
                }

            if(current.value.length > 0){
                next.focus()
            }   
        }    
    }

        // Load the modal from the given template URL
    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'jelly'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Load the modal from the given template URL
    $ionicModal.fromTemplateUrl('fail.html', {
        scope: $scope,
        animation: 'jelly'
    }).then(function(modal) {
        $scope.fail = modal;
    });
    $scope.failed = function() {
        $http.post("http://192.168.1.67:3000/fail", {
            _id: challenge.selectedChallenge._id
        }).success(function(data) {
            window.location = "#/home";
        });
    };

     // Load the modal from the given template URL
    $ionicModal.fromTemplateUrl('success.html', {
        scope: $scope,
        animation: 'jelly'
    }).then(function(modal) {
        $scope.success = modal;
    });
    $scope.gotIt = function() {
        $http.post("http://192.168.1.67:3000/answer", {
            _id: challenge.selectedChallenge._id,
            opponent: challenge.selectedChallenge.opponent,
            challenger: challenge.selectedChallenge.challenger
        })
        .success(function(data) {
            location.href = "#/home";
        });
    };
})

.controller('CreateChallengeCtrl', function($scope, createChallenge) {

    $scope.data = {};
    $scope.data.message = allEmojis;
    $scope.data.length = ($scope.data.message).length;
    $scope.data.min = 0;
    $scope.data.max = 196;
    $scope.data.caption = [];
    $scope.data.clue = [];
    $scope.emojiInput = '';
    $scope.challenge = createChallenge;


    $scope.data.changeMinMax = function(element) {
        switch (element) {
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

    $scope.data.passEmojis = function(caption) {
        console.log(caption);
        $scope.data.caption = caption;
    }

    $scope.data.delete = function(index) {
        $scope.data.caption.splice(index, 1);
    }

    $scope.data.deleteClue = function(index) {
        $scope.data.clue.splice(index, 1);
    }

    $scope.changeInput = function(input){
        $scope.emojiInput = input;
    }

    $scope.buildCaption = function(icon) {
        console.log($scope.emojiInput);
        if($scope.emojiInput == 'caption'){
            $scope.$apply(function() {
                if ($scope.data.caption.length <= 2) {
                    $scope.data.caption.push(icon);
                }
            });
        } else if ($scope.emojiInput == 'clue') {
            $scope.$apply(function() {
                if ($scope.data.clue.length <= 0) {
                    $scope.data.clue.push(icon);
                }
            });
        }
    }
})
