const socket = io();

socket.on('realtimeproducts', (products) => {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';
    const titleTest = document.createElement('p')
    titleTest.innerText = `Producto tomado mediante socket`;

    products.forEach((product) => {
      const productCard = document.createElement('div');
      productCard.classList.add('card');


      const title = document.createElement('h4');
      title.innerText = `Title: ${product.title}`;

      const stock = document.createElement('p');
      stock.innerText = `Disponibilidad: ${product.stock}`;

      const price = document.createElement('p');
      price.innerText = `Price: $${product.price}`;

      productCard.appendChild(title);
      productCard.appendChild(stock);
      productCard.appendChild(price);

      productsContainer.appendChild(productCard);
    });
  });