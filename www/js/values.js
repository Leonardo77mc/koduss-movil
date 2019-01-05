angular.module('koduss.values', [])

.constant('config', {
    confortIconDir: "img/conforts/",
    defaultFrontPhoto: "img/frontPhoto.png",
    initialMapZoom: 13,
    initialSiteZoom: 15
})

.constant('siteTypes', {
    hostel: 1,
    hotelHouse: 2,
    property: 3
})

.constant('urls', {
    states: "data/states.json",
    hostels: "data/hostels/",
    conforts: "data/conforts.json",
    hostel: "data/hostels/single/",
    photos: "img/photos/"
})

.value('currentCity', {
    city: {
        code: 0,
        name: "",
        location: {longitude: 0, latitude: 0}
    }, 
    state: {
        code: 0,
        name: ""
    }
});