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

emojinary.directive("regExInput", function(){
    "use strict";
    return {
        restrict: "A",
        require: "?regEx",
        scope: {},
        replace: false,
        link: function(scope, element, attrs, ctrl){
          element.bind('keypress', function (event) {
            var regex = new RegExp(attrs.regEx);
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
               event.preventDefault();
               return false;
            }
          });
        }
    };
});

emojinary.directive("focusOnNext", function() {
    return {
        restrict: "A",
        link: function($scope, element) {
            element.on("input", function(e) {
                if(element.val().length == element.attr("maxlength")) {
                    var $nextElement = element.next();
                    if($nextElement.length) {
                        $nextElement[0].focus();
                    }
                }
            });
        }
    }
});