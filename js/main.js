$(function () {
    $('#screen2').css('right', -1 * $(window).width());

    $('#start').click(function () {
        $('#screen1').animate({
            right: $(window).width()
        });
        $('#screen2').fadeIn(0);
        $('#screen2').animate({
            right: 0
        });
    });

    $('#generate').click(function () {
        $('#screen2').fadeOut(0);
        $('#screen3').fadeIn();
        $('#screen2').animate({
            right: 0
        });
    });


    var schedule = {
        "days": [
            {
                "date": "9/19/2015",
                "events": [
                    {
                        "name": "Breakfast",
                        "timeStart": "9:00 AM",
                        "timeEnd": "10:00 AM",
                        "type": "placeholder"
                    },
                    {
                        "name": "Visit MIT Library",
                        "timeStart": "2:00 PM",
                        "timeEnd": "4:00 PM",
                        "type": "suggested"
                    }]
            }
        ]
    }

    var blockHeight = '60px';

    function generateParser(schedule) {
        for (var day = 0; day < schedule.days.length; ++day) {
            var currentDay = schedule.days[day];
            var html = '<div class="day animated fadeIn" data-date="' + day + '" ><h1>' + currentDay.date + '</h1><div class="display">';
            var counter = 0; //counts hour segs.
            var scale = [8, 23];

            // Print out hour segments
            for (var h = scale[0]; h < scale[1]; ++h) {
                var ampm = h >= 12 ? 'pm' : 'am';
                var hour = h % 12;
                var display = (hour ? hour : 12) + ':00 ' + ampm;
                html += '<div class="timeDiv">' + display + '</div>';
                ++counter;
            }
            html += '</div></div>';
            $('#calendar').append(html);

            // Print out each event in the day
            var $currentDiv = $('.day[data-date="' + day + '"]').children('.display'),
                totHeight = counter * blockHeight,
                dayEvents = currentDay.events,
                e = 0;

            function timeout() {
                setTimeout(function () {
                    $currentDiv.append('<div class="event ' + dayEvents[e].type + ' animated fadeInUp"><h1>' + dayEvents[e].name + '</h1><p>' + dayEvents[e].timeStart + ' - ' + dayEvents[e].timeEnd + '</p></div>');
                    if (e < (dayEvents.length - 1)) {
                        ++e;
                        timeout();
                    }
                }, 300);
            }
            timeout();
        }
    }
    generateParser(schedule);



    function getFlights(origin, destination, departure_date, return_date, number_of_results, apikey) {
        var Url = "http://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?" +
            "origin=" + origin +
            "&destination=" + destination +
            "&departure_date=" + departure_date +
            "&return_date=" + return_date +
            "&number_of_results=" + "1" +
            "&apikey=" + "PmD367pC6G8DrAXWLNPLw5UC3NM7R1n2";
        //$('.out').html(Url);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", Url, true); // false for synchronous request
        xmlHttp.send(null);
        var json = xmlHttp.responseText;

        $('.out').html(json);

        //$('.out').html(json);
        /*var response = JSON.parse(json);
    	$('.out').html(response);
    
	var outFlights = response.results[0].itineraries[0].outbound.flights;
	var inFlights = response.results[0].itineraries[0].inbound.flights;
	var events = [];
    
	var outDep = response.results[0].itineraries[0].outbound.flights["departs_at"];
	var outArr = response.results[0].itineraries[0].outbound.flights["arrives_at"];
	var inDep = response.results[0].itineraries[0].inbound.flights["departs_at"];
	var inArr = response.results[0].itineraries[0].inbound.flights["arrives_at"]; */
    }

    getFlights("BOS", "ATL", "2015-10-15", "2015-10-19", "FD", "DF");
});