/**
 * @description Javascript code for loading the mini Timegrid displaying
 *   picked classes
 */

/**
 * A type of EventSource that allows the creation and display of recurring 
 * events that are not tied to a specific date, e.g. 8am on MWF.
 */
var miniEventSource = new Timegrid.RecurringEventSource();
var timegridEventSource = new Timegrid.RecurringEventSource();

function updateMiniTimegrid(preview, previewSectionID) {
    var collection = window.exhibit.getCollection("picked-sections");
    var dayMap = {
        'M' : 1,
        'T' : 2,
        'W' : 3,
        'R' : 4,
        'F' : 5
    };
    
    var itemSet = collection.getRestrictedItems();
    var events = [];
    var addEvent = function(label, dayLetter, start, end, color) {
        var day   = dayMap[dayLetter];
        var event = new Timegrid.RecurringEventSource.EventPrototype(
            [ day ], 
            start, 
            end, 
            label, 
            "", 
            "", 
            "", 
            "", 
            color, 
            "white"
        );
        events.push(event);
    };
    var parseTime = function(s) {
        /* Date.parseString(val, format) defined in Timegrid code; scripts/util/date.js, line 34
        Returns a Date if string can be parsed to specified format
        Returns null if not
        */
        return s ? Date.parseString(s, "H:mm") ||
                   Date.parseString(s, 'H:mm:ss') : null;
    };
    var addSection = function(sectionID) {
        var db = window.exhibit.getDatabase();
        // example: type = "LectureSession"
        var type = db.getObject(sectionID, "type");
        var sectionData = sectionTypeToData[type];
        // example: 7.012 = db.getObject(L017.012, "lecture-session-of");
        var classID = db.getObject(sectionID, sectionData.linkage);
        var classLabel = db.getObject(classID, "label");
        var color = db.getObject(sectionID, "color");
        
        // Definition of visit(function) given in Exhibit documentation
        //"Exhibit.Set.prototype.visit=function(A){for(var B in this._hash){if(A(B)==true){break;}"
        //api/exhibit-bundle.js line 8235 
        db.getObjects(sectionID, "timeAndPlace").visit(function(timeAndPlace) {
        	if (timeAndPlace.search(/arranged/) < 0) {
			    var timePlaceArray = timeAndPlace.split(" ");
			    // deals with EVE classes but ignores location changes
                // EVE format: "W EVE (5-8.30 PM) 56-202" 
			    if (timePlaceArray.length > 4 && timePlaceArray[1] == 'EVE') {
                    // I don't think any time and place still contain BEGIN and END
				    if (timeAndPlace.search(/\(BEGIN/) < 0 && timeAndPlace.search(/\(END/) < 0) {
					    var days = timePlaceArray[0];
					    var time = timePlaceArray[2].replace('(', '');
					    var b = time.split("-");
					    for (var x = 0; x < b.length; x++) {
						    if (b[x].search(/\./) > 0) { 
							    var hourMinutes = b[x].split('.');
							    hourMinutes[0] = parseInt(hourMinutes[0]) + 12;
							    b[x] = hourMinutes[0] + ':' + hourMinutes[1];
						    } else {
							    b[x] = parseInt(b[x]) + 12;
							    b[x] = b[x] + ":00";
						    }
					    }
				    } 
				    var start = parseTime(b[0]);
				    var end = b.length > 1 ? parseTime(b[1]) : start.clone().add('h', 1);
				    var room = timePlaceArray.length > 4 ? (" @ " + timePlaceArray[timePlaceArray.length - 1]) : "";
				    for (var d = 0; d < days.length ; d++) {
					    addEvent(classLabel + room + " " + sectionData.postfix, days.substr(d,1), start, end, color);
				    }
			    } else {
                    // non-EVE format: "MWF9-10.30 56-114"
                    // or perhaps: "MWF9-10.30,TR11-2 56-114"
				    var timeAndDay = timePlaceArray[0].split(",");
				    for (var t = 0; t < timeAndDay.length; t++) {
					    var days = timeAndDay[t].substring(0, timeAndDay[t].search(/\d/));
					    var time = timeAndDay[t].substr(timeAndDay[t].search(/\d/));
					    var startEnd = time.split("-");
					    for (var x = 0; x < startEnd.length; x++) {
						    if (startEnd[x].search(/\./) > 0) { 
							    var hourMinutes = startEnd[x].split('.');
                                // a time like 1 is in the afternoon and notated 13
							    if (hourMinutes[0] < 6) { 
								    hourMinutes[0] = parseInt(hourMinutes[0]) + 12;
								    startEnd[x] = hourMinutes[0] + ':' + hourMinutes[1];
							    } else {
								    startEnd[x] = startEnd[x].replace('\.', ':'); 
							    }
						    } else {
							    if (startEnd[x] < 6) { 
                                    startEnd[x] = parseInt(startEnd[x]) + 12; 
                                }
							    startEnd[x] = startEnd[x] + ":00";
						    }
					    }
					    var start = parseTime(startEnd[0]);
					    var end = startEnd.length > 1 ? parseTime(startEnd[1]) : start.clone().add('h', 1);
					    var room = timePlaceArray.length > 1 ? (" @ " + timePlaceArray[timePlaceArray.length - 1]) : "";
					    for (var d = 0; d < days.length ; d++) {
						    addEvent(classLabel + room + " " + sectionData.postfix, days.substr(d,1), start, end, color);
					    }
				    }
			    }
		    }
        });
    };
    
    itemSet.visit(addSection);
    if (preview) {
        if (previewSectionID) {
            addSection(previewSectionID);
        }
        miniEventSource.setEventPrototypes(events);
    } else {
        miniEventSource.setEventPrototypes(events);
        timegridEventSource.setEventPrototypes(events);
    }
};

function enableMiniTimegrid() {
    var collection = window.exhibit.getCollection("picked-sections");
    
    collection.addListener({ onItemsChanged: function() { updateMiniTimegrid(false); } });
    updateMiniTimegrid();
    
    window.timegrids = [
        Timegrid.createFromDOM($('#mini-timegrid').get(0)),
        Timegrid.createFromDOM($('#timegrid').get(0))
    ];
    
    window.onresize = function() { Timegrid.resize(); };
};
