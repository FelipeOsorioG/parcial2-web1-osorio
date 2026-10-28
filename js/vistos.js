const CLAVE = 'parcial2-vistos';

export const leerVistos = () => {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
};

export const guardarVistos = (ids) => {
  localStorage.setItem(CLAVE, JSON.stringify(ids));
};
