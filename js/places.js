$(function() {
	
	var inputlocation = "Boston";
	var idFinder = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + inputlocation + "&types=geocode&key=AIzaSyD9WIWFg0D2iGnTq12mM6vDmfEOeLQ4LiE";
	
	var id = "AIzaSyD9WIWFg0D2iGnTq12mM6vDmfEOeLQ4LiE";
	var url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyD9WIWFg0D2iGnTq12mM6vDmfEOeLQ4LiE&placeid=" + id;


//results.id
	$.ajax({
	        url: idFinder,
	        type: 'GET',
	        data: {},
	        dataType: 'json',
	        success: function (cities) {
	            console.log(cities);
	        }
	});
	
	/**for the arrray
	result.opening_hours.periods
	**/
});
