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
            var i = c * rowCount + r;
            if (i >= courses.length) {
                break;
            }
            
            var course = courses[i];
            if (course.number == "hass_d") {
                continue;
            }
            
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
            
            if (debug && course.number == "6") {
                td1.firstChild.checked = true;
            }
        }
    }
    
    if (debug) {
        browseCourses(); // Ditto here.
    }
}

function browseCourses() {
    var courses = [];
    var inputs = document.getElementsByName("course");
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.checked) {
            courses.push(input.value);
        }
    }
    
    if (courses.length > 0) {
        document.location = "browse.html?courses=" + encodeURIComponent(courses.join(";"));
    } else {
        alert("You didn't select any courses.");
    }
}

function browseIAPCourses() {
    document.location = "iap-browse.html";
}
