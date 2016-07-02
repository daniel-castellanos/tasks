<?php 
require_once '../includes/db.php'; // The mysql database connection script
if(isset($_GET['task'])){
$task = $_GET['task'];
$status = "0";
$created = time();

$query="SELECT * from tasks";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$row_cnt = $result->num_rows + 1;

$query="INSERT INTO tasks(task,status,position,created_at)  VALUES ('$task', '$status', '$row_cnt', '$created')";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$result = $mysqli->affected_rows;

echo $json_response = json_encode($result);
}
?>