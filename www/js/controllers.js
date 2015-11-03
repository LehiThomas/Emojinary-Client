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
            });
    };
})

.controller('homeCtrl', function($scope, user, createChallenge) {
    $scope.user = user;
    console.log($scope.user.data);
    $scope.challenge = createChallenge;
})

.controller('friendsCtrl', function($scope, friends, createChallenge) {
    $scope.friends = friends;
    $scope.chooseOpponent = function(opponent) {
        createChallenge.data.opponent = opponent;
        window.location.href = "#/createChallenge";
    }
})

.controller('challengesCtrl', function($scope, challenge) {
    $scope.data = {};
    $scope.data.challenge = challenge;

    $scope.data.challenges = challenge.getChallenges().then(function(challenges) {
        $scope.data.challenges = challenges.data;
    });
})

.controller('challengeCtrl', function($scope, challenge, user, $http, $ionicModal) {
    $scope.challenge = challenge;
    $scope.user = user;
    $scope.giveUnderscores = function() {
        var underscore = challenge.selectedChallenge.answer;
        // var answer = underscore.replace(/[a-z, 0-9]/ig, '_');
        var answer = '';
        for (var i = 0; i < underscore.length; i++) {
            if (underscore[i] != ' ') {
                answer += '_';
            } else {
                answer += underscore[i];
            }
        }
        return answer;
    }
    $scope.fake = $scope.giveUnderscores();
    $scope.letterClue = function() {
        var answer = challenge.selectedChallenge.answer;
        console.log(answer[Math.floor(Math.random() * answer.length)]);
        var clue = answer[Math.floor(Math.random() * answer.length)];
        while (clue == ' ') {
            clue = answer[Math.floor(Math.random() * answer.length)];
        }
        var checkIndex = answer.indexOf(clue);
        return $scope.fake.substr(0, checkIndex) + clue + $scope.fake.substr(checkIndex + 1, $scope.fake.length);
    }
    $scope.isLetterDisabled = false;
    $scope.isEmojiDisabled = false;
    $scope.checkAnswer = function(answer) {
            if (answer.toUpperCase() === challenge.selectedChallenge.answer.toUpperCase()) {
                $scope.success.show();
            } else {
                $http.post("http://127.0.0.1:3000/try", {
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
        $http.post("http://127.0.0.1:3000/fail", {
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
         $http.post("http://127.0.0.1:3000/answer", {
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
    if (!createChallenge.data.opponent || createChallenge.data.opponent == 'Random') {
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
    $scope.data.clue = [];
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

    $scope.buildCaption = function(icon) {
        $scope.$apply(function() {
            if ($scope.data.caption.length <= 2) {
                $scope.data.caption.push(icon);
            }
        });
    }

    $scope.buildClue = function(icon) {
        $scope.$apply(function() {
            if ($scope.data.clue.length <= 0) {
                $scope.data.clue.push(icon);
            }
        });
    }

})
