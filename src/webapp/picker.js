var debug = (document.location.search == "?debug");

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
        },
		{	number:	"21L",
			name:	"Literature",
			hasData: false
		},
		{	number:	"15",
			name:	"Management",
			hasData: false
		},
		{	number:	"3",
			name:	"Materials Science and Engineering",
			hasData: false
		},
		{	number:	"18",
			name:	"Mathematics",
			hasData: false
		},
		{	number:	"2",
			name:	"Mechanical Engineering",
			hasData: false
		},
		{	number:	"MAS",
			name:	"Media Arts and Sciences (Media Lab)",
			hasData: false
		},
		{	number:	"21M",
			name:	"Music and Theater Arts",
			hasData: false
		},
		{	number:	"22",
			name:	"Nuclear Science and Engineering",
			hasData: false
		},
		{	number:	"8",
			name:	"Physics",
			hasData: false
		},
		{	number:	"17",
			name:	"Political Science",
			hasData: false
		},
		{	number:	"STS",
			name:	"Science, Technology, and Society",
			hasData: false
		},
		{	number:	"11",
			name:	"Urban Studies and Planning",
			hasData: false
		},
		{	number:	"21W",
			name:	"Writing and Humanistic Studies",
			hasData: false
		}
    ];
	
	var installHandlers = function(td, num) {
        td.onclick = function() {
			console.log(num);
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
	
	var div = document.getElementById("course-table");
	var hassTable = document.createElement("table");
	hassTable.id = "hass-d-table";
	hassTable.cellPadding = "3";
	hassTable.style.paddingTop="15px";
	
	var tr = hassTable.insertRow(0);
	var td0 = tr.insertCell(0);
	td0.innerHTML = "<input type='checkbox' name='course' id='hass-d' value='Hass-D Courses'></input>"
	var td1 = tr.insertCell(1);
	td1.innerHTML = "Hass-D Courses";
	
	//add in when hass-d data has been loaded
	//installHandlers(td1, "hass-d"); 
	
	td1.style.color = "#888"; //remove when hass-d data has been loaded
	
	div.appendChild(hassTable);
	
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
            urls.push("data/course-" + input.value + "-classes.js");
            urls.push("data/course-" + input.value + "-lectures.js");
			urls.push("data/course-" + input.value + "-sections.js");
        }
    }
    
    document.getElementById("starting-interface").style.display = "none";
    
    window.database = Exhibit.Database.create();
    
    var fDone = function() {
        document.getElementById("browsing-interface").style.display = "block";
        document.getElementById("picked-interface").style.display = "block";

        
        var pickedClasses = new Exhibit.Collection("picked-classes", window.database);
        pickedClasses._update = pickedClassUpdate;
        pickedClasses._update();
        
        window.exhibit = Exhibit.create();
        window.exhibit.setCollection("picked-classes", pickedClasses);
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
