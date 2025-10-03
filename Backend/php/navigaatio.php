<?php
$pages = [
    "Etusivu" => "etusivu.php",
    "Tuotteet" => "tuotteet.php",
    "Ota yhteyttä" => "yhteystiedot.php"
];

$current = basename($_SERVER['PHP_SELF']);
?>
<nav>
    <ul>
        <?php foreach ($pages as $name => $url): ?>
            <li class="<?php if ($current == $url) echo 'active'; ?>">
                <a href="<?php echo $url; ?>"><?php echo $name; ?></a>
            </li>
        <?php endforeach; ?>
    </ul>
</nav>
