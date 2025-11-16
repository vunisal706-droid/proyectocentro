# Plan de Centro CEIP Capitulaciones 📚

Aplicación web progresiva (PWA) para visualizar el Plan de Centro del CEIP "Capitulaciones" de Santa Fe, Granada.

## 🎯 Características

- ✅ **Navegación por secciones**: Acceso rápido a cada parte del Plan de Centro
- 🔍 **Búsqueda integrada**: Busca cualquier término en todo el documento
- 📱 **Funciona offline**: Una vez cargada, funciona sin conexión a internet
- 💻 **Responsive**: Adaptada a móviles, tablets y ordenadores
- 🎨 **Colores del cole**: Diseño con los colores institucionales (azul y blanco)
- ⚡ **PWA instalable**: Se puede instalar como app en el dispositivo

## 📑 Secciones del Plan de Centro

1. **Proyecto Educativo** (pág. 3)
2. **PAD** - Plan de Atención a la Diversidad (pág. 25)
3. **CIL** - Currículo Integrado de Lenguas (pág. 131)
4. **ROF** - Reglamento de Organización y Funcionamiento (pág. 201)
5. **Proyecto de Gestión** (pág. 256)
6. **POAT** - Plan de Orientación y Acción Tutorial (pág. 267)
7. **Plan de Convivencia** (pág. 292)

## 🚀 Instalación en GitHub Pages

1. **Crear un nuevo repositorio** en GitHub (por ejemplo: `plan-centro`)

2. **Subir los archivos**:
   - index.html
   - styles.css
   - app.js
   - sw.js
   - manifest.json
   - plan_de_centro_2025.pdf

3. **Activar GitHub Pages**:
   - Ve a Settings → Pages
   - En "Source" selecciona "main" branch
   - Guarda los cambios

4. **Acceder a la aplicación**:
   - La URL será: `https://TU-USUARIO.github.io/plan-centro/`

## 💡 Uso

### Navegación básica
- **Menú lateral**: Haz clic en cualquier sección para ir directamente a ella
- **Controles de página**: Usa las flechas ◀️ ▶️ para navegar página por página
- **Zoom**: Usa los botones + y - para ajustar el tamaño
- **Descarga**: Descarga el PDF completo con el botón 📥

### Búsqueda
1. Escribe el término a buscar (mínimo 3 caracteres)
2. Haz clic en 🔍 o presiona Enter
3. Se mostrarán todos los resultados encontrados
4. Haz clic en cualquier resultado para ir a esa página

### Atajos de teclado
- **← →**: Navegar entre páginas
- **+ -**: Zoom in/out
- **Enter** en el campo de búsqueda: Buscar

### En móvil
- **Menú hamburguesa**: Accede al menú lateral
- **Gesto de deslizar**: Desplázate por el documento
- **Instalar como app**: Acepta la notificación para instalar en tu dispositivo

## 🔧 Archivos del proyecto

```
plan-centro/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── app.js             # Lógica de la aplicación
├── sw.js              # Service Worker (offline)
├── manifest.json      # Configuración PWA
├── plan_de_centro_2025.pdf  # Documento PDF
└── README.md          # Este archivo
```

## 🎨 Personalización

Los colores principales están definidos en `styles.css`:

```css
--primary-color: #2196F3;  /* Azul principal */
--primary-dark: #1976D2;   /* Azul oscuro */
--secondary-color: #FFC107; /* Amarillo/dorado */
```

Puedes modificar estos valores para ajustar los colores.

## 📱 Instalación como PWA

La aplicación se puede instalar en:
- **Android**: Chrome, Edge, Samsung Internet
- **iOS**: Safari (Añadir a pantalla de inicio)
- **Windows**: Edge, Chrome
- **macOS**: Safari, Chrome

Una vez instalada, funcionará sin conexión a internet.

## ⚙️ Requisitos técnicos

- Navegador moderno con soporte para:
  - Service Workers
  - Canvas API
  - ES6 JavaScript
- PDF.js (cargado desde CDN)

## 📄 Licencia

Desarrollado para el CEIP "Capitulaciones" de Santa Fe, Granada.

## 👨‍💻 Autor

Creado por Víctor - Educador en CEIP Capitulaciones

---

**CEIP "Capitulaciones"**  
Santa Fe, Granada  
Curso 2024-2025
