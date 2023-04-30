<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.5">
    <title>Florida Historical Society Event Calendar</title>
<!--JavaScript and CSS-->
<script src="calendar-script.js"></script>
<link rel="stylesheet" href="stylesheets/styles-calendar.css">
</head>
<!-- This is the navigation bar for the top of the page. -->
<nav>
      <a href="index.html">
        <img class="logo" src="FHS_Prototype-1/index/fhs_logo.png" alt="Florida Historical Society Logo" width="75" height="75"/>
      </a>
    <li><a class="active" href="about-us.html">About Us</a></li>
    <li><a class="active" href="education.html">Education</a></li>
    <li><a class="active" href="fhscalendar.php">Events</a></li>
    <li><a class="active" href="media.html">Media</a></li>
    <li><a class="active" href="membership.html">Membership</a></li>
    <li><a class="active" href="support.html">Support</a></li>
    <li><a class="active" href="research.html">Research</a></li>
  </nav>
<body>
<?php
    // This will return an array of the months
    $months = [
      1 => "January", 2 => "Febuary", 3 => "March", 4 => "April",
      5 => "May", 6 => "June", 7 => "July", 8 => "August",
      9 => "September", 10 => "October", 11 => "November", 12 => "December"
    ];
    //This will set the current month and current year
    $monthNow = date("m");
    $yearNow = date("Y"); ?>

    <!--Period selector for Calendar-->
    <div id="calendarHead">
      <div id="calendarPeriod">
        <input id="calendarBack" type="button" class="mi" value="&lt;">
        <select id="calendarMonth"><?php foreach ($months as $m=>$mth) {
          //Prints out the selected option for the month that is present.
          printf("<option value='%u'%s>%s</option>",
            $m, $m==$monthNow?" selected":"", $mth
          );
        } ?></select>
        <input id="calendarYear" type="number" value="<?=$yearNow?>">
        <input id="calendarNext" type="button" class="mi" value="&gt;">
      </div>
      <!--The calendarAdd button is to add an event to the calendar-->
      <input id="calendarAdd" type="button" value="+">
    </div>

    <!--Calendar Wrapper-->
    <!--The HTML of the calendar will be generated with JavaScript-->
    <div id="calendarWrap">
      <div id="calendarDays"></div>
      <div id="calendarBody"></div>
    </div>

    <!-- Event Form Dialog Box -->
    <dialog id="calendarForm"><form method="dialog">
      <!--The form will display a hidden popup dialog box to either save, update, or delete an event-->
      <div id="closeEvent">X</div>
      <h2 class="event1">CALENDAR EVENT</h2>
      <div class="event2">
        <label>Start</label>
        <input id="eventStart" type="datetime-local" required>
      </div>
      <div class="event2">
        <label>End</label>
        <input id="eventEnd" type="datetime-local" required>
      </div>
      <div class="event2">
        <label>Text Color</label>
        <input id="eventColor" type="color" value="#000000" required>
      </div>
      <div class="event2">
        <label>Background Color</label>
        <input id="eventBackground" type="color" value="#ffdbdb" required>
      </div>
      <div class="event1">
        <label>Event</label>
        <input id="eventTxt" type="text" required>
      </div>
      <div class="event1">
        <input type="hidden" id="eventID">
        <input type="button" id="eventDel" value="Delete">
        <input type="submit" id="eventSave" value="Save">
      </div>
    </form></dialog>
    </body>
</html>
