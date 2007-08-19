var debug = (document.location.search == "?debug");

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
    {    number:    "21L",
        name:    "Literature",
        hasData: false
    },
    {    number:    "15",
        name:    "Management",
        hasData: false
    },
    {    number:    "3",
        name:    "Materials Science and Engineering",
        hasData: false
    },
    {    number:    "18",
        name:    "Mathematics",
        hasData: false
    },
    {    number:    "2",
        name:    "Mechanical Engineering",
        hasData: false
    },
    {    number:    "MAS",
        name:    "Media Arts and Sciences (Media Lab)",
        hasData: false
    },
    {    number:    "21M",
        name:    "Music and Theater Arts",
        hasData: false
    },
    {    number:    "22",
        name:    "Nuclear Science and Engineering",
        hasData: false
    },
    {    number:    "8",
        name:    "Physics",
        hasData: false
    },
    {    number:    "17",
        name:    "Political Science",
        hasData: false
    },
    {    number:    "STS",
        name:    "Science, Technology, and Society",
        hasData: false
    },
    {    number:    "11",
        name:    "Urban Studies and Planning",
        hasData: false
    },
    {    number:    "21W",
        name:    "Writing and Humanistic Studies",
        hasData: false
    }
];
    
var facetData = {
    'level-facet': {
        expression: '.level',
        facetLabel: 'level &raquo;',
        height:     '4em'
    },
    'units-facet': {
        expression: '.units',
        facetLabel: 'units &raquo;'
    },
    'total-units-facet': {
        expression: '.total-units',
        facetLabel: 'total units &raquo;',
        height:     '8em'
    },
    'day-facet': {
        expression: '!class!section.day',
        facetLabel: 'day of week &raquo;',
        fixedOrder: 'M; T; W; R; F'
    },
    'eng-conc-facet': {
        expression: '.engineering-concentration',
        facetLabel: 'engineering concentration &raquo;',
        height:     '20em'
    },
    'category-facet': {
        expression: '.category',
        facetLabel: 'category &raquo;',
        height:     '20em'
    },
    'semester-facet': {
        expression: '.semester',
        facetLabel: 'semester &raquo;',
        height:     '7em'
    },
    'offering-facet': {
        expression: '.offering',
        facetLabel: 'offering &raquo;',
        height:     '8em'
    }
};

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
