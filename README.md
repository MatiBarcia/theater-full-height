<p align="center">
  <img src="icons/icon128.png" alt="Theater Full Height" width="96" />
</p>

<h1 align="center">Theater Full Height</h1>

<p align="center">
  Extensión de Chrome que hace que el <b>modo teatro</b> de YouTube ocupe todo el espacio de la ventana, sin entrar en pantalla completa.
</p>

---

## Características

- **Video a toda la ventana en modo teatro:** el reproductor usa todo el ancho y todo el alto visible.
- **Se adapta a cada video:** si el video es más ancho que la ventana se ajusta al ancho; si es más alto (videos verticales o 4:3 en monitores anchos) se ajusta al alto. Siempre se mantiene la relación de aspecto.
- **Tapar la barra superior (opcional):** oculta la barra de YouTube para que el video use el 100% del alto. Al llevar el mouse al borde superior, la barra aparece encima del video.
- **Se configura desde el ícono de la extensión**, con cambios al instante y sin recargar la página.
- **Sin recopilación de datos:** solo guarda tus preferencias en Chrome.

## Instalación

La extensión no está en la Chrome Web Store; se instala manualmente:

1. Descargá el zip de la última versión desde [Releases](../../releases/latest) (o con **Code → Download ZIP**).
2. Descomprimí el archivo en una carpeta que no vayas a borrar (la extensión se carga desde ahí).
3. Abrí `chrome://extensions` en Chrome.
4. Activá el **Modo de desarrollador** (arriba a la derecha).
5. Hacé clic en **Cargar extensión sin empaquetar** y elegí la carpeta que contiene `manifest.json`.

Funciona también en Edge, Brave, Opera y otros navegadores basados en Chromium.

> **Actualizar:** la extensión no se actualiza sola. Descargá la versión nueva, reemplazá los archivos de la carpeta y apretá el botón de recargar (↻) de la extensión en `chrome://extensions`. Para enterarte de nuevas versiones, en GitHub usá **Watch → Custom → Releases**.

## Uso

1. Abrí cualquier video de YouTube.
2. Activá el modo teatro con la tecla **T** o con el botón del reproductor.
3. Hacé clic en el ícono de la extensión para configurar:
   - **Activado:** enciende o apaga la extensión.
   - **Tapar la barra superior:** oculta la barra de YouTube en modo teatro; aparece al llevar el mouse al borde superior.

## Estructura

| Archivo | Descripción |
| --- | --- |
| `manifest.json` | Configuración de la extensión (Manifest V3). |
| `content.css` | Estilos que agrandan el reproductor y ocultan la barra superior. |
| `content.js` | Detecta el modo teatro, aplica las preferencias y muestra la barra al pasar el mouse. |
| `popup.html` / `popup.js` | Ventana de configuración con los switches. |
| `icons/` | Íconos de la extensión. |

## Contribuir

YouTube cambia su estructura interna de vez en cuando. Si la extensión deja de funcionar, abrí un [issue](../../issues) o mandá un pull request.

## Licencia

[MIT](LICENSE)

---

_Esta extensión no está afiliada ni respaldada por YouTube ni Google._
