# GUÍA DE INSTALACIÓN Y SOLUCIÓN DE PROBLEMAS

## 📋 PASOS PARA SUBIR A GITHUB PAGES

### Opción A: Con el ZIP completo (incluye PDF)

1. **Descarga el archivo**: `plan-centro-completo.zip` (7.1 MB)

2. **Descomprime el ZIP** en tu ordenador

3. **Crea un repositorio en GitHub**:
   - Ve a github.com
   - Click en "New repository"
   - Nombre: `plan-centro` (o el que prefieras)
   - Marca "Public"
   - NO marques "Initialize with README"
   - Click "Create repository"

4. **Sube los archivos**:
   - En la página del repositorio, click "uploading an existing file"
   - Arrastra TODOS los archivos descomprimidos
   - Commit los cambios

5. **Activa GitHub Pages**:
   - Ve a Settings → Pages
   - En "Source" selecciona "main" branch
   - Click "Save"
   - Espera 1-2 minutos

6. **Accede a tu aplicación**:
   - La URL será: `https://TU-USUARIO.github.io/plan-centro/`

### Opción B: Solo código (sin PDF)

Si prefieres subir el PDF por separado:

1. Descarga `plan-centro-codigo.zip` (12 KB)
2. Descomprime
3. Añade tu archivo PDF a la carpeta (debe llamarse `plan_de_centro_2025.pdf`)
4. Sigue los pasos 3-6 de la Opción A

## ❌ SOLUCIÓN DE PROBLEMAS

### Problema: "Cargando documento..." pero nunca carga

**Causa**: El archivo PDF no está en el mismo directorio o tiene un nombre diferente

**Solución**:
1. Verifica que el PDF se llame EXACTAMENTE: `plan_de_centro_2025.pdf`
2. Debe estar en la MISMA carpeta que index.html
3. Verifica en GitHub que el PDF se haya subido correctamente

### Problema: Solo aparece el menú pero no funciona

**Causa**: Falta el archivo app.js o no se cargó correctamente

**Solución**:
1. Abre la consola del navegador (F12)
2. Mira si hay errores en rojo
3. Verifica que app.js esté en el repositorio
4. Limpia la caché del navegador (Ctrl+Shift+R)

### Problema: Error 404 al cargar el PDF

**Causa**: El PDF no está en GitHub o tiene un nombre diferente

**Solución**:
1. En GitHub, verifica que veas el archivo `plan_de_centro_2025.pdf`
2. Si no está, súbelo manualmente
3. Si tiene otro nombre, renómbralo a `plan_de_centro_2025.pdf`

### Problema: La aplicación no funciona offline

**Causa**: El Service Worker no se ha instalado

**Solución**:
1. Visita la página al menos una vez con conexión
2. Espera a que cargue completamente
3. Cierra y vuelve a abrir (ahora funcionará offline)

## 🔍 VERIFICAR QUE TODO ESTÉ BIEN

Abre la consola del navegador (F12) y deberías ver:

```
DOM cargado, inicializando aplicación...
Canvas inicializado
Event listeners de navegación configurados
Intentando cargar PDF...
URL del PDF: plan_de_centro_2025.pdf
Cargando: 0%
Cargando: 25%
Cargando: 50%
Cargando: 75%
Cargando: 100%
PDF cargado exitosamente. Páginas: 260
Renderizando página: 1
Página renderizada: 1
PDF renderizado
```

Si ves estos mensajes, ¡todo está funcionando!

## 📱 INSTALACIÓN COMO APP (PWA)

Una vez que funcione en el navegador:

### En Android:
1. Abre la página en Chrome
2. Click en el menú (⋮)
3. "Instalar aplicación" o "Añadir a pantalla de inicio"

### En iOS:
1. Abre la página en Safari
2. Click en el botón de compartir
3. "Añadir a pantalla de inicio"

### En PC (Windows/Mac):
1. Abre la página en Chrome/Edge
2. En la barra de direcciones verás un icono de instalación (+)
3. Click para instalar

## 📝 ESTRUCTURA DE ARCHIVOS (debe estar así)

```
tu-repositorio/
├── index.html              ✅ Debe estar
├── styles.css              ✅ Debe estar
├── app.js                  ✅ Debe estar
├── sw.js                   ✅ Debe estar
├── manifest.json           ✅ Debe estar
├── plan_de_centro_2025.pdf ✅ Debe estar (IMPORTANTE)
└── README.md               ⚪ Opcional
```

## 🆘 SI NADA FUNCIONA

1. **Descarga los archivos individuales** (no el ZIP)
2. Crea una carpeta nueva en tu ordenador
3. Guarda cada archivo en esa carpeta
4. Asegúrate que el PDF se llame `plan_de_centro_2025.pdf`
5. Sube toda la carpeta a GitHub

## 💡 CONSEJOS

- El nombre del PDF es CRÍTICO: debe ser exactamente `plan_de_centro_2025.pdf`
- GitHub Pages puede tardar 1-2 minutos en activarse
- Si haces cambios, espera 1-2 minutos y limpia la caché
- Usa Chrome o Edge para mejor compatibilidad

## 🔧 MENSAJES DE ERROR Y SOLUCIONES

| Error en consola | Solución |
|-----------------|----------|
| "No se encontró el elemento canvas" | Recarga la página |
| "Error cargando PDF" | Verifica nombre y ubicación del PDF |
| "pdfjsLib is not defined" | Verifica tu conexión a internet |
| "Service Worker failed" | Normal en desarrollo local, OK en GitHub Pages |

---

Si sigues teniendo problemas, envíame capturas de:
1. La consola del navegador (F12)
2. La lista de archivos en tu repositorio de GitHub
3. La URL de tu GitHub Pages
