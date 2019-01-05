// Ionic Starter App

angular.module('koduss', ['ionic', 'uiGmapgoogle-maps', 
    'ionic.utils', 'koduss.controllers', 'koduss.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html'
            }
        }
    })
    .state('app.hostels', {
        url: '/hostels',
        views: {
            'menuContent': {
                templateUrl: 'templates/hostels.html',
                controller: 'HostelsCtrl'
            }
        }
    })
    .state('app.hostel', {
        url: '/hostels/:hostelId',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'templates/hostel.html',
                controller: 'HostelCtrl'
            }
        }
    })
    .state('app.hotelHouses', {
        url: '/hotel-houses',
        views: {
            'menuContent': {
                templateUrl: 'templates/hotel-houses.html'
            }
        }
    })
    .state('app.properties', {
        url: '/properties',
        views: {
            'menuContent': {
                templateUrl: 'templates/properties.html'
            }
        }
    })
    .state('app.help', {
        url: '/help',
        views: {
            'menuContent': {
                templateUrl: 'templates/help.html'
            }
        }
    });
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
