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
        $('#screen2').animate({
            right: $(window).width()
        });
        $('#screen3').fadeIn(0);
        generateParser(schedule);
    });


    var schedule = {
        "days": [
            {
                "date": "9/18/2015",
                "events": [
                    {
                        "name": "Flight from RDU",
                        "timeStart": "7:30 PM",
                        "timeEnd": "10:45 PM",
                        "type": "flight"
                    }]
            },
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
                        "name": "Lunch",
                        "timeStart": "11:00 AM",
                        "timeEnd": "12:00 PM",
                        "type": "placeholder"
                    },
                    {
                        "name": "Visit MIT Library",
                        "timeStart": "2:00 PM",
                        "timeEnd": "4:00 PM",
                        "type": "suggested"
                    },
                    {
                        "name": "Visit TD Garden",
                        "timeStart": "5:20 PM",
                        "timeEnd": "6:30 PM",
                        "type": "suggested"
                    },
                    {
                        "name": "Party",
                        "timeStart": "7:10 PM",
                        "timeEnd": "10:40 PM",
                        "type": "suggested"
                    }]
            },
            {
                "date": "9/20/2015",
                "events": [
                    {
                        "name": "Lunch",
                        "timeStart": "11:00 AM",
                        "timeEnd": "12:00 PM",
                        "type": "placeholder"
                    },
                    {
                        "name": "Go to Paul Revere Museum",
                        "timeStart": "2:00 PM",
                        "timeEnd": "4:00 PM",
                        "type": "suggested"
                    },
                    {
                        "name": "Flight to RDU",
                        "timeStart": "5:30 PM",
                        "timeEnd": "8:25 PM",
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
                    raw = d.getHours(),
                    delta = scale[1] - scale[0],
                    result = totHeight * ((raw - scale[0]) / delta);

                if (top)
                    return result + 'px';
                else
                    return totHeight - result + 'px';
            }
            timeout();
        }
        dayLoop();
    }
});