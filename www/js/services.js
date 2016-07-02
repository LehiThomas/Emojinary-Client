emojinary.factory('user', function (ngFB, $http) {
	var obj = {};

    obj.getFullUser = function(){
        ngFB.api({
            path: '/me',
            params: {
                fields: 'id,name'
            }
	   }).then(function(fbUser){
            $http.get("http://192.168.1.67:3000/user?id="+fbUser.id).success(function(userSet){
                obj.data = userSet;
                obj.data.name = fbUser.name;
                window.location = '#/home'
            });
        },error);
    }

	function error(err){
		console.log(err)
	}

	return obj;
})

.factory('friends', function (ngFB, $http) {
	var obj = {};

	obj.data = {};

	ngFB.api({
		path: '/me/friends',
		params: {
			fields: 'name,id'
		}
	}).then(getStats,error);


	function getStats(users){
		var ids = [];
		for(var i = 0; i < users.data.length; i++){
			ids.push(users.data[i].id);
		}
		$http.get("http://192.168.1.67:3000/users?ids="+ids).success(function(usersSet){
			for(var i = 0; i < usersSet.length; i++){
				for(var ii = 0; ii < users.data.length; ii++){
					if(usersSet[i].id === users.data[ii].id){
						usersSet[i].name = users.data[ii].name;
					}
				}
			}
			obj.data = usersSet;
		});
	}

	function error(err){
		console.log(err)
	}

	return obj;
})

.factory('createChallenge', function (user, $ionicLoading, $http) {
	var obj = {data: {}};

	obj.sendChallenge = function(answer, emojis, clue){
		if(!answer || emojis.length < 1) {
			alert('Must fill out an answer and emojis!');
			return;
		}

	   	var challenge = {
			challenger: user.data.id,
			opponent: obj.data.opponent.id,
			answer: answer,
			emojis: emojis,
			tries: 0,
			clue: clue
		};
		console.log(challenge);
		$http.post("http://192.168.1.67:3000/challenge", challenge)
			.success(function(data){
				$ionicLoading.show({
			      duration: 2000,
			      noBackdrop: false,
			      template: '<p class="item-icon-left">Sending...<ion-spinner icon="lines"/></p>'
			    });
			window.location = "#/home";
		});

	}

	return obj;
})

.factory('challenge', function (user, $http) {
	var obj = {};

	obj.getChallenges = function(){
        if(!user.data){
            window.location = '#/';
            return;
        }
		return $http.get("http://192.168.1.67:3000/challenges?id="+user.data.id);
	}

	obj.selectChallenge = function(chal){
		obj.selectedChallenge = chal;
		console.log(obj.selectedChallenge)
		window.location = "#/challenge";
	}

	obj.getHours = function(postDate){
		var pd = new Date(postDate);
		return Math.floor((new Date() - pd)/60000/60)+'hr';
	}

	return obj;
})
