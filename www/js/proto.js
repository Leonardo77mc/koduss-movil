function Site() {}

Site.prototype = {
    constructor: Site,
    createMarker: function() {
        var marker = {
            id: this._id,
            coords: {
                latitude: this.location.latitude,
                longitude: this.location.longitude
            },
            options: {
                draggable: false,
                labelContent: this.address,
                labelAnchor: "40 90",
                labelClass: "marker-labels"
            }
        };
        
        return marker;
    }
};

function Hostel() {}

Hostel.prototype = {
    constructor: Hostel,
    getSexText: function() {
        switch(this.sex) {
            case 1:
                return "Hombres";
            case 2:
                return "Mujeres";
            case 3:
                return "Mixto";
            default:
                return "Error!!";
        }
    },
    getPrice: function() {
        if (this.prices[0] === null) {
            return $filter('currency')(this.prices[1], '$');
        } else if (this.prices[1] === null) {
            return $filter('currency')(this.prices[0], '$');
        } else {
            return "Multiples Precios";
        }
    }
};