<?php
$tuntipalkka = floatval(str_replace(',', '.', ($_POST['tuntipalkka'] ?? 0)));
$tuntimaara = floatval(str_replace(',', '.', ($_POST['tuntimaara'] ?? 0)));
$viikonloppulisa = floatval(str_replace(',', '.', ($_POST['viikonloppulisa'] ?? 0)));
$viikonloppumaara = floatval(str_replace(',', '.', ($_POST['viikonloppumaara'] ?? 0)));

$yhteispalkka = $tuntipalkka * $tuntimaara;
$yhteispalkka_lisilla = $yhteispalkka + ($viikonloppulisa * $viikonloppumaara);

echo "Yhteispalkka ilman viikonloppulisiä: " . number_format($yhteispalkka, 2, '.', '') . "<br>";
echo "Yhteispalkka viikonloppulisien kanssa: " . number_format($yhteispalkka_lisilla, 2, '.', '');
?>