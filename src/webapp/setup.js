Exhibit.Functions["building"] = {
    f: function(args) {
        var building = "";
        args[0].forEachValue(function(v) {
            building = v.split("-")[0];
            return true;
        });
        return new Exhibit.Expression._Collection([ building ],  "text");
    }
};

function onLoad() {
    var urls = [ "data/schema.js" ];
    
    var query = document.location.search;
    if (query.length > 1) {
        var params = query.substr(1).split("&");
        for (var i = 0; i < params.length; i++) {
            var a = params[i].split("=");
            var name = a[0];
            var value = a.length > 1 ? decodeURIComponent(a[1]) : "";
            if (name == "courses") {
                var courses = value.split(";");
                for (var c = 0; c < courses.length; c++) {
                    var course = courses[c];
                    if (course == "hass-d") {
                        urls.push("data/hass-d-classes.js");
                        urls.push("data/hass-d-lectures.js");
                        urls.push("data/hass-d-sections.js");
                    } else {
                        urls.push("data/course-" + course + "-classes.js");
                        urls.push("data/course-" + course + "-lectures.js");
                        urls.push("data/course-" + course + "-sections.js");
                    }
                }
            }
        }
    }

    window.database = Exhibit.Database.create();
    
    var fDone = function() {
        document.getElementById("schedule-preview-pane").style.display = "block";
        document.getElementById("browsing-interface").style.display = "block";
        
        var pickedSections = new Exhibit.Collection("picked-sections", window.database);
        pickedSections._update = function() {
            this._items = this._database.getSubjects("true", "picked");
            this._onRootItemsChanged();
        };
        pickedSections._update();
        
        window.exhibit = Exhibit.create();
        window.exhibit.setCollection("picked-sections", pickedSections);
        window.exhibit.configureFromDOM();
        
        setupExistingFacet(document.getElementById("category-facet"));
        setupExistingFacet(document.getElementById("semester-facet"));
        setupExistingFacet(document.getElementById("offering-facet"));
        
        enableMiniTimegrid();
        enableUnitAdder();
    };
    var fNext = function() {
        if (urls.length > 0) {
            var url = urls.shift();
            var importer = Exhibit.importers["application/json"];
            importer.load(url, window.database, fNext);
        } else {
            fDone();
        }
    };
    fNext();
}
