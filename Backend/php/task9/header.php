<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/functions.php';

if (!isset($pageTitle)) {
    $pageTitle = $siteName;
}
?>
<!DOCTYPE html>
<html lang="fi" data-theme="system">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title><?= e($pageTitle) ?></title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body class="site-body">
<div class="loader">Loading...</div>
  <div class="site-bg" aria-hidden="true">
    <span class="orb orb--1"></span>
    <span class="orb orb--2"></span>
    <span class="orb orb--3"></span>
    <span class="orb orb--4"></span>
    <span class="grid-overlay"></span>
  </div>

  <header class="site-header">
    <div class="container topbar">
      <a class="brand" href="etusivu.php" aria-label="Etusivulle">
        <span class="brand__logo">TK</span>
        <span class="brand__text">
          <strong><?= e($siteName) ?></strong>
          <small>Pieni PHP-projekti</small>
        </span>
      </a>

      <div class="header-controls">
        <label class="theme-switch" for="themeSelect">
          <span>Teema</span>
          <select id="themeSelect" name="theme">
            <option value="system">Järjestelmä</option>
            <option value="light">Vaalea</option>
            <option value="dark">Tumma</option>
            <option value="ocean">Ocean</option>
            <option value="sunset">Sunset</option>
            <option value="forest">Forest</option>
          </select>
        </label>

        <button class="menu-toggle" type="button" aria-label="Avaa valikko">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <?php include __DIR__ . '/nav.php'; ?>
  </header>