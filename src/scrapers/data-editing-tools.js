var allDays = ['07', '08', '09', 10, 11, 14, 15, 16, 17, 18, 22, 23, 24, 25, 28, 29, 30, 31, '01'];

function makeLecture(id, days, startTime, endTime, room) {
    document.write("<table>");
	for (var i = 0; i < days.length; i++) {
		var lecture = "L-" + id + "-" + days[i] + "-" + room.replace(/\s/g,'');
		var start = "2008-01-" + days[i] + "T" + startTime;
		var end = "2008-01-" + days[i] + "T" + endTime;
		document.write("<tr><td>Lecture</td><td>s"+ id +"a</td><td>"+ lecture +"</td><td>"+ start +"</td><td>"+ end +"</td><td>"+ room +"</td></tr>");
	}
    document.write("</table><br>");
}

makeLecture('10.10', [1, 2, 3], '12:00', '17:00', '32-123');