angular.module('koduss.services', ['koduss.values'])

.service('ConfigService', function(LocalStorage, currentCity) {
    var copyCurrentCity = function(city, state) {
        
        currentCity.city.code = city.code;
        currentCity.city.name = city.name;
        currentCity.city.location = city.location;
        
        currentCity.state.code = state.code;
        currentCity.state.name = state.name;
    };
            
    this.load = function() {
        if (currentCity.city.code === 0) {
            var local = LocalStorage.getObject('currentCity');
            if (local.city) {
                copyCurrentCity(local.city, local.state);
            }
        }
    };
    
    this.getCurrentCity = function() {
        if (currentCity.city.code === 0) {
            return null;
        }
        
        return currentCity;
    };
    
    this.setCurrentCity = function(city, state) {
        copyCurrentCity(city, state);
        LocalStorage.setObject('currentCity', currentCity);
    };
})

.factory('UrlResolverService', function(urls) {
    return {
        getStates: function() {
            return urls.states;
        },
        getHostels: function(data) {
            return urls.hostels + data.city + ".json";
        },
        getConforts: function() {
            return urls.conforts;
        },
        getHostel: function(id) {
            return urls.hostel + id + ".json";
        },
        getPhoto: function(siteType, id, photoId) {
            //return urls.photos + siteType + "-" + id + "-" + photoId;
            return "http://placehold.it/640x480/f0f0f0/000000.jpg?text="
                        + siteType + "-" + id + "-" + photoId;
        },
        getPhotos: function(siteType, id, photos) {
            var urls = [];
            var service = this;
            
            photos.forEach(function(photo){
                urls.push(service.getPhoto(siteType, id, photo));
            });
            
            return urls;
        }
    };
})

.service('StateService', function(LocalStorage, $http, UrlResolverService) {
    this.states = null;
    this.loading = false;
    this.callbacks = [];
    
    this.load = function(callback) {
        if (callback) {
            this.callbacks.push(callback);
        }
        
        var service = this;
        if (!this.states) {
            var local = LocalStorage.getObject('states');
            if (!local.states) {
                if (!this.loading) {
                    this.loading = true;
                    $http.get(UrlResolverService.getStates())
                    .then(function (response){
                        service.states = response.data.states;
                        LocalStorage.setObject('states', response.data);
                        service.loading = false;
                        service.callbacks.forEach(function(cb) {
                           cb(service.states); 
                        });
                        service.callbacks = [];
                    });
                }
            } else {
                this.states = local.states;
            }
        }
        
        if (!this.loading) {
            service.callbacks.forEach(function(cb) {
                cb(service.states); 
            });
            service.callbacks = [];
        }
    };
})

.service('ConfortService', function(LocalStorage, $http, UrlResolverService) {
    
    this.conforts = null;
    this.loading = false;
    this.callbacks = [];
    
    this.load = function(callback) {
        if (callback) {
            this.callbacks.push(callback);
        }
        
        var service = this;
        if (!this.conforts) {
            var local = LocalStorage.getObject('conforts');
            if (!local.conforts) {
                if (!this.loading) {
                    this.loading = true;
                    $http.get(UrlResolverService.getConforts())
                    .then(function (response){
                        service.conforts = response.data.conforts;
                        LocalStorage.setObject('conforts', response.data);
                        service.loading = false;
                        service.callbacks.forEach(function(cb) {
                           cb(service.conforts); 
                        });
                        service.callbacks = [];
                    });
                }
            } else {
                this.conforts = local.conforts;
            }
        }
        
        if (!this.loading) {
            service.callbacks.forEach(function(cb) {
                cb(service.conforts); 
            });
            service.callbacks = [];
        }
    };
})

.service('HostelService', function(LocalStorage, $http, UrlResolverService, 
    config, currentCity) {
    
    this.citySelected = function(scope) {
        scope.currentCity = currentCity;
        scope.map = scope.createMapObject(currentCity.city.location, config.initialMapZoom);
        scope.hostels = [];
        this.load(function(hostels){
            scope.hostels = hostels;
            scope.hostels.forEach(function(hostel){
               hostel.marker = scope.createSiteMarker(hostel);
            });
        });
    };
    
    this.hostels = null;
    this.loading = false;
    this.callbacks = [];
    this.city = 0;
    
    this.load = function(callback) {
        if (callback) {
            this.callbacks.push(callback);
        }
        
        var city = currentCity.city.code;
            
        var service = this;
        if (this.city === 0 || this.city !== city || !this.hostels) {
            var local = LocalStorage.getObject('hostels');
            if (!local.city || local.city !== city || !local.hostels) {
                if (!this.loading) {
                    this.loading = true;
                    $http.get(UrlResolverService.getHostels({city: city}))
                    .then(function (response){
                        service.hostels = response.data.hostels;
                        service.city = city;
                        
                        var localData = {
                            hostels: service.hostels,
                            city: city
                        };
                        
                        LocalStorage.setObject('hostels', localData);
                        service.loading = false;
                        service.callbacks.forEach(function(cb) {
                           cb(service.hostels); 
                        });
                        service.callbacks = [];
                    });
                }
            } else {
                this.hostels = local.hostels;
            }
        }
        
        if (!this.loading) {
            service.callbacks.forEach(function(cb) {
                cb(service.hostels); 
            });
            service.callbacks = [];
        }
    };
    
    this.loadSingle = function(id, callback, callback2) {

        this.load(function(hostels) {
            hostels.forEach(function(hostel) {
                if (hostel._id == id) {
                    callback(hostel);
                    var local = LocalStorage.getObject('hostels.' + id);
                    
                    if (!local.user) {
                        
                        $http.get(UrlResolverService.getHostel(id))
                        .then(function(response) {
                            hostel.description = response.data.description;
                            hostel.user = response.data.user;
                            hostel.photos = response.data.photos;
                            
                            var localData = {
                                user: hostel.user,
                                description: hostel.description,
                                photos: hostel.photos
                            };
                            
                            LocalStorage.setObject('hostels.' + id, localData);
                            
                            callback2(hostel);
                        });
                    } else {
                        hostel.user = local.user;
                        hostel.description = local.description;
                        hostel.photos = local.photos;
                        
                        callback2(hostel);
                    }
                }
            });
        });
    };
    
});