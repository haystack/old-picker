/**
 * @description Javascript code for loading the IAP Timegrid displaying
 *   picked classes
 */

function updateIAPTimegrid(preview, previewSectionID) {
    /*
    var collection = window.exhibit.getCollection("picked-sections");
    
    var itemSet = collection.getRestrictedItems();
    var events = [];
    var addSection = function(sectionID) {
        var db = window.exhibit.getDatabase();
        var classID = db.getObject(sectionID, "class");
        var color = db.getObject(sectionID, "color");
        
        db.getSubjects(sectionID, "section").visit(function(lecID) {
        	var start = db.getObject(lecID, "start");
         var end = db.getObject(lecID, "end");      	
        	var evt = new Timegrid.DefaultEventSource.Event(
                parseDateTimeFunction(start),
                parseDateTimeFunction(end),
                "",
                "",
                "",
                db.getObject(classID, "label") + " (" + db.getObject(lecID, "room") + ")",
                "",
                "",
                "",
                "",
                color,
                "white"
            );
            events.push(evt);
        });
    };
    
    itemSet.visit(addSection);
    if (preview) {
        if (previewSectionID) {
            addSection(previewSectionID);
        }
        timegridEventSource.addMany(events); 
    } else {
        timegridEventSource.addMany(events); 
    }
    */
};

function enableIAPTimegrid() {
    var collection = window.exhibit.getCollection("picked-sections");
    
    collection.addListener({ onItemsChanged: function() { updateIAPTimegrid(false); } });
    updateIAPTimegrid();
    
    window.timegrids = [
        Timegrid.createFromDOM($('#timegrid').get(0))
    ];
    
    window.onresize = function() { Timegrid.resize(); };
};
