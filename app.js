// Configurar PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Estado de la aplicación
const state = {
    pdfDoc: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.5,
    canvas: null,
    ctx: null,
    searchResults: [],
    currentSection: 'proyecto-educativo'
};

// Secciones del documento
const sections = {
    'proyecto-educativo': { page: 3, name: 'Proyecto Educativo' },
    'pad': { page: 25, name: 'Plan de Atención a la Diversidad' },
    'cil': { page: 131, name: 'Currículo Integrado de Lenguas' },
    'rof': { page: 201, name: 'Reglamento de Organización y Funcionamiento' },
    'proyecto-gestion': { page: 256, name: 'Proyecto de Gestión' },
    'poat': { page: 267, name: 'Plan de Orientación y Acción Tutorial' },
    'plan-convivencia': { page: 292, name: 'Plan de Convivencia' },
    'documento-completo': { page: 1, name: 'Documento Completo' }
};

// Cargar PDF
const loadPDF = async () => {
    console.log('Iniciando carga del PDF...');
    try {
        const pdfUrl = 'plan_de_centro_2025.pdf';
        console.log('URL del PDF:', pdfUrl);
        
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        
        loadingTask.onProgress = function(progress) {
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`Cargando: ${percent.toFixed(0)}%`);
        };
        
        state.pdfDoc = await loadingTask.promise;
        console.log('PDF cargado exitosamente. Páginas:', state.pdfDoc.numPages);
        
        document.getElementById('pageCount').textContent = state.pdfDoc.numPages;
        
        // Renderizar primera página
        await renderPage(state.pageNum);
        
        // Ocultar loading
        document.getElementById('loading').style.display = 'none';
        console.log('PDF renderizado');
    } catch (error) {
        console.error('Error detallado al cargar PDF:', error);
        const loadingEl = document.getElementById('loading');
        loadingEl.innerHTML = `
            <div style="color: white; text-align: center; padding: 2rem;">
                <p style="font-size: 2rem;">❌</p>
                <p style="margin: 1rem 0;"><strong>Error al cargar el documento</strong></p>
                <p style="font-size: 0.9rem; opacity: 0.8;">Verifica que el archivo PDF esté en la misma carpeta</p>
                <p style="font-size: 0.8rem; opacity: 0.6; margin-top: 1rem;">Error: ${error.message}</p>
            </div>
        `;
    }
};

// Renderizar página
const renderPage = async (num) => {
    if (!state.pdfDoc) {
        console.error('No hay documento PDF cargado');
        return;
    }
    
    state.pageRendering = true;
    console.log('Renderizando página:', num);
    
    try {
        const page = await state.pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: state.scale });
        
        state.canvas.height = viewport.height;
        state.canvas.width = viewport.width;

        const renderContext = {
            canvasContext: state.ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        
        state.pageRendering = false;
        if (state.pageNumPending !== null) {
            renderPage(state.pageNumPending);
            state.pageNumPending = null;
        }
        
        document.getElementById('pageNum').textContent = num;
        console.log('Página renderizada:', num);
    } catch (error) {
        console.error('Error renderizando página:', error);
        state.pageRendering = false;
    }
};

// Cambiar página con cola
const queueRenderPage = (num) => {
    if (state.pageRendering) {
        state.pageNumPending = num;
    } else {
        renderPage(num);
    }
};

// Página anterior
const onPrevPage = () => {
    if (state.pageNum <= 1) return;
    state.pageNum--;
    queueRenderPage(state.pageNum);
};

// Página siguiente
const onNextPage = () => {
    if (!state.pdfDoc) return;
    if (state.pageNum >= state.pdfDoc.numPages) return;
    state.pageNum++;
    queueRenderPage(state.pageNum);
};

// Zoom in
const onZoomIn = () => {
    state.scale += 0.25;
    updateZoomLevel();
    queueRenderPage(state.pageNum);
};

// Zoom out
const onZoomOut = () => {
    if (state.scale <= 0.5) return;
    state.scale -= 0.25;
    updateZoomLevel();
    queueRenderPage(state.pageNum);
};

// Actualizar nivel de zoom
const updateZoomLevel = () => {
    document.getElementById('zoomLevel').textContent = Math.round(state.scale * 100) + '%';
};

// Ir a sección
const goToSection = (sectionId) => {
    console.log('Navegando a sección:', sectionId);
    const section = sections[sectionId];
    if (section) {
        state.pageNum = section.page;
        state.currentSection = sectionId;
        queueRenderPage(state.pageNum);
        
        // Actualizar menú activo
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Cerrar sidebar en móvil
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }
};

// Buscar en el documento
const searchInDocument = async () => {
    if (!state.pdfDoc) {
        alert('El documento aún no está cargado');
        return;
    }
    
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm || searchTerm.length < 3) {
        alert('Por favor, introduce al menos 3 caracteres para buscar');
        return;
    }

    // Mostrar loading
    const resultsContainer = document.getElementById('searchResultsList');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Buscando...</p></div>';
    document.getElementById('searchResults').style.display = 'flex';
    
    state.searchResults = [];
    
    try {
        // Buscar en todas las páginas
        for (let i = 1; i <= state.pdfDoc.numPages; i++) {
            const page = await state.pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ');
            
            // Buscar coincidencias
            const lowerText = text.toLowerCase();
            const lowerSearchTerm = searchTerm.toLowerCase();
            
            if (lowerText.includes(lowerSearchTerm)) {
                // Encontrar contexto
                const index = lowerText.indexOf(lowerSearchTerm);
                const start = Math.max(0, index - 50);
                const end = Math.min(text.length, index + searchTerm.length + 50);
                const context = text.substring(start, end);
                
                state.searchResults.push({
                    page: i,
                    context: context,
                    searchTerm: searchTerm
                });
            }
        }
        
        displaySearchResults();
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        resultsContainer.innerHTML = '<p style="padding: 1rem; text-align: center;">❌ Error en la búsqueda</p>';
    }
};

// Mostrar resultados de búsqueda
const displaySearchResults = () => {
    const resultsContainer = document.getElementById('searchResultsList');
    
    if (state.searchResults.length === 0) {
        resultsContainer.innerHTML = '<p style="padding: 1rem; text-align: center;">No se encontraron resultados</p>';
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    state.searchResults.forEach((result, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'search-result-item';
        
        // Resaltar término de búsqueda en el contexto
        const highlightedContext = result.context.replace(
            new RegExp(result.searchTerm, 'gi'),
            match => `<span class="search-highlight">${match}</span>`
        );
        
        resultDiv.innerHTML = `
            <div class="search-result-page">Página ${result.page}</div>
            <div class="search-result-text">...${highlightedContext}...</div>
        `;
        
        resultDiv.addEventListener('click', () => {
            state.pageNum = result.page;
            queueRenderPage(state.pageNum);
            document.getElementById('searchResults').style.display = 'none';
        });
        
        resultsContainer.appendChild(resultDiv);
    });
    
    resultsContainer.insertAdjacentHTML('afterbegin', 
        `<p style="padding: 0.5rem 0; font-weight: 600; color: var(--primary-color);">
            ${state.searchResults.length} resultado${state.searchResults.length !== 1 ? 's' : ''} encontrado${state.searchResults.length !== 1 ? 's' : ''}
        </p>`
    );
};

// Descargar PDF
const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = 'plan_de_centro_2025.pdf';
    link.download = 'Plan_de_Centro_CEIP_Capitulaciones_2025.pdf';
    link.click();
};

// PWA - Install banner
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBanner = document.getElementById('installBanner');
    if (installBanner) {
        installBanner.style.display = 'flex';
    }
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando aplicación...');
    
    // Inicializar canvas
    state.canvas = document.getElementById('pdfCanvas');
    if (!state.canvas) {
        console.error('No se encontró el elemento canvas');
        return;
    }
    state.ctx = state.canvas.getContext('2d');
    console.log('Canvas inicializado');
    
    // Event Listeners
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const downloadBtn = document.getElementById('downloadPdf');
    
    if (prevBtn) prevBtn.addEventListener('click', onPrevPage);
    if (nextBtn) nextBtn.addEventListener('click', onNextPage);
    if (zoomInBtn) zoomInBtn.addEventListener('click', onZoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', onZoomOut);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadPDF);

    // Navegación por secciones
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            goToSection(section);
        });
    });
    console.log('Event listeners de navegación configurados');

    // Búsqueda
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const closeSearch = document.getElementById('closeSearch');
    
    if (searchBtn) searchBtn.addEventListener('click', searchInDocument);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchInDocument();
            }
        });
    }
    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            document.getElementById('searchResults').style.display = 'none';
        });
    }

    // Menú móvil
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    }

    // Cerrar sidebar al hacer click fuera (móvil)
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (window.innerWidth <= 768 && 
            sidebar && sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            menuToggle && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') onPrevPage();
        if (e.key === 'ArrowRight') onNextPage();
        if (e.key === '+' || e.key === '=') onZoomIn();
        if (e.key === '-') onZoomOut();
    });

    // Inicializar zoom
    updateZoomLevel();
    
    // Cargar PDF
    console.log('Intentando cargar PDF...');
    loadPDF();
});

// Event listeners de instalación PWA
window.addEventListener('load', () => {
    const installBtn = document.getElementById('installBtn');
    const dismissInstall = document.getElementById('dismissInstall');
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
                document.getElementById('installBanner').style.display = 'none';
            }
        });
    }
    
    if (dismissInstall) {
        dismissInstall.addEventListener('click', () => {
            document.getElementById('installBanner').style.display = 'none';
        });
    }
    
    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado:', reg))
            .catch(err => console.log('Error al registrar Service Worker:', err));
    }
});
