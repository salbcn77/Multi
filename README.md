# Multi

Un juego de tablas de multiplicar interactivo para practicar matemáticas. Perfecto para estudiantes de primaria y cualquier persona que quiera mejorar su cálculo mental.

## Características

- **Personalización**: Elige tu nombre y un avatar entre 19 personajes (animales, personajes divertidos y más)
- **Juego configurable**:
  - Número de preguntas: de 1 a 100
  - Tiempo límite: de 1 a 60 minutos
- **Tres tipos de ecuaciones aleatorias**:
  - `2 × 2 = ?` → Encuentra el resultado
  - `? × 5 = 30` → Encuentra el primer factor
  - `9 × ? = 18` → Encuentra el segundo factor
- **Sin multiplicar por 1**: Los factores van siempre de 2 a 9
- **Teclado numérico en móvil**: Solo se permiten números para evitar errores
- **Temporizador visible**: Con alertas de color cuando queda poco tiempo
- **Corrección animada**: Se revisa pregunta a pregunta mostrando ✓ verde o ✗ rojo con un contador de aciertos/fallos en tiempo real
- **Marcadores locales**: Los mejores puntajes se guardan en el navegador
- **Tema claro/oscuro**: Adapta el juego a tu preferencia
- **Diseño responsive**: Funciona en ordenador y móvil

## Cómo jugar

1. **Configuración**:
   - Introduce tu nombre
   - Selecciona un avatar
   - Ajusta el número de preguntas y el tiempo deseado
   - Elige entre tema claro u oscuro
   - Pulsa **Jugar**

2. **Durante el juego**:
   - Aparecerán multiplicaciones con un valor desconocido que debes resolver
   - Escribe el número correcto en cada campo
   - Navega entre preguntas con las flechas o con Enter
   - El temporizador en la parte superior muestra el tiempo restante

3. **Corrección**:
   - Pulsa **Corregir** cuando termines (o espera a que se acabe el tiempo)
   - Se revisará cada pregunta una a una con una animación
   - El contador de aciertos y fallos se actualizará en directo
   - Al terminar, verás el resumen con tu puntuación y la revisión detallada

4. **Marcadores**:
   - Desde la pantalla de resultados puedes guardar tu puntuación
   - Los marcadores se muestran ordenados por porcentaje de aciertos

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Estructura principal del juego |
| `style.css` | Estilos responsive (tema claro y oscuro) |
| `game.js` | Lógica del juego (preguntas, temporizador, corrección) |
| `leaderboard.js` | Sistema de marcadores con localStorage |

## Tecnologías

- HTML5
- CSS3 (variables CSS, responsive)
- JavaScript vanilla (sin frameworks)

## Licencia

Código libre para uso educativo y personal.
