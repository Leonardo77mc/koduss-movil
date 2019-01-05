angular.module('koduss.controllers', ['koduss.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, 
    config, ConfigService, StateService, ConfortService) {

    ConfigService.load();
    StateService.load();
    ConfortService.load();

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
  
    $ionicModal.fromTemplateUrl('templates/start-slides.html', {
        scope: $scope
    }).then(function(modalSlides) {
        $scope.modalSlides = modalSlides;
        //$scope.modalSlides.show();
    });
    
    $scope.closeStartSlides = function() {
        $scope.modalSlides.hide();
    };
    
    $rootScope.openSelectCityModal = function(_closeable) {
        var closeable = _closeable === undefined? true: _closeable;
        var scope = this;
        $ionicModal.fromTemplateUrl('templates/select-city.html', {
            scope: scope,
            backdropClickToClose: false,
            hardwareBackButtonClose: closeable
        }).then(function(selectCity) {
            scope.selectCityModal = selectCity;
            scope.selectCityCloseable = closeable;
            scope.selectCityModal.show();
        });
    };
    
    $rootScope.closeSelectCityModal = function() {
        this.selectCityModal.hide();
    };
    
    $rootScope.getFrontPhoto = function(hostel) {
        if (hostel.frontPhoto == null) {
            return config.defaultFrontPhoto;
        }

        return hostel.frontPhoto;
    };

    $rootScope.getConfortIcon = function(confort) {
        var confortIconDir = config.confortIconDir;

        var conforts = ConfortService.conforts;

        for (var i = 0; i < conforts.length; ++i) {
            if (conforts[i]._id == confort) {
                return confortIconDir + conforts[i].icon;
            }
        }

        return "";
    };

    $rootScope.getSexText = function(hostel) {
        switch(hostel.sex) {
            case 1:
                return "Hombres";
            case 2:
                return "Mujeres";
            case 3:
                return "Mixto";
            default:
                return "Error!!";
        }
    };
    
    $rootScope.createMapObject = function(location, initialZoom) {
        return {
            initialZoom: initialZoom,
            center: {
                latitude: location.latitude,
                longitude: location.longitude
            }
        };
    };
    
    $rootScope.createSiteMarker = function(site) {
        var marker = {
            id: site._id,
            coords: {
                latitude: site.location.latitude,
                longitude: site.location.longitude
            },
            options: {
                draggable: false,
                labelContent: site.address,
                labelAnchor: "40 90",
                labelClass: "marker-labels"
            }
        };
        
        return marker;
    };
})

.controller('HostelsCtrl', function($scope, $filter, ConfigService, HostelService) {
    
    $scope.$on('$ionicView.enter', function() {
        
        var currentCity = ConfigService.getCurrentCity();
        if (currentCity === null) {
            $scope.openSelectCityModal(false);
        } else {
            HostelService.citySelected($scope);
        }
    });
    
    $scope.citySelected = function() {
        HostelService.citySelected($scope);
    };
    
    $scope.isAndroid = ionic.Platform.isAndroid();
    
    $scope.getPrice = function(hostel) {
        if (hostel.prices[0] === null) {
            return $filter('currency')(hostel.prices[1], '$');
        } else if (hostel.prices[1] === null) {
            return $filter('currency')(hostel.prices[0], '$');
        } else {
            return "Multiples Precios";
        }
    };
})

.controller('HostelCtrl', function($scope, config, HostelService, $stateParams, 
    currentCity, Utils, siteTypes, UrlResolverService) {
    
    $scope.map = $scope.createMapObject(currentCity.city.location, config.initialSiteZoom);
    
    HostelService.loadSingle($stateParams.hostelId, 
    function(hostel){
        $scope.frontPhoto = $scope.getFrontPhoto(hostel);
        $scope.sex = $scope.getSexText(hostel);
        Utils.copyLocation(hostel.location, $scope.map.center);
        $scope.hostel = hostel;
        $scope.hostel.marker = $scope.createSiteMarker(hostel);
        
    }, function(hostel) {
        $scope.photos = UrlResolverService.getPhotos(siteTypes.hostel, hostel._id, hostel.photos);
    });
})

.controller('GalleryCtrl', function($scope, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
    $scope.zoomMin = 1;
    
    $scope.showImages = function(index) {
        $scope.activeSlide = index;
        $scope.showModal('templates/gallery-zoom.html');
    };
 
    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };
 
    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
    };
 
    $scope.updateSlideStatus = function(slide) {
        var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
        if (zoomFactor == $scope.zoomMin) {
            $ionicSlideBoxDelegate.enableSlide(true);
        } else {
            $ionicSlideBoxDelegate.enableSlide(false);
        }
    };
})

.controller('SelectCityCtrl', function($scope, StateService, ConfigService) {
    StateService.load(function(states) {
        $scope.states = states;
    });
    
    $scope.toggleState = function(state) {
        if ($scope.isStateShown(state)) {
            $scope.shownState = null;
        } else {
            $scope.shownState = state;
        }
    };
    
    $scope.isStateShown = function(state) {
        return $scope.shownState === state;
    };
    
    $scope.selectCity = function(city, state) {
        ConfigService.setCurrentCity(city, state);
        $scope.selectCityModal.hide();
        $scope.citySelected();
    };
});