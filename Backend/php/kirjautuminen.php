<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = $_POST['username'] ?? '';
    $p = $_POST['password'] ?? '';

    if ($u === 'admin' && $p === 'cat123') {
        echo "<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='refresh' content='2; url=palkkalaskuri.php'><title>Welcome</title></head><body>";
        echo "<h1>Welcome admin!</h1>";
        echo "<p>You will be redirected to the salary calculator in a few seconds...</p>";
        echo "</body></html>";
        exit;
    } else {
        echo "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Login failed</title></head><body>";
        echo "Invalid username or password<br><a href='palkkalaskuri_kirjautuminen.html'>Back</a>";
        echo "</body></html>";
        exit;
    }
} else {
    header('Location: palkkalaskuri_kirjautuminen.html');
    exit;
}
?>