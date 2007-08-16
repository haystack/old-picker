var debug = (document.location.search == "?debug");
var colorTable = [
    {   color:      "#F01E4F",
        used:       false
    },
    {   color:      "#41607F",
        used:       false
    },
    {   color:      "#C69EE4",
        used:       false
    },
    {   color:      "#C28F0E",
        used:       false
    },
    {   color:      "#79CE9D",
        used:       false
    },
    {   color:      "#7A652F",
        used:       false
    }
];

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
        pickedSections._update = pickedSectionUpdate;
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

function makeFacet(div, expression) {
	var configuration = { expression: expression, facetLabel: div.innerHTML };
	if (expression == '.level') {
		configuration.height = "45px";
	}
	if (expression == '.total-units') {
		configuration.height = "60px";
	}
	div.className = "";
	
	Exhibit.UI.createFacet( configuration, div, window.exhibit.getUIContext());
	
	div.onclick = function() {};
	
};

function pickedSectionUpdate() {
    this._items = this._database.getSubjects("true", "picked");
    this._onRootItemsChanged();
}

function pick(thediv) {

    var sectionID = thediv.getAttribute("sectionID");
	SimileAjax.History.addLengthyAction(
		function() { doPick(thediv, sectionID) },
		function() { doUnpick(thediv, sectionID) },
		"Picked " + sectionID
	);
}

function unpick(thediv) {
	
    var sectionID = thediv.getAttribute("sectionID");
	SimileAjax.History.addLengthyAction(
		function() { doUnpick(thediv, sectionID) },
		function() { doPick(thediv, sectionID) },
		"Unpicked " + sectionID
	);
}

function doPick(thediv, sectionID) {
		window.database.addStatement(sectionID, "picked", "true");
		window.database.addStatement(sectionID, "color", getNewColor());
		window.database.removeStatement(sectionID, "temppick", "true");
		
		window.exhibit.getCollection("picked-sections")._update();

		showHidePickDiv(thediv, false); 
}
function doUnpick(thediv, sectionID) {
    var color = window.database.getObject(sectionID, "color");
    releaseColor(color);
    
    window.database.removeStatement(sectionID, "picked", "true");
    window.database.removeStatement(sectionID, "color", color);
    
    window.exhibit.getCollection("picked-sections")._update();
    
	showHidePickDiv(thediv, true);
}
function mouseOverPick(thediv) {
	var sectionID = thediv.getAttribute("sectionID");
	if (!window.database.getObject(sectionID, "picked")) {
		window.database.addStatement(sectionID, "picked", "true");
		window.database.addStatement(sectionID, "color", getNewColor());
		window.database.addStatement(sectionID, "temppick", "true");
		window.exhibit.getCollection("picked-sections")._update();
	}
}
function mouseOutPick(thediv) {

}
function removeItem(img) {
	var color = window.database.getObject(sectionID, "color");
	var sectionID = img.getAttribute("sectionID");
	var thediv = document.getElementById("divid-" + sectionID);
	
	showHidePickDiv(thediv, true);
	window.database.removeStatement(sectionID, "picked", "true");
	window.database.removeStatement(sectionID, "color", color);
	
	window.exhibit.getCollection("picked-sections")._update();
}
function showHidePickDiv(thediv, picked) {
	thediv.className = picked ? "each-section-unpicked" : "each-section-picked" ;
	var imgs = thediv.getElementsByTagName("img");

	imgs[0].style.display = picked ? "block" : "none";
	imgs[1].style.display = picked ? "none" : "block";	
	
	thediv.onclick = picked ? function() {pick(this);} : function() {unpick(this);};
}

function getNewColor() {
    for (var i = 0; i < colorTable.length; i++) {
        var entry = colorTable[i];
        if (!entry.used) {
            entry.used = true;
            return entry.color;
        }
    }
    return "black";
}
function releaseColor(c) {
    for (var i = 0; i < colorTable.length; i++) {
        var entry = colorTable[i];
        if (c == entry.color) {
            entry.used = false;
        }
    }
}

function showScheduleDetails() {
    document.getElementById("classes-layer").style.visibility = "hidden";
    document.getElementById("schedule-preview-pane").style.visibility = "hidden";
    
    document.getElementById("schedule-details-layer").style.visibility = "visible";
}
function showSchedulePreview() {
    document.getElementById("schedule-details-layer").style.visibility = "hidden";
    
    document.getElementById("classes-layer").style.visibility = "visible";
    document.getElementById("schedule-preview-pane").style.visibility = "visible";
}
