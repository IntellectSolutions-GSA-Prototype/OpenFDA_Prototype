app.controller('LandingController', ['$routeParams', '$http', function ($routeParams, $http) {
    //Indicates if the application is operating in mobile mode or not.
    this.setPageTitle = function () {
        window.setPageTitle('ADERS');
    };
}]);