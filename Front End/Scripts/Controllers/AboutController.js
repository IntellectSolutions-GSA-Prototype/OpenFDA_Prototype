app.controller('AboutController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.isMobile = function () {
        return window.isMobile();
    };
}]);