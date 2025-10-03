<?php
$toEmail = "bogdan.verkhovod@vuoksi.fi"; 

$name = trim($_POST['nimi'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['puhelin'] ?? '');
$maara = intval($_POST['maara'] ?? 0);
$toimitustapa = $_POST['toimitustapa'] ?? '';
$kiinnostus = $_POST['kiinnostus'] ?? [];
$priority = $_POST['priority'] ?? '';
$message = trim($_POST['viesti'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    header("Location: virhe.php");
    exit;
}

$body = "Nimi: $name\n";
$body .= "Sähköposti: $email\n";
$body .= "Puhelin: $phone\n";
$body .= "Määrä: $maara\n";
$body .= "Toimitustapa: $toimitustapa\n";
$body .= "Kiinnostus: " . implode(', ', $kiinnostus) . "\n";
$body .= "Prioriteetti: $priority\n\n";
$body .= "Viesti:\n$message\n";

$headers = "From: " . $email . "\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

$ok = mail($toEmail, "Palaute sivustolta", $body, $headers);

if ($ok) {
    header("Location: kiitos.php");
    exit;
} else {
    header("Location: virhe.php");
    exit;
}
?>