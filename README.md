# Plan de Centro · CEIP Capitulaciones (Santa Fe, Granada)

App web de consulta del Plan de Centro. HTML + CSS + JS sin dependencias. PWA instalable y con caché offline.

## Estructura

```
index.html                      · la app entera (interfaz + lógica)
manifest.json / sw.js           · PWA e instalación
icons/                          · iconos 192 y 512
data/                           · contenido del Plan de Centro (generado desde los Word)
  resumenes.js                      → los tres resúmenes (PE, ROF y Gestión)
  pe.js                             → Proyecto Educativo (A–P)
  rof.js  gestion.js                → ROF y Proyecto de Gestión
  anexos.js                         → PAD, POAT, Plan de Convivencia y CIL
descargas/                      · documentos descargables
  programaciones/*.docx             → 20 programaciones didácticas
  Propuesta_pedagogica_Infantil.docx
  CIL_Capitulaciones.docx
  Programaciones_y_propuesta_pedagogica_Capitulaciones.zip
```

## Publicar en GitHub Pages

1. Sube todo el contenido de esta carpeta a la raíz del repositorio (o a `/docs`).
2. Settings → Pages → Source: `main` / carpeta raíz (o `/docs`).
3. La app queda en `https://usuario.github.io/repositorio/`.

## Actualizar el contenido

El contenido de `data/` se genera a partir de los .docx. Si cambia el Plan de Centro, hay que
regenerar esos archivos. Para cambios pequeños se pueden editar a mano: cada sección es un objeto
`{id, titulo, grupo, encabezado, html, subs}`.

Al publicar una versión nueva, sube el número de caché en `sw.js` (`plan-centro-v1` → `v2`)
para que los dispositivos ya instalados recojan los cambios.

## Diseño

Fondo aurora animado (cinco degradados en movimiento, se desactiva con `prefers-reduced-motion`)
y color de acento propio para cada documento: rojo (inicio), ámbar (resúmenes), azul (Proyecto
Educativo), violeta (ROF), turquesa (Proyecto de Gestión), verde (anexos) y rosa (programaciones).
El acento se aplica con `document.body.dataset.accent` y las variables `--accent*` del CSS.
