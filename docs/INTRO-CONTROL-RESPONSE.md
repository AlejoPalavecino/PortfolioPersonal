# Contornos e interacción de los controles

- Se anulan los bordes heredados de ambas acciones con un selector de mayor prioridad. Se conserva únicamente un indicador discontinuo al usar foco de teclado.
- Se retoca la silueta del caminante y se elimina su balanceo continuo para mantenerla legible a tamaño de icono.
- El sonido expone su nuevo estado y silencia de forma síncrona. La interfaz ya no espera a la promesa de reproducción para cambiar el icono.
- Reanudar el contexto y reproducir se solicitan juntos dentro del gesto. Al silenciar se conserva el contexto disponible, evitando reiniciarlo en cada clic; la pestaña oculta sigue suspendiéndolo.
- Cada petición de audio tiene una revisión: resultados antiguos no pisan el estado solicitado más recientemente. Una denegación actual restaura silencio y comunica el fallo.

Verificación: build con `/PortfolioPersonal/`, lint y diff-check aprobados. Pruebas de alternancia rápida, rechazo atrasado y fallo actual de reproducción incluidas. La revisión visual y auditiva en navegador de esta rama sigue pendiente; no se midió latencia real del dispositivo.
