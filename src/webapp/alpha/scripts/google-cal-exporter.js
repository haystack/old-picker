/**
 *Exports Course Picker course selections
 *to Google Calendar
 *Function with Google Calendar API
 *
 *Portions of code obtained from https://github.com/jnhnum1/websis
 *
 */

var exportCalendarToGoogle = function() {
    var clientId = '708865523100.apps.googleusercontent.com';
    var scope = 'https://www.googleapis.com/auth/calendar';
    var apiKey = 'AIzaSyA4eSND4AU5UDdWpByNj868ABowMKM0Ge8';

    var withGApi = function() {
      console.log("gapi loaded");
      setTimeout(function() {
          gapi.client.setApiKey(apiKey);
          gapi.auth.init(checkAuth);
        }, 100);
    }
    
    var checkAuth = function() {
        gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
    }

    var handleAuthResult = function(authResult) {
        if(authResult) {
            gapi.client.load("calendar", "v3", exportPickerCalendar);
        } else {
            alert("Authentication failed: please enter correct login information.");
        }
    }
  
    var exportPickerCalendar = function() {
      var $ = jQuery;
      
      var collection = window.exhibit.getCollection("picked-sections");
      var itemSet = collection.getRestrictedItems();
      var labels = itemSet._hash;
      var db = window.exhibit.getDatabase();
      
      for (var item in itemSet._hash) {
        var type = getSessionType(item, db);
        var time = getClassTime(item, db);
        var number = getClassNumber(item, db);
        var loc = getClassLocation(item, db);
        
        if(type != null) {
            var times = parseTimeString(time);
             if (times) {
                var recurList = [];
                for(var i = 0; i < times.length; i++) {
                    recurList.push("RRULE:FREQ=WEEKLY;UNTIL=20130516;BYHOUR=" + times[i].startHour + ";BYMINUTE=" + times[i].startMinute+";BYDAY=" + times[i].days2String);
                }
                var firstEvent = findFirstEvent(times);
                var startDateTime = firstEvent.startHour + ":" + firstEvent.startMinute + ":00";
                var endDateTime = firstEvent.endHour + ":" + firstEvent.endMinute + ":00";
                var firstDay = firstEvent.day;
                var firstDate;
                if (firstDay == "MO") {
                    firstDate = "2013-02-11T";
                } else if (firstDay == "TU") {
                    firstDate = "2013-02-05T";
                } else if (firstDay == "WE") {
                    firstDate = "2013-02-06T";
                } else if (firstDay == "TH") {
                    firstDate = "2013-02-07T";
                } else if (firstDay == "FR") {
                    firstDate = "2013-02-08T";
                } else if (firstDay == "SA") {
                    firstDate = "2013-02-09T";
                } else if (firstDay == "SU") {
                    firstDate = "2013-02-10T";
                }
                var request = gapi.client.calendar.events.insert(
                    {"calendarId": "primary",
                        resource: {
                             "summary": (number + " " + type),
                             "location": loc,
                             "start": {
                                "dateTime": firstDate + startDateTime,
                                "timeZone": "America/New_York"
                             },
                             "end": {
                                "dateTime": firstDate + endDateTime,
                                "timeZone": "America/New_York"
                            },
                            "recurrence": recurList
                        }});
                (function(x) {
                              request.execute(function(resp) {
                                  if (resp) {
                                      console.log("Added " + x);
                                  }
                             });
                          })(number + " "+ type);
                }
             }
        }
        alert("Picked courses has been loaded into calendar.");
      }

  var day2ToInt = function(day2) {
      return {'WE' : 0, 'TH' : 1, 'FR' : 2, 'SA' : 3, 'SU' : 4, 'MO' : 5, 'TU' : 6}[day2]
  }

  var intToDay2 = function(dayint) {
      return ['WE', 'TH', 'FR', 'SA', 'SU', 'MO', 'TU'][dayint];
  }

  var findFirstEvent = function(times) {
      var minDay = Math.min.apply(this, times[0].dayList);
      var minStartHour = times[0].startHour;
      var minStartMinute = times[0].startMinute;
      var minEndHour = times[0].endHour;
      var minEndMinute = times[0].endMinute;

      times.forEach(function(time) {
          var thisMinDay = Math.min.apply(this, time.dayList);
          if (thisMinDay < minDay) {
              minDay = thisMinDay;
              minStartHour = time.startHour;
              minStartMinute = time.startMinute;
              minEndHour = time.endHour;
              minEndMinute = time.endMinute;
          }
      });
      return {startHour: minStartHour, startMinute: minStartMinute, endHour: minEndHour, endMinute: minEndMinute, day: intToDay2(minDay)};
  }


  var day_1_to_2 = function(x) {
      return ({'M': 'MO', 'T': 'TU', 'W': 'WE', 'R': 'TH', 'F': 'FR', 'S': 'SA', 'U': 'SU'})[x]
  }
  // returns a list of objects with startHour, startMinute, endHour, endMinute, and days2String properties, all ready to be directly included in the rrule string.
  // test cases: M2:30-4 TR5 W3-3:30 R5:40
  var parseTimeString = function(timeString) {
      var timeChunks = timeString.match(/([MTWRFSU]+(\s\w+\s)?)\(?([\d-\.]+(\s\w+)?\)?)/g);
      var retObj = [];
      if (!timeChunks) {
          return null;
      }
      timeChunks.forEach(function(x) {
              
              var days = x.match(/[MTWRFSU]+/)[0];
              var dayList = days.split("").map(day_1_to_2);
              var days2String = dayList.join(",");

              var times = x.match(/(\d+)(\.(\d+))?(-(\d+)(\.(\d+))?)?/);
              var patt = /PM/;
              var startHour = times[1];
              var endHour = times[5] || ("" + (parseInt(startHour) + 1));
              
              if(patt.test(x) || parseInt(startHour) < 9){
                  startHour = "" + (parseInt(startHour)+12);
              }
              if(patt.test(x) || parseInt(endHour) < 9){
                  endHour = "" + (parseInt(endHour) + 12);

              }         
              var startMinute = times[3] || "00";
              var endMinute = times[7];
              if (!endMinute) {
                  if (times[5]) {
                      endMinute = "00";
                  } else {
                      endMinute = startMinute;
                  }
              }
              retObj.push({startHour: startHour, startMinute: startMinute, endHour: endHour, endMinute: endMinute, days2String: days2String, dayList: dayList.map(day2ToInt)});
          
          }
      );
      return retObj;
  }

  var getSessionType = function(item, database) {
    var itemname = database.getObject(item, "type");
    return itemname.split("S")[0];
  }
  
  var getClassLocandTime = function(item, database) {
    var locandtime = database.getObject(item, "timeAndPlace");
    return locandtime.split(" ");
  }
  
  var getClassTime = function(item, database) {
    return getClassLocandTime(item, database)[0];
  }
  
  var getClassNumber = function(item, database) {
    return item.substring(3);
  }
  
  var getClassLocation = function(item, database) {
    var arr = getClassLocandTime(item, database);
    return arr[arr.length-1];
  }
  
  var withJquery = function() {
      var $ = jQuery;
      $.getScript("https://apis.google.com/js/client.js", withGApi);
  }

  var jqScript = document.createElement('script');
  var head= document.getElementsByTagName('head')[0];

  jqScript.type='text/javascript';
  jqScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';

  jqScript.onload = withJquery;

  head.appendChild(jqScript);
}