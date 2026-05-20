# Multiplication Game

Un juego de tablas de multiplicar interactivo para practicar matemáticas.

## Características

- Elige tu nombre y avatar entre 20 emojis diferentes
- Configura el número de preguntas (1-100) y el tiempo límite (1-60 minutos)
- Tres tipos de ecuaciones aleatorias:
  - `2 x 2 = X` (encuentra el resultado)
  - `Y x 5 = 30` (encuentra el primer factor)
  - `9 x Z = 18` (encuentra el segundo factor)
- Teclado numérico en móvil (`inputmode="numeric"`)
- Temporizador visible con alertas de tiempo
- Corrección automática con revisión detallada
- Marcadores (leaderboard) local y en GitHub

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub (ej: `tu-usuario/multiplication-game`)
2. Sube todos los archivos (`index.html`, `style.css`, `game.js`, `leaderboard.js`, `leaderboard.json`)
3. Ve a Settings > Pages > Source y selecciona la rama `main`
4. Tu juego estará disponible en `https://tu-usuario.github.io/multiplication-game/`

## Leaderboard en GitHub

Para que los marcadores se sincronicen globalmente entre todos los jugadores:

1. Crea un [GitHub Personal Access Token](https://github.com/settings/tokens) con permisos de `repo`
2. Configura tu repositorio en formato `usuario/repositorio`
3. Introduce el token en la configuración del juego

El leaderboard se guarda en `leaderboard.json` dentro del mismo repositorio.

## Archivos

- `index.html` - Estructura principal
- `style.css` - Estilos responsive (desktop y móvil)
- `game.js` - Lógica del juego
- `leaderboard.js` - Sistema de marcadores (localStorage + GitHub API)
- `leaderboard.json` - Archivo de marcadores (se actualiza automáticamente)
