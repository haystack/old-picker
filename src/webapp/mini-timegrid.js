/**
 * @description Javascript code for loading the mini Timegrid displaying
 *   picked classes
 */

function enableMiniTimegrid() {
    var collection = window.exhibit.getCollection("picked-sections");
    miniEventSource = new Timegrid.RecurringEventSource();
    var dayMap = {
        'M' : 1,
        'T' : 2,
        'W' : 3,
        'R' : 4,
        'F' : 5
    };
    var getNextColor = function() {
        var rand255 = function() { return Math.floor(Math.random() * 255); };
        return "rgb(" + rand255() + "," + rand255() + "," + rand255() + ")";
    };
    var addSection = function(sectionID) {
        var db = window.exhibit.getDatabase();
        var color = getNextColor();
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
                [day], start, end, "", "", "", "", "", color, "");
            miniEventSource.addEventPrototype(eProto);
        });
    };
    var syncCollectionWithSource = function() {
        var itemSet = collection.getRestrictedItems();
        miniEventSource.clearEventPrototypes();
        itemSet.visit(addSection);
    };
    collection.addListener({ onItemsChanged: syncCollectionWithSource });
    syncCollectionWithSource();
    window.timegrids = [Timegrid.createFromDOM($('#mini-timegrid').get(0))];
};
