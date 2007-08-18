function onLoad() {
    var installHandlers = function(td, num) {
        td.style.cursor = "pointer";
        td.onclick = function() {
            document.getElementById('c' + num).click();
        };
    };
    
    var table = document.getElementById("course-list");
    var rowCount = Math.ceil(courses.length / 3);
    for (var r = 0; r < rowCount; r++) {
        var tr = table.insertRow(r);
        
        for (var c = 0; c < 3; c++) {
            var i = r * 3 + c;
            if (i >= courses.length) {
                break;
            }
            
            var course = courses[i];
            var td0 = tr.insertCell(c * 3);
            td0.innerHTML = course.number;
            td0.align = "right";
            
            var td1 = tr.insertCell(c * 3 + 1);
            td1.innerHTML = "<input type='checkbox' " + (course.hasData ? "" : "disabled") + " name='course' id='c" + course.number + "'value='" + course.number + "' />";
            
            var td2 = tr.insertCell(c * 3 + 2);
            td2.innerHTML = course.name;
            
            if (course.hasData) {
                installHandlers(td0, course.number);
                installHandlers(td2, course.number);
            };
            
            if (!course.hasData) {
                td0.style.color = "#888";
                td1.style.color = "#888";
                td2.style.color = "#888";
            }
        }
    }
    
    if (debug) {
        browseCourses(); // Ditto here.
    }
}

function browseCourses() {
    var urls = [ "data/schema.js" ];
    var inputs = document.getElementsByName("course");
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.checked) {
            if (input.value == "Hass-D Courses") {
                urls.push("data/hass-d-classes.js");
                urls.push("data/hass-d-lectures.js");
                urls.push("data/hass-d-sections.js");
            } else {
                urls.push("data/course-" + input.value + "-classes.js");
                urls.push("data/course-" + input.value + "-lectures.js");
                urls.push("data/course-" + input.value + "-sections.js");
            }
        }
    }
    
    document.getElementById("starting-interface").style.display = "none";
    
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
