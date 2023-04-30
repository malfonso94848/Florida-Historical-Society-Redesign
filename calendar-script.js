var cal = {
  // The variable cal is an object that currently contains the basic mechanics of the calendar
  monday : false, // The first day in the calendar will be Monday
  events : null, // This will display the events data for the current month and year
  selectedMth : 0, selectedYear : 0, // The selected Month and Year
  calMth : null, calYear : null, // HTML for the Month and Year
  calDays : null, calBody : null, // HTML for the body and days of the calendar
  // HTML form and Fields
  calFormWrap : null, calForm : null, calFormID : null,
  calFormStart : null, calFormEnd : null, calFormTxt : null,
  calFormColor : null, calFormBackground : null, calFormDel : null,

  // A function that will help support for the AJAX Fetch
  ajax : (data, onload) => {
    // Data for the Form
    let form = new FormData();
    for (let [k,v] of Object.entries(data)) { form.append(k,v); }

    //Fetches the ajax
    //This fetch function will call the calendar-ajax.php file
    fetch("calendar-ajax.php", { method:"POST", body:form })
    .then(res => res.text())
    .then(txt => onload(txt))
    .catch(err => console.error(err));
  },

  //Initialize the calendar
  init : () => {
    // Acquire the HTML Elements
    cal.calMth = document.getElementById("calendarMonth");
    cal.calYear = document.getElementById("calendarYear");
    cal.calDays = document.getElementById("calendarDays");
    cal.calBody = document.getElementById("calendarBody");
    cal.calFormWrap = document.getElementById("calendarForm");
    cal.calForm = cal.calFormWrap.querySelector("form");
    cal.calFormID = document.getElementById("eventID");
    cal.calFormStart = document.getElementById("eventStart");
    cal.calFormEnd = document.getElementById("eventEnd");
    cal.calFormTxt = document.getElementById("eventTxt");
    cal.calFormColor = document.getElementById("eventColor");
    cal.calFormBackground = document.getElementById("eventBackground");
    cal.calFormDel = document.getElementById("eventDel");

    //Attach controls for going forward and/or backward on months and years
    //Attach controls for adding an event to the calendar or closing the dialog box
    cal.calMth.onchange = cal.load;
    cal.calYear.onchange = cal.load;
    document.getElementById("calendarBack").onclick = () => cal.pshift();
    document.getElementById("calendarNext").onclick = () => cal.pshift(1);
    document.getElementById("calendarAdd").onclick = () => cal.show();
    cal.calForm.onsubmit = () => cal.save();
    document.getElementById("closeEvent").onclick = () => cal.calFormWrap.close();
    cal.calFormDel.onclick = cal.del;

    // The days variable draws out the names of the days
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (cal.monday) { days.push("Sun"); } else { days.unshift("Sun"); }
    for (let d of days) {
      let cell = document.createElement("div");
      cell.className = "calendarCell";
      cell.innerHTML = d;
      cal.calDays.appendChild(cell);
    }

    // Load and Draw the calendar
    cal.load();
  },

  //This will shift the current period by 1 month
  //This function will be used to drive the buttons for the next month and previous month
  pshift : forward => {
    cal.selectedMth = parseInt(cal.calMth.value);
    cal.selectedYear = parseInt(cal.calYear.value);
    if (forward) { cal.selectedMth++; } else { cal.selectedMth--; }
    if (cal.selectedMth > 12) { cal.selectedMth = 1; cal.selectedYear++; }
    if (cal.selectedMth < 1) { cal.selectedMth = 12; cal.selectedYear--; }
    cal.calMth.value = cal.selectedMth;
    cal.calYear.value = cal.selectedYear;
    cal.load();
  },

  // Load the events to the calendar
  load : () => {
    cal.selectedMth = parseInt(cal.calMth.value);
    cal.selectedYear = parseInt(cal.calYear.value);
    cal.ajax({
      req : "get", month : cal.selectedMth, year : cal.selectedYear
    }, events => {
      cal.events = JSON.parse(events);
      cal.draw();
    });
  },

  // Draw the calendar
  draw : () => {
    // Calculate the month, day, and year
    // Jan is 0 & Dec is 11
    // Sun is 0 & Sat is 6
    let daysInMth = new Date(cal.selectedYear, cal.selectedMth, 0).getDate(), // number of days in selected month
        startDay = new Date(cal.selectedYear, cal.selectedMth-1, 1).getDay(), // first day of the month
        endDay = new Date(cal.selectedYear, cal.selectedMth-1, daysInMth).getDay(), // last day of the month
        current = new Date(), // current date
        currentMth = current.getMonth()+1, // current month
        currentYear = parseInt(current.getFullYear()), // current year
        currentDay = cal.selectedMth==currentMth && cal.selectedYear==currentYear ? current.getDate() : null ;

    // Draw the rows and cells for the calendar
    // Initialize the functions
    let calRowA, calRowB, calRowC, calRowMap = {}, calRowNum = 1,
        cell, cellNum = 1,
    rower = () => {
      calRowA = document.createElement("div");
      calRowB = document.createElement("div");
      calRowC = document.createElement("div");
      calRowA.className = "calendarRow";
      calRowA.id = "calendarRow" + calRowNum;
      calRowB.className = "calendarRowHead";
      calRowC.className = "calendarRowBack";
      cal.calBody.appendChild(calRowA);
      calRowA.appendChild(calRowB);
      calRowA.appendChild(calRowC);
    },
    celler = day => {
      cell = document.createElement("div");
      cell.className = "calendarCell";
      if (day) { cell.innerHTML = day; }
      calRowB.appendChild(cell);
      cell = document.createElement("div");
      cell.className = "calendarCell";
      if (day===undefined) { cell.classList.add("calendarBlank"); }
      if (day!==undefined && day==currentDay) { cell.classList.add("calendarToday"); }
      calRowC.appendChild(cell);
    };
    cal.calBody.innerHTML = ""; rower();

    // Blank cells before the start of the month
    if (cal.monday && startDay != 1) {
      let blanks = startDay==0 ? 7 : startDay ;
      for (let i=1; i<blanks; i++) { celler(); cellNum++; }
    }
    if (!cal.monday && startDay != 0) {
      for (let i=0; i<startDay; i++) { celler(); cellNum++; }
    }

    // The days of the month
    //Loop through the days of the month and create a cell for each day
    for (let i=1; i<=daysInMth; i++) {
      //Store the row and column number of each cell in a map
      calRowMap[i] = { r : calRowNum, c : cellNum };
      celler(i);
      //If the end of the week is reached and it is not the last day then create a new row.
      if (i!=daysInMth && cellNum%7==0) { calRowNum++; rower(); }
      cellNum++;
    }

    // Displays the blank cells after the end of the month
    //If the calendar starts on Monday, check the last day of the month
    if (cal.monday && endDay != 0) {
      //Fill the remaining cells of the last row with blanks
      let blanks = endDay==6 ? 1 : 7-endDay;
      for (let i=0; i<blanks; i++) { celler(); cellNum++; }
    }
    if (!cal.monday && endDay != 6) {
      let blanks = endDay==0 ? 6 : 6-endDay;
      for (let i=0; i<blanks; i++) { celler(); cellNum++; }
    }

    // Draw the events onto the calendar
    if (cal.events !== false) { for (let [id,evt] of Object.entries(cal.events)) {
      // Displays the start day and the last day of the event
      let sd = new Date(evt.s), ed = new Date(evt.e);
      if (sd.getFullYear() != cal.selectedYear) { sd = 1; }
      else { sd = sd.getMonth()+1 < cal.selectedMth ? 1 : sd.getDate(); }
      if (ed.getFullYear() != cal.selectedYear) { ed = daysInMth; }
      else { ed = ed.getMonth()+1 > cal.selectedMth ? daysInMth : ed.getDate(); }

      // Map onto the HTML Calendar
      cell = {}; calRowNum = 0;
      for (let i=sd; i<=ed; i++) {
        if (calRowNum!=calRowMap[i]["r"]) {
          cell[calRowMap[i]["r"]] = { s:calRowMap[i]["c"], e:0 };
          calRowNum = calRowMap[i]["r"];
        }
        if (cell[calRowNum]) { cell[calRowNum]["e"] = calRowMap[i]["c"]; }
      }

      // Draw the row for the HTML Event
      for (let [r,c] of Object.entries(cell)) {
        let o = c.s - 1 - ((r-1) * 7), // Offset of the event cell
            w = c.e - c.s + 1; // Width of the event cell
        calRowA = document.getElementById("calendarRow"+r);
        calRowB = document.createElement("div");
        calRowB.className = "calendarRowEvent";
        calRowB.innerHTML = cal.events[id]["t"]; //text details
        calRowB.style.color = cal.events[id]["c"]; //text color
        calRowB.style.backgroundColor  = cal.events[id]["b"]; //background color
        calRowB.classList.add("w"+w);
        if (o!=0) { calRowB.classList.add("o"+o); }
        calRowB.onclick = () => cal.show(id);
        calRowA.appendChild(calRowB);
      }
    }}
  },

  // Display the event form
  //cal.show() will display the add and edit event form for the calendar
  show : id => {
    if (id) {
      cal.calFormID.value = id;
      cal.calFormStart.value = cal.events[id]["s"].replace(" ", "T").substring(0, 16);
      cal.calFormEnd.value = cal.events[id]["e"].replace(" ", "T").substring(0, 16);
      cal.calFormTxt.value = cal.events[id]["t"];
      cal.calFormColor.value = cal.events[id]["c"];
      cal.calFormBackground.value = cal.events[id]["b"];
      cal.calFormDel.style.display = "inline-block";
    } else {
      cal.calForm.reset();
      cal.calFormID.value = "";
      cal.calFormDel.style.display = "none";
    }
    cal.calFormWrap.show();
  },

  // Save the events
  //cal.save() will save the events
  save : () => {
    // Collects the data of the saved event
    var data = {
      req : "save",
      start : cal.calFormStart.value,
      end : cal.calFormEnd.value,
      txt : cal.calFormTxt.value,
      color : cal.calFormColor.value,
      bg : cal.calFormBackground.value
    };
    if (cal.calFormID.value != "") { data.id = cal.calFormID.value; }

    // Checking the dates to make sure the starts date is not later than the end date of the event
    if (new Date(data.start) > new Date(data.end)) {
      alert("The start date cannot be later than end date!");
      return false;
    }

    // AJAX Save
    cal.ajax(data, res => { if (res == "OK") {
      cal.calFormWrap.close();
      cal.load();
    } else { alert(res); }});
    return false;
  },

  // Deletes the event
  //cal.del() will delete the events from the calendar
  del : () => { if (confirm("Delete the event?")) {
    cal.ajax({
      req : "del", id : cal.calFormID.value
    }, res => { if (res == "OK") {
      cal.calFormWrap.close();
      cal.load();
    } else { alert(res); }});
  }}
};
window.onload = cal.init;