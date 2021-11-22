<?php
header('Content-Type:application/json');
if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $post = json_decode(file_get_contents("php://input"), true);
    if ($post['password'] == "mekarevet") {
        echo '{"message": "true"}';
       
    } else {
        echo '{"message": "false"}';
    }
}
