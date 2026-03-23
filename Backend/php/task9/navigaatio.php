<?php
$pages = [
    "Home" => "etusivu.php",
    "Products" => "tuotteet.php",
    "Form" => "lomake.php"
];

$current = basename($_SERVER['PHP_SELF']);
?>
<nav>
  <ul>
    <?php foreach ($pages as $name => $url): ?>
      <li class="<?php echo ($current === $url) ? 'active' : ''; ?>">
        <a href="<?php echo $url; ?>"><?php echo $name; ?></a>
      </li>
    <?php endforeach; ?>
  </ul>
</nav>