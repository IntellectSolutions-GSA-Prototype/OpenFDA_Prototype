app.controller('LandingController', ['$routeParams', '$http', '$log', function ($routeParams, $http, $log) {
    //Set the page title for the view context.
    this.setPageTitle = function () {
        window.setPageTitle('ADERS');
    };
    //Indicates if the application is operating in mobile mode or not.
    this.isMobile = function () {
        return window.isMobile();
    };
}]);