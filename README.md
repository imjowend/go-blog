# Blog Go - Aplicación Web de Posts Traducidos

Aplicación web completa desarrollada en Golang que sirve posts de blog traducidos entre español e inglés.

## Características

- **Backend en Go**: Servidor HTTP usando solo librerías estándar de Go
- **API REST**: Endpoints para obtener todos los posts o un post específico
- **25 Posts de Blog**: Contenido sobre programación en Go, traducido al español e inglés
- **Frontend Minimalista**: Diseño limpio inspirado en la estética de Go
- **Toggle de Idioma**: Cambia entre español e inglés en cada post
- **Copiar Resumen**: Funcionalidad para copiar el resumen al portapapeles
- **Responsive**: Diseño mobile-friendly

## Estructura del Proyecto

```
go-blog/
└── backend/
    ├── main.go                          # Servidor HTTP y API
    ├── go.mod                           # Módulo de Go
    ├── data/
    │   └── posts_translated.json        # 25 posts traducidos
    └── static/
        ├── index.html                   # Página de inicio
        ├── post.html                    # Página de detalle de post
        ├── css/
        │   └── style.css                # Estilos minimalistas
        └── js/
            └── main.js                  # Funcionalidad del frontend
```

## Requisitos

- Go 1.16 o superior

## Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd go-blog
```

### 2. Navegar al directorio del backend

```bash
cd backend
```

### 3. Inicializar el módulo de Go (si es necesario)

```bash
go mod init go-blog
```

### 4. Ejecutar el servidor

```bash
go run main.go
```

Deberías ver el mensaje:
```
Cargados 25 posts exitosamente
Servidor iniciado en http://localhost:8080
```

### 5. Abrir en el navegador

Abre tu navegador y visita:
```
http://localhost:8080
```

## Funcionalidades

### Página de Inicio (/)
- Lista todos los 25 posts de blog
- Muestra: ID, Título en español, Fecha y Resumen
- Click en cualquier post para ver el detalle

### Página de Post (/post/:id)
- Muestra el contenido completo de un post
- Toggle para cambiar entre español e inglés
- Botón para copiar el resumen al portapapeles
- Botón para volver a la página de inicio

### API REST

#### Obtener todos los posts
```
GET /api/posts
```

Retorna un array JSON con todos los posts.

#### Obtener un post específico
```
GET /api/posts/:id
```

Retorna un objeto JSON con el post solicitado.

Ejemplo:
```bash
curl http://localhost:8080/api/posts/1
```

## Tecnologías Utilizadas

### Backend
- **Go** (Golang) - Solo librerías estándar:
  - `net/http` - Servidor HTTP
  - `encoding/json` - Manejo de JSON
  - `io` - Lectura de archivos
  - `os` - Operaciones del sistema

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos minimalistas
- **JavaScript Vanilla** - Funcionalidad sin frameworks

## Paleta de Colores

- Azul Go: `#00ADD8`
- Fondo: `#FFFFFF` / `#F5F5F5`
- Texto: `#333333`
- Gris claro: `#E0E0E0`

## Autor

Desarrollado con Go 🚀
