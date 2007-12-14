outputParams.outputFormat = "json";
json.items = [];

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
  } else {
    a[1] = a[1].substr(0,2);
  }
  return a.join(":");
}
var addOneHour = function(s) {
  var a = s.split(":");
  a[0] = parseInt(a[0]) + 1;
  if (a[0] < 8) {
    a[0] += 12;
  }
  return a.join(":");
}

var addOptionalArrayProperty = function(obj, name, a) {
    if (a.length == 1) {
        obj[name] = a[0];
    } else if (a.length > 1) {
        obj[name] = a;
    }
}

function processSection(node, sectionItem, type) {
    var empty = true;
    try {
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
              } else {
                hours[1] = addOneHour(hours[0]);
              }
          
              if (node.nextSibling.nextSibling.nodeName.toLowerCase() == "a") {
                var room = cleanString(node.nextSibling.nextSibling.firstChild.nodeValue);
              } else { var room = "Unknown"; }
          
              for (var d = 0; d < days.length; d++) {
                var day = days.substr(d,1);
                if (" EVE(".indexOf(day) < 0) {
                    var label = sectionItem.label + "-" + day + hours[0] + "-" + room;
                    var lectureItem = {
                        "type":       type,
                        "label":      label,
                        "section":    sectionItem.label,
                        "day":        day,
                        "start":      hours[0],
                        "end":        (hours.length > 1 ? hours[1] : ""),
                        "room":       room
                    };
                    json.items.push(lectureItem);
                    empty = false;
                }
              }
            }
          }
          node = node.nextSibling;
        }
    } catch (e) {}
    
    if (!empty) {
        json.items.push(sectionItem);
    }
}

function processClass(element, area, subarea) {
    var classNumber = getText(element, './b[1]/text()[1]');
    var dot = classNumber.indexOf(".");
    var classSeries = classNumber.substr(0, dot + 2) + "xx";
    var course = classNumber.substr(0, dot);
    var url = document.location.href + "#" + classNumber;
  
    var courseName = getText(element, './b[2]/text()[1]');
    var semesters = [];
    var type = 'Unknown';
    var offerings = [];
    var categories = [];

    var images = utilities.gatherElementsOnXPath(document, element, './IMG', nsResolver);
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

    var o = 0;
    for (; o < offerings.length; o++) {
        if (offerings[o] == "Not offered this year") {
            break;
        }
    }
    if (o == offerings.length) {
        offerings.push('Currently Offered');
    }


    var fields = utilities.gatherElementsOnXPath(document, element, './/text()', nsResolver);
    var units = 'Unknown';
    var totalUnits = 'Unknown';
    for each (var node in fields) {
        var field = cleanString(node.nodeValue);
        if (field.indexOf('Units:') == 0) {
            units = cleanString(field.substr(6));
            try {
              totalUnits = eval(units.split("-").join("+"));
            } catch (e) {}
        }
    }

    var prereqs = [];
    var elmts = utilities.gatherElementsOnXPath(document, element, './A', nsResolver);
    for each (var a in elmts) {
        try {
            if (a.childNodes.length == 1 && a.firstChild.nodeType == 3) {
                var t = cleanString(a.innerHTML);
                if (t.indexOf(".") > 0 && t.substr(0, 5) != "http:") {
                  prereqs.push("c" + t);
                }
            }
        } catch (e) {}
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
                  description = string;
                  break;
                }
            }
            node = node.previousSibling;
        }
    }

    var classID = "c" + classNumber;
    var classItem = {
        "type":         "Class",
        "label":        classNumber + " - " + courseName,
        "id":           classID,
        "level":        type,
        "units":        units,
        "total-units":  totalUnits,
        "has-final":    hasFinal,
        "description":  description,
        "url":          url
    };
    addOptionalArrayProperty(classItem, "semester", semesters);
    addOptionalArrayProperty(classItem, "offering", offerings);
    addOptionalArrayProperty(classItem, "category", categories);
    addOptionalArrayProperty(classItem, "prereq", prereqs);
    addOptionalArrayProperty(classItem, "in-charge", instructors);
    if (area != null) {
        classItem.area = area;
    }
    if (subarea != null) {
        classItem.subarea = subarea;
    }
    json.items.push(classItem);
  
    var bolds = utilities.gatherElementsOnXPath(document, element, './B', nsResolver);
    var sectionIndex = 1;
    for (var b = 0; b < bolds.length; b++) {
        var bold = bolds[b];
        if (bold.firstChild == null || bold.firstChild.nodeType != 3) {
          return;
        }

        var field = cleanString(bold.firstChild.nodeValue);
        if (field == "Lecture:") {
            var sectionID = "s" + classNumber + "-" + sectionIndex++;
            var sectionItem = {
                "type":                 "LectureSection",
                "label":                sectionID,
                "lecture-section-of":   classID
            };
            processSection(bold.nextSibling, sectionItem, "Lecture");
        } else if (field == "Recitation:") {
            var sectionID = "s" + classNumber + "-" + sectionIndex++;
            var sectionItem = {
                "type":             "RecitationSection",
                "label":            sectionID,
                "rec-section-of":   classID
            };
            processSection(bold.nextSibling, sectionItem, "Recitation");
        } else if (field == "Lab:") {
            var sectionID = "s" + classNumber + "-" + sectionIndex++;
            var sectionItem = {
                "type":             "LabSection",
                "label":            sectionID,
                "lab-section-of":   classID
            };
            processSection(bold.nextSibling, sectionItem, "Lab");
        }
    }
}

var xpath = '/html/body/table/tbody/tr/td';
var elements = utilities.gatherElementsOnXPath(document, document, xpath, nsResolver);
var area = null;
var subarea = null;
for (var i = 0; i < elements.length; i++) {
    var node = elements[i].firstChild;
    while (node != null) {
        if (node.nodeType == 1) {
            if (node.tagName == "P") {
                try {
                    processClass(node, area, subarea);
                } catch (e) {
                    // ignore
                }
            } else if (node.tagName == "H2") {
                area = node.firstChild.nodeValue;
            } else if (node.tagName == "H3") {
                subarea = node.firstChild.nodeValue;
            }
        }
        node = node.nextSibling;
    }
}
