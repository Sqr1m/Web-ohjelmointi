<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8">
  <title>Lomake</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <?php include 'navigaatio.php'; ?>
  <div class="container">
    <main>
      <h1>Ota yhteyttä / Lähetä palaute</h1>

      <form action="lahetys.php" method="post">
        <p>
          <label>Nimi:<br>
            <input type="text" name="nimi" required>
          </label>
        </p>

        <p>
          <label>Sähköposti:<br>
            <input type="email" name="email" required>
          </label>
        </p>

        <p>
          <label>Puhelin (valinnainen):<br>
            <input type="tel" name="puhelin">
          </label>
        </p>

        <p>
          <label>Tuotteen määrä:<br>
            <input type="number" name="maara" min="1" value="1">
          </label>
        </p>

        <p>
          <label>Toimitustapa:<br>
            <select name="toimitustapa">
              <option value="Nouto">Nouto</option>
              <option value="Postipaketti">Postipaketti</option>
              <option value="Kotiinkuljetus">Kotiinkuljetus</option>
            </select>
          </label>
        </p>

        <p>
          <label>Kiinnostus:<br>
            <input type="checkbox" name="kiinnostus[]" value="uutiskirje"> Uutiskirje
            <input type="checkbox" name="kiinnostus[]" value="tarjoukset"> Tarjoukset
          </label>
        </p>

        <p>
          <label>Prioriteetti:<br>
            <input type="radio" name="priority" value="low" checked> Matala
            <input type="radio" name="priority" value="high"> Korkea
          </label>
        </p>

        <p>
          <label>Viesti:<br>
            <textarea name="viesti" required></textarea>
          </label>
        </p>

        <p>
          <input type="submit" value="Lähetä">
        </p>

        <small class="muted">Kaikki kentät merkitty * ovat pakollisia.</small>
      </form>
    </main>
  </div>
</body>
</html>
