document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  });

  // Funcionalidad del formulario de contacto
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nombreApellido = document.getElementById("nombreapellido").value;
      const correoElectronico =
        document.getElementById("correoelectronico").value;
      const telefono = document.getElementById("telefono").value;
      const mensaje = document.getElementById("mensaje").value;
      const contacto = document.querySelector(
        'input[name="contacto"]:checked'
      ).value;
      const novedades = document.getElementById("novedades").checked;

      const formData = {
        nombreApellido,
        correoElectronico,
        telefono,
        mensaje,
        contacto,
        novedades,
      };

      fetch("http://localhost:3000/contactos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          let storedData = JSON.parse(localStorage.getItem("contactos")) || [];
          storedData.push(data);
          localStorage.setItem("contactos", JSON.stringify(storedData));
          console.log("Contacto guardado en localStorage:", storedData);

          contactForm.reset();
        })
        .catch((error) => console.error("Error:", error));
    });

    // Verificar contactos guardados en el servidor JSON
    fetch("http://localhost:3000/contactos")
      .then((response) => response.json())
      .then((data) => {
        console.log("Contactos guardados en el servidor JSON:", data);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Funcionalidad del carrusel de imágenes
  let currentIndex = 0;

  function showSlide(index) {
    const slides = document.querySelectorAll(".carousel-item");
    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    } else {
      currentIndex = index;
    }
    const offset = -currentIndex * 100;
    document.querySelector(
      ".carousel-inner"
    ).style.transform = `translateX(${offset}%)`;
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  setInterval(() => {
    nextSlide();
  }, 3000);

  // Funcionalidad para agregar y mostrar productos
  const productForm = document.getElementById("productForm");
  const contenedorProductos = document.getElementById("product-grid");
  let productos = [];

  if (productForm && contenedorProductos) {
    productForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nuevoProducto = {
        nombre: document.getElementById("nombre").value,
        precio: parseFloat(document.getElementById("precio").value),
        imagen: document.getElementById("imagen").value,
      };

      fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
      })
        .then((response) => response.json())
        .then((data) => {
          productos.push(data);
          mostrarProductos();
          alert("Producto creado");
        })
        .catch((error) => console.error("Error:", error));

      productForm.reset();
    });

    function mostrarProductos() {
      contenedorProductos.innerHTML = "";

      productos.forEach((producto) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("product-card");
        tarjeta.innerHTML = `
          <img src="${producto.imagen}" alt="${
          producto.nombre
        }" class="product-image">
          <p>${producto.nombre}</p>
          <p>$${producto.precio.toFixed(2)}</p>
          <button class="delete-button" onclick="eliminarProducto('${
            producto.id
          }')">
            <img src="img/basurero.png" alt="Eliminar producto" class="delete-icon">
          </button>
        `;
        contenedorProductos.appendChild(tarjeta);
      });
    }

    // Función para eliminar un producto
    window.eliminarProducto = function (id) {
      fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          productos = productos.filter((producto) => producto.id !== id);
          mostrarProductos();
        })
        .catch((error) => console.error("Error:", error));
    };

    // Cargar productos al cargar la página
    fetch("http://localhost:3000/productos")
      .then((response) => response.json())
      .then((data) => {
        productos = data;
        mostrarProductos();
      })
      .catch((error) => console.error("Error:", error));
  }
});
