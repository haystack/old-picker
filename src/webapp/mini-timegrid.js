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
    var addSection = function(sectionID) {
        var db = window.exhibit.getDatabase();
        var classID = db.getObject(sectionID, "class");
        var color = db.getObject(sectionID, "color");
        
        db.getSubjects(sectionID, "section").visit(function(lecID) {
            var parseTime = function(s) {
                return s ? Date.parseString(s, "H:mm") ||
                           Date.parseString(s, 'H:mm:ss') : null;
            };
            var dayLetter = db.getObject(lecID, "day");
            var start = parseTime(db.getObject(lecID, "start"));
            var end   = parseTime(db.getObject(lecID, "end")) || 
                    start.clone().add('h', 1);
            var day   = dayMap[dayLetter];
            var eProto = new Timegrid.RecurringEventSource.EventPrototype(
                [ day ], 
                start, 
                end, 
                db.getObject(classID, "label") + " (" + db.getObject(lecID, "room") + ")", 
                "", 
                "", 
                "", 
                "", 
                color, 
                "white"
            );
            eProtos.push(eProto);
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
