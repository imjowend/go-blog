// Estado global
let currentPost = null;
let currentLanguage = 'es'; // 'es' o 'en'

// Función para cargar todos los posts (página de inicio)
async function loadPosts() {
    const container = document.getElementById('posts-container');

    try {
        const response = await fetch('/api/posts');

        if (!response.ok) {
            throw new Error('Error al cargar los posts');
        }

        const posts = await response.json();

        // Limpiar el contenedor
        container.innerHTML = '';

        // Crear una tarjeta para cada post
        posts.forEach(post => {
            const card = createPostCard(post);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `
            <div class="error">
                Error al cargar los posts. Por favor, intenta nuevamente.
            </div>
        `;
    }
}

// Función para crear una tarjeta de post
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';

    card.innerHTML = `
        <div class="post-card-header">
            <span class="post-id">Post #${post.id}</span>
            <span class="post-date">${formatDate(post.date)}</span>
        </div>
        <h2>${post.title_es}</h2>
        <p>${post.summary_es}</p>
        <button class="btn btn-primary read-more-btn">Leer más →</button>
    `;

    // Agregar evento de clic para navegar al post
    card.addEventListener('click', () => {
        window.location.href = `/post/${post.id}`;
    });

    return card;
}

// Función para cargar un post individual
async function loadPost() {
    const postContainer = document.getElementById('post-container');
    const postContent = document.getElementById('post-content');

    // Obtener el ID del post desde la URL
    const pathParts = window.location.pathname.split('/');
    const postId = pathParts[pathParts.length - 1];

    if (!postId || isNaN(postId)) {
        postContainer.innerHTML = `
            <div class="error">
                ID de post inválido
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`/api/posts/${postId}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Post no encontrado');
            }
            throw new Error('Error al cargar el post');
        }

        currentPost = await response.json();

        // Ocultar mensaje de carga y mostrar contenido
        postContainer.style.display = 'none';
        postContent.style.display = 'block';

        // Renderizar el post
        renderPost();

        // Configurar eventos
        setupPostEvents();

    } catch (error) {
        console.error('Error:', error);
        postContainer.innerHTML = `
            <div class="error">
                ${error.message}
            </div>
        `;
    }
}

// Función para renderizar el post en la página
function renderPost() {
    if (!currentPost) return;

    const title = currentLanguage === 'es' ? currentPost.title_es : currentPost.title_en;
    const content = currentLanguage === 'es' ? currentPost.content_es : currentPost.content_en;

    document.getElementById('post-title').textContent = title;
    document.getElementById('post-date').textContent = formatDate(currentPost.date);
    document.getElementById('post-body').textContent = content;

    // Actualizar el toggle de idioma
    const currentLangEl = document.getElementById('current-lang');
    const switchToLangEl = document.getElementById('switch-to-lang');

    if (currentLanguage === 'es') {
        currentLangEl.textContent = 'Español';
        switchToLangEl.textContent = 'English';
    } else {
        currentLangEl.textContent = 'English';
        switchToLangEl.textContent = 'Español';
    }

    // Actualizar el título de la página
    document.title = `${title} - Blog Go`;
}

// Función para configurar eventos en la página del post
function setupPostEvents() {
    // Toggle de idioma
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    langToggleBtn.addEventListener('click', toggleLanguage);

    // Botón de copiar resumen
    const copySummaryBtn = document.getElementById('copy-summary-btn');
    copySummaryBtn.addEventListener('click', copySummary);
}

// Función para cambiar entre idiomas
function toggleLanguage() {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    renderPost();
}

// Función para copiar el resumen al portapapeles
async function copySummary() {
    if (!currentPost) return;

    const summary = currentLanguage === 'es' ? currentPost.summary_es : currentPost.summary_en;

    try {
        await navigator.clipboard.writeText(summary);
        showToast('Resumen copiado al portapapeles');
    } catch (error) {
        console.error('Error al copiar:', error);
        // Fallback para navegadores que no soportan clipboard API
        fallbackCopyToClipboard(summary);
    }
}

// Función fallback para copiar al portapapeles
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showToast('Resumen copiado al portapapeles');
    } catch (error) {
        console.error('Error al copiar:', error);
        showToast('Error al copiar el resumen');
    }

    document.body.removeChild(textArea);
}

// Función para mostrar notificación toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remover el toast después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideInUp 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Función para formatear fechas
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}
