<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <?php include 'navigaatio.php'; ?>

  <div class="container">
    <main>
      <h1>Contact Form</h1>
      <p>Fill in the form below. Fields marked with * are required.</p>

      <form action="lahetys.php" method="post">
        <p>
          <label>Name *<br>
            <input type="text" name="nimi" required placeholder="Your name" list="nameSuggestions">
          </label>
        </p>

        <datalist id="nameSuggestions">
          <option value="Alex">
          <option value="Maria">
          <option value="John">
          <option value="Emma">
        </datalist>

        <p>
          <label>Email *<br>
            <input type="email" name="email" required placeholder="name@example.com">
          </label>
        </p>

        <p>
          <label>Country<br>
            <input type="text" id="country" name="maa" placeholder="Auto-filled">
          </label>
        </p>

        <p>
          <label>Phone<br>
            <input type="tel" name="puhelin" placeholder="+358...">
          </label>
        </p>

        <p>
          <label>Amount<br>
            <input type="range" name="maara" min="1" max="20" value="5" oninput="amountOut.value=this.value">
          </label>
          <output id="amountOut">5</output>
        </p>

        <p>
          <label>Delivery method<br>
            <select name="toimitustapa">
              <option value="Pickup">Pickup</option>
              <option value="Parcel">Parcel</option>
              <option value="Home delivery">Home delivery</option>
            </select>
          </label>
        </p>

        <p>
          Interests:<br>
          <label><input type="checkbox" name="kiinnostus[]" value="Newsletter"> Newsletter</label>
          <label><input type="checkbox" name="kiinnostus[]" value="Offers"> Offers</label>
          <label><input type="checkbox" name="kiinnostus[]" value="Updates"> Updates</label>
        </p>

        <p>
          Priority:<br>
          <label><input type="radio" name="priority" value="low" checked> Low</label>
          <label><input type="radio" name="priority" value="normal"> Normal</label>
          <label><input type="radio" name="priority" value="high"> High</label>
        </p>

        <p>
          <label>Message *<br>
            <textarea name="viesti" required placeholder="Write your message here..."></textarea>
          </label>
        </p>

        <p>
          <input type="submit" value="Send">
        </p>
      </form>
    </main>
  </div>

  <script>
    const country = document.getElementById("country");
    if (country) {
      const lang = (navigator.language || "").toLowerCase();
      if (lang.startsWith("fi")) country.value = "Finland";
      else if (lang.startsWith("sv")) country.value = "Sweden";
      else if (lang.startsWith("et")) country.value = "Estonia";
      else if (lang.startsWith("no")) country.value = "Norway";
      else if (lang.startsWith("da")) country.value = "Denmark";
      else country.value = "Finland";
    }
  </script>
</body>
</html>