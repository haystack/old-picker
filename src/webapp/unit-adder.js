/*
 * unit-adder.js
 */
 
function enableUnitAdder() {
 	var collection = window.exhibit.getCollection("picked-classes");
 	collection.addListener({ onItemsChanged: function() { 
			var classes = collection.getRestrictedItems();
			var currentSize = classes.size();
			if (currentSize > 0) {
				var reportedHours = 0;
				var expr = Exhibit.ExpressionParser.parse("add(!class.@reported-hours)");
				expr.evaluate({ value: collection.getRestrictedItems() }, { value: "item" }, "value", window.database).values.visit(function(v) { reportedHours = v; } );				
				var units = { lecture: 0, lab: 0, prep: 0 };
				classes.visit(function(classID) {
					var classUnits = database.getObject(classID, "units").split('-');
					units.lecture = units.lecture + parseInt(classUnits[0]);
					units.lab = units.lab + parseInt(classUnits[1]);
					units.prep = units.prep + parseInt(classUnits[2]);
				});
				var unitsString = units.lecture+"-"+units.lab+"-"+units.prep;
				var unitsTotal = units.lecture + units.lab + units.prep;
				
				var div = document.getElementById('total-units');
				div.innerHTML = 'Units: '+unitsString+
								'<br>Total Units: '+unitsTotal+
								'<br>Reported Total Hours: '+reportedHours+'<br>';
			}
 		} 
 	});
 }
 
