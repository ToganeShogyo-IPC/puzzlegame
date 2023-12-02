<?php
    $files = glob("*.json");
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($files);
?>