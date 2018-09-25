<?php
$client_secret = 'SECRET'; 
    if (isset($_POST['token'])) {
              $sign = md5("application_key=KEYformat=jsonmethod=users.getCurrentUser" . md5("{$_POST['token']}"));

        $params = array(
            'method'          => 'users.getCurrentUser',
            'access_token'    => $_POST['token'],
            'application_key' => 'KEY',
            'format'          => 'json',
            'sig'             => $sign
        );
		
		$mypath = 'http://api.odnoklassniki.ru/fb.do' . '?' . urldecode(http_build_query($params));
		$userInfo = json_decode(file_get_contents($mypath),true);
		$homepage = file_get_contents('http://ok.ru/profile/'.$userInfo["uid"]);
		if(strpos($homepage, $_POST["url"]))echo 'yes';
    }
?>
