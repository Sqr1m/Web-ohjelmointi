<?php
// tilaus.php — täydellinen tiedosto (HTML + CSS + PHP)

// Funktio toimituskuluja varten (Tehtävä 6)
function laskeToimituskulut($toimitustapa) {
    switch ($toimitustapa) {
        case "Nouto":
            return 0.00;
        case "Postipaketti":
            return 6.90;
        case "Kotiinkuljetus":
            return 12.50;
        default:
            return 0.00;
    }
}

// Alustetaan muuttujat
$maara = 1;
$toimitustapa = "Kotiinkuljetus";
$hinta_kpl = 349.90;
$valmis = false;
$valisumma = 0.0;
$toimituskulut = 0.0;
$kokonais = 0.0;

// Käsitellään lomake
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // turvallinen lukeminen
    $maara = isset($_POST['maara']) ? intval($_POST['maara']) : 1;
    if ($maara < 1) $maara = 1;
    $toimitustapa = isset($_POST['toimitustapa']) ? $_POST['toimitustapa'] : "Kotiinkuljetus";

    $valisumma = $maara * $hinta_kpl;
    $toimituskulut = laskeToimituskulut($toimitustapa);
    $kokonais = $valisumma + $toimituskulut;
    $valmis = true;
}

// apufunktio hintojen muotoiluun (suomalainen tyyli: 1 234,56)
function fmt($num) {
    return number_format($num, 2, ',', ' ');
}
?>
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="utf-8">
    <title>Tilauslomake</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        /* Tausta */
        :root {
            --bg: #f3f5f8;
            --card-bg: #ffffff;
            --muted: #6b7280;
            --accent: #0a84ff; /* sininen nappi */
            --border: #e6e9ee;
        }
        html,body {
            height:100%;
            margin:0;
            font-family: "Helvetica Neue", Arial, sans-serif;
            background-color: var(--bg);
            color: #111827;
        }

        /* Keskitys */
        .page {
            min-height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:40px 20px;
        }

        /* Kortti */
        .card {
            width: 420px;
            background: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(17,24,39,0.08);
            padding: 26px;
        }

        /* Otsikot */
        .card h1 {
            margin:0 0 14px 0;
            font-size:22px;
            font-weight:700;
        }
        .product-title {
            margin:0 0 18px 0;
            font-size:15px;
            font-weight:600;
            color:#111827;
        }

        /* Lomakekentät */
        label {
            display:block;
            text-align:left;
            font-size:13px;
            color:var(--muted);
            margin-bottom:6px;
        }
        input[type="number"], select {
            width:100%;
            box-sizing:border-box;
            padding:10px 12px;
            border-radius:6px;
            border:1px solid #d1d5db;
            font-size:14px;
            outline:none;
            background:#fff;
        }
        /* select näyttää hieman tummemmalta kuin input (kuten kuvassa) */
        select {
            border:2px solid #111;
            appearance:menulist;
            background-color:#fff;
        }

        /* Nappi */
        .btn {
            display:block;
            width:100%;
            padding:12px 14px;
            margin-top:14px;
            border-radius:6px;
            border:none;
            font-weight:600;
            font-size:15px;
            cursor:pointer;
            background: var(--accent);
            color:#fff;
            box-shadow: 0 6px 18px rgba(10,132,255,0.18);
        }
        .btn:active { transform: translateY(1px); }

        /* Jakaja joukko */
        .divider {
            height:1px;
            background: var(--border);
            margin:22px 0;
            border-radius:1px;
        }

        /* Yhteenveto */
        .summary h3 {
            margin:0 0 12px 0;
            font-size:18px;
            font-weight:700;
        }
        .summary p {
            margin:6px 0;
            font-size:14px;
            color:#111827;
        }
        .summary .muted {
            color:var(--muted);
            font-size:13px;
        }
        .summary .total {
            margin-top:10px;
            font-weight:800;
            font-size:16px;
        }

        /* Pieni footer-tyyli numeric inputin sisällä */
        .small {
            font-size:13px;
            color:var(--muted);
        }

        /* Kosmeettinen */
        ::-webkit-outer-spin-button,
        ::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Responsiivisuus (pienemmillä ruuduilla kortti kapenee) */
        @media (max-width:480px) {
            .card { width: 92%; padding:18px; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="card" role="main">
            <h1>Tilaa tuote</h1>

            <p class="product-title"><strong>Tuote:</strong> Sähköpotkulauta (349,90 €/kpl)</p>

            <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <label for="maara">Määrä:</label>
                <input type="number" id="maara" name="maara" min="1" value="<?php echo htmlspecialchars($maara); ?>" required>

                <label for="toimitustapa" style="margin-top:12px;">Toimitustapa:</label>
                <select id="toimitustapa" name="toimitustapa" aria-label="Toimitustapa">
                    <option value="Nouto" <?php if($toimitustapa==="Nouto") echo "selected"; ?>>Nouto (0,00 €)</option>
                    <option value="Postipaketti" <?php if($toimitustapa==="Postipaketti") echo "selected"; ?>>Postipaketti (6,90 €)</option>
                    <option value="Kotiinkuljetus" <?php if($toimitustapa==="Kotiinkuljetus") echo "selected"; ?>>Kotiinkuljetus (12,50 €)</option>
                </select>

                <button class="btn" type="submit">Laske hinta</button>
            </form>

            <div class="divider" aria-hidden="true"></div>

            <div class="summary" aria-live="polite">
                <h3>Tilauksen yhteenveto</h3>

                <?php if ($valmis): ?>
                    <p class="small">Määrä: <strong><?php echo htmlspecialchars($maara); ?></strong> kpl</p>
                    <p>Välisumma: <strong><?php echo fmt($valisumma); ?> €</strong></p>
                    <p class="muted">Toimitustapa: <?php echo htmlspecialchars($toimitustapa); ?></p>
                    <p>Toimituskulut: <strong><?php echo fmt($toimituskulut); ?> €</strong></p>
                    <p class="total">Yhteensä: <?php echo fmt($kokonais); ?> €</p>
                <?php else: ?>
                    <p class="muted">Syötä määrä ja valitse toimitustapa, sitten paina "Laske hinta" nähdäksesi yhteenvedon.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
