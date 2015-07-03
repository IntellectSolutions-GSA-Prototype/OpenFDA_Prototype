app.controller('LandingController', ['$routeParams', '$http', '$log', function ($routeParams, $http, $log) {
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Video Intro');
    };
    this.isMobile = function () {
        return window.isMobile();
    };
}]);