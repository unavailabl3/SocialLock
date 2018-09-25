<?php

$client_secret = 'SECRET'; 
    if (isset($_POST['token'])) {
        $sign = md5("app_id=APP_IDlimit=1method=stream.getByAuthorsecure=1session_key={$_POST['token']}{$client_secret}");

        $params = array(
			'method'	   => 'stream.getByAuthor',
            'secure'       => '1',
            'app_id'       => 'APP_ID',
			'limit'		   => '1',
            'session_key'  => $_POST['token'],
            'sig'          => $sign
        );
		$mypath = 'http://www.appsmail.ru/platform/api' . '?' . urldecode(http_build_query($params));
		$userInfo = file_get_contents($mypath);
		echo $userInfo;
    }
?>