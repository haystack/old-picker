/*
 * unit-adder.js
 */
 
function enableUnitAdder() {
 	var collection = window.exhibit.getCollection("picked-sections");
 	collection.addListener({ onItemsChanged: function() { 
			var sections = collection.getRestrictedItems();
			var currentSize = sections.size();
			if (currentSize > 0) {
				var reported = { hours: 0, courses: 0 };
				sections.visit(function(sectionID) {
					var hours = database.getObject(sectionID, "reported-hours");
					reported.hours = reported.hours + hours;
					if (hours > 0) { reported.courses = reported.courses + 1; }
				});
				
				var units = { lecture: 0, lab: 0, prep: 0, total: 0, string: "" };
				sections.visit(function(sectionID) {
					var classID = database.getSubject(sectionID, "class");
					var unit = database.getObject(classID, "unit");
					units.lecture = units.lecture + parseInt(unit[0]);
					units.lab = units.lab + parseInt(unit[1]);
					units.prep = units.prep + parseInt(unit[2]);
				});
				units.string = units.lecture+"-"+units.lab+"-"+units.prep;
				units.total = units.lecture + units.lab + units.prep;
				
				var div = document.getElementById('total-units');
				div.innerHTML = 'Total Units: '+units.string+' ('+units.total+')'+
								'<br>Student Reported Total Hours: '+reported.hours+' ('+
								reported.courses+' Courses with Data)<br>';
								
			    document.getElementById('no-picked-classes').style.display = "none";
			} else {
				var div = document.getElementById('total-units');
				div.innerHTML = "";
				
			    document.getElementById('no-picked-classes').style.display = "block";
			}
 		} 
 	});
 }
 
