app.controller('DrugSearchController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Drug Reactions Search');
    };
    this.title = "Drug Reactions Search";
    this.context = "Drug Interactions";
}]);