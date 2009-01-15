/*
 * unit-adder.js
 */
 
function enableUnitAdder() {
 	var collection = window.exhibit.getCollection("picked-classes");
 	collection.addListener({ onItemsChanged: function() { 
			var classes = collection.getRestrictedItems();
			var currentSize = classes.size();
			if (currentSize > 0) {
				var units = { lecture: 0, lab: 0, prep: 0, total: 0, string: "" };
				var reported = { hours: 0, courses: 0 };
				classes.visit(function(classID) {
					if (database.getObject(classID, "units") !== null) {
						unit = database.getObject(classID, "units").split('-');
						units.lecture = units.lecture + parseInt(unit[0]);
						units.lab = units.lab + parseInt(unit[1]);
						units.prep = units.prep + parseInt(unit[2]);
					} 
					units.total = units.total + parseInt(database.getObject(classID, "total-units"));
                    
                    var classRating = database.getSubject(classID, "class-rating-of");
                    if (classRating != null) {
    					var hours = database.getObject(classRating, "hours");
    					if (hours !== null) {
    						reported.hours = reported.hours + (Math.ceil(10 * parseFloat(hours)) / 10);
    				   		reported.courses = reported.courses + 1; 
    				   	}
                    }
				});
				
				units.string = units.lecture + "-" + units.lab + "-" + units.prep;
				if (reported.courses == 1) { var courseWord = ' Course'; } else { var courseWord = ' Courses'; }
				
				var div = document.getElementById('total-units');
				if (units.lecture + units.lab + units.prep > 0) {
					div.innerHTML = 'Total Units: '+units.string+' ('+units.total+')'+
									'<br>Reported Hours: '+reported.hours+' ('+
									reported.courses+courseWord+')<br>';
				} else {
					div.innerHTML = 'Total Units: '+units.total;	
				}
				
			   document.getElementById('no-picked-classes').style.display = "none";
			} else {
				var div = document.getElementById('total-units');
				div.innerHTML = "";
				
			    document.getElementById('no-picked-classes').style.display = "block";
			}
 		} 
 	});
 }
 
