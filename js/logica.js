export const filtrarEpisodios = (lista, { texto, temporada }) => {
  const buscado = texto.trim().toLowerCase();
  return lista.filter(
    (episodio) =>
      episodio.name.toLowerCase().includes(buscado) &&
      episodio.episode.startsWith(temporada)
  );
};

export const contarPersonajes = (lista) =>
  lista.reduce((total, episodio) => total + episodio.characters.length, 0);

export const alternarId = (ids, id) =>
  ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
