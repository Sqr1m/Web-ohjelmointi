<!DOCTYPE html>
<html lang="fi">
<head>
<meta charset="UTF-8">
<title></title>
</head>
<body>
<h1>Tuotteen hintatiedot</h1>
<?php
$tuotteen_name = "Sähköpotkulauta";
$hinta_pcs = 349.90;
$kappalemaara = 2;
$alennusprosentti = 15;

$valisumma = $hinta_pcs * $kappalemaara;
$alennus_eur = $valisumma * ($alennusprosentti / 100);
$loppusumma = $valisumma - $alennus_eur;

echo "Tuote: " . $tuotteen_name . "<br>";
echo "Kappalehinta: " . number_format($hinta_pcs, 2, ',', '') . " €<br>";
echo "Määrä: " . $kappalemaara . " kpl<br>";
echo "------------------<br>";
echo "Välisumma: " . number_format($valisumma, 2, ',', '') . " €<br>";
echo "Alennus (" . $alennusprosentti . " %): " . number_format($alennus_eur, 2, ',', '') . " €<br>";
echo "-------------------<br>";
echo "<b>Lopullinen hinta: " . number_format($loppusumma, 2, ',', '') . " €</b><br>";
?>
</body>
</html>
