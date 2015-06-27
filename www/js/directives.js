emojinary.directive('selectEmoji', function(){
    return {
        restrict: 'A',
        link: function(scope, ele, attr){
            ele.bind('click', function(e){
                scope.buildCaption(ele.children()[0].title);
            })
        }
    }
})