# Rutas en pasos estrechos

La búsqueda comprueba primero los extremos y el trayecto directo. Si este está obstruido, busca en la cuadrícula habitual del mundo; únicamente si no encuentra ruta y la celda supera 4 unidades, repite la búsqueda una vez con la mitad del tamaño, con un mínimo de 4. En el campamento esto pasa de 8 a 4 unidades y permite atravesar el paso hacia el extremo este.

El reintento mantiene el margen de colisión de 5 unidades y comprueba cada segmento con las mismas reglas geométricas. No cambia el mundo ni sus obstáculos. Las rutas normales no pagan el costo de la segunda búsqueda; cuando hace falta, la cuadrícula más fina puede tener aproximadamente cuatro veces más posiciones, y no hay reintentos adicionales.
