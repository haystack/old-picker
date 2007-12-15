/**
 * @description Javascript code for loading the mini Timegrid displaying
 *   picked classes
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
    var eProtos = [];
    var addEvent = function(label, dayLetter, start, end, color) {
        var day   = dayMap[dayLetter];
        var eProto = new Timegrid.RecurringEventSource.EventPrototype(
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
        eProtos.push(eProto);
    };
    var parseTime = function(s) {
        return s ? Date.parseString(s, "H:mm") ||
                   Date.parseString(s, 'H:mm:ss') : null;
    };
    var addSection = function(sectionID) {
        var db = window.exhibit.getDatabase();
        var type = db.getObject(sectionID, "type");
        var sectionData = sectionTypeToData[type];
        var classID = db.getObject(sectionID, sectionData.linkage);
        var classLabel = db.getObject(classID, "label");
        var color = db.getObject(sectionID, "color");
        
        db.getObjects(sectionID, "timeAndPlace").visit(function(tap) {
            var a = tap.split(" ");
            var b = a[1].split("-");
            var start = parseTime(b[0]);
            var end = b.length > 1 ? parseTime(b[1]) : start.clone().add('h', 1);
            var days = a[0];
            var room = a.length > 2 ? (" @ " + a[2]) : "";
            for (var d = 0; d < days.length ; d++) {
                addEvent(classLabel + room + " " + sectionData.postfix, days[d], start, end, color);
            }
        });
    };
    
    itemSet.visit(addSection);
    if (preview) {
        if (previewSectionID) {
            addSection(previewSectionID);
        }
        miniEventSource.setEventPrototypes(eProtos);
    } else {
        miniEventSource.setEventPrototypes(eProtos);
        timegridEventSource.setEventPrototypes(eProtos);
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
