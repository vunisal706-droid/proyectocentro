// Configurar PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Estado de la aplicación
const state = {
    pdfDoc: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.5,
    canvas: document.getElementById('pdfCanvas'),
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

// Inicializar contexto del canvas
state.ctx = state.canvas.getContext('2d');

// Cargar PDF
const loadPDF = async () => {
    try {
        const loadingTask = pdfjsLib.getDocument('plan_de_centro_2025.pdf');
        state.pdfDoc = await loadingTask.promise;
        document.getElementById('pageCount').textContent = state.pdfDoc.numPages;
        
        // Renderizar primera página
        renderPage(state.pageNum);
        
        // Ocultar loading
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error cargando PDF:', error);
        document.getElementById('loading').innerHTML = 
            '<p>❌ Error al cargar el documento</p><p>Por favor, recarga la página</p>';
    }
};

// Renderizar página
const renderPage = (num) => {
    state.pageRendering = true;
    
    state.pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale: state.scale });
        state.canvas.height = viewport.height;
        state.canvas.width = viewport.width;

        const renderContext = {
            canvasContext: state.ctx,
            viewport: viewport
        };

        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
            state.pageRendering = false;
            if (state.pageNumPending !== null) {
                renderPage(state.pageNumPending);
                state.pageNumPending = null;
            }
        });
    });

    document.getElementById('pageNum').textContent = num;
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
    const section = sections[sectionId];
    if (section) {
        state.pageNum = section.page;
        state.currentSection = sectionId;
        queueRenderPage(state.pageNum);
        
        // Actualizar menú activo
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        
        // Cerrar sidebar en móvil
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }
};

// Buscar en el documento
const searchInDocument = async () => {
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

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners
    document.getElementById('prevPage').addEventListener('click', onPrevPage);
    document.getElementById('nextPage').addEventListener('click', onNextPage);
    document.getElementById('zoomIn').addEventListener('click', onZoomIn);
    document.getElementById('zoomOut').addEventListener('click', onZoomOut);
    document.getElementById('downloadPdf').addEventListener('click', downloadPDF);

    // Navegación por secciones
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            console.log('Navegando a sección:', section); // Debug
            goToSection(section);
        });
    });

    // Búsqueda
    document.getElementById('searchBtn').addEventListener('click', searchInDocument);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchInDocument();
        }
    });

    document.getElementById('closeSearch').addEventListener('click', () => {
        document.getElementById('searchResults').style.display = 'none';
    });

    // Menú móvil
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // Cerrar sidebar al hacer click fuera (móvil)
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
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

    // Inicializar
    updateZoomLevel();
    loadPDF();
});

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
