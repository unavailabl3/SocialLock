<?php
header('Content-Type: text/html; charset= utf-8');
	
	
	require_once './twitteroauth/twitteroauth.php';
	if(isset($_POST['username'])) {


	$connection = new TwitterOAuth(
		"azgfAhEXrVBho2PDvDEL8FO4o", 
		"T7sGyBE4aSOev9HtUI6i5bSD58YW1TFlm64FRqoCg8J7BHMV9b",
		"2590331284-rJ9IlLb1f8PnMDJbUQcIvfORObADd8v4VnqOQYf",
		"tMARjlGM7XI2XQkONfH4SGpx527E0uqf0jqlnYMpOk8HzXH"
	);	
  

$data = $connection->get("statuses/user_timeline", array('count' => '1', 'exclude_replies' => true, 'screen_name' => $_POST['username']));
//$data = $connection->get("account/verify_credentials");
echo json_encode($data); 
	}
?>

