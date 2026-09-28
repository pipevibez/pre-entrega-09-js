# Pre-Entrega 9 - Asincronismo y Promesas

Proyecto realizado para la novena pre-entrega del curso JavaScript Flex.

## Descripción

Este proyecto es un gestor interno de servicios desarrollado con JavaScript, DOM, eventos, persistencia local y comportamiento asincrónico.

La aplicación permite administrar el catálogo de servicios de un negocio mediante altas, edición, eliminación, búsqueda y persistencia con `localStorage`.

En esta versión se incorporó un sistema de sincronización simulada que utiliza `setTimeout()`, Promises y `async/await` para ejecutar una operación asincrónica sin bloquear la interfaz.

También se incorporó manejo de errores mediante `try-catch-finally`, permitiendo que la aplicación continúe funcionando incluso si los datos almacenados no pueden recuperarse correctamente.

## Funcionalidades

- Alta de servicios.
- Edición de servicios existentes.
- Eliminación de servicios.
- Vaciado completo del catálogo.
- Búsqueda por nombre o categoría.
- Persistencia mediante `localStorage`.
- Recuperación automática del estado guardado.
- Sincronización asincrónica del catálogo.
- Feedback visual durante la sincronización.
- Manejo de errores de almacenamiento.
- Actualizaciones selectivas del DOM.
- Panel flotante con resumen del catálogo.
- Envío del catálogo al equipo de ventas mediante WhatsApp.
- Interacción mediante eventos.
- Cierre de paneles con la tecla `Escape`.
- Diseño responsive.

## Asincronismo

La aplicación simula una verificación de sincronización del catálogo unos segundos después de ingresar.

Para generar esta espera se utiliza `setTimeout()` dentro de una Promise:

```js
function esperar(milisegundos) {
  return new Promise((resolve) => {
    setTimeout(resolve, milisegundos);
  });
}
```

Luego la Promise se consume mediante `async/await`:

```js
await esperar(1800);
```

Mientras transcurre ese tiempo, la aplicación continúa disponible y el usuario puede seguir interactuando con la interfaz.

Una vez finalizada la espera se informa visualmente el resultado de la sincronización.

## Promesas

La espera asincrónica se encapsula en una Promise para evitar mezclar directamente la lógica de la aplicación con el temporizador.

De esta forma la función de sincronización puede utilizar `await` y mantener una lectura secuencial del código sin bloquear la ejecución de la interfaz.

## Manejo de errores

La sincronización utiliza una estructura:

```js
try {
  // recuperación y validación
} catch (error) {
  // manejo del problema
} finally {
  // finalización de la operación
}
```

Dentro del bloque `try` se recupera la información almacenada y se procesa mediante `JSON.parse()`.

Si el contenido no puede procesarse o presenta un formato incorrecto, el error es capturado por `catch` y se muestra feedback directamente en la interfaz.

El bloque `finally` se ejecuta independientemente del resultado y se utiliza para restaurar el estado del botón de sincronización.

La carga inicial del catálogo también está protegida para evitar que un problema en los datos almacenados interrumpa toda la aplicación.

## Persistencia

El catálogo continúa utilizando `localStorage` para mantener los datos entre sesiones.

Los objetos se almacenan mediante `JSON.stringify()` y se recuperan mediante `JSON.parse()`.

La clave utilizada es específica para esta entrega:

```text
preEntrega09_catalogoServicios
```

Esto evita que el estado almacenado por otras versiones del proyecto interfiera con la Pre-Entrega 9.

## Sincronización entre datos y DOM

El array de servicios continúa siendo la fuente principal de información.

Cada modificación sigue la lógica:

```text
Interacción del usuario
        ↓
Actualización del array
        ↓
Actualización de localStorage
        ↓
Actualización del DOM
```

## Actualización selectiva del DOM

En esta versión no se reconstruye todo el catálogo cada vez que se modifica un servicio.

Después de la carga inicial:

- Un servicio nuevo se inserta individualmente.
- Un servicio editado reemplaza únicamente su propia tarjeta.
- Un servicio eliminado remueve únicamente su propia tarjeta.
- La búsqueda cambia la visibilidad de las tarjetas existentes.

El panel flotante se renderiza nuevamente porque funciona como una vista secundaria y compacta derivada del catálogo.

Esta estructura mantiene el código simple para el tamaño actual del proyecto y evita actualizaciones innecesarias del listado principal.

## Operadores modernos y destructuring

El proyecto mantiene el uso de destructuring para trabajar con las propiedades de los objetos:

```js
const {
  id,
  nombre,
  categoria,
  precio
} = servicio;
```

También se utilizan operadores modernos como:

- Operador ternario.
- Nullish coalescing `??`.
- Spread operator.

## Flujo del sistema

```text
Carga del sistema
        ↓
Recuperación de localStorage
        ↓
Renderizado inicial
        ↓
Interfaz disponible
        ↓
Sincronización asincrónica
        ↓
Resultado visible en el DOM
```

La administración del catálogo funciona de manera independiente mientras se realiza la sincronización.

## Flujo de envío a ventas

El botón flotante abre un resumen del catálogo actual.

Desde allí se puede utilizar la opción **Enviar a ventas**, que solicita:

- Responsable.
- Observaciones opcionales.

El sistema genera automáticamente un mensaje con el listado completo de servicios y sus precios y abre WhatsApp con la información preparada para el equipo comercial.

## Eventos utilizados

La aplicación utiliza eventos para:

- Enviar formularios.
- Agregar servicios.
- Editar servicios.
- Eliminar servicios.
- Vaciar el catálogo.
- Buscar servicios.
- Iniciar una sincronización.
- Abrir y cerrar el panel flotante.
- Abrir y cerrar el formulario de ventas.
- Detectar la tecla `Escape`.

## Diseño

La interfaz utiliza principalmente **Neumorphism** para la estructura principal del sistema.

El botón flotante, el resumen del catálogo y el formulario de ventas utilizan un tratamiento **Liquid Glass / Glassmorphism**, diferenciando visualmente la capa principal de administración de las acciones flotantes.

La tipografía utilizada es **Poppins** y la interfaz cuenta con ajustes responsive para diferentes tamaños de pantalla.

## Servicios iniciales

- Landing page — USD 1500
- Sitio institucional — USD 3500
- Tienda online — USD 5900
- Mantenimiento mensual — USD 250
- Optimización SEO — USD 850

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- DOM
- Web Storage API
- Promises
- Async / Await

## Conceptos aplicados

- `setTimeout()`.
- `Promise`.
- `async`.
- `await`.
- `try`.
- `catch`.
- `finally`.
- `localStorage`.
- `JSON.stringify()`.
- `JSON.parse()`.
- `querySelector()`.
- `innerHTML`.
- Template strings.
- Arrays de objetos.
- `map()`.
- `find()`.
- `findIndex()`.
- `splice()`.
- Destructuring.
- Spread operator.
- Nullish coalescing `??`.
- Operador ternario.
- Eventos.
- `addEventListener()`.
- `preventDefault()`.
- Renderizado dinámico.
- Actualización selectiva del DOM.
- Manipulación de clases.
- Atributos `data-*`.
- `window.open()`.
- `encodeURIComponent()`.
- Diseño responsive.

## Estructura del proyecto

```text
pre-entrega-09-js/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── main.js
```

## Autor

Andrés Felipe Villarreal
