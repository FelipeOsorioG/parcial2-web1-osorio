export const URL_EPISODIOS = 'https://rickandmortyapi.com/api/episode';

export const pedirJSON = async (url) => {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return datos;
};

export const obtenerEpisodios = async () => {
  const datos = await pedirJSON(URL_EPISODIOS);
  return datos.results;
};
