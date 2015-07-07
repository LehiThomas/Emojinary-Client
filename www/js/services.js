emojinary.factory('user', function (ngFB, $http, pushNotify) {
	var obj = {};

    obj.getFullUser = function(){
        ngFB.api({
            path: '/me',
            params: {
                fields: 'id,name'
            }
	   }).then(function(fbUser){
            $http.get("http://104.131.161.4:3000/user?id="+fbUser.id).success(function(userSet){
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


.factory('pushNotify', function($rootScope, $http, $cordovaPush){
	var obj = {data:{}};
	var userID2;
	obj.register = function(userID){
		userID2 = userID;
		var androidConfig = {
			"senderID": "475608260286",
		};
		$cordovaPush.register(androidConfig).then(function (result) {},function (err) {});
	};


	$rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
		switch (notification.event) {
		case 'registered':
			if (notification.regid.length > 0) {
				$http.post("http://104.131.161.4:3000/setRegid", {
					id: userID2,
					regid:notification.regid
				}).success(function(res){
					alert("got it!");
				});
			}
			break;

		case 'message':
			// this is the actual push notification. its format depends on the data model from the push server
			alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
			break;

		case 'error':
			alert('GCM error = ' + notification.msg);
			break;

		default:
			alert('An unknown GCM event has occurred');
			break;
		}
	});
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
		$http.get("http://104.131.161.4:3000/users?ids="+ids).success(function(usersSet){
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

.factory('createChallenge', function (user, $http) {
	var obj = {data: {}};

	obj.sendChallenge = function(answer, emojis){
		if(!answer || emojis.length < 1) {
			alert('Must fill out an answer and emojis!');
			return;
		}
	   var challenge = {
			challenger: user.data.id,
			opponent: obj.data.opponent.id,
			answer: answer,
			emojis: emojis
		};

		$http.post("http://104.131.161.4:3000/challenge", challenge)
			.success(function(data){
			alert("Challenge sent!");
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
		return $http.get("http://104.131.161.4:3000/challenges?id="+user.data.id);
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
