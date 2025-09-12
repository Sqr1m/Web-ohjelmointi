<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>First PHP Page</title>
</head>
<body>

<p>There are <?php echo 24 * 60 * 60; ?> seconds.</p>
<p>Today is <?php echo date("j.n.Y"); ?>.</p>
<p>The server has PHP version <?php echo PHP_VERSION; ?>.</p>

<?php
echo "<ul>";
for ($i = 1; $i <= 10; $i++) {
    echo "<li>" . $i . "</li>";
}
echo "</ul>";

$greeting = "Hello, world! ";
$times = 5;
$count = 0;
while ($count < $times) {
    echo $greeting;
    $count++;
}

?>
</body>
</html>