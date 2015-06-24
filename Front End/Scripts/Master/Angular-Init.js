var app = angular.module('OpenFDAPrototype', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    var urlFormat = "../../Views/{0}";
    var createUrl = function(viewName){
        return exoTools.stringFormatter(urlFormat, viewName);
    };
    $routeProvider.when('/Search', {
        templateUrl: createUrl('Search.html'),
        controller: 'SearchController',
        controllerAs: 'search'
    }).when('/Search/Prescription', {
        templateUrl: createUrl('Search.html'),
        controller: 'PrescriptionLabelsController',
        controllerAs: 'search'
    }).when('/Search/Food', {
        templateUrl: createUrl('Search.html'),
        controller: 'FoodSearchController',
        controllerAs: 'search'
    }).when('/Search/Drugs', {
        templateUrl: createUrl('Search.html'),
        controller: 'DrugSearchController',
        controllerAs: 'search'
    }).when('/Disclosure', {
        templateUrl: createUrl('Disclosure.html'),
        controller: 'DisclosureController',
        controllerAs: 'disclosure'
    });
}]);
var menuItem = exoTools.$class('Prototype.MenuItem', function (text, url, isLogo, show, classes) {
    this.text = text;
    this.url = url;
    this.isLogo = isLogo;
    this.isImage = false;
    this.show = show;
    this.classes = classes || '';
});
var imageMenuItem = exoTools.$class('Prototype.ImageMenuItem', function (src, alt, url, isLogo, show, classes) {
    this.initializeBase('', url, isLogo, show, classes);
    this.src = src;
    this.alt = alt;
    this.isImage = true;
}, menuItem);
app.controller('MainController', ['$route', '$routeParams', '$location', function ($route, $routeParams, $location) {
    this.$route = $route;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.closeMenu = function () {
        window.$menu.close();
        this.setPageTitle();
    };
    this.isMobile = window.isMobile;
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Home');
    };
    this.menuItems = [
        new menuItem('openFDA', '/', true, true),
        new menuItem('Prescription Labels', '#/Search/Prescription', false, true),
        new menuItem('Drug Search', '#/Search/Drugs', false, true),
        new menuItem('Food Search', '#/Search/Food', false, true),
        new menuItem('About Us', '/', false, true),
        new menuItem('Beta Disclosure', '#/Disclosure', false, this.isMobile, 'beta-menu')
    ];
}]);