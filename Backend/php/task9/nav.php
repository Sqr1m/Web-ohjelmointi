<?php
?>
<nav class="nav">
  <div class="container">
    <ul class="nav__list" id="navList">
      <?php foreach ($navItems as $label => $url): ?>
        <li class="nav__item <?= isActive($url) ?>">
          <a class="nav__link" href="<?= e($url) ?>"><?= e($label) ?></a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</nav>