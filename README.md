# Multi

Un juego de tablas de multiplicar interactivo para practicar matem\u00e1ticas. Perfecto para estudiantes de primaria y cualquier persona que quiera mejorar su c\u00e1lculo mental.

## Caracter\u00edsticas

### Personalizaci\u00f3n
- Elige tu nombre y un avatar entre 19 personajes (animales, personajes divertidos y m\u00e1s)
- **Tema claro/oscuro**: Adapta el juego a tu preferencia visual
- **Niveles de dificultad**:
  - **F\u00e1cil**: Tablas del 2 al 5
  - **Normal**: Tablas del 2 al 7
  - **Dif\u00edcil**: Tablas del 2 al 9

### Juego
- **Pr\u00e1ctica enfocada**: Selecciona tablas espec\u00edficas para practicar (ej: solo la del 7 y la del 8)
- **Juego configurable**:
  - N\u00famero de preguntas: de 1 a 100
  - Tiempo l\u00edmite: de 1 a 60 minutos
- **Tres tipos de ecuaciones aleatorias** (nunca multiplica por 1):
  - `2 \u00d7 2 = ?` \u2192 Encuentra el resultado
  - `? \u00d7 5 = 30` \u2192 Encuentra el primer factor
  - `9 \u00d7 ? = 18` \u2192 Encuentra el segundo factor
- **Bot\u00f3n de saltar**: Si no sabes una respuesta, pasa sin bloquear el flujo
- **Teclado num\u00e9rico en m\u00f3vil**: Solo se permiten n\u00fameros para evitar errores

### Correcci\u00f3n y estad\u00edsticas
- **Correcci\u00f3n animada**: Se revisa pregunta a pregunta mostrando \u2705 verde o \u274c rojo con un contador de aciertos/fallos en tiempo real
- **Puntuaci\u00f3n por tiempo**: Bonus basado en el tiempo restante al terminar (cu\u00e1nto m\u00e1s r\u00e1pido, mejor)
- **Estad\u00edsticas detalladas**: Barras de progreso por tabla para identificar cu\u00e1les necesitas practicar m\u00e1s
- **Confetti**: \u00a1Animaci\u00f3n de celebraci\u00f3n al lograr el 100% de aciertos!
- **Revisi\u00f3n completa**: Cada respuesta se revisa con la ecuaci\u00f3n completa y su resultado correcto

### Marcadores
- Los mejores puntajes se guardan localmente en el navegador
- Ranking ordenado por puntuaci\u00f3n total (aciertos + bonus tiempo)
- Muestra dificultad, porcentaje y ratio de aciertos

## C\u00f3mo jugar

1. **Configuraci\u00f3n**:
   - Introduce tu nombre
   - Selecciona un avatar
   - Elige nivel de dificultad (F\u00e1cil, Normal o Dif\u00edcil)
   - (Opcional) Selecciona tablas espec\u00edficas para practicar
   - Ajusta el n\u00famero de preguntas y el tiempo deseado
   - Elige entre tema claro u oscuro
   - Pulsa **Jugar**

2. **Durante el juego**:
   - Aparecer\u00e1n multiplicaciones con un valor desconocido que debes resolver
   - Escribe el n\u00famero correcto en cada campo
   - Usa **Saltar** para pasar preguntas que no sepas
   - Navega entre preguntas con las flechas o con Enter
   - El temporizador en la parte superior muestra el tiempo restante

3. **Correcci\u00f3n**:
   - Pulsa **Corregir** cuando termines (o espera a que se acabe el tiempo)
   - Se revisar\u00e1 cada pregunta una a una con una animaci\u00f3n
   - El contador de aciertos y fallos se actualizar\u00e1 en directo
   - Al terminar, ver\u00e1s el resumen con tu puntuaci\u00f3n, bonus tiempo y estad\u00edsticas

4. **Resultados**:
   - Puntuaci\u00f3n = (aciertos \u00d7 10) + bonus tiempo
   - Revisa las estad\u00edsticas por tabla para saber cu\u00e1les practicar
   - Guarda tu marcador para competir en el ranking

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub
2. Sube los archivos: `index.html`, `style.css`, `game.js`, `leaderboard.js`
3. Ve a **Settings > Pages > Source** y selecciona la rama `main`
4. Tu juego estar\u00e1 disponible en `https://tu-usuario.github.io/tu-repo/`

## Archivos

| Archivo | Descripci\u00f3n |
|---------|-------------|
| `index.html` | Estructura principal del juego |
| `style.css` | Estilos responsive (tema claro y oscuro) |
| `game.js` | L\u00f3gica del juego (preguntas, temporizador, correcci\u00f3n, confetti) |
| `leaderboard.js` | Sistema de marcadores con localStorage |

## Tecnolog\u00edas

- HTML5
- CSS3 (variables CSS, responsive, animaciones)
- JavaScript vanilla (sin frameworks)

## Licencia

C\u00f3digo libre para uso educativo y personal.
