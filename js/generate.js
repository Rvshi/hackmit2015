$(function () {
    var term = 'roch';
    var url = 'http://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=PmD367pC6G8DrAXWLNPLw5UC3NM7R1n2&term=';
    $(".city").keyup(function (e) {
        if (e.which == 13 && ($(this).children('input').val() != '')) {
            var code = $(this).children('.autoComplete').html();
            $(this).children('input').val(code);
            addCity($(this), code);
            $(this).children('.autoComplete').fadeOut();
        } else {
            var value = $(this).children('input').val(),
                $auto = $(this).children('.autoComplete');
            if (value != '') {
                $.get(url + value, function (json) {
                    if (json.length != 0) {
                        $auto.html(json[0].value);
                        $auto.fadeIn(200);
                    } else
                        $auto.fadeOut();
                });
            } else {
                $auto.fadeOut();
            }
        }
    });

    function addCity($this, code) {
        var url = 'http://api.sandbox.amadeus.com/v1.2/location/' + code + '/?apikey=PmD367pC6G8DrAXWLNPLw5UC3NM7R1n2';
        $.get(url, function (json) {
            $this.attr('data-lat', json.city.location.latitude);
            $this.attr('data-long', json.city.location.longitude);
        });
    }
});