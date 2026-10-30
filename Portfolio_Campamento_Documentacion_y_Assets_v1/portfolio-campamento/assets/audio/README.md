# Audio del campamento

Cinco archivos WAV originales, sintetizados para este kit. No contienen samples ni grabaciones de terceros. El ambiente evoca brisa y agua de forma abstracta; no es una grabación de Mendoza.

## Uso

- `ui-open.wav`: apertura de un destino o ficha.
- `ui-close.wav`: cierre de una ficha.
- `discovery.wav`: una respuesta breve al descubrir un detalle.
- `step-soft.wav`: paso discreto, opcional.
- `camp-ambience-loop.wav`: bucle estéreo de 12 segundos.

El sonido comienza desactivado y se habilita después de una acción explícita del visitante. El contenido debe funcionar completo en silencio. Usar una sola instancia del ambiente; no apilar el mismo efecto con cada evento de hover.

Los niveles ya son bajos. `metadataaudio.json` contiene las medidas y una ganancia inicial sugerida; ajustar el volumen general en el sitio. Aplicar una entrada y salida suave de 150 ms al ambiente. El bucle periódico funciona mejor con un buffer de audio que no agregue una pausa entre repeticiones.

## Reproducción de los archivos

```bash
python3 source.py
```

Requiere Python 3 y NumPy. Los WAV son PCM de 16 bits a 44.100 Hz. La síntesis utiliza una semilla fija. La validación automática comprueba formato, duración y ausencia de clipping; la escucha final debe hacerse dentro del sitio con el volumen elegido para publicación.
