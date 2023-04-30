<?php
class Calendar {
//Declaring a private property to store the PHP Data Object(PDO) and PDO Statement Object
  private $pdo = null;
  private $stmt = null;
  public $error = "";
  //The construct function will establish a connection to the database
  function __construct () {
    $this->pdo = new PDO(
      "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=".DB_CHARSET,
      DB_USER, DB_PASSWORD, [
        //ERRMODE will control how the errors the PDO encounters are dealt with
        //ERR_EXCEPTION will tell the PDO to throw an exception object using the built-in PDO Exception class
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
  }

  // This destruct function is a function that disconnects from the database
  function __destruct () {
    if ($this->stmt!==null) { $this->stmt = null; }
    if ($this->pdo!==null) { $this->pdo = null; }
  }

  // Function to run the SQL query
  function query ($sql, $data=null) {
    $this->stmt = $this->pdo->prepare($sql);
    $this->stmt->execute($data);
  }

  // Saves events into the calendar
  function save ($start, $end, $txt, $color, $bg, $id=null) {
    // Checks the beginning date and final date of the event that is going to be stored.
    if (strtotime($end) < strtotime($start)) {
      $this->error = "The end date of the event cannot be earlier than the start date";
      return false;
    }

    // Run the SQL and creates an SQL command for updating the event calendar
    if ($id==null) {
      //Insert a new event into the calendar
      $sql = "INSERT INTO `events` (`event_start`, `event_end`, `event_text`, `event_color`, `event_background`) VALUES (?,?,?,?,?)";
      $data = [$start, $end, strip_tags($txt), $color, $bg];
    } else {
      //Update the start date and end date of the event
      $sql = "UPDATE `events` SET `event_start`=?, `event_end`=?, `event_text`=?, `event_color`=?, `event_background`=? WHERE `event_id`=?";
      $data = [$start, $end, strip_tags($txt), $color, $bg, $id];
    }
    $this->query($sql, $data);
    return true;
  }

  // function del deletes the events
  function del ($id) {
    $this->query("DELETE FROM `events` WHERE `event_id`=?", [$id]);
    return true;
  }

  // Acquire the events for the selected Month and Year
  function get ($month, $year) {
    // Calculates the date range
    $month = $month<10 ? "0$month" : $month ;
    $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
    $dateYM = "{$year}-{$month}-";
    $start = $dateYM . "01 00:00:00";
    $end = $dateYM . $daysInMonth . " 23:59:59";

    // Acquire the events
    // s & e : start & end date
    // c & b : text & background color
    // t : event text

    //Executes the SQL query to select events from then calendar table that overlaps within a given date range
    $this->query("SELECT * FROM `events` WHERE (
      (`event_start` BETWEEN ? AND ?)
      OR (`event_end` BETWEEN ? AND ?)
      OR (`event_start` <= ? AND `event_end` >= ?)
    )", [$start, $end, $start, $end, $start, $end]);
    $events = [];
    //Loop through the result set of the prepared statement and fetch each row as associative array
    while ($r = $this->stmt->fetch()) {
      $events[$r["event_id"]] = [
        "s" => $r["event_start"], "e" => $r["event_end"],
        "c" => $r["event_color"], "b" => $r["event_background"],
        "t" => $r["event_text"]
      ];
    }

    // Display the results
    return count($events)==0 ? false : $events ;
  }
}

// Setting of the database
define("DB_HOST", "net1255.net.ucf.edu");
define("DB_NAME", "la898655");
define("DB_CHARSET", "utf8mb4");
define("DB_USER", "la898655");
define("DB_PASSWORD", "L@88yUCF9123");

// New Calendar Object
$_CAL = new Calendar();