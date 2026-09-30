// ==========================================
// 1. DATOS INICIALES
// ==========================================
const productosIniciales = [
  { id: 1, nombre: "Teclado mecánico", precio: 45000 },
  { id: 2, nombre: "Mouse inalámbrico", precio: 22000 },
  { id: 3, nombre: "Monitor 24''", precio: 180000 }
];

const CLAVE_STORAGE = "productos";

// ==========================================
// 2. LEER DATOS DEL STORAGE
// ==========================================

function cargarProductos() {
  const guardados = localStorage.getItem(CLAVE_STORAGE);
  
  return guardados ? JSON.parse(guardados) : productosIniciales;
}

let productos = cargarProductos();

// ==========================================
// 3. GUARDAR EN STORAGE
// ==========================================
function guardarProductos() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

// ==========================================
// 4. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const inputNombre = document.querySelector("#input-nombre");
const inputPrecio = document.querySelector("#input-precio");
const btnAgregar  = document.querySelector("#btn-agregar");
const inputBuscar = document.querySelector("#input-buscar");
const mensaje     = document.querySelector("#mensaje");
const contenedor  = document.querySelector("#contenedor-items");

// ==========================================
// 5. FEEDBACK VISUAL
// ==========================================
function mostrarMensaje(texto, color = "#27ae60") {
  mensaje.textContent = texto;
  mensaje.style.color = color;
  setTimeout(() => { mensaje.textContent = ""; }, 2000);
}

// ==========================================
// 6. RENDERIZADO DINÁMICO
// ==========================================
function renderizar(lista = productos) {
  contenedor.innerHTML = "";


  lista.length === 0
    ? contenedor.innerHTML = "<p style='text-align:center;color:#888;'>No hay productos para mostrar.</p>"
    : lista.forEach(({ id, nombre, precio }) => {
        const div = document.createElement("div");
        div.classList.add("item");

        
        const precioFormateado = typeof precio === "number"
          ? precio.toLocaleString("es-AR")
          : "0";

        div.innerHTML = `
          <div>
            <h3>${nombre ?? "Sin nombre"}</h3>
            <p>$${precioFormateado}</p>
          </div>
          <button class="btn-eliminar" data-id="${id}">Eliminar</button>
        `;

        contenedor.appendChild(div);
      });
}

// ==========================================
// 7. AGREGAR PRODUCTO
// ==========================================
btnAgregar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const precio = Number(inputPrecio.value);


  const esValido = nombre !== "" && precio > 0 && !isNaN(precio);

  !esValido
    ? mostrarMensaje("⚠ Completa ambos campos correctamente", "#e74c3c")
    : (() => {
        
        const nuevoProducto = {
          id: Date.now(),
          nombre: nombre,
          precio: precio
        };
        const { nombre: nom } = nuevoProducto;

        productos.push(nuevoProducto);
        guardarProductos();
        renderizar();
        mostrarMensaje(`✔ Producto "${nom}" agregado`);

        inputNombre.value = "";
        inputPrecio.value = "";
        inputNombre.focus();
      })();
});

// ==========================================
// 8. ELIMINAR PRODUCTO
// ==========================================
contenedor.addEventListener("click", (e) => {
  e.target.classList.contains("btn-eliminar")
    ? (() => {
        const id = Number(e.target.dataset.id);
        const indice = productos.findIndex(p => p.id === id);

        indice !== -1
          ? (() => {
              const { nombre } = productos[indice];
              productos.splice(indice, 1);
              guardarProductos();
              renderizar();
              mostrarMensaje(`🗑 "${nombre}" eliminado`, "#e67e22");
            })()
          : null;
      })()
    : null;
});

// ==========================================
// 9. BUSCADOR
// ==========================================
inputBuscar.addEventListener("keyup", () => {
  const texto = inputBuscar.value.toLowerCase();
  const filtrados = productos.filter(({ nombre }) =>
    nombre.toLowerCase().includes(texto)
  );
  renderizar(filtrados);
});

// ==========================================
// 10. BOTÓN VACIAR TODO
// ==========================================
const btnVaciar = document.createElement("button");
btnVaciar.id = "btn-vaciar";
btnVaciar.textContent = "🗑 Vaciar todo";
document.querySelector(".formulario").after(btnVaciar);

btnVaciar.addEventListener("click", () => {
  productos.length > 0
    ? (() => {
        productos = [];
        localStorage.removeItem(CLAVE_STORAGE);
        renderizar();
        mostrarMensaje("🧹 Lista vaciada", "#e67e22");
      })()
    : mostrarMensaje("La lista ya está vacía", "#888");
});

// ==========================================
// 11. RENDER INICIAL
// ==========================================
renderizar();