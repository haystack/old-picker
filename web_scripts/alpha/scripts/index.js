function onLoad() {
    writeCookie('termChosen', "FA");

    var installHandlers = function(td, num) {
        td.style.cursor = "pointer";
        td.onclick = function() {
            document.getElementById('c' + num).click();
        };
    };
    
    var table = document.getElementById("course-list");
    var rowCount = Math.ceil((courses.length - 1) / 3);
    for (var r = 0; r < rowCount; r++) {
        var tr = table.insertRow(r);
        
        for (var c = 0; c < 3; c++) {
            var i = c * rowCount + r;
            if (i >= courses.length) { break; }
            
            var course = courses[i];
            if (course.number == "hass_d") { continue; }
            
            var td0 = tr.insertCell(c * 3);
            td0.innerHTML = course.number;
            td0.align = "right";
            
            var td1 = tr.insertCell(c * 3 + 1);
            td1.innerHTML = "<input type='checkbox' " + "" + " name='course' id='c" + course.number + "'value='" + course.number + "' />";
            
            var td2 = tr.insertCell(c * 3 + 2);
            td2.innerHTML = course.name;
            
            installHandlers(td0, course.number);
            installHandlers(td2, course.number);
        }
    }
}

function browseCourses() {
    if (document.getElementsByName('button-terms')[2].checked == true) {
        document.location="iap-browse.html";
    }
    
    else {
        browseTerm();
    
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
}

/**
function browseIAPCourses() {
    document.location = "iap-browse.html";
}*/

/** Changes the term of the courses depending on which term is selected.
* Cookie stores term across all pages in session.
*/
function browseTerm() {
    var input;
    var radios = document.getElementsByName('button-terms');
    
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            input = radios[i].value;
        }
    }
    //document.getElementById("term-input").innerHTML="You picked: " + input + " Term";
    writeCookie('termChosen', input);
}

function browseAllCourses() {
    if (document.getElementsByName('button-terms')[2].checked == true) {
        document.location="iap-browse.html";
    }
    else {
        courses = [];
    
        var inputs = document.getElementsByName("course");
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            courses.push(input.value);
        }
    
        document.location = "browse.html?courses=" + encodeURIComponent(courses.join(";"));
    }
}

function toggle_description() {
    var description = document.getElementById("description_appear");
    var welcome = document.getElementById("welcome_appear");
    
    var readMoreBtn = document.getElementById("read_more");
    
    readMoreBtn.onclick = function() {
        if(description.style.display == "none") {
            description.style.display = "block";
            readMoreBtn.innerHTML = "Read Less";
        } else {
            description.style.display = "none";
            readMoreBtn.innerHTML = "Read More";
        }
    }
}