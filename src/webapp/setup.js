function onLoad() {
    var installHandlers = function(td, num) {
        td.style.cursor = "pointer";
        td.onclick = function() {
            document.getElementById(num).click();
        };
    };
    
    var table = document.getElementById("course-list");
    for (var i = 0; i < 11; i++) {
        var course = courses[i];
        var tr = table.insertRow(i);
        
        var td0 = tr.insertCell(0);
        td0.innerHTML = "<input type='checkbox' " + (course.hasData ? "" : "disable") + "name='course' id='" + course.number + "'value='" + course.number + "'>" + course.number + "</input>";
        
        var td1 = tr.insertCell(1);
        td1.innerHTML = course.name;
        
        if (course.hasData) {
            installHandlers(td1, course.number);
        };
        
        if (!course.hasData) {
            td0.style.color = "#888";
            td1.style.color = "#888";
        }
    };
    for (var j = 0; j < 11; j++) {
        var course = courses[j+11];
        var td2 = table.rows[j].insertCell(2);
        td2.innerHTML = "<input type='checkbox' " + (course.hasData ? "" : "disabled") + "name='course' id='" + course.number + "'value='" + course.number + "'>" + course.number + "</input>";
        
        var td3 = table.rows[j].insertCell(3);
        td3.innerHTML = course.name;
        
        if (course.hasData) {
            installHandlers(td3, course.number);
        };
        
        if (!course.hasData) {
            td2.style.color = "#888";
            td3.style.color = "#888";
        }
        
        // This is just to make developing a bit easier...remove for deployment
        if (debug && course.number == 6) {
           td2.firstChild.checked = true;
           document.getElementById('hass-d').checked = true;
        }
    };
    for (var k = 0; k < 10; k++) {
        var course = courses[k+22];
        var td4 = table.rows[k].insertCell(4);
        td4.innerHTML = "<input type='checkbox' " + (course.hasData ? "" : "disabled") + "name='course' id='" + course.number + "'value='" + course.number + "'>" + course.number + "</input>";
        
        var td5 = table.rows[k].insertCell(5);
        td5.innerHTML = course.name;
        
        if (course.hasData) {
            installHandlers(td5, course.number);
        };
        
        if (!course.hasData) {
            td4.style.color = "#888";
            td5.style.color = "#888";
        }
    };
    
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
