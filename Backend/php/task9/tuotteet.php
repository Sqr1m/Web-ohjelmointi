<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Products</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <?php include 'navigaatio.php'; ?>

  <div class="container">
    <main>
      <h1>Products</h1>
      <p>Here are a few example items generated with PHP.</p>

      <?php
      $products = [
          ["name" => "Basic", "price" => "19.90 €", "desc" => "Simple and fast to use."],
          ["name" => "Pro", "price" => "39.90 €", "desc" => "Balanced and practical."],
          ["name" => "Premium", "price" => "59.90 €", "desc" => "A more complete option."]
      ];
      ?>

      <div class="product-list">
        <?php foreach ($products as $product): ?>
          <section class="product-card">
            <h2><?php echo $product["name"]; ?></h2>
            <p><strong>Price:</strong> <?php echo $product["price"]; ?></p>
            <p><?php echo $product["desc"]; ?></p>
          </section>
        <?php endforeach; ?>
      </div>
    </main>
  </div>
</body>
</html>