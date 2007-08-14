/**
 * @description Javascript code for loading the mini Timegrid displaying
 *   picked classes
 */

var collection = window.exhibit.getCollection("picked-classes");
var miniEventSource = new Timegrid.RecurringEventSource();

(function() {
    var dayMap = {
        'M' : 1,
        'T' : 2,
        'W' : 3,
        'R' : 4,
        'F' : 5
    };
    var addSection = function(sectionID) {
        var db = collection.getDatabase();
        var color = getNextColor();
        db.getSubjects(sectionID, "section").visit(function(lecID) {
            var parseTime = function(s) {
                return s ? Date.parseString(s, "HH:mm") : null;
            };
            var dayLetter = db.getObject(lecID, "day");
            var start = parseTime(db.getObject(lecID, "start"));
            var end   = parseTime(db.getObject(lecID, "end")) || 
                        start.clone().add('h', 1);
            var day   = dayMap[dayLetter];
            miniEventSource.addEventPrototype(
                new Timegrid.RecurringEventSource.EventPrototype(
                    [day], start, end, "", "", "", "", "", color, ""));
        });
    };
    var syncCollectionWithSource = function() {
        var itemSet = collection.getRestrictedItems();
        itemSet.visit(addSection);
    };
    collection.addListener({ onItemsChanged: syncCollectionWithSource });
})();
