app.controller('DisclosureController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.isMobile = function () {
        return window.isMobile();
    };
}]);