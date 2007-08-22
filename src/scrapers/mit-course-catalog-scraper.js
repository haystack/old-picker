var rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
var dc = 'http://purl.org/dc/elements/1.1/';

var namespace = document.documentElement.namespaceURI;
var nsResolver = namespace ? function(prefix) {
  return (prefix == 'x') ? namespace : null;
} : null;

var getNode = function(document, contextNode, xpath, nsResolver) {
  return document.evaluate(xpath, contextNode, nsResolver, XPathResult.ANY_TYPE,null).iterateNext();
}

var cleanString = function(s) {
  return utilities.trimString(s);
}

var getText = function(elmt, xpath) {
  return cleanString(getNode(document, elmt, xpath, nsResolver).nodeValue);
}
var getAttribute = function(elmt, xpath, attr) {
  return cleanString(getNode(document, elmt, xpath, nsResolver)[attr]);
}

var cleanHours = function(s) {
  var a = s.split(".");
  a[0] = parseInt(a[0]);
  if (a[0] < 8) {
    a[0] += 12;
  }
  if (a.length < 2) {
    a[1] = "00";
  }
  return a.join(":");
}

var xpath = '/html/body/table/tbody/tr/td/p';
var elements = utilities.gatherElementsOnXPath(document, document, xpath, nsResolver);
var classOutput = [];
var sectionOutput = [];
var lectureOutput = [];
for (var i = 0; i < elements.length; i++) {
  var element = elements[i];
  try {
    var classNumber = getText(element, './A[1]/B[1]/text()[1]');
    var classSeries = classNumber.substr(0,3) + "xx";
  } catch (e) { 
    continue;
  }
   try {
    var courseName = getText(element, './A[1]/B[2]/text()[1]');
  } catch (e) { 
    continue;
  }
  
  var semesters = [];
  var type = 'Unknown';
  var offerings = [];
  var categories = [];
  
  var images = utilities.gatherElementsOnXPath(document, element, './A[1]/IMG', nsResolver);
  for each (var img in images) {
    var src = img.src;
    if (src.indexOf('/fall.gif') > 0) {
      semesters.push('Fall');
    } else if (src.indexOf('/spring.gif') > 0) {
      semesters.push('Spring');
    } else if (src.indexOf('/iap.gif') > 0) {
      semesters.push('IAP');
    } else if (src.indexOf('/summer.gif') > 0) {
      semesters.push('Summer');
      
    } else if (src.indexOf('/under.gif') > 0) {
      type = 'Undergrad';
    } else if (src.indexOf('/grad.gif') > 0) {
      type = 'Grad';
      
    } else if (src.indexOf('/nooffer.gif') > 0) {
      offerings.push('Not offered this year');
    } else if (src.indexOf('/nonext.gif') > 0) {
      offerings.push('Not offered next year');
    } else if (src.indexOf('/nooffera.gif') > 0) {
      offerings.push('Not currently listed');
    } else if (src.indexOf('/repeat.gif') > 0) {
      offerings.push('Can be repeated for credit');
      
    } else if (src.indexOf('/bio.gif') > 0) {
      categories.push('Biology');
    } else if (src.indexOf('/calc1.gif') > 0) {
      categories.push('Calculus 1');
    } else if (src.indexOf('/calc2.gif') > 0) {
      categories.push('Calculus 2');
    } else if (src.indexOf('/chem.gif') > 0) {
      categories.push('Chemistry');
    } else if (src.indexOf('/hassE.gif') > 0) {
      categories.push('HASS Elective');
    } else if (src.indexOf('/hassL.gif') > 0) {
      categories.push('HASS Language Option');
    } else if (src.indexOf('/hass1.gif') > 0) {
      categories.push('HASS-D 1');
    } else if (src.indexOf('/hass2.gif') > 0) {
      categories.push('HASS-D 2');
    } else if (src.indexOf('/hass3.gif') > 0) {
      categories.push('HASS-D 3');
    } else if (src.indexOf('/hass4.gif') > 0) {
      categories.push('HASS-D 4');
    } else if (src.indexOf('/hass5.gif') > 0) {
      categories.push('HASS-D 5');
    } else if (src.indexOf('/cih1.gif') > 0) {
      categories.push('HASS Communication-Intensive');
    } else if (src.indexOf('cihw.gif') > 0) {
      categories.push('HASS Communication-Intensive Writing');
    } else if (src.indexOf('/lab.gif') > 0) {
      categories.push('Institute LAB');
    } else if (src.indexOf('/phys1.gif') > 0) {
      categories.push('Physics 1');
    } else if (src.indexOf('/phys2.gif') > 0) {
      categories.push('Physics 2');
    } else if (src.indexOf('/rest.gif') > 0) {
      categories.push('Restricted Electives in Science and Technology');
    } else if (src.indexOf('/hlevel.gif') > 0) {
      categories.push('H-LEVEL Grad Credit');  
    } 
  }
  if (offerings.length == 0) {
    offerings.push('Currently Offered');
  }

  var fields = utilities.gatherElementsOnXPath(document, element, './/text()', nsResolver);
  var hasPrerequisites = false;
  var units = 'Unknown';
  var totalUnits = 'Unknown';
  for each (var node in fields) {
    var field = cleanString(node.nodeValue);
    if (field.indexOf('Prereq:') == 0) {
      var t = cleanString(field.substr(7));
      if (t != "--") {
        hasPrerequisites = true;
      }
    } else if (field.indexOf('Units:') == 0) {
      units = cleanString(field.substr(6));
      try {
        totalUnits = eval(units.split("-").join("+"));
      } catch (e) {}
    }
  }
  
  var hasFinal = false;
  	try {
  	  var fin = getText(element, './I/B/text()');
  	  if (fin == "+final") { hasFinal = true; }
  } catch (e) { }
  
  var description = 'No description available.';
  var instructors = [];
  var italics = utilities.gatherElementsOnXPath(document, element, './I', nsResolver);
  if (italics.length > 0) {
    var italic = italics[italics.length - 1];
    var names = cleanString(italic.textContent).split(",");
    for (var x = 0; x < names.length; x++) {
      var name = cleanString(names[x]);
      var space = name.lastIndexOf(' ');
      if (space > 0) {
        name = name.substr(space + 1) + ", " + name.substr(0, space);
      }
      instructors.push(name);
    }
    
    var node = italic.previousSibling;
    while (node != null) {
	  if (node.nodeType == 3) {
	  	var string = cleanString(node.nodeValue);
		if (string !== "..." && string !== "Spring:" && string !== "Fall:") { 
		  description = string
		  break;
		}
	  }
      node = node.previousSibling;
    }
    
  }
  
  var bolds = utilities.gatherElementsOnXPath(document, element, './B', nsResolver);
  var lectures = [];
  for (var b = 0; b < bolds.length; b++) {
    var bold = bolds[b];
    if (bold.firstChild == null || bold.firstChild.nodeType != 3)
      continue;
      
    var field = cleanString(bold.firstChild.nodeValue);
    if (field == "Lecture:") {
      var node = bold.nextSibling;
      while (node != null) {
        if (node.nodeType == 1) {
          var tagName = node.tagName.toLowerCase();
          if (tagName == "b") {
            break;
          } if (tagName == "i" && node.firstChild.nodeType == 3) {
            var code = cleanString(node.firstChild.nodeValue);
            
            var n = code.search(/\d/);
            var days = code.substr(0,n);
            var hours = code.substr(n).split("-");
            hours[0] = cleanHours(hours[0]);
            if (hours.length > 1) {
              hours[1] = cleanHours(hours[1]);
            }
            if (node.nextSibling.nextSibling.nodeName.toLowerCase() == "a") {
              var room = cleanString(node.nextSibling.nextSibling.firstChild.nodeValue);
            } else { var room = "Unknown"; }
            
            for (var d = 0; d < days.length; d++) {
              var day = days.substr(d,1);
              var lecture = "L-" + classNumber + "-" + day + hours[0] + "-" + room;
              var lectureString = "Lecture" +
                "\ts" + classNumber + 'a' +
                "\t" + lecture +
                "\t" + day +
                "\t" + hours[0] +
                "\t" + (hours.length > 1 ? hours[1] : "") +
                "\t" + room;
              lectures.push(lecture);
              lectureOutput.push(lectureString);
            }
          }
        }
        node = node.nextSibling;
      }
      var sectionString = "Section" + 
				"\ts" + classNumber + 'a' +
				"\tc" + classNumber + 
				"\t" + instructors.join("; ");
			sectionOutput.push(sectionString);
    }
  }
  
  var classString = "Class" + 
    "\tc" + classNumber + 
    "\t" + classSeries + 
    "\t" + classNumber + " - " + courseName + 
    "\t" + type +
    "\t" + semesters.join("; ") +
    "\t" + offerings.join("; ") +
    "\t" + categories.join("; ") +
    "\t" + instructors.join("; ") +
    "\t" + units +
    "\t" + totalUnits +
    "\t" + hasFinal +
    "\t" + description;
  classOutput.push(classString);
}

log("type \tid \tseries \tlabel \tlevel \tsemester \toffering \tcategory \tin-charge \tunits \ttotal-units \thas-final \tdescription");
for (var i = 0; i < classOutput.length; i++) { log(classOutput[i]); }
log("type \tsection \tclass \tinstructor");
for (var i = 0; i < sectionOutput.length; i++) { log(sectionOutput[i]); }
log("type \tsection \tlecture \tday \tstart \tend \troom");
for (var i = 0; i < lectureOutput.length; i++) { log(lectureOutput[i]); }