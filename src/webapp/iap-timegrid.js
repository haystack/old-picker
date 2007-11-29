/**
 * @description Javascript code for loading the IAP Timegrid displaying
 *   picked classes
 */

var days = [];
function resetDays() {
    days = [];
    for (var i = 0; i < 31; i++) {
        days.push({ timeSpans: [], lectures: [], conflict: false, preview: false });
    }
}

function updateIAPTimegrid(preview, previewSectionID) {
    var db = window.exhibit.getDatabase();
    var collection = window.exhibit.getCollection("picked-sections");
    var itemSet = collection.getRestrictedItems();
    
    resetDays();
    
    var addLecture = function(lecID, preview) {
        var start = db.getObject(lecID, "start");
        var end = db.getObject(lecID, "end");
        
        var startTime = SimileAjax.DateTime.parseIso8601DateTime(start + ":00");
        if (startTime == null) {
            return;
        }
        
        var endTime = null;
        try {
            endTime = SimileAjax.DateTime.parseIso8601DateTime(end + ":00");
        } catch (e) {}
        if (endTime == null) {
            endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        }
        
        var startMinute = startTime.getHours() * 60 + startTime.getMinutes();
        var endMinute = endTime.getHours() * 60 + endTime.getMinutes();
        
        var dayOfMonth = startTime.getDate();
        var day = days[dayOfMonth - 1];
        day.lectures.push(lecID);
        if (preview) {
            day.preview = true;
        }
        if (!day.conflict) {
            for (var i = 0; i < day.timeSpans.length; i++) {
                var timeSpan = day.timeSpans[i];
                if (!(endMinute < timeSpan.start || startMinute >= timeSpan.end)) {
                    day.conflict = true;
                    break;
                }
            }
            day.timeSpans.push({ start: startMinute, end: endMinute });
        }
    };
    
    var addSection = function(sectionID, preview) {
        var classID = db.getObject(sectionID, "class");
        db.getSubjects(sectionID, "section").visit(function (lecID) { addLecture(lecID, preview); });
    };
    
    itemSet.visit(addSection);
    if (preview) {
        if (previewSectionID) {
            addSection(previewSectionID, true);
        }
    }
    
    for (var i = 0; i < days.length; i++) {
        var day = days[i];
        var td = document.getElementById("day-" + i);
        var preview = day.preview ? " preview-day" : "";
        if (day.conflict) {
            td.className = "calendar-cell conflict-day" + preview;
        } else if (day.lectures.length > 0) {
            td.className = "calendar-cell busy-day" + preview;
        } else {
            td.className = "calendar-cell free-day" + preview;
        }
    }
};

function constructCalendar() {
    var table = document.getElementById("calendar");
    
    var dayOfMonth = -new Date(2008, 0, 1).getDay(); // 0 is Sunday
    while (dayOfMonth < 31) {
        var tr = table.insertRow(table.rows.length);
        for (var c = 0; c < 7 && dayOfMonth < 31; c++) {
            var td = tr.insertCell(c);
            if (dayOfMonth < 0) {
                td.className = "calendar-cell";
            } else {
                td.id = "day-" + dayOfMonth;
                td.className = "calendar-cell free-day";
                td.innerHTML = new String(dayOfMonth + 1);
            }
            dayOfMonth++;
        }
    }
}

function enableIAPTimegrid() {
    constructCalendar();
    resetDays();
    
    var collection = window.exhibit.getCollection("picked-sections");
    collection.addListener({ onItemsChanged: function() { updateIAPTimegrid(false); } });
};
