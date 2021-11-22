<?php
header('Content-Type:application/json');
if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $post = json_decode(file_get_contents("php://input"), true);
    if ($post['password'] == "mekarevet") {

        if ($post['upload'] == true) {
            file_put_contents($post['filename'], $post['content']);
            echo '{"message": "קובץ נשמר בהצלחה!"}';

        } else if (isset($post['filename'])) {
            echo '{"content": "'. file_get_contents($post['filename']).'"}';
        }
    } else {
        echo '{"erorr": "סיסמא לא תקינה!"}';
    }
}
