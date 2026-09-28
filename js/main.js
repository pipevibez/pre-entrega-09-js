const CLAVE_STORAGE =
  "preEntrega09_catalogoServicios";

const serviciosIniciales = [
  {
    id: 1,
    nombre: "Landing page",
    categoria: "Diseño y desarrollo",
    precio: 1500
  },
  {
    id: 2,
    nombre: "Sitio institucional",
    categoria: "Desarrollo web",
    precio: 3500
  },
  {
    id: 3,
    nombre: "Tienda online",
    categoria: "Ecommerce",
    precio: 5900
  },
  {
    id: 4,
    nombre: "Mantenimiento mensual",
    categoria: "Soporte",
    precio: 250
  },
  {
    id: 5,
    nombre: "Optimización SEO",
    categoria: "Marketing",
    precio: 850
  }
];

const numeroWhatsApp = "5493812091755";

const estadoSistema =
  document.querySelector("#estado-sistema");

const estadoSync =
  document.querySelector("#estado-sync");

const detalleSync =
  document.querySelector("#detalle-sync");

const botonSincronizar =
  document.querySelector("#btn-sincronizar");

const formulario =
  document.querySelector("#form-servicio");

const tituloFormulario =
  document.querySelector("#titulo-formulario");

const inputNombre =
  document.querySelector("#nombre");

const inputCategoria =
  document.querySelector("#categoria");

const inputPrecio =
  document.querySelector("#precio");

const inputBuscar =
  document.querySelector("#buscar");

const textoBotonGuardar =
  document.querySelector("#texto-btn-guardar");

const simboloBotonGuardar =
  document.querySelector("#simbolo-btn-guardar");

const botonCancelarEdicion =
  document.querySelector("#btn-cancelar-edicion");

const botonVaciarCatalogo =
  document.querySelector("#btn-vaciar-catalogo");

const contenedorServicios =
  document.querySelector("#contenedor-servicios");

const cantidadServicios =
  document.querySelector("#cantidad-servicios");

const sinResultados =
  document.querySelector("#sin-resultados");

const mensaje =
  document.querySelector("#mensaje");

const botonFlotante =
  document.querySelector("#btn-servicios-flotante");

const contadorFlotante =
  document.querySelector("#contador-flotante");

const panelServicios =
  document.querySelector("#panel-servicios");

const cantidadPanel =
  document.querySelector("#cantidad-panel");

const listaPanel =
  document.querySelector("#lista-servicios-panel");

const botonCerrarPanel =
  document.querySelector("#btn-cerrar-panel");

const overlay =
  document.querySelector("#glass-overlay");

const botonEnviarVentas =
  document.querySelector("#btn-enviar-ventas");

const modalVentas =
  document.querySelector("#modal-ventas");

const botonCerrarVentas =
  document.querySelector("#btn-cerrar-ventas");

const formularioVentas =
  document.querySelector("#form-ventas");

const ventasResponsable =
  document.querySelector("#ventas-responsable");

const ventasObservaciones =
  document.querySelector("#ventas-observaciones");

const cantidadEnvio =
  document.querySelector("#cantidad-envio");

const mensajeVentas =
  document.querySelector("#mensaje-ventas");

let servicios = [];
let siguienteId = 1;
let idServicioEditando = null;

function clonarServiciosIniciales() {
  return serviciosIniciales.map(
    (servicio) => ({
      ...servicio
    })
  );
}

function cargarServicios() {
  let datos = [];

  estadoSistema.className =
    "sync-status is-loading";

  try {
    const contenidoGuardado =
      localStorage.getItem(CLAVE_STORAGE);

    if (contenidoGuardado === null) {
      datos = clonarServiciosIniciales();

      localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(datos)
      );

      detalleSync.textContent =
        "Se creó una copia local del catálogo.";
    } else {
      datos =
        JSON.parse(contenidoGuardado);

      if (!Array.isArray(datos)) {
        throw new Error(
          "El catálogo guardado no tiene un formato válido."
        );
      }

      detalleSync.textContent =
        "El catálogo local fue recuperado correctamente.";
    }

    return datos;
  } catch (error) {
    datos = clonarServiciosIniciales();

    estadoSistema.className =
      "sync-status is-error";

    estadoSync.textContent =
      "Se recuperó una copia segura";

    try {
      localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(datos)
      );

      detalleSync.textContent =
        "Los datos almacenados no eran válidos. Se restauró una copia segura del catálogo.";
    } catch (storageError) {
      detalleSync.textContent =
        "Los datos almacenados no pudieron recuperarse y el almacenamiento local no está disponible. La aplicación continuará con una copia temporal.";
    }

    return datos;
  } finally {
    botonSincronizar.disabled = false;
  }
}

function guardarServicios() {
  try {
    localStorage.setItem(
      CLAVE_STORAGE,
      JSON.stringify(servicios)
    );

    marcarCambiosLocales();

    return true;
  } catch (error) {
    estadoSistema.className =
      "sync-status is-error";

    estadoSync.textContent =
      "No se pudieron guardar los cambios";

    detalleSync.textContent =
      "La aplicación continúa funcionando, pero el almacenamiento local no está disponible.";

    return false;
  }
}

function calcularSiguienteId() {
  siguienteId =
    servicios.length > 0
      ? Math.max(
          ...servicios.map(
            ({ id }) => id
          )
        ) + 1
      : 1;
}

function obtenerHTMLTarjeta(servicio) {
  const {
    id,
    nombre,
    categoria,
    precio
  } = servicio;

  return `
    <article
      class="servicio-card"
      data-id="${id}"
      data-search="${(
        nombre +
        " " +
        categoria
      ).toLowerCase()}"
    >
      <div class="card-top">
        <span class="card-id">
          ${String(id).padStart(2, "0")}
        </span>

        <span class="categoria">
          ${categoria}
        </span>
      </div>

      <h3>${nombre}</h3>

      <div class="card-footer">
        <p class="precio-label">
          Valor del servicio
        </p>

        <p class="precio">
          USD ${precio}
        </p>

        <div class="card-actions">
          <button
            type="button"
            class="btn-editar"
            data-id="${id}"
          >
            Editar
          </button>

          <button
            type="button"
            class="btn-eliminar"
            data-id="${id}"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderizarCatalogoInicial() {
  contenedorServicios.innerHTML =
    servicios
      .map(obtenerHTMLTarjeta)
      .join("");

  aplicarFiltro();
}

function insertarTarjeta(servicio) {
  contenedorServicios.insertAdjacentHTML(
    "beforeend",
    obtenerHTMLTarjeta(servicio)
  );

  aplicarFiltro();
}

function actualizarTarjeta(servicio) {
  const tarjeta =
    contenedorServicios.querySelector(
      `[data-id="${servicio.id}"]`
    );

  if (!tarjeta) {
    return;
  }

  tarjeta.outerHTML =
    obtenerHTMLTarjeta(servicio);

  aplicarFiltro();
}

function eliminarTarjeta(id) {
  const tarjeta =
    contenedorServicios.querySelector(
      `[data-id="${id}"]`
    );

  tarjeta?.remove();

  aplicarFiltro();
}

function aplicarFiltro() {
  const termino =
    inputBuscar.value
      .toLowerCase()
      .trim();

  const tarjetas =
    contenedorServicios.querySelectorAll(
      ".servicio-card"
    );

  let visibles = 0;

  tarjetas.forEach((tarjeta) => {
    const coincide =
      tarjeta.dataset.search.includes(
        termino
      );

    tarjeta.hidden = !coincide;

    if (coincide) {
      visibles++;
    }
  });

  cantidadServicios.textContent =
    visibles;

  if (servicios.length === 0) {
    sinResultados.textContent =
      "No hay servicios cargados.";

    sinResultados.hidden = false;

    return;
  }

  if (visibles === 0) {
    sinResultados.textContent =
      "No hay coincidencias para esta búsqueda.";

    sinResultados.hidden = false;

    return;
  }

  sinResultados.hidden = true;
}

function renderizarPanel() {
  const cantidad = servicios.length;

  contadorFlotante.textContent =
    cantidad;

  cantidadPanel.textContent =
    cantidad;

  botonEnviarVentas.disabled =
    cantidad === 0;

  botonVaciarCatalogo.disabled =
    cantidad === 0;

  if (cantidad === 0) {
    listaPanel.innerHTML = `
      <p class="glass-panel-empty">
        No hay servicios cargados.
      </p>
    `;

    return;
  }

  listaPanel.innerHTML =
    servicios
      .map(
        ({
          id,
          nombre,
          categoria,
          precio
        }) => {
          return `
            <div class="glass-service-item">
              <span class="glass-service-id">
                ${String(id).padStart(2, "0")}
              </span>

              <div>
                <p class="glass-service-name">
                  ${nombre}
                </p>

                <p class="glass-service-category">
                  ${categoria}
                </p>
              </div>

              <span class="glass-service-price">
                USD ${precio}
              </span>
            </div>
          `;
        }
      )
      .join("");
}

function actualizarResumenEnvio() {
  const cantidad = servicios.length;

  cantidadEnvio.textContent =
    cantidad === 1
      ? "1 servicio cargado"
      : cantidad + " servicios cargados";
}

function actualizarVistasSecundarias() {
  renderizarPanel();
  actualizarResumenEnvio();
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className =
    "mensaje " + tipo;
}

function marcarCambiosLocales() {
  estadoSistema.className =
    "sync-status is-local";

  estadoSync.textContent =
    "Cambios guardados";

  detalleSync.textContent =
    "El catálogo local fue actualizado. Podés verificar la sincronización cuando quieras.";
}

function iniciarEdicion(id) {
  const servicio =
    servicios.find(
      ({
        id: servicioId
      }) => servicioId === id
    );

  if (!servicio) {
    return;
  }

  const {
    nombre,
    categoria,
    precio
  } = servicio;

  idServicioEditando = id;

  inputNombre.value = nombre;
  inputCategoria.value = categoria;
  inputPrecio.value = precio;

  tituloFormulario.textContent =
    "Editar servicio";

  textoBotonGuardar.textContent =
    "Guardar cambios";

  simboloBotonGuardar.textContent =
    "✓";

  botonCancelarEdicion.hidden =
    false;

  inputNombre.focus();
}

function cancelarEdicion() {
  idServicioEditando = null;

  formulario.reset();

  tituloFormulario.textContent =
    "Agregar servicio";

  textoBotonGuardar.textContent =
    "Agregar servicio";

  simboloBotonGuardar.textContent =
    "+";

  botonCancelarEdicion.hidden =
    true;
}

function vaciarCatalogo() {
  servicios = [];
  siguienteId = 1;

  cancelarEdicion();

  inputBuscar.value = "";

  contenedorServicios.innerHTML = "";

  guardarServicios();

  aplicarFiltro();
  actualizarVistasSecundarias();

  mostrarMensaje(
    "El catálogo fue vaciado.",
    "info"
  );
}

function esperar(milisegundos) {
  return new Promise((resolve) => {
    setTimeout(
      resolve,
      milisegundos
    );
  });
}

async function sincronizarCatalogo() {
  estadoSistema.className =
    "sync-status is-loading";

  estadoSync.textContent =
    "Sincronizando catálogo";

  detalleSync.textContent =
    "La interfaz sigue disponible mientras se verifica el estado guardado.";

  botonSincronizar.disabled =
    true;

  botonSincronizar.textContent =
    "Sincronizando...";

  try {
    await esperar(1800);

    const contenidoGuardado =
      localStorage.getItem(
        CLAVE_STORAGE
      );

    const catalogoGuardado =
      JSON.parse(
        contenidoGuardado ?? "[]"
      );

    if (
      !Array.isArray(
        catalogoGuardado
      )
    ) {
      throw new Error(
        "Formato de catálogo inválido."
      );
    }

    const cantidad =
      catalogoGuardado.length;

    estadoSistema.className =
      "sync-status is-success";

    estadoSync.textContent =
      "Catálogo sincronizado";

    detalleSync.textContent =
      cantidad === 1
        ? "1 servicio disponible en este navegador."
        : cantidad +
          " servicios disponibles en este navegador.";
  } catch (error) {
    estadoSistema.className =
      "sync-status is-error";

    estadoSync.textContent =
      "No se pudo verificar la sincronización";

    detalleSync.textContent =
      "El catálogo sigue disponible en memoria. Podés intentar nuevamente.";
  } finally {
    botonSincronizar.disabled =
      false;

    botonSincronizar.textContent =
      "Sincronizar ahora";
  }
}

function abrirPanel() {
  renderizarPanel();

  panelServicios.classList.add(
    "is-open"
  );

  overlay.classList.add(
    "is-open"
  );

  document.body.classList.add(
    "panel-open"
  );

  panelServicios.setAttribute(
    "aria-hidden",
    "false"
  );

  overlay.setAttribute(
    "aria-hidden",
    "false"
  );

  botonFlotante.setAttribute(
    "aria-expanded",
    "true"
  );

  botonCerrarPanel.focus();
}

function cerrarPanel() {
  panelServicios.classList.remove(
    "is-open"
  );

  overlay.classList.remove(
    "is-open"
  );

  document.body.classList.remove(
    "panel-open"
  );

  panelServicios.setAttribute(
    "aria-hidden",
    "true"
  );

  overlay.setAttribute(
    "aria-hidden",
    "true"
  );

  botonFlotante.setAttribute(
    "aria-expanded",
    "false"
  );
}

function abrirVentas() {
  if (servicios.length === 0) {
    return;
  }

  actualizarResumenEnvio();

  cerrarPanel();

  modalVentas.classList.add(
    "is-open"
  );

  modalVentas.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

  ventasResponsable.focus();
}

function cerrarVentas() {
  modalVentas.classList.remove(
    "is-open"
  );

  modalVentas.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

  mensajeVentas.textContent = "";

  botonFlotante.focus();
}

formulario.addEventListener(
  "submit",
  (evento) => {
    evento.preventDefault();

    const nombre =
      inputNombre.value.trim();

    const categoria =
      inputCategoria.value.trim();

    const precio =
      Number(inputPrecio.value);

    if (
      nombre === "" ||
      categoria === "" ||
      Number.isNaN(precio) ||
      precio <= 0
    ) {
      mostrarMensaje(
        "Revisá los datos ingresados.",
        "error"
      );

      return;
    }

    const editando =
      idServicioEditando !== null;

    if (editando) {
      const indice =
        servicios.findIndex(
          ({ id }) =>
            id ===
            idServicioEditando
        );

      if (indice === -1) {
        return;
      }

      const servicioActualizado = {
        id: idServicioEditando,
        nombre,
        categoria,
        precio
      };

      servicios[indice] =
        servicioActualizado;

      actualizarTarjeta(
        servicioActualizado
      );
    } else {
      const nuevoServicio = {
        id: siguienteId,
        nombre,
        categoria,
        precio
      };

      servicios.push(
        nuevoServicio
      );

      siguienteId++;

      insertarTarjeta(
        nuevoServicio
      );
    }

    guardarServicios();
    actualizarVistasSecundarias();

    inputBuscar.value = "";

    cancelarEdicion();
    aplicarFiltro();

    mostrarMensaje(
      editando
        ? nombre +
            " fue actualizado."
        : nombre +
            " fue agregado al catálogo.",
      "exito"
    );

    inputNombre.focus();
  }
);

contenedorServicios.addEventListener(
  "click",
  (evento) => {
    const botonEditar =
      evento.target.closest(
        ".btn-editar"
      );

    const botonEliminar =
      evento.target.closest(
        ".btn-eliminar"
      );

    if (botonEditar) {
      iniciarEdicion(
        Number(
          botonEditar.dataset.id
        )
      );

      return;
    }

    if (!botonEliminar) {
      return;
    }

    const id =
      Number(
        botonEliminar.dataset.id
      );

    const indice =
      servicios.findIndex(
        ({
          id: servicioId
        }) => servicioId === id
      );

    if (indice === -1) {
      return;
    }

    const {
      nombre
    } = servicios[indice];

    servicios.splice(
      indice,
      1
    );

    if (
      idServicioEditando === id
    ) {
      cancelarEdicion();
    }

    eliminarTarjeta(id);

    guardarServicios();
    actualizarVistasSecundarias();

    mostrarMensaje(
      nombre +
        " fue eliminado del catálogo.",
      "info"
    );
  }
);

botonCancelarEdicion.addEventListener(
  "click",
  () => {
    cancelarEdicion();

    inputNombre.focus();
  }
);

botonVaciarCatalogo.addEventListener(
  "click",
  () => {
    vaciarCatalogo();
  }
);

inputBuscar.addEventListener(
  "input",
  () => {
    aplicarFiltro();
  }
);

botonSincronizar.addEventListener(
  "click",
  () => {
    sincronizarCatalogo();
  }
);

botonFlotante.addEventListener(
  "click",
  () => {
    abrirPanel();
  }
);

botonCerrarPanel.addEventListener(
  "click",
  () => {
    cerrarPanel();
    botonFlotante.focus();
  }
);

overlay.addEventListener(
  "click",
  () => {
    cerrarPanel();
    botonFlotante.focus();
  }
);

botonEnviarVentas.addEventListener(
  "click",
  () => {
    abrirVentas();
  }
);

botonCerrarVentas.addEventListener(
  "click",
  () => {
    cerrarVentas();
  }
);

modalVentas.addEventListener(
  "click",
  (evento) => {
    if (
      evento.target ===
      modalVentas
    ) {
      cerrarVentas();
    }
  }
);

formularioVentas.addEventListener(
  "submit",
  (evento) => {
    evento.preventDefault();

    const responsable =
      ventasResponsable.value
        .trim();

    const observaciones =
      ventasObservaciones.value
        .trim();

    const listaServicios =
      servicios
        .map(
          ({
            nombre,
            precio
          }) => {
            return (
              "• " +
              nombre +
              " — USD " +
              precio
            );
          }
        )
        .join("\n");

    const texto = [
      "Catálogo de servicios actualizado",
      "",
      "Responsable: " +
        responsable,
      "Cantidad: " +
        servicios.length +
        " servicios",
      "",
      "Servicios:",
      listaServicios,
      observaciones !== ""
        ? "\nObservaciones:\n" +
          observaciones
        : ""
    ]
      .filter(
        (linea) =>
          linea !== ""
      )
      .join("\n");

    const urlWhatsApp =
      "https://wa.me/" +
      numeroWhatsApp +
      "?text=" +
      encodeURIComponent(
        texto
      );

    window.open(
      urlWhatsApp,
      "_blank",
      "noopener,noreferrer"
    );

    formularioVentas.reset();

    mensajeVentas.textContent =
      "El catálogo está listo para compartir con ventas.";
  }
);

document.addEventListener(
  "keydown",
  (evento) => {
    if (
      evento.key !== "Escape"
    ) {
      return;
    }

    if (
      modalVentas.classList.contains(
        "is-open"
      )
    ) {
      cerrarVentas();

      return;
    }

    if (
      panelServicios.classList.contains(
        "is-open"
      )
    ) {
      cerrarPanel();

      botonFlotante.focus();
    }
  }
);

servicios = cargarServicios();

calcularSiguienteId();

renderizarCatalogoInicial();

actualizarVistasSecundarias();

sincronizarCatalogo();
