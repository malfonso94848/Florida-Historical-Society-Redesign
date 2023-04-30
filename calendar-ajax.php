<?php
  // This AJAX handler maps $_POST requests to the library functions of get, save, and delete
if (isset($_POST["req"])) {
      // require "calendar-library.php" will load the library
  require "calendar-library.php";
  switch ($_POST["req"]) {
      //Acquire the dates and events for the selected period
    case "get":
      echo json_encode($_CAL->get($_POST["month"], $_POST["year"]));
      break;

    // Save the events
    case "save":
      //Echo a calendar save
      echo $_CAL->save(
        //Return null if it is not set
        $_POST["start"], $_POST["end"], $_POST["txt"], $_POST["color"], $_POST["bg"],
        isset($_POST["id"]) ? $_POST["id"] : null
      ) ? "OK" : $_CAL->error ;
      break;

    // Delete the event
    case "delete":
      echo $_CAL->delete($_POST["id"])  ? "OK" : $_CAL->error ;
      break;
}}