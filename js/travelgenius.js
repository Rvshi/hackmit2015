$(function () {
    $("#timeStart").datepicker();
    $("#timeStop").datepicker();


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
        generateSchedule();
    });


    var sc1 = {
        "days": [
            {
                "date": "9/24/2015",
                "events": [
                    {
                        "name": "Flight JetBlue 1384 from RDU",
                        "timeStart": "5:55 PM",
                        "timeEnd": "7:44 PM",
                        "type": "flight"
                    }]
            },
            {
                "date": "9/25/2015",
                "events": [
                    {
                        "name": "Breakfast",
                        "timeStart": "9:00 AM",
                        "timeEnd": "10:00 AM",
                        "type": "placeholder"
                    },
                    {
                        "name": "Boston Museum of Fine Arts",
                        "timeStart": "10:15 AM",
                        "timeEnd": "11:40 AM",
                        "type": "suggested"
                    },

                    {
                        "name": "Lunch at Bravo",
                        "timeStart": "12:00 PM",
                        "timeEnd": "1:00 PM",
                        "type": "placeholder"
                    },
                    {
                        "name": "Visit MIT Library",
                        "timeStart": "2:00 PM",
                        "timeEnd": "4:00 PM",
                        "type": "suggested"
                    },
                    {
                        "name": "Visit Harvard University",
                        "timeStart": "5:00 PM",
                        "timeEnd": "6:00 PM",
                        "type": "suggested"
                    },
                    {
                        "name": "Dinner at Russell House Tavern",
                        "timeStart": "7:00 PM",
                        "timeEnd": "9:00 PM",
                        "type": "suggested"
                    }]
            },
            {
                "date": "9/26/2015",
                "events": [
                    {
                        "name": "Lunch",
                        "timeStart": "11:00 AM",
                        "timeEnd": "12:00 PM",
                        "type": "placeholder"
                    },
                    {
                        "name": "Paul Revere House",
                        "timeStart": "9:00 AM",
                        "timeEnd": "10:00 AM",
                        "type": "suggested"
                    },
                    {
                        "name": "Flight JetBlue 2783 to RDU",
                        "timeStart": "1:00 PM",
                        "timeEnd": "3:00 PM",
                        "type": "flight"
                    }]
            }
        ]
    }

    var blockHeight = 60,
        totHeight = 0,
        blockWidth = 350 + 20;

    function generateParser(schedule) {
        $('#calendar').css('width', schedule.days.length * blockWidth);

        var day = 0,
            dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        function dayLoop() {
            var currentDay = schedule.days[day],
                dName = new Date(currentDay.date),
                dayName = dayNames[dName.getUTCDay()];

            var html = '<div class="day animated fadeInRight" data-date="' + day + '" ><h1>' + dayName + ' <div class="dateDisplay">' + currentDay.date + '</div></h1><div class="display">';
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
                dayEvents = currentDay.events,
                e = 0;
            totHeight = counter * blockHeight;

            function timeout() {
                var top = findSpot(dayEvents[e].timeStart, true),
                    bottom = findSpot(dayEvents[e].timeEnd, false);

                setTimeout(function () {
                    $currentDiv.append('<div class="event ' + dayEvents[e].type + ' animated fadeInUp" style="top:' + top + '; bottom:' + bottom + '"><h1>' + dayEvents[e].name + '</h1><p>' + dayEvents[e].timeStart + ' - ' + dayEvents[e].timeEnd + '</p></div>');
                    if (e < (dayEvents.length - 1)) {
                        ++e;
                        timeout();
                    } else {
                        if (day < (schedule.days.length - 1)) {
                            ++day;
                            dayLoop();
                        }
                    }
                }, 300);
            }

            function findSpot(time, top) {
                var d = new Date("9/10/2015 " + time),
                    raw = d.getHours() + (d.getMinutes()/60);
                    delta = scale[1] - scale[0],
                    result = totHeight * ((raw - scale[0]) / delta);
                console.log(raw);
                if (top)
                    return result + 'px';
                else
                    return totHeight - result + 'px';
            }
            timeout();
        }
        dayLoop();
    }

    function getFlights(origin, destination, departure_date, return_date, number_of_results, apikey) {
        var Url = "http://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?" +
            "origin=" + origin +
            "&destination=" + destination +
            "&departure_date=" + departure_date +
            "&return_date=" + return_date +
            "&number_of_results=" + "1" +
            "&apikey=" + "PmD367pC6G8DrAXWLNPLw5UC3NM7R1n2";

        var response;
        $.ajax({
            url: Url,
            type: 'GET',
            data: {},
            dataType: 'json',
            success: function (flights) {
                handleFlights(flights);
            }
        });
    }

    function handleFlights(response) {
        var retflights = [];
        var outFlights = response.results[0].itineraries[0].outbound.flights;
        for (var i = 0; i < outFlights.length; i++) {
            var flt = {
                "name": "",
                "timeStart": "",
                "timeEnd": "",
                "type": "flight"
            };
            flt.name = ("Flight from " + response.results[0].itineraries[0].outbound.flights[i].origin.airport + " &#8594; " + response.results[0].itineraries[0].outbound.flights[i].destination.airport);
            flt.timeStart = (response.results[0].itineraries[0].outbound.flights[i].departs_at);
            flt.timeEnd = (response.results[0].itineraries[0].outbound.flights[i].arrives_at);
            retflights.push(flt);
        }
        var inFlights = response.results[0].itineraries[0].inbound.flights;
        for (var i = 0; i < inFlights.length; i++) {
            var flt = {
                "name": "",
                "timeStart": "",
                "timeEnd": "",
                "type": "flight"
            };
            flt.name = ("Flight from " + response.results[0].itineraries[0].inbound.flights[i].origin.airport + " &#8594; " + response.results[0].itineraries[0].inbound.flights[i].destination.airport);
            flt.timeStart = (response.results[0].itineraries[0].inbound.flights[i].departs_at);
            flt.timeEnd = (response.results[0].itineraries[0].inbound.flights[i].arrives_at);
            retflights.push(flt);
        }
    }

    function generateSchedule() {
        var interests = $('#interests').val().split(/[,]+/),
            origin = $('#begin input').val(),
            destination = $('#end input').val(),
            tS = $('#timeStart').val(),
            tE = $('#timeStop').val();
        /*    if ((tS == '' || tE == '') || (origin == '' || destination == '')) {} else {*/
        // This starts everything
        $('#gen').fadeOut(0);
        $('#generate').addClass('loading');
        $('#loading').fadeIn(400);
        setTimeout(function () {
            $('#screen2').animate({
                right: $(window).width()
            });
            $('#screen3').fadeIn(0);
            //var sc = interests.indexOf('museum') ? sc1 : sc1;
            generateParser(sc1);
        }, 500);


        //getFlights(origin, destination, reformat(tS), reformat(tE), "FD", "DF");
    }

    function reformat(date) {
        var dt = new Date(date),
            mth = dt.getMonth() + 1,
            month = mth > 9 ? mth : '0' + mth,
            date = dt.getDate() > 9 ? dt.getDate() : '0' + dt.getMonth();
        return dt.getFullYear() + '-' + month + '-' + date;
    }

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