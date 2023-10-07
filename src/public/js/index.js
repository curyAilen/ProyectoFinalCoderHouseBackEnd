const socket = io();

socket.on('realtimeproducts', (productos) => {
    const productosContainer = document.getElementById('productosContainer');
    productosContainer.innerHTML = '';
    const titleTest = document.createElement('p')
    titleTest.innerText = `Producto tomado mediante socket`;

    productos.forEach((producto) => {
      const productCard = document.createElement('div');
      productCard.classList.add('card');


      const title = document.createElement('h4');
      title.innerText = `Title: ${producto.title}`;

      const stock = document.createElement('p');
      stock.innerText = `Disponibilidad: ${producto.stock}`;

      const price = document.createElement('p');
      price.innerText = `Price: $${producto.price}`;

      productCard.appendChild(title);
      productCard.appendChild(stock);
      productCard.appendChild(price);

      productosContainer.appendChild(productCard);
    });
  });