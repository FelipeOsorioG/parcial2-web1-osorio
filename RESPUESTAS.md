# Parcial 2 · Respuestas de razonamiento

Nombre: Felipe Osorio Grajales

Son cuatro preguntas de 5 puntos sobre código que ya conoces. Para cada una:

1. Lee el código y escribe primero lo que **crees** que pasa.
2. Compruébalo: pégalo en la consola de DevTools (F12 → Console) con tu página del parcial abierta en Live Server. En esa consola sí se puede usar `await` fuera de una función.
3. Escribe tu respuesta debajo de cada letra: (a), (b), (c)…

Se califica la explicación, no solo el resultado: con dos o tres frases por letra es suficiente. Escríbela con tus palabras, porque te la pueden preguntar.

## P1 · ¿En qué orden se imprime? (5 puntos)

**Lo viste en:** la función `cargar` del Explorador (semana 8): «await pausa ESTA función, no el navegador».

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
const cargar = async () => {
  console.log('3');
  const respuesta = await fetch('https://rickandmortyapi.com/api/episode/1');
  console.log('4');
};
cargar();
console.log('5');
```

**(a)** Los cinco números en el orden en que salen en la consola. (2 pts)

Respuesta:

Creo que sale así: 1, 3, 5, 2, 4. Lo probé en la consola y me dio ese mismo orden.

**(b)** Por qué el `3` sale **antes** que el `5`, si `cargar` es una función `async`. (2 pts)

Respuesta:

Porque una función async no se pone en pausa desde que empieza, sino desde que llega al primer await. Al llamar a cargar() se ejecuta normal, y como el console.log("3") está antes del await, sale enseguida. Solo después de ese await se devuelve el control al código de afuera, que es el que imprime el 5.

**(c)** Por qué el `5` no espera a que termine el `fetch`, y por qué el `2` y el `4` salen al final. (1 pt)

Respuesta:

El await solo pausa la función cargar, no todo el navegador, por eso el código de afuera sigue de largo y llega al 5 sin esperar nada. El 2 y el 4 salen al final porque ambos tienen que esperar a que termine todo el código normal: el 2 es el setTimeout y el 4 es lo que va después del await. El 2 sale primero porque su tiempo es 0 y el fetch tiene que esperar la respuesta del servidor por internet.

## P2 · Un 404 que no llega al catch (5 puntos)

**Lo viste en:** el `pedirJSON` del Explorador (semana 8): «fetch solo falla si NO pudo hablar con el servidor».

El episodio 9999 no existe: la API responde con código **404** y el cuerpo `{"error":"Episode not found"}`.

```js
try {
  const respuesta = await fetch('https://rickandmortyapi.com/api/episode/9999');
  const datos = await respuesta.json();
  console.log('Episodio:', datos.name);
} catch (error) {
  console.log('Falló:', error.message);
}
```

**(a)** Qué imprime la consola, exactamente. (1 pt)

Respuesta:

Imprime exactamente: Episodio: undefined

**(b)** Por qué **no** entra al `catch`, aunque el episodio no existe. Pista: piensa en la diferencia entre «el servidor respondió con un 404» y «no hubo respuesta» (por ejemplo, sin internet). (2 pts)

Respuesta:

Porque el fetch solo falla cuando no logra comunicarse con el servidor, por ejemplo si no hay internet. Aquí el servidor sí contestó, solo que con un 404, y para fetch eso es una respuesta válida, no un fallo. Además respuesta.json() puede leer el cuerpo {"error":"Episode not found"} sin problema, y como ese objeto no tiene la propiedad name, datos.name queda en undefined en vez de lanzar un error.

**(c)** La línea que falta para que sí entre al `catch`: escríbela e indica en qué parte del código va. Luego escribe qué imprimiría la consola con esa línea. (2 pts)

Respuesta:

Hay que revisar si la respuesta fue exitosa y lanzar el error nosotros mismos. La línea va justo después del fetch y antes de respuesta.json():

```js
if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
```

Con esa línea, la consola imprimiría: Falló: HTTP 404

## P3 · LocalStorage sin JSON (5 puntos)

**Lo viste en:** `js/favoritos.js` del Explorador (semana 8): «localStorage solo guarda TEXTO».

```js
const vistos = [1, 5, 8];
localStorage.setItem('vistos', vistos);
const leido = localStorage.getItem('vistos');
console.log(leido, typeof leido);      // (a)
console.log(leido.length);             // (b)
const recuperado = JSON.parse(leido);  // (c)
```

**(a)** Qué imprime la línea marcada (a): el valor y su tipo. (1 pt)

Respuesta:

Imprime: 1,5,8 string. Cuando guardé el array con setItem, localStorage lo convirtió a texto, y lo que leo de vuelta es un string, no un array.

**(b)** Qué imprime la línea marcada (b), y por qué da ese número. (1 pt)

Respuesta:

Imprime 5. Como leido es el texto "1,5,8" y no el array, length cuenta los caracteres: los tres números y las dos comas, o sea 5. Si fuera el array daría 3.

**(c)** Qué pasa en la línea marcada (c): ¿funciona o sale un error? Si sale un error, cuál y por qué. (1 pt)

Respuesta:

Sale un error de tipo SyntaxError (en mi consola dice "Unexpected non-whitespace character after JSON at position 1"). Pasa porque JSON.parse necesita texto en formato JSON válido y "1,5,8" no lo es: lee el 1 y se encuentra con una coma que no esperaba.

**(d)** La segunda línea corregida, para que `recuperado` vuelva a ser el array `[1, 5, 8]`. (1 pt)

Respuesta:

```js
localStorage.setItem('vistos', JSON.stringify(vistos));
```

Así lo que se guarda es el texto "[1,5,8]", que sí es JSON válido, y JSON.parse lo puede volver a convertir en el array.

**(e)** Por qué en tu `leerVistos` el `JSON.parse` va dentro de un `try/catch`: qué podría pasarle a la app si no estuviera. (1 pt)

Respuesta:

Porque lo que hay en localStorage puede estar dañado o alguien lo pudo modificar a mano (por ejemplo dejarlo en "{roto"). Si JSON.parse no estuviera dentro de un try/catch, lanzaría un error apenas cargue la página, y como leerVistos() se llama al arrancar, toda la app se rompería y quedaría en blanco. Con el try/catch, si algo falla simplemente devuelvo [] y la app arranca normal.

## P4 · Botones que dejan de funcionar (5 puntos)

**Lo viste en:** la delegación en la grilla del Explorador (semana 7, paso 04). Está explicada en el README, en R6: «¿Qué es la delegación?».

Un compañero escribió este código. Al cargar la página, el primer clic en «Marcar como visto» funciona; pero después de ese clic, o después de escribir una letra en el buscador, **ningún botón responde**.

```js
render();
document.querySelectorAll('[data-id]').forEach((boton) => {
  boton.addEventListener('click', () => {
    vistos = alternarId(vistos, Number(boton.dataset.id));
    guardarVistos(vistos);
    render();
  });
});
```

**(a)** Qué les pasó a los botones. Pista: fíjate en qué hace `render()` con el contenido de `#lista` cada vez que se llama, y en cuántas veces se ejecuta el `forEach`. (2 pts)

Respuesta:

El forEach se ejecuta una sola vez, cuando carga la página, y le pone un listener a cada botón que existe en ese momento. El problema es que render() reemplaza todo el contenido de #lista con innerHTML: los botones viejos se borran junto con sus listeners y se crean botones nuevos que ya no tienen ninguno. Por eso el primer clic funciona, pero después de cualquier render() (un clic o escribir en el buscador) los botones nuevos no responden.

**(b)** El código reescrito con **delegación**: un solo listener en `#lista` que funcione con cualquier botón, aunque `render()` lo haya creado después. Se revisan tres cosas, 1 punto cada una: que el listener esté en `#lista` y no en los botones; que use `closest('[data-id]')` (o algo equivalente) para saber qué botón se presionó; y que no haga nada si el clic no fue en un botón. (3 pts)

Respuesta:

```js
lista.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-id]");
  if (!boton) return;

  vistos = alternarId(vistos, Number(boton.dataset.id));
  guardarVistos(vistos);
  render();
});
```

El listener está solo en #lista, así que sigue funcionando aunque render() cree botones nuevos. Con closest("[data-id]") sé cuál botón se presionó, y si el clic no fue en un botón, boton es null y el return no hace nada.

