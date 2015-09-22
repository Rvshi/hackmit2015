$(function () {
            var k1,k2,k3,k4;
    
    function sortNumber(a,b) {
    return a - b;
}
    function cut(Start, End) {
        //output = List of arrays where each array = <Interval(start), Interval(end)>

        //Combining starting and ending points and ordering them
        var Combined = new Array();
        for (k1 = 0; k1 < Start.length; k1++) {
            Combined.push(Start[k1]);
        }
        for (k2 = 0; k2 < End.length; k2++) {
            Combined.push(End[k2]);
        }
        Combined.sort(sortNumber);    
        Combined = removerepeats(Combined);
   

        var results = new Array();
        for (k1 = 0; k1 < Combined.length - 1; k1++) {
            var range = new Array();
            range.push(Combined[k1]);
            range.push(Combined[k1 + 1]);
            results.push(range);
        }
        return results;
    }

    function removerepeats(a) {
        var output = new Array();
        for (k1 = 0; k1 < a.length; k1++) {
            if (k1 > 0) {
                if ((a[k1] === a[k1 - 1]) == false) {
                    output.push(a[k1]);
                }
            } else {
                output.push(a[k1]);
            }
        }
        return output;
    }

    function schedule(B, SB, T, FlightIn, FlightOut) {
        // B contains a list of businesses, and T contains a list of arrays, each displaying each business's hours of operation
        // For instance: <2,3> = 2 to 3, and <2,3,6,7> = 2 to 3 and 6 to 7.
        // SB = "super" businesses which take precedence over all other businesses (however, flyingin and flyingout events take precedence over all "super" businesses)

        //add [FlightIn, FlightOut] as a "super" business
        var FlyingIn = new Array();
        FlyingIn.push(-1.0);
        FlyingIn.push(FlightIn);
        B.push("flyingin");
        SB.push("flyingin");
        T.push(FlyingIn);

        var FlyingOut = new Array();
        FlyingOut.push(FlightOut);
        FlyingOut.push(1e7);
        B.push("flyingout");
        SB.push("flyingout");
        T.push(FlyingOut);

        var S = new Array();
        var E = new Array();

        for (k1 = 0; k1 < B.length; k1++) {
            var Times = T[k1];
            for (k2 = 0; k2 < (Times.length / 2); k2++) {
                S.push(Times[2 * k2]);
                E.push(Times[2 * k2 + 1]);
            }
        }
        var IntervalAndCounter = cut(S, E);

        var Intervals = new Array();
        for (k1 = 0; k1 < IntervalAndCounter.length; k1++) {
            var Range = new Array();
            Range.push(IntervalAndCounter[k1][0]);
            Range.push(IntervalAndCounter[k1][1]);
            Intervals.push(Range);
        }

        var Businesses = new Array();
        for (k1 = 0; k1 < Intervals.length; k1++) {
            var BusinessList = new Array();
            for (k2 = 0; k2 < B.length; k2++) {
                for (k3 = 0; k3 < (T[k2].length / 2); k3++) {
                    if (T[k2][2 * k3] <= Intervals[k1][0] &&
                        T[k2][2 * k3 + 1] >= Intervals[k1][1]) {
                        BusinessList.push(B[k2]);
                        break;
                    }
                }
            }
            Businesses.push(BusinessList);
        }
        //take account of "super" businesses
        for (k1 = 0; k1 < Businesses.length; k1++) {
            var marker = 0;
            for (k4 = 0; k4 < Businesses[k1].length; k4++) {
                if (Businesses[k1][k4] === "flyingin") {
                    marker = 1;
                    break;
                } else if (Businesses[k1][k4] === "flyingout") {
                    marker = 2;
                    break;
                }
            }
            for (k2 = 0; k2 < Businesses[k1].length; k2++) {
                for (k3 = 0; k3 < SB.length; k3++) {
                    if ((Businesses[k1][k2] === SB[k3]) && marker == 0) {
                        Businesses[k1] = [];
                        Businesses[k1].push(SB[k3]);
                        break;
                    } else if ((Businesses[k1][k2] === SB[k3]) && marker == 1) {
                        Businesses[k1] = [];
                        Businesses[k1].push("flyingin");
                        break;
                    } else if (Businesses[k1][k2] === SB[k3] && marker == 2) {
                        Businesses[k1] = [];
                        Businesses[k1].push("flyingout");
                        break;
                    }
                }
            }
        }

        var newIntervals = new Array();
        for (k1 = 0; k1 < Intervals.length; k1++) {
            if (Businesses[k1].length == 1) {
                newIntervals.push(Intervals[k1]);
            } else if (Businesses[k1].length > 1) {
                var size = Businesses[k1].length;
                var dt = (Intervals[k1][1] - Intervals[k1][0]) / size;
                for (k2 = 0; k2 < size; k2++) {
                    var miniInterval = new Array();
                    if (k2 == 0) {
                        miniInterval.push(Intervals[k1][0]);
                        miniInterval.push(Intervals[k1][0] + dt);
                        newIntervals.push(miniInterval);
                    } else if (k2 != 0) {
                        var pastnum = newIntervals[newIntervals.length - 1][1];
                        miniInterval.push(pastnum);
                        if (k2 != size - 1) {
                            miniInterval.push(pastnum + dt);
                        } else if (k2 == size - 1) {
                            miniInterval.push(Intervals[k1][1]);
                        }
                        newIntervals.push(miniInterval);
                    }
                }
            }
        }
        //combine businesses
        var CombineBusinesses = new Array();
        for (k1 = 0; k1 < Businesses.length; k1++) {
            if (k1 == 0) {
                for (k3 = 0; k3 < Businesses[k1].length; k3++) {
                    CombineBusinesses.push(Businesses[k1][k3]);
                }
            } else {
                var except = -1;
                var size2 = CombineBusinesses.length;
                for (k2 = 0; k2 < Businesses[k1].length; k2++) {
                    if (Businesses[k1][k2] === CombineBusinesses[size2 - 1]) {
                        CombineBusinesses.push(Businesses[k1][k2]);
                        except = k2;
                        break;
                    }
                }
                if (except != -1) {
                    for (k2 = 0; k2 < Businesses[k1].length; k2++) {
                        if (k2 != except) {
                            CombineBusinesses.push(Businesses[k1][k2]);
                        }
                    }
                } else {
                    for (k4 = 0; k4 < Businesses[k1].length; k4++) {
                        CombineBusinesses.push(Businesses[k1][k4]);
                    }
                }
            }
        }
        
        //combine to make a proper schedule
        var finalBusinesses = new Array();
        var tempIntervals = new Array();

        for (k1 = 0; k1 < CombineBusinesses.length; k1++) {
            if ((CombineBusinesses[k1] === "flyingin") == false &&
                (CombineBusinesses[k1] === "flyingout") == false) {
                if (k1 == 0) {
                    finalBusinesses.push(CombineBusinesses[0]);
                    tempIntervals.push(newIntervals[k1][0]);
                }
                else if (k1 != 0 && k1 != CombineBusinesses.length - 1) {
                    if ((CombineBusinesses[k1] === CombineBusinesses[k1 + 1]) == false &&
                        (CombineBusinesses[k1] === CombineBusinesses[k1 - 1])) {
                        tempIntervals.push(newIntervals[k1][1]);
                    }
                    else if ((CombineBusinesses[k1] === CombineBusinesses[k1 + 1]) &&
                        (CombineBusinesses[k1] === CombineBusinesses[k1 - 1]) == false) {
                        finalBusinesses.push(CombineBusinesses[k1]);
                        tempIntervals.push(newIntervals[k1][0]);
                    }
                    else if ((CombineBusinesses[k1] === CombineBusinesses[k1 - 1]) == false &&
                        (CombineBusinesses[k1] === CombineBusinesses[k1 + 1]) == false) {
                        finalBusinesses.push(CombineBusinesses[k1]);
                        for (k2 = 0; k2 < newIntervals[k1].length; k2++) {
                            tempIntervals.push(newIntervals[k1][k2])
                        }
                    }
                }
                else if (k1 == CombineBusinesses.length - 1) {
                    if (CombineBusinesses[k1] === CombineBusinesses[k1 - 1]) {
                        tempIntervals.push(newIntervals[k1][1]);
                    } else {
                        for (k3 = 0; k3 < newIntervals[k1].length; k3++) {
                            tempIntervals.push(newIntervals[k1][k3]);
                        }
                        finalBusinesses.push(CombineBusinesses[k1]);
                    }
                }
            }
        }        
        var output = new Array();
        for (k1 = 0; k1 < finalBusinesses.length; k1++) {
            output[k1] = finalBusinesses[k1] + " " + tempIntervals[2 * k1] + " " + tempIntervals[2 * k1 + 1];
        }

        return output;
    }


    var Bedit = new Array();
    Bedit.push("lol");
    Bedit.push("lolol");
    Bedit.push("lololol");
    Bedit.push("lolololol");
    Bedit.push("lololololol");
    Bedit.push("lololololololmao");

    var SBedit = new Array();

    SBedit.push("lolololol");
    SBedit.push("lololololololmao");

    var T = new Array();
    var test1 = new Array();
    test1.push(1.0);
    test1.push(2.5);
    test1.push(3.0);
    test1.push(4.0);
    var test2 = new Array();
    test2.push(2.0);
    test2.push(3.0);
    test2.push(5.0);
    test2.push(7.0);
    var test3 = new Array();
    test3.push(1.0);
    test3.push(2.5);
    test3.push(5.5);
    test3.push(7.5);
    var test4 = new Array();
    test4.push(6.0);
    test4.push(8.0);
    test4.push(3.0);
    test4.push(4.0);
    var test5 = new Array();
    test5.push(3.0);
    test5.push(5.0);
    var test6 = new Array();
    test6.push(2.0);
    test6.push(2.5);
    T.push(test1);
    T.push(test2);
    T.push(test3);
    T.push(test4);
    T.push(test5);
    T.push(test6);
    console.log(schedule(Bedit, SBedit, T, 1.3, 7.1));
});