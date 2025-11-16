package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// Post representa un post de blog
type Post struct {
	ID                int    `json:"id"`
	Title             string `json:"title"`
	Date              string `json:"date"`
	URL               string `json:"url"`
	ContentOriginal   string `json:"content_original,omitempty"`   // Solo en posts_es.json
	ContentTraducido  string `json:"content_traducido,omitempty"`  // Solo en posts_es.json
	Content           string `json:"content,omitempty"`            // Solo en posts_en.json
	Resumen           string `json:"resumen,omitempty"`            // Solo en posts_es.json
}

// Language representa el idioma configurado
type Language string

const (
	Spanish    Language = "es"
	English    Language = "en"
	Portuguese Language = "pt"
)

var (
	posts           []Post
	currentLanguage Language = Spanish // Idioma por defecto: español
	// Para cambiar el idioma, modifica esta variable a:
	// - Spanish (usa posts_es.json)
	// - English (usa posts_en.json)
	// - Portuguese (usa posts_pt.json, cuando esté disponible)
)

func main() {
	// Cargar posts desde el archivo JSON
	if err := loadPosts(); err != nil {
		log.Fatal("Error cargando posts:", err)
	}

	// Servir archivos estáticos
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Ruta para servir index.html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "./static/index.html")
			return
		}
		http.NotFound(w, r)
	})

	// Ruta para servir post.html
	http.HandleFunc("/post/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./static/post.html")
	})

	// API: Obtener todos los posts
	http.HandleFunc("/api/posts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(posts); err != nil {
			http.Error(w, "Error codificando JSON", http.StatusInternalServerError)
			return
		}
	})

	// API: Obtener un post por ID
	http.HandleFunc("/api/posts/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		// Extraer el ID de la URL
		path := strings.TrimPrefix(r.URL.Path, "/api/posts/")
		if path == "" {
			http.Error(w, "ID requerido", http.StatusBadRequest)
			return
		}

		id, err := strconv.Atoi(path)
		if err != nil {
			http.Error(w, "ID inválido", http.StatusBadRequest)
			return
		}

		// Buscar el post por ID
		var foundPost *Post
		for i := range posts {
			if posts[i].ID == id {
				foundPost = &posts[i]
				break
			}
		}

		if foundPost == nil {
			http.Error(w, "Post no encontrado", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(foundPost); err != nil {
			http.Error(w, "Error codificando JSON", http.StatusInternalServerError)
			return
		}
	})

	// Iniciar servidor
	fmt.Println("Servidor iniciado en http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Error iniciando servidor:", err)
	}
}

// loadPosts carga los posts desde el archivo JSON según el idioma configurado
func loadPosts() error {
	// Determinar la ruta del archivo JSON según el idioma
	filename := getPostsFilename(currentLanguage)
	jsonPath := filepath.Join("data", filename)

	// Abrir el archivo
	file, err := os.Open(jsonPath)
	if err != nil {
		return fmt.Errorf("error abriendo archivo %s: %w", jsonPath, err)
	}
	defer file.Close()

	// Leer el contenido
	bytes, err := io.ReadAll(file)
	if err != nil {
		return fmt.Errorf("error leyendo archivo: %w", err)
	}

	// Parsear JSON
	if err := json.Unmarshal(bytes, &posts); err != nil {
		return fmt.Errorf("error parseando JSON: %w", err)
	}

	log.Printf("Cargados %d posts exitosamente desde %s (idioma: %s)\n", len(posts), filename, currentLanguage)
	return nil
}

// getPostsFilename devuelve el nombre del archivo de posts según el idioma
func getPostsFilename(lang Language) string {
	switch lang {
	case Spanish:
		return "posts_es.json"
	case English:
		return "posts_en.json"
	case Portuguese:
		return "posts_pt.json"
	default:
		return "posts_es.json" // Fallback a español
	}
}

// setLanguage cambia el idioma y recarga los posts
func setLanguage(lang Language) error {
	currentLanguage = lang
	return loadPosts()
}
