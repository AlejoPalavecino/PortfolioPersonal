"""Audio original del kit Campamento de Alejo.

Sintesis reproducible, sin grabaciones, samples ni melodias de terceros.
Requisitos: Python 3 y NumPy. Ejecutar: python3 source.py
Salida: WAV PCM de 16 bits a 44 100 Hz y metadataaudio.json.
"""

from pathlib import Path
import hashlib
import json
import math
import wave

import numpy as np


ROOT = Path(__file__).resolve().parent
SR = 44100
RNG = np.random.default_rng(20261029)


def envelope(n, attack=0.012, release=0.08):
    out = np.ones(n, dtype=np.float64)
    a = min(int(SR * attack), n // 2)
    r = min(int(SR * release), n // 2)
    if a:
        out[:a] = np.sin(np.linspace(0, math.pi / 2, a)) ** 2
    if r:
        out[-r:] = np.cos(np.linspace(0, math.pi / 2, r)) ** 2
    return out


def tone(freq, duration, decay=5.0):
    n = round(SR * duration)
    t = np.arange(n) / SR
    # Timbre suave con una pequena segunda armonica; sin onda cuadrada dura.
    x = np.sin(2 * math.pi * freq * t)
    x += 0.10 * np.sin(4 * math.pi * freq * t)
    return x * np.exp(-decay * t) * envelope(n)


def sequence(notes, duration):
    out = np.zeros(round(SR * duration))
    for start, freq, note_duration, gain in notes:
        note = tone(freq, note_duration) * gain
        i = round(start * SR)
        end = min(i + len(note), len(out))
        out[i:end] += note[:end - i]
    return out * envelope(len(out), 0.006, 0.1)


def periodic_noise(duration, low, high, tilt=0.45):
    n = round(SR * duration)
    freq = np.fft.rfftfreq(n, 1 / SR)
    phase = RNG.uniform(0, 2 * math.pi, len(freq))
    spectrum = np.exp(1j * phase)
    with np.errstate(divide='ignore', invalid='ignore'):
        shape = np.maximum(freq, 1.0) ** (-tilt)
        shape *= 1.0 / (1.0 + (low / np.maximum(freq, 1.0)) ** 6)
        shape *= 1.0 / (1.0 + (freq / high) ** 6)
    shape[0] = 0
    signal = np.fft.irfft(spectrum * shape, n=n)
    return signal / max(float(np.max(np.abs(signal))), 1e-12)


def save(name, data, peak_db, purpose, loop=False):
    data = np.asarray(data, dtype=np.float64)
    data -= data.mean(axis=0)
    current = float(np.max(np.abs(data)))
    data *= 10 ** (peak_db / 20) / max(current, 1e-12)
    pcm = np.rint(data * 32767).astype('<i2')
    filename = ROOT / name
    channels = 1 if pcm.ndim == 1 else pcm.shape[1]
    with wave.open(str(filename), 'wb') as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes(pcm.tobytes())
    measured = pcm.astype(np.float64) / 32768
    peak = float(np.max(np.abs(measured)))
    rms = float(np.sqrt(np.mean(measured ** 2)))
    return {
        'file': name,
        'purpose_es': purpose,
        'format': 'WAV PCM signed 16-bit little-endian',
        'sample_rate_hz': SR,
        'channels': channels,
        'duration_seconds': len(pcm) / SR,
        'loop': loop,
        'peak_dbfs': round(20 * math.log10(max(peak, 1e-12)), 2),
        'rms_dbfs': round(20 * math.log10(max(rms, 1e-12)), 2),
        'clipped_samples': int(np.count_nonzero(np.abs(pcm.astype(np.int32)) >= 32767)),
        'size_bytes': filename.stat().st_size,
        'sha256': hashlib.sha256(filename.read_bytes()).hexdigest(),
        'recommended_gain': 0.45 if loop else 0.65,
    }


def main():
    records = []
    records.append(save('ui-open.wav', sequence([
        (0.00, 440.00, 0.24, 0.70),
        (0.07, 659.25, 0.28, 0.50),
    ], 0.42), -22, 'Apertura de un destino o ficha.'))
    records.append(save('ui-close.wav', sequence([
        (0.00, 440.00, 0.20, 0.60),
        (0.06, 329.63, 0.24, 0.45),
    ], 0.36), -24, 'Cierre de una ficha o regreso al mapa.'))
    records.append(save('discovery.wav', sequence([
        (0.00, 523.25, 0.36, 0.55),
        (0.12, 659.25, 0.40, 0.48),
        (0.24, 783.99, 0.48, 0.40),
    ], 0.85), -21, 'Detalle descubierto; reproducir una sola vez por evento.'))

    n = round(SR * 0.11)
    t = np.arange(n) / SR
    step = periodic_noise(0.11, 220, 1700, 0.2)
    step = step * np.exp(-40 * t) + 0.28 * np.sin(2 * math.pi * 115 * t) * np.exp(-55 * t)
    step *= envelope(n, 0.004, 0.035)
    records.append(save('step-soft.wav', step, -28, 'Paso suave opcional; no repetir si el personaje esta detenido.'))

    duration = 12.0
    t = np.arange(round(SR * duration)) / SR
    shared = periodic_noise(duration, 190, 3400, 0.55)
    detail_l = periodic_noise(duration, 650, 5000, 0.30)
    detail_r = periodic_noise(duration, 650, 5000, 0.30)
    # Modulaciones periodicas: el ciclo completo dura exactamente 12 segundos.
    breathing = 0.78 + 0.12 * np.sin(2 * math.pi * t / duration)
    breathing += 0.06 * np.cos(2 * math.pi * 3 * t / duration)
    left = (0.83 * shared + 0.17 * detail_l) * breathing
    right = (0.83 * shared + 0.17 * detail_r) * breathing
    ambience = np.stack([left, right], axis=-1)
    records.append(save('camp-ambience-loop.wav', ambience, -26,
                        'Textura ambiental sintetica suave, evocacion abstracta de brisa y agua; no es una grabacion de campo.', True))

    metadata = {
        'title': 'Audio original - Campamento de Alejo',
        'created_for': 'Portfolio personal de Alejo Palavecino',
        'method': 'Sintesis matematica reproducible con semilla 20261029; sin samples externos.',
        'default_playback': 'Desactivado hasta que el visitante active el sonido.',
        'loop_integration': 'Usar un bucle de buffer sin retraso agregado; aplicar fade-in/fade-out de 150 ms al iniciar o detener.',
        'checks': 'WAV reabiertos, dimensiones y niveles medidos. No clipping. No se realizo una evaluacion auditiva humana.',
        'files': records,
    }
    (ROOT / 'metadataaudio.json').write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps(metadata, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
