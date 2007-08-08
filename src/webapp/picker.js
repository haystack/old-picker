function onLoad() {
    var courses = [
        {   number: "16",
            name:   "Aeronautics and Astronautics",
            hasData: false
        },
        {   number: "21A",
            name:   "Anthropology",
            hasData: false
        },
        {   number: "4",
            name:   "Architecture",
            hasData: false
        },
        {   number: "20",
            name:   "Biological Engineering",
            hasData: false
        },
        {   number: "7",
            name:   "Biology",
            hasData: false
        },
        {   number: "9",
            name:   "Brain and Cognitive Sciences",
            hasData: false
        },
        {   number: "15",
            name:   "Business (see Sloan School of Management)",
            hasData: false
        },
        {   number: "10",
            name:   "Chemical Engineering",
            hasData: false
        },
        {   number: "5",
            name:   "Chemistry",
            hasData: false
        },
        {   number: "1",
            name:   "Civil and Environmental Engineering",
            hasData: false
        },
        {   number: "CMS",
            name:   "Comparative Media Studies",
            hasData: false
        },
        {   number: "12",
            name:   "Earth, Atmospheric, and Planetary Sciences",
            hasData: false
        },
        {   number: "14",
            name:   "Economics",
            hasData: false
        },
        {   number: "6",
            name:   "Electrical Engineering and Computer Science",
            hasData: true
        },
        {   number: "ESD",
            name:   "Engineering Systems Division",
            hasData: false
        },
        {   number: "21F",
            name:   "Foreign Languages and Literatures",
            hasData: false
        },
        {   number: "HST",
            name:   "Health Sciences and Technology",
            hasData: false
        },
        {   number: "21H",
            name:   "History",
            hasData: false
        },
        {   number: "24",
            name:   "Linguistics and Philosophy",
            hasData: false
        }
    ];
    
    var table = document.getElementById("course-list");
    for (var i = 0; i < courses.length; i++) {
        var course = courses[i];
        var tr = table.insertRow(i);
        
        var td0 = tr.insertCell(0);
        td0.innerHTML = "<input type='checkbox' " + (course.hasData ? "" : "disabled ") + "name='course' value='" + course.number + "'>" + course.number + "</input>";
        
        var td1 = tr.insertCell(1);
        td1.innerHTML = course.name;
        
        if (!course.hasData) {
            tr.style.color = "#888";
        }
    }
}

function browseCourses() {
    var urls = [ "data/schema.js" ];
    var inputs = document.getElementsByName("course");
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.checked) {
            urls.push("data/course-" + input.value + "-classes.js");
            urls.push("data/course-" + input.value + "-lectures.js");
        }
    }
    
    document.getElementById("starting-interface").style.display = "none";
    
    window.database = Exhibit.Database.create();
    
    var fDone = function() {
        document.getElementById("browsing-interface").style.display = "block";
        
        var pickedClasses = new Exhibit.Collection("picked-classes", window.database);
        pickedClasses._update = pickedClassUpdate;
        pickedClasses._update();
        
        window.exhibit = Exhibit.create();
        window.exhibit.setCollection("picked-classes", pickedClasses);
        window.exhibit.configureFromDOM();
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

function pickedClassUpdate() {
    this._items = this._database.getSubjects("true", "picked");
    this._onRootItemsChanged();
}

function pick(button) {
    var classID = button.getAttribute("classID");
    SimileAjax.History.addLengthyAction(
        function() { doPick(button, classID) },
        function() { doUnpick(button, classID) },
        "Picked " + classID
    );
}

function unpick(button) {
    var classID = button.getAttribute("classID");
    SimileAjax.History.addLengthyAction(
        function() { doUnpick(button, classID) },
        function() { doPick(button, classID) },
        "Unpicked " + classID
    );
}

function doPick(button, classID) {
    window.database.addStatement(classID, "picked", "true");
    window.exhibit.getCollection("picked-classes")._update();
    showHidePickButtons(button.parentNode, true);
}
function doUnpick(button, classID) {
    window.database.removeStatement(classID, "picked", "true");
    window.exhibit.getCollection("picked-classes")._update();
    showHidePickButtons(button.parentNode, false);
}

function showHidePickButtons(parentNode, picked) {
    var buttons = parentNode.getElementsByTagName("button");
    buttons[0].style.display = picked ? "none" : "inline";
    buttons[1].style.display = picked ? "inline" : "none";
}

function showAllClasses() {
    document.getElementById("picked-classes").style.display = "none";
    document.getElementById("all-classes").style.display = "block";
}
function showPickedClasses() {
    document.getElementById("all-classes").style.display = "none";
    document.getElementById("picked-classes").style.display = "block";
}