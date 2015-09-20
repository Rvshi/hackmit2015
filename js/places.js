$(function () {
    /*function getCity_ID(dest_city) {
	var Url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"+
	"input="+input+
	"&types="+"geocode"+
	"&key="+"AIzaSyD9WIWFg0D2iGnTq12mM6vDmfEOeLQ4LiE";
	var json
	var m = $.ajax({
    	url: Url,
    	type: 'GET',
    	data: {},
    	dataType: 'json',
    	success: function (city) {
        	json = city;
        	city_id = json.predictions.place_id;
        	return city_id;
    	}
	});
	return m;
	//var response = JSON.parse(json);
    
}

function getLocation(placeid){
	//location=-33.8670,151.1957
	var URL = "https://maps.googleapis.com/maps/api/place/details/json?"+
	"placeid="+placeid+
	"&key="+AIzaSyD9WIWFg0D2iGnTq12mM6vDmfEOeLQ4LiE;
	var json
	var u = $.ajax({
    	url: URL,
    	type: 'GET',
    	data: {},
    	dataType: 'json',
    	success: function (city_info) {
        	json = city_info;
        	city_loc = json.result.geometry.location.lat+result.geometry.location.lng;
        	return city_loc;
    	}
	});    
	return u;
}*/

    function getBusinesses(location, radius, interests, key, days) {
        for (var i = 0; i < interests.length; i++) {
            var URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
                "location=" + location +
                "&radius=" + radius +
                "&name=" + interests[i] +
                "&key=" + key;

            $.ajax({
                url: URL,
                type: 'GET',
                dataType: 'json',
                jsonpCallback: 'callback',
                success: function (json) {
                    console.log(json);
                    processBuisnesses(json);
                }
            });
        }
    }

    function processBuisnesses(results) {
        var businesses = [];
        var wrapper = [];
        /*
           
        
        var retval;
        var counter = 0;
        while (counter < 10 * days) {
            for (var i = 0; i < wrapper.length; i++) {
                for (var j = 0; j < wrapper.length; j++) {
                    if (i < wrapper[i].length) {
                        retval.push(wrapper[j][i]);
                        counter = counter + 1;
                    }
                }
            }
        }
        return retval;
        */
    }

    var businesses = getBusinesses("-33.8670,151.1957", "800", ["entertainment"], "AIzaSyAGi3TztX-WpOY91yWTjSydQwm7qmzhQi0", 5);
});