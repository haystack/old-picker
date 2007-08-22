var debug = (document.location.search == "?debug");

var courses = [
    {   number: "1",
        name:   "Civil and Environmental Engineering",
        hasData: true
    },
    {    number:    "2",
        name:    "Mechanical Engineering",
        hasData: true
    },
    {    number:    "3",
        name:    "Materials Science and Engineering",
        hasData: true
    },
    {   number: "4",
        name:   "Architecture",
        hasData: true
    },
    {   number: "5",
        name:   "Chemistry",
        hasData: true
    },
    {   number: "6",
        name:   "Electrical Engineering and Computer Science",
        hasData: true
    },
    {   number: "7",
        name:   "Biology",
        hasData: true
    },
    {    number:    "8",
        name:    "Physics",
        hasData: true
    },
    {   number: "9",
        name:   "Brain and Cognitive Sciences",
        hasData: true
    },
    {   number: "10",
        name:   "Chemical Engineering",
        hasData: true
    },
    {    number:    "11",
        name:    "Urban Studies and Planning",
        hasData: true
    },
    {   number: "12",
        name:   "Earth, Atmospheric, and Planetary Sciences",
        hasData: true
    },
    {   number: "14",
        name:   "Economics",
        hasData: true
    },
    {   number: "15",
        name:   "Business (see Sloan School of Management)",
        hasData: true
    },
    {   number: "16",
        name:   "Aeronautics and Astronautics",
        hasData: true
    },
    {    number:    "17",
        name:    "Political Science",
        hasData: true
    },
    {    number:    "18",
        name:    "Mathematics",
        hasData: true
    },
    {   number: "20",
        name:   "Biological Engineering",
        hasData: true
    },
    {   number: "21A",
        name:   "Anthropology",
        hasData: true
    },
    {   number: "21F",
        name:   "Foreign Languages and Literatures",
        hasData: true
    },
    {   number: "21H",
        name:   "History",
        hasData: true
    },
    {    number:    "21L",
        name:    "Literature",
        hasData: true
    },
    {    number:    "21M",
        name:    "Music and Theater Arts",
        hasData: true
    },
    {    number:    "21W",
        name:    "Writing and Humanistic Studies",
        hasData: true
    },
    {    number:    "22",
        name:    "Nuclear Science and Engineering",
        hasData: true
    },
    {   number: "24",
        name:   "Linguistics and Philosophy",
        hasData: true
    },
    {   number: "CMS",
        name:   "Comparative Media Studies",
        hasData: true
    },
    {   number: "ESD",
        name:   "Engineering Systems Division",
        hasData: true
    },
    {   number: "HST",
        name:   "Health Sciences and Technology",
        hasData: true
    },
    {    number:    "MAS",
        name:    "Media Arts and Sciences (Media Lab)",
        hasData: true
    },
    {    number:    "STS",
        name:    "Science, Technology, and Society",
        hasData: true
    }
];
    
var facetData = {
    'course-facet': {
        expression: '.course',
        facetLabel: 'course &raquo;',
        height:     '10em'
    },
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
    'topic-facet': {
        expression: '.topic',
        facetLabel: 'topic &raquo;',
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
