app.controller('SearchController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.title = "openFDA Search";
    this.context = null;
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Search');
    };
}]);