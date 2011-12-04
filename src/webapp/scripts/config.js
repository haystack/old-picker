var term = "spring";

var courses = [
    {   number: "1",
        name:   "Civil and Environmental Engineering",
        hasData: true,
        //hassd: true,
    },
    {   number:  "2",
        name:    "Mechanical Engineering",
       // hassd: false,
        hasData: true
    },
    {   number:  "3",
        name:    "Materials Science and Engineering",
      //  hassd: true,
        hasData: true
    },
    {   number: "4",
        name:   "Architecture",
    //    hassd: true,
        hasData: true
    },
    {   number: "5",
        name:   "Chemistry",
   //     hassd: false,
        hasData: true
    },
    {   number: "6",
        name:   "Electrical Engineering and Computer Science",
     //   hassd: false,
        hasData: true
    },
    {   number: "7",
        name:   "Biology",
       // hassd: false,
        hasData: true
    },
    {   number:  "8",
        name:    "Physics",
 //       hassd: false,
        hasData: true
    },
    {   number: "9",
        name:   "Brain and Cognitive Sciences",
   //     hassd: true,
        hasData: true
    },
    {   number: "10",
        name:   "Chemical Engineering",
     //   hassd: false,
        hasData: true
    },
    {   number:  "11",
        name:    "Urban Studies and Planning",
       // hassd: true,
        hasData: true
    },
    {   number: "12",
        name:   "Earth, Atmospheric, and Planetary Sciences",
  //      hassd: false,
        hasData: true
    },
    {   number: "13",
        name: "Ocean Engineering",
        hasData: true
    },
    {   number: "14",
        name:   "Economics",
    //    hassd: true,
        hasData: true
    },
    {   number: "15",
        name:   "Business (see Sloan School of Management)",
      //  hassd: false,
        hasData: true
    },
    {   number: "16",
        name:   "Aeronautics and Astronautics",
        //hassd: false,
        hasData: true
    },
    {    number:    "17",
        name:    "Political Science",
   //     hassd: true,
        hasData: true
    },
    {    number:    "18",
        name:    "Mathematics",
     //   hassd: false,
        hasData: true
    },
    {   number: "20",
        name:   "Biological Engineering",
       // hassd: false,
        hasData: true
    },
    {   number: "21A",
        name:   "Anthropology",
  //      hassd: true,
        hasData: true
    },
    {   number: "21F",
        name:   "Foreign Languages and Literatures",
    //    hassd: true,
        hasData: true
    },
    {   number: "21H",
        name:   "History",
      //  hassd: true,
        hasData: true
    },
    {    number:    "21L",
        name:    "Literature",
        //hassd: true,
        hasData: true
    },
    {    number:    "21M",
        name:    "Music and Theater Arts",
   //     hassd: true,
        hasData: true
    },
    {    number:    "21W",
        name:    "Writing and Humanistic Studies",
     //   hassd: true,
        hasData: true
    },
    {   number: "WGS",
        name: "Women's and Gender Studies",
        hasData: true
    },
    {    number:    "22",
        name:    "Nuclear Science and Engineering",
        hasData: true
    },
    {   number: "24",
        name:   "Linguistics and Philosophy",
       // hassd: true,
        hasData: true
    },
    {    number:    "CC",
        name:    "Concourse",
        hasData: true
    },
    {   number: "CMS",
        name:   "Comparative Media Studies",
 //       hassd: true,
        hasData: true
    },
    {    number:    "CSB",
        name:    "Computational and Systems Biology",
        hasData: true
    },
    {    number:    "EC",
        name:    "Edgerton Center",
        hasData: true
    },
    {    number:    "ES",
        name:    "Experimental Study Group",
        hasData: true
    },
    {   number: "ESD",
        name:   "Engineering Systems Division",
   //     hassd: false,
        hasData: true
    },
    {   number: "HST",
        name:   "Health Sciences and Technology",
     //   hassd: false,
        hasData: true
    },
    {   number:  "MAS",
        name:    "Media Arts and Sciences (Media Lab)",
       // hassd: true,
        hasData: true
    },
    {    number:    "AS",
        name:    "ROTC - Aerospace Studies",
        hasData: true
    },
    {    number:    "MS",
        name:    "ROTC - Military Science",
        hasData: true
    },
    {    number:    "NS",
        name:    "ROTC - Naval Science",
        hasData: true
    },
    {   number:  "STS",
        name:    "Science, Technology, and Society",
  //      hassd: true,
        hasData: true
    },
    {    number:    "SWE",
        name:    "Engineering School-Wide Electives",
        hasData: true
    },
    {   number:  "SP",
	    name:	 "Special Programs",
    //    hassd: true,
	    hasData:  true
    },
/*
    {   number:  "hass_d",
        name:    "HASS D",
        hasData: true
    }
*/
];

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
    },
    {   color:      "#CCFF33",
        used:       false
    },
    {   color:      "#66FF00",
        used:       false
    },
    {   color:      "#3333FF",
        used:       false
    },
    {   color:      "#9900CC",
        used:       false
    },
    {   color:      "#CCCCCC",
        used:       false
    },
    {   color:      "#FF0099",
        used:       false
    },
    {   color:      "#CCFFFF",
        used:       false
    },
    {   color:      "#666699",
        used:       false
    },
    {   color:      "#FF6600",
        used:       false
    }
];
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

var sectionTypeToData = {
    "LectureSection": {
        linkage:    "lecture-section-of",
        postfix:    "(lecture)"
    },
    "RecitationSection": {
        linkage:    "rec-section-of",
        postfix:    "(rec)"
    },
    "LabSection": {
        linkage:    "lab-section-of",
        postfix:    "(lab)"
    }
}

var girData = {
	"GIR:PHY1": ["8.01", "8.011", "8.012", "8.01L"],
	"GIR:PHY2": ["8.02", "8.022", "8.021"],
	"GIR:CAL1": ["18.01", "18.014", "18.01A"],
	"GIR:CAL2": ["18.02", "18.022", "18.023", "18.024", "18.02A"],
	"GIR:BIOL": ["7.012", "7.013", "7.014"],
	"GIR:CHEM": ["3.091", "5.111", "5.112"]
}

/* PersistentData object: stores functionality to deal with persistent
 * data in a cleaner way.
 */
/*
var PersistentData = {};

PersistentData.readCookie = function(name) {
    var start = document.cookie.indexOf(name + '=');
    if (start != -1) {
        start = start + name.length + 1;
        var end = document.cookie.indexOf(';', start);
        if (end == -1)
            end = document.cookie.length;
        var content = unescape(document.cookie.substring(start, end));
        if (content != 'null')
        	return content;
        return '';
    }
    return '';
}
*/
/**
 * Returns an Exhibit.Set of the requested stored data
 */
/*
PersistentData.stored = function(name) {
    var sections;
    
	// if Exhibit loaded MySQL data re: picked sections
	if (window.database &&
		window.database.getObjects(name, 'list').size() > 0) {
		sections = window.database.getObjects(name, 'list');
	}
	else { // no prior user data exists, check cookie
		stringArr = this.readCookie(name);
		elts = stringArr.split(',');
		sections = new Exhibit.Set(elts);
	}

	return sections;
}
*/
