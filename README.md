# Juego de Multiplicar

Un juego de tablas de multiplicar interactivo para practicar matem\u00e1ticas. Perfecto para estudiantes de primaria y cualquier persona que quiera mejorar su cálculo mental.

## Características

### Personalización
- Elige tu nombre y un avatar entre 19 personajes (animales, personajes divertidos y más)
- **Tema claro/oscuro**: Adapta el juego a tu preferencia visual
- **Niveles de dificultad**:
  - **Fácil**: Tablas del 2 al 5
  - **Normal**: Tablas del 2 al 7
  - **Difícil**: Tablas del 2 al 9

### Juego
- **Práctica enfocada**: Selecciona tablas específicas para practicar (ej: solo la del 7 y la del 8)
- **Juego configurable**:
  - Número de preguntas: de 1 a 100
  - Tiempo límite: de 1 a 60 minutos
- **Tres tipos de ecuaciones aleatorias** (nunca multiplica por 1):
  - `2 x 2 = ?` = Encuentra el resultado
  - `? x 5 = 30` = Encuentra el primer factor
  - `9 x ? = 18` = Encuentra el segundo factor
- **Botón de saltar**: Si no sabes una respuesta, pasa sin bloquear el flujo
- **Teclado numérico en móvil**: Solo se permiten números para evitar errores

### Corrección y estadísticas
- **Corrección animada**: Se revisa pregunta a pregunta mostrando verde o rojo con un contador de aciertos/fallos en tiempo real
- **Puntuación por tiempo**: Bonus basado en el tiempo restante al terminar (cuanto más rápido, mejor)
- **Estadísticas detalladas**: Barras de progreso por tabla para identificar cuáles necesitas practicar más
- **Confetti**: Animación de celebración al lograr el 100% de aciertos!
- **Revisión completa**: Cada respuesta se revisa con la ecuación completa y su resultado correcto

### Marcadores
- Los mejores resultados se guardan localmente en el navegador
- Ranking ordenado por puntuaci\u00f3n total (aciertos + bonus tiempo)
- Muestra dificultad, porcentaje y ratio de aciertos

## Cómo jugar

1. **Configuración**:
   - Introduce tu nombre
   - Selecciona un avatar
   - Elige nivel de dificultad (Fácil, Normal o Difícil)
   - (Opcional) Selecciona tablas específicas para practicar
   - Ajusta el número de preguntas y el tiempo deseado
   - Elige entre tema claro u oscuro
   - Pulsa **Jugar**

2. **Durante el juego**:
   - Aparecerán multiplicaciones con un valor desconocido que debes resolver
   - Escribe el número correcto en cada campo
   - Usa **Saltar** para pasar preguntas que no sepas
   - Navega entre preguntas con las flechas o con Enter
   - El temporizador en la parte superior muestra el tiempo restante

3. **Corrección**:
   - Pulsa **Corregir** cuando termines (o espera a que se acabe el tiempo)
   - Se revisará cada pregunta una a una con una animación
   - El contador de aciertos y fallos se actualizará en directo
   - Al terminar, ver\u00e1s el resumen con tu puntuación, bonus tiempo y estadísticas

4. **Resultados**:
   - Puntuación = (aciertos + 10) + bonus tiempo
   - Revisa las estadísticas por tabla para saber cuáles practicar
   - Guarda tu marcador para competir en el ranking


## Archivos

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Estructura principal del juego |
| `style.css` | Estilos responsive (tema claro y oscuro) |
| `game.js` | Lógica del juego (preguntas, temporizador, corrección, confetti) |
| `leaderboard.js` | Sistema de marcadores con localStorage |

## Tecnolog\u00edas

- HTML5
- CSS3 (variables CSS, responsive, animaciones)
- JavaScript vanilla (sin frameworks)

## Licencia

Código libre para uso educativo y personal.
