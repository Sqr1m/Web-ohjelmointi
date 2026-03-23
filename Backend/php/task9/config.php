<?php
$siteName = 'Tekniikkakulma';


$smtpHost = 'smtp.example.com';
$smtpUser = 'bogdan.verkhovod@vuoksi.fi';
$smtpPass = '';
$smtpPort = 587; // обычно 587 или 465
$smtpSecure = 'tls'; // tls или ssl
// markku.hautamaki@vuoksi.fi
$recipientEmail = 'bogdan.verkhovod@vuoksi.fi'; // <-- СЮДА вставь почту, на которую должны приходить сообщения
$senderEmail = 'no-reply@your-domain.com';      // лучше доменный адрес, если на хостинге это разрешено
$navItems = [
    'Etusivu' => 'etusivu.php',
    'Tuotteet' => 'tuotteet.php',
    'Lomake'   => 'lomake.php',
];

$features = [
    [
        'title' => 'Selkeä rakenne',
        'text'  => 'Header, valikko, sisältö ja footer toistuvat kaikilla sivuilla.'
    ],
    [
        'title' => 'PHP-laskenta',
        'text'  => 'Sivun sisältöä tuotetaan PHP-taulukoista ja silmukoista.'
    ],
    [
        'title' => 'Pieni interaktiivisuus',
        'text'  => 'Mobiilivalikko ja merkkilaskuri tekevät sivusta elävämmän.'
    ],
];

$products = [
    [
        'name' => 'Peruspaketti',
        'price' => '19,90 €',
        'desc'  => 'Sopii nopeaan aloitukseen ja yksinkertaiseen käyttöön.'
    ],
    [
        'name' => 'Tehopaketti',
        'price' => '39,90 €',
        'desc'  => 'Tasapainoinen vaihtoehto, jossa on enemmän ominaisuuksia.'
    ],
    [
        'name' => 'Premium',
        'price' => '59,90 €',
        'desc'  => 'Laajempi kokonaisuus, viimeistellympi ulkoasu.'
    ],
];

$formTopics = [
    'Verkkosivut',
    'PHP',
    'CSS',
    'JavaScript',
    'Tietoturva',
];