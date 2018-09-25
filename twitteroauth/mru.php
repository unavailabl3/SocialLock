<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <title></title>
</head>
<body>

<?php

$client_id = 'ID'; // ID
$client_secret = 'SECRET'; // Секретный ключ
$redirect_uri = 'REDIRECT_URL'; // Ссылка на приложение

$url = 'https://connect.mail.ru/oauth/authorize';

$params = array(
    'client_id'     => $client_id,
    'response_type' => 'code',
    'redirect_uri'  => $redirect_uri
);

echo $link = '<p><a href="' . $url . '?' . urldecode(http_build_query($params)) . '">Аутентификация через Mail.ru</a></p>';

if (isset($_GET['code'])) {
    $result = false;

    $params = array(
        'client_id'     => $client_id,
        'client_secret' => $client_secret,
        'grant_type'    => 'authorization_code',
        'code'          => $_GET['code'],
        'redirect_uri'  => $redirect_uri
    );

    $url = 'https://connect.mail.ru/oauth/token';

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, urldecode(http_build_query($params)));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    $result = curl_exec($curl);
    curl_close($curl);

    $tokenInfo = json_decode($result, true);

    if (isset($tokenInfo['access_token'])) {
        $sign = md5("app_id={$client_id}limit=1method=stream.getByAuthorsecure=1session_key={$tokenInfo['access_token']}{$client_secret}");

        $params = array(
     //       'method'       => 'users.getInfo',
			'method'	   => 'stream.getByAuthor',
            'secure'       => '1',
            'app_id'       => $client_id,
			'limit'		   => '1',
            'session_key'  => $tokenInfo['access_token'],
            'sig'          => $sign
        );
		$mypath = 'http://www.appsmail.ru/platform/api' . '?' . urldecode(http_build_query($params));
        echo $mypath;
		$userInfo = json_decode(file_get_contents($mypath), true);
		echo json_encode($userInfo);
        if (isset($userInfo[0]['uid'])) {
			echo json_encode($userInfo);
            $userInfo = array_shift($userInfo);
            $result = true;
        }
    }
}


?>

</body>
</html>
