app.controller('VideoController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Video Intro');
    };
}]);