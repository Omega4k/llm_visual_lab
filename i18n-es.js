/* Spanish translations for LLM Visual Lab. */
window.I18N_ES = {
 "chrome.0": "Lecciones",
 "chrome.1": "Descubre cómo un modelo de lenguaje lee, piensa en vectores y predice el siguiente token.",
 "chrome.2": "llama3.2:1b",
 "chrome.3": "Volver a comprobar",
 "embeddings.0": "2 · Embeddings — las palabras como lugares",
 "embeddings.1": "Dentro del modelo, cada palabra se convierte en una lista de números: un punto en el espacio. Las palabras que significan cosas parecidas se sitúan cerca unas de otras. Arrastra para mirar alrededor de la nube, desplázate para hacer zoom y encuentra los grupos de animales, vehículos y alimentos.",
 "embeddings.2": "La vista 3D necesita una conexión a internet para su\n    biblioteca la primera vez que se carga. La idea: cada punto etiquetado es una palabra, y la distancia significa similitud.",
 "embeddings.3": "<strong>Prueba esto:</strong> encuentra las palabras de la realeza y las palabras de vehículos. ¿Por qué crees que <em>king</em> y <em>queen</em>\n    están lejos de <em>car</em> y <em>bus</em>, aunque las cuatro son sustantivos?",
 "embeddings.4": "¿Por qué están cerca <em>king</em> y <em>queen</em>?",
 "embeddings.5": "Nadie le dijo al modelo que están relacionados. Durante el <strong>entrenamiento</strong> (siguiente lección) leyó\n    miles de millones de frases y fue ajustando estas posiciones para poder adivinar mejor la siguiente palabra.\n    <em>King</em> y <em>queen</em> aparecen en frases casi intercambiables —\n    «the ___ wore a crown», «the ___ ruled the kingdom», «long live the ___» — así que las posiciones que\n    mejor predicen esos contextos compartidos acaban siendo casi idénticas. <em>Car</em> y <em>bus</em> comparten un\n    conjunto diferente de contextos («parked the ___», «drove the ___»), así que forman su propio grupo muy lejos.\n    La cercanía en este espacio significa literalmente <em>«usado en frases similares».</em> Por eso también la\n    geometría tiene significado: la dirección de <em>man</em> a <em>king</em> es aproximadamente la misma\n    dirección que de <em>woman</em> a <em>queen</em> — la realeza, aprendida solo del uso.",
 "embeddings.6": "Cómo se almacenan realmente los embeddings",
 "embeddings.7": "La nube 3D es una imagen aplanada, no el almacenamiento en sí. Cada embedding empieza como una lista aleatoria de\n    números y es un peso como cualquier otro: cada vez que su token aparece en el entrenamiento, el descenso de gradiente\n    (siguiente lección) retoca un poco esa lista, y los tokens usados en frases similares reciben retoques\n    similares, así que los grupos de arriba se organizan solos. Lo que realmente se almacena es una tabla: una fila\n    de números por token, buscada por el ID del token. En el pequeño Llama que se usa más adelante en este laboratorio esa tabla\n    contiene unos 128,000 tokens, cada uno una lista de 2,048 números — miles de dimensiones, no tres.\n    La nube aplasta esas listas hasta dejarlas en 3 ejes para que puedas mirarlas; la cercanía es real\n    (medida por el ángulo entre las listas completas), las posiciones 3D son solo una aproximación.\n    Un detalle más: la fila almacenada para <em>bank</em> es la misma en todas las frases — las capas\n    de la Lección 6 la reescriben usando el contexto, así que «river bank» y «money bank» acaban siendo diferentes dentro\n    del modelo aunque partieran de la misma fila.",
 "embeddings.8": "<span class=\"lvl-add-tag\">Medio</span>Esa lista de números tiene un nombre: un <strong>embedding</strong> — un vector aprendido durante el entrenamiento, no diseñado por nadie. Como las palabras usadas en frases similares obtienen vectores similares, el significado aparece como distancia en la nube de arriba: cerca significa «usado de forma parecida», lejos significa «usado de forma diferente».",
 "embeddings.9": "<span class=\"lvl-add-tag\">Experto</span>Formalmente, cada ID de token indexa una fila de la matriz de embeddings E ∈ ℝ<sup>V×d</sup>, donde d se cuenta por miles en un modelo real; la nube de arriba proyecta una versión de juguete a 3D. La proximidad del coseno codifica la similitud distribucional, y las direcciones pueden transportar estructura relacional: el ejemplo clásico es king − man + woman ≈ queen.",
 "intro.0": "✦ Introducción — empieza aquí",
 "intro.1": "Bienvenido al taller. Este curso desmonta un pequeño modelo de lenguaje — uno real,\n    que se ejecuta en este ordenador — pieza a pieza, para que cuando un modelo grande\n    haga algo que parezca magia, sepas qué pieza lo hizo. No necesitas un título en matemáticas:\n    cada idea viene con algo que puedes pulsar, arrastrar, escribir o romper.",
 "intro.10": "<strong>Fundamentos</strong> · Lecciones 1–5<br>Cómo lee el modelo, en qué se convierten las palabras, cómo aprendió, a qué presta atención y cómo elige qué decir a continuación.",
 "intro.11": "<strong>Dentro de la máquina</strong> · Lecciones 6–8<br>El viaje de un token a través de las capas, cómo se analiza tu pregunta sin un analizador, y un modelo diminuto real entrenándose ante tus ojos.",
 "intro.12": "<strong>Comprobación de realidad</strong> · Lecciones 9–12<br>Por qué olvida, cómo se equivoca con total confianza, el modelo real en vivo con sus datos de depuración, y qué lo separa de los modelos premium.",
 "intro.13": "<strong>Más allá de lo básico</strong> · Lecciones 13–15<br>Cómo un predictor se convierte en asistente, cómo los sistemas reales buscan respuestas, y un proyecto final que desmonta por completo una respuesta en vivo.",
 "intro.14": "<a href=\"#tokens\" class=\"begin-btn\">Empezar la Lección 1 — Tokens →</a>",
 "intro.2": "Cómo usar esta guía",
 "intro.3": "<strong>Una lección cada vez.</strong> Elige desde el menú de la izquierda; el botón «Siguiente lección» al final de cada lección es el camino principal.",
 "intro.4": "<strong>Elige tu nivel de profundidad.</strong> Empieza en Principiante. Cuando un tema te atrape, cambia a Medio o Experto en los Ajustes de la barra lateral para ver más detalle: puedes volver atrás en cualquier momento.",
 "intro.5": "<strong>Predice antes de ejecutar.</strong> Adivinar qué va a pasar y luego observarlo es la forma más rápida de desarrollar la intuición. Varias lecciones (y el proyecto final) giran en torno a esto.",
 "intro.6": "<strong>Las pruebas y el progreso</strong> están en la barra lateral: dos preguntas por lección en el cajón de Prueba, y «Marcar como completada» al final de cada lección registra dónde estás.",
 "intro.7": "Qué necesitas",
 "intro.8": "Ollama",
 "intro.9": "El mapa del curso",
 "sidebar.0": "Lecciones",
 "sidebar.1": "✦ Introducción",
 "sidebar.10": "7 · Analizar una pregunta",
 "sidebar.11": "8 · Modelo de juguete 3D",
 "sidebar.12": "Comprobación de realidad",
 "sidebar.13": "9 · Contexto",
 "sidebar.14": "10 · Límites",
 "sidebar.15": "11 · Modelo en vivo",
 "sidebar.16": "12 · Pequeño frente a premium",
 "sidebar.17": "Más allá de lo básico",
 "sidebar.18": "13 · De predictor a asistente",
 "sidebar.19": "14 · Recuperación (RAG)",
 "sidebar.2": "Fundamentos",
 "sidebar.20": "15 · Proyecto final",
 "sidebar.21": "Ajustes",
 "sidebar.22": "Nivel",
 "sidebar.23": "Principiante",
 "sidebar.24": "Medio",
 "sidebar.25": "Experto",
 "sidebar.26": "Sonido: desactivado",
 "sidebar.27": "Ámbar",
 "sidebar.28": "Hielo",
 "sidebar.29": "Esmeralda",
 "sidebar.3": "1 · Tokens",
 "sidebar.30": "Rosa",
 "sidebar.31": "Idioma",
 "sidebar.32": "Inglés",
 "sidebar.33": "Español",
 "sidebar.34": "Francés",
 "sidebar.4": "2 · Embeddings",
 "sidebar.5": "3 · Entrenamiento",
 "sidebar.6": "4 · Atención",
 "sidebar.7": "5 · Siguiente token",
 "sidebar.8": "Dentro de la máquina",
 "sidebar.9": "6 · Dentro del modelo",
 "tokens.0": "1 · Tokens — cómo lee el modelo",
 "tokens.1": "Una idea sostiene todo el curso: <strong>un modelo de lenguaje es una máquina de predicción,\n    no una base de datos.</strong> No busca respuestas; adivina qué viene a continuación, una\n    pequeña pieza cada vez, de forma asombrosamente buena. Todo lo demás — la inteligencia, los\n    errores, los datos inventados con total confianza de la lección 10 — se deriva de eso. Y todo\n    empieza por cómo lee el modelo, porque no lee como tú.",
 "tokens.10": "Comparar con un tokenizador real",
 "tokens.11": "Esto carga un tokenizador BPE real (familia GPT-2) en tu navegador y tokeniza el texto\n    de arriba con él. Llama usa el mismo tipo de algoritmo con un vocabulario diferente y más grande,\n    así que las divisiones exactas difieren.",
 "tokens.12": "Tokenizar con el tokenizador real",
 "tokens.13": "<span class=\"lvl-add-tag\">Medio</span>Esos fragmentos proceden de un vocabulario fijo, producido por un <strong>tokenizador</strong> antes de que el propio modelo vea nada. Los espacios y la puntuación también cuentan como partes de los tokens: prueba a añadir puntuación, una mayúscula o un espacio extra en el texto de arriba y observa cómo cambia el recuento.",
 "tokens.14": "<span class=\"lvl-add-tag\">Experto</span>Más precisamente, la regla de división se aprende, no se escribe a mano: un tokenizador de subpalabras (fusiones de tipo BPE sobre bytes) segmenta el texto en IDs de ese vocabulario fijo. Por eso el recuento de tokens — no el de caracteres — determina el coste y el uso del contexto, y por eso los modelos pueden ser ciegos a las letras individuales dentro de un token. La comparación con el tokenizador real de arriba muestra la versión aprendida.",
 "tokens.2": "Un modelo nunca ve palabras. Ve <strong>tokens</strong>: pequeños fragmentos de texto. Escribe abajo y observa cómo tu frase se divide en fragmentos. Las palabras comunes se quedan enteras; las largas o raras se dividen en piezas.",
 "tokens.3": "Prueba con una sorpresa:",
 "tokens.4": "Palabras muy largas",
 "tokens.5": "Números &amp; dinero",
 "tokens.6": "Emoji",
 "tokens.7": "MAYÚSCULAS &amp; contracciones",
 "tokens.8": "Pasa el cursor sobre una pieza de color: la misma pieza se ilumina en la línea superior, para que veas exactamente qué caracteres cubre cada token.",
 "tokens.9": "Este divisor es una aproximación con fines didácticos. El tokenizador real se aprende\n    a partir de datos, pero la intuición — los fragmentos comunes se quedan enteros, los raros se dividen — es la misma.",
 "attention.0": "4 · Atención — decidir qué importa",
 "attention.1": "Las palabras pueden ser ambiguas — en «The cat sat on the mat because it was tired», ¿qué significa <em>it</em>? La <strong>atención</strong> permite a cada palabra mirar hacia atrás, a las palabras anteriores, y decidir cuáles importan. Haz clic en una palabra para ver adónde mira, y prueba las diferentes cabezas.",
 "attention.2": "Cabeza A — ¿a quién se refiere «it»?",
 "attention.3": "Cabeza B — qué ocurrió (verbos)",
 "attention.4": "Cabeza C — la palabra anterior",
 "attention.5": "Datos de enseñanza esquemáticos, simplificados a partir de cómo se comportan las cabezas reales.\n    Un modelo real tiene docenas de capas, cada una con muchas cabezas, todas votando a la vez —\n    y los tokens solo pueden mirar hacia atrás, nunca hacia adelante.",
 "attention.6": "<span class=\"lvl-add-tag\">Medio</span>Mirar hacia atrás es solo la mitad: cada token mezcla la información de los tokens que ponderó en su propia representación, así que su significado es reescrito por su contexto. Las <strong>cabezas</strong> funcionan en paralelo y se especializan — una sigue la referencia (qué significa «it»), otra sigue los verbos, otra sigue la palabra anterior. Cambia de cabeza arriba y compara qué cambia.",
 "attention.7": "<span class=\"lvl-add-tag\">Experto</span>El mecanismo es la atención por producto escalar escalado: <span class=\"mono\">softmax(QK<sup>T</sup>/√d)V</span>, calculada bajo una máscara causal para que cada posición solo atienda hacia atrás. Cada cabeza proyecta Q, K y V de forma diferente por capa, por eso las cabezas se especializan (inducción, correferencia, sintaxis). Los pesos de la demostración anterior son esquemáticos; la operación de mezcla es la real.",
 "journey.0": "6 · Dentro del modelo — el viaje de un token",
 "journey.1": "Dentro del modelo, tus palabras viajan a través de una pila de capas, como pisos en un edificio. En cada piso, cada palabra escucha a las demás y luego piensa en lo que ahora sabe. Elige una palabra y pulsa reproducir para acompañarla mientras cambia, piso a piso, hasta convertirse en una respuesta.",
 "journey.10": "<span class=\"lvl-add-tag\">Medio</span>No hay un único camino a través de un transformer: <strong>cada token pasa por cada capa</strong>. Cada capa ejecuta <strong>atención</strong> (mezcla entre tokens) y luego un <strong>MLP</strong> (procesamiento dentro de un token) — dos trabajos diferentes, uno reescribe lo que un token sabe de sus vecinos, el otro lo que sabe de sí mismo. Ese par es lo que reescribe la <strong>representación</strong> del token a medida que asciende.",
 "journey.11": "<span class=\"lvl-add-tag\">Experto</span>Un pase hacia adelante es un flujo residual: x<sub>l+1</sub> = x<sub>l</sub> + Attn(x<sub>l</sub>) + MLP(x<sub>l</sub> + Attn), por capa, con todas las posiciones procesadas en paralelo. Las capas tempranas codifican sobre todo posición y sintaxis, las capas medias resuelven la referencia, y las capas tardías alinean el flujo con la desincrustación para que los logits finales favorezcan la respuesta. Las barras anteriores muestran 16 de los miles de números de ese flujo.",
 "journey.2": "Reproducir a través de las capas",
 "journey.3": "Volver al inicio",
 "journey.4": "Pila de capas",
 "journey.5": "Su representación (16 de miles de números)",
 "journey.6": "Atención en esta capa",
 "journey.7": "Si tuviera que predecir ahora",
 "journey.8": "Cómo se afina la predicción, capa a capa",
 "journey.9": "Modelo de enseñanza esquemático — el modelo real apila capas como este boceto,\n    pero la API de Ollama no expone sus números internos reales, así que estos valores son ilustrativos,\n    con forma de comportamiento real: las capas tempranas manejan la posición y los vecinos, las capas medias resuelven\n    referencias como «it», las capas tardías se comprometen con una respuesta. Para ver el interior real de un modelo, consulta\n    la lección 8 — un modelo diminuto que realmente se entrena en esta página.",
 "probabilities.0": "5 · Siguiente token — un lanzamiento de moneda ponderado",
 "probabilities.1": "El modelo no elige directamente la siguiente palabra. Da a cada palabra posible una puntuación, convierte las puntuaciones en probabilidades y lanza un dado ponderado. Pulsa <strong>Paso</strong> para elegir una palabra cada vez. El control de temperatura hace el dado más justo (salvaje) o más cargado (seguro).",
 "probabilities.2": "La capital de Francia es",
 "probabilities.3": "Paso — elegir el siguiente token",
 "probabilities.4": "Reiniciar",
 "probabilities.5": "Las probabilidades de las candidatas son datos de enseñanza con una forma realista;\n    las matemáticas de temperatura aplicadas a ellas son las matemáticas reales.",
 "probabilities.6": "<span class=\"lvl-add-tag\">Medio</span>Esas puntuaciones tienen un nombre: <strong>logits</strong> — uno por token, producidos por la capa final. Una función llamada <strong>softmax</strong> los convierte en probabilidades que suman 1, y elegir una palabra es <strong>muestrear</strong> de esa distribución. La temperatura reescala los logits antes de softmax: por debajo de 1 agudiza las probabilidades, por encima de 1 las aplana. Mueve el control de arriba, luego pulsa Paso, y observa cómo ocurren ambas cosas.",
 "probabilities.7": "<span class=\"lvl-add-tag\">Experto</span>Formalmente, <span class=\"mono\">p = softmax(z/T)</span> sobre todo el vocabulario — unos 128k tokens en el Llama local; las barras anteriores muestran un subconjunto de enseñanza. Tras el muestreo, el token elegido se añade a la entrada y todo el pase hacia adelante se repite: ese bucle es lo que significa <em>autorregresivo</em>. T→0 se acerca a argmax (decodificación voraz), T&gt;1 aumenta la entropía. Las probabilidades candidatas aquí son didácticas; la transformación de temperatura aplicada a ellas es exacta.",
 "training.0": "3 · Entrenamiento — cómo aprendió todo esto",
 "training.1": "Antes de que el modelo pudiera responder a nada, practicó — y mucho. Leyó texto, adivinó la siguiente palabra, comprobó y corrigió sus errores en una cantidad diminuta. Tras miles de millones de intentos, las palabras usadas de formas parecidas acabaron como vecinas. Pulsa <strong>Entrenar</strong> y observa cómo ocho palabras se organizan mientras baja la puntuación de error.",
 "training.10": "Imagina cada posible configuración del modelo como un lugar en un paisaje con colinas, donde la altura es lo equivocado que está. Este paisaje tiene <strong>tres depresiones</strong>: dos poco profundas y una más profunda. Entrenar es caminar cuesta abajo — pero la bola solo puede sentir la pendiente bajo sus pies, esa pendiente es el <strong>gradiente</strong>, y no tiene mapa. En qué depresión termina depende de dónde empieza. Cada paso baja una cantidad fijada por la <strong>tasa de aprendizaje</strong>: demasiado pequeña, avanza a rastras; demasiado grande, salta por encima de la depresión y sube por el otro lado. Prueba los tres botones de inicio y observa cómo las mismas reglas acaban en depresiones diferentes.",
 "training.11": "Arrastra para girar · arrastra con el botón derecho (o Mayús+arrastrar) para moverte · desplázate para hacer zoom · haz doble clic para restablecer la vista",
 "training.12": "Dar un paso",
 "training.13": "Descenso automático",
 "training.14": "Reiniciar la bola",
 "training.15": "Inicia la bola:",
 "training.16": "Pendiente oeste",
 "training.17": "Cresta norte",
 "training.18": "Pendiente sur",
 "training.19": "<span class=\"lvl-add-tag\">Medio</span>El bucle anterior tiene nombres: predecir el siguiente token, medir el error (<strong>pérdida</strong>) y luego ajustar cada peso ligeramente cuesta abajo — <strong>descenso de gradiente</strong>, escrito <span class=\"mono\">w ← w − η·∇L</span>. Los embeddings se organizan porque las palabras en contextos similares reciben ajustes similares. En cuanto al paisaje: cada depresión es un <strong>mínimo local</strong> — cuesta abajo en todas las direcciones, pero solo la más profunda (depresión este, pérdida ≈ 0.83) es el <strong>mínimo global</strong>. La bola no puede saber cuál encontró; gradiente ≈ 0 se siente idéntico en las tres. Prueba η = 0.1 (avanza a rastras), 0.35 (se asienta) y luego 0.8 (demasiado grande para estas depresiones — traquetea o se escapa).",
 "training.2": "Entrenar",
 "training.20": "<span class=\"lvl-add-tag\">Experto</span>El preentrenamiento minimiza la entropía cruzada del siguiente token sobre billones de tokens mediante descenso de gradiente estocástico, con el error llevado hacia atrás a través de cada capa (retropropagación). Los juguetes anteriores usan la misma actualización, <span class=\"mono\">w ← w − η·∂L/∂w</span> — y el punto de partida elige el resultado, porque esta superficie no es convexa: la cuenca de atracción en la que empiezas decide a qué mínimo convergirás. El entrenamiento real combate esto con reinicios aleatorios de algún modo — orden de datos mezclado, ruido en cada gradiente estocástico, momento — para que el optimizador pueda salir traqueteando de cuencas poco profundas y estrechas y prefiera las anchas y planas, que generalizan mejor.",
 "training.21": "<span class=\"lvl-add-tag\">Experto · el paisaje, matemáticamente</span>La superficie anterior es <span class=\"mono\">L(x,y) = 0.22(x²+y²) + 3 − Σᵢ dᵢ·exp(−((x−aᵢ)²+(y−bᵢ)²)/(2σᵢ²))</span>: un cuenco suave menos tres pozos gaussianos en (−1.9, 1.3), (0.2, −1.7) y (2.0, 0.9). Su gradiente es exacto, no medido: <span class=\"mono\">∂L/∂x = 0.44x + Σᵢ dᵢ·exp(·)·(x−aᵢ)/σᵢ²</span> (y lo mismo para y) — cada pozo atrae la bola hacia su centro con una fuerza proporcional a la distancia, que se desvanece con la gaussiana. Hacer ∇L = 0 da los puntos estacionarios; resolviendo numéricamente, los mínimos son (−1.68, 1.15) con L = 1.43, (0.19, −1.51) con L = 1.36, y el mínimo global (1.76, 0.79) con L = 0.83. Entre cada par de cuencas se sitúa una <strong>cresta de silla</strong>: crúzala y un mínimo diferente te posee. La curvatura decide el tamaño del paso: en los mínimos, el mayor valor propio de la hessiana λ<sub>max</sub> ≈ 3.5–4.2, y el descenso de gradiente simple solo es estable para <span class=\"mono\">η &lt; 2/λ<sub>max</sub> ≈ 0.5</span> — por eso η = 0.45 se asienta (por los pelos, con una oscilación) y η = 0.8 no puede quedarse quieto en ninguna depresión. Cerca de un mínimo, la pérdida es localmente cuadrática, L ≈ L* + ½(w−w*)ᵀH(w−w*), así que la convergencia es geométrica: el error se reduce aproximadamente en |1 − ηλ| por paso a lo largo de cada dirección propia. Una salvedad honesta: en el caso real, con miles de millones de dimensiones, los verdaderos mínimos locales importan menos de lo que sugiere esta imagen — los puntos de silla y los valles conectados de baja pérdida dominan la geometría en altas dimensiones, y los gradientes estocásticos rara vez se quedan quietos el tiempo suficiente para quedar atrapados. La lección en 2D que sobrevive intacta es el límite de estabilidad y la idea de cuenca, no el miedo a las depresiones.",
 "training.3": "Reiniciar",
 "training.4": "Pérdida de entrenamiento — cuanto menor, mejor",
 "training.5": "El bucle, como matemáticas — <strong>descenso de gradiente</strong>:<br>\n      1 · Adivinar: el modelo produce probabilidades <span class=\"mono\">p</span> para el siguiente token.<br>\n      2 · Medir: <span class=\"mono\">loss = −log p(correct token)</span> — enorme cuando se equivocó con confianza, cerca de cero cuando acertó.<br>\n      3 · Culpar: cada peso recibe un gradiente <span class=\"mono\">∂loss/∂w</span> — su parte personal de culpa (la regla de la cadena lleva el error hacia atrás, capa a capa: «retropropagación»).<br>\n      4 · Ajustar: <span class=\"mono\">w ← w − η · ∂loss/∂w</span>, con una tasa de aprendizaje <span class=\"mono\">η</span> pequeña (el modelo de juguete de la lección 8 usa η = 0.4) para que mejore en lugar de saltar más allá de la respuesta.<br>\n      Repite eso miles de millones de veces y la pérdida baja lentamente — como caminar cuesta abajo en la niebla, siempre dando el paso en la pendiente descendente más pronunciada que puedas sentir bajo los pies.",
 "training.6": "Modelo de juguete, principio real. El sistema real se entrena con billones de tokens durante semanas\n    en miles de procesadores, y las «palabras» son tokens en un espacio con miles de dimensiones —\n    pero el bucle es el mismo: adivinar, medir el error, ajustar, repetir. Algo crucial: el entrenamiento termina\n    antes de que escribas un prompt; chatear con el modelo (<strong>inferencia</strong>) no cambia nada\n    dentro de él. No está aprendiendo de ti.",
 "training.7": "Usar un modelo no lo reentrena",
 "training.8": "El descenso de gradiente necesita una respuesta correcta conocida con la que medir la pérdida, y eso solo\n    existe en los datos de entrenamiento. Mientras chateas con un modelo terminado — <strong>inferencia</strong> —\n    los pesos están congelados: no hay pérdida, ni gradiente, ni pase hacia atrás ni ajustes. El modelo\n    solo funciona hacia adelante — lee el prompt, predice el siguiente token, lo añade, repite (lección 5). Si una\n    conversación parece enseñarle algo, eso es la ventana de contexto en acción (lección 9): las palabras\n    permanecen en su memoria a corto plazo y dan forma a la siguiente predicción, pero ningún peso cambia, y todo se\n    olvida cuando termina el contexto. Enseñar algo a un modelo de forma permanente siempre significa otro\n    entrenamiento, realizado sin conexión por sus creadores — nunca el propio chat.",
 "training.9": "El paisaje de la pérdida — descenso de gradiente en 3D",
 "context.0": "9 · Contexto: por qué olvida",
 "context.1": "El modelo solo puede recordar una cantidad limitada de tu conversación. Cuando se ha dicho demasiado, las palabras más antiguas se caen y se olvidan: el modelo nunca lo nota, porque para él ya no existen. Añade frases y observa cómo desaparece el principio.",
 "context.2": "Llenado de la ventana de contexto",
 "context.3": "Añadir frase",
 "context.4": "Reiniciar la conversación",
 "context.5": "Las ventanas reales son mucho más grandes (este modelo pequeño anuncia hasta 128k tokens), pero la regla es idéntica a cualquier tamaño. Por eso también las conversaciones largas «se desvían»: la instrucción que diste al principio puede haber salido literalmente de la ventana.",
 "context.6": "<span class=\"lvl-add-tag\">Medio</span>Esa cantidad limitada tiene un nombre: la <strong>ventana de contexto</strong>, un número fijo de tokens recientes. Tus prompts y las respuestas del modelo viven juntos en ella; superado el límite, los tokens más antiguos se caen por el principio, exactamente como en la demostración de arriba.",
 "context.7": "<span class=\"lvl-add-tag\">Experto</span>La inferencia no tiene estado: todo el estado es la secuencia de tokens dentro de esa ventana fija (el modelo local anuncia 128k tokens; la ventana de juguete de arriba contiene 18). Los tokens que superan el límite no se comprimen ni se resumen: están ausentes en la siguiente pasada hacia adelante, y por eso las sesiones largas pierden silenciosamente las instrucciones iniciales.",
 "limits.0": "10 · Límites: seguro, plausible, equivocado",
 "limits.1": "El modelo intenta decir cosas que <em>suenan</em> bien, lo que no es lo mismo que <em>ser</em> correctas. Cuando no sabe, a menudo se inventa cosas, con seguridad. Cada botón siguiente carga una pregunta trampa en el modelo en vivo; adivina qué pasará antes de ejecutarla.",
 "limits.10": "Aún no ejecutada",
 "limits.11": "Cita falsa",
 "limits.12": "Cae en la trampa",
 "limits.13": "Lo acierta",
 "limits.14": "Aún no ejecutada",
 "limits.15": "Matemáticas con prisa",
 "limits.16": "Cae en la trampa",
 "limits.17": "Lo acierta",
 "limits.18": "Aún no ejecutada",
 "limits.19": "Restablecer el marcador",
 "limits.2": "La trampa de contar letras",
 "limits.20": "Por qué falla: contar necesita letras, pero el modelo ve tokens (lección 1); las citas son fáciles de imitar incluso cuando no existen; y la respuesta matemática que «suena bien» (10 céntimos) gana a la correcta (5 céntimos) a menos que el modelo se tome su tiempo. Los modelos más grandes caen menos en estas trampas: ninguno es inmune.",
 "limits.21": "<span class=\"lvl-add-tag\">Medio</span>La razón está en el entrenamiento: optimiza texto plausible, no verdad verificada. Sin una base de datos de hechos ni autocomprobación, los huecos se rellenan con fluidez: ese modo de fallo se llama <strong>alucinación</strong>. Los modelos pequeños lo hacen constantemente; estate atento cuando las trampas se ejecuten en la lección 11.",
 "limits.22": "<span class=\"lvl-add-tag\">Experto</span>El objetivo es la verosimilitud, no la verdad: nada en el entrenamiento del siguiente token fundamenta una afirmación, y la decodificación continuará encantada una premisa falsa con un estilo perfecto. Espera citas inventadas, fallos de conteo provocados por la tokenización y respuestas equivocadas de alta probabilidad (el señuelo de 10¢ del bate y la pelota). Los modelos más grandes reducen los tres: no eliminan ninguno.",
 "limits.3": "La trampa de la cita falsa",
 "limits.4": "La trampa de las matemáticas con prisa",
 "limits.5": "Marcador de trampas: pronostica antes de ejecutarla",
 "limits.6": "Para cada trampa: haz tu predicción y luego ejecuta la trampa en la lección 11. Cuando la respuesta termine, el resultado se evaluará automáticamente aquí (una heurística: comprueba también la respuesta tú mismo).",
 "limits.7": "Conteo de letras",
 "limits.8": "Cae en la trampa",
 "limits.9": "Lo acierta",
 "parsing.0": "7 · Análisis sintáctico — cómo se lee tu pregunta",
 "parsing.1": "Cuando escribes una pregunta, el modelo tiene que averiguar qué le estás preguntando antes de poder responder, pero nadie le dio un libro de gramática. No hay dentro ningún diccionario de sustantivos y verbos, ni ningún código que dibuje diagramas de oraciones. La comprensión lectora que has visto construirse — los tokens (lección 1), los enlaces de atención (lección 4), las capas que se especializan (lección 6) — <em>es</em> el analizador sintáctico. La comprensión se ensambla sola, capa a capa. Recorre las tres etapas siguientes y observa cómo se desmonta una pregunta.",
 "parsing.10": "2 · Enlaces",
 "parsing.11": "3 · Qué está preguntando",
 "parsing.12": "Anotaciones didácticas esquemáticas: los colores y los enlaces muestran el tipo de estructura que la atención tiene que construir, no una lectura del interior real del modelo (no expone nada de eso). Las preguntas predefinidas están anotadas a mano; tu propio texto recibe reglas sencillas por palabra.",
 "parsing.13": "<span class=\"lvl-add-tag\">Medio</span>Tres cosas suceden en secuencia. Las capas tempranas fijan la estructura superficial: el orden de las palabras, qué palabras se agrupan. Las capas intermedias conectan los punteros: una palabra interrogativa como <em>cuántas</em> debe encontrar lo que se está contando, y un <em>no</em> debe encontrar el verbo que cancela (la segunda predefinida es una trampa de exactamente este tipo). Las capas tardías conservan el resultado como una interpretación de trabajo a partir de la cual se genera la respuesta. Los tokens de plantilla invisibles que rodean tu pregunta (la tira de depuración de la lección 11) también se analizan: el modelo distingue «el humano está preguntando» de «texto que continuar».",
 "parsing.14": "<span class=\"lvl-add-tag\">Experto</span>Lo que los lingüistas llaman análisis sintáctico — constituyentes, estructura de dependencias, roles semánticos — aparece en las sondas del flujo residual: la profundidad del árbol sintáctico y las relaciones de dependencia se pueden decodificar linealmente a partir de las representaciones de las capas intermedias, y cabezas de atención individuales siguen relaciones como sujeto→verbo y pronombre→antecedente. Nada de ello es simbólico: no hay ninguna estructura de datos en forma de árbol, solo vectores que se comportan <em>como si</em> se hubiera calculado un árbol, lo bastante bien como para que disminuya la pérdida del siguiente token. La ambigüedad es, por tanto, una apuesta, no una búsqueda: con dos análisis válidos, la masa de probabilidad sigue la distribución del entrenamiento, y el perdedor simplemente nunca se representa. Por eso una pregunta mal interpretada recibe una respuesta fluida, segura y equivocada: la generación es fiel al análisis, y el error estaba en el análisis.",
 "parsing.2": "¿Cuántas letras r hay en la palabra strawberry? Responde solo con el número.",
 "parsing.3": "¿Por qué no se cae la Luna?",
 "parsing.4": "Escribe un haiku sobre las hojas de otoño, pero no uses la palabra caída.",
 "parsing.5": "El tiempo vuela como una flecha.",
 "parsing.6": "A las moscas de la fruta les gusta una banana.",
 "parsing.7": "Analiza la mía",
 "parsing.8": "Las preguntas personalizadas reciben un análisis sintáctico esquemático aproximado: las predefinidas están anotadas a mano.",
 "parsing.9": "1 · Funciones de las palabras",
 "toymodel.0": "8 · Un modelo de juguete real: míralo pensar en 3D",
 "toymodel.1": "Esta lección es un modelo diminuto <strong>real</strong>, no un dibujo. Aprende de unas pocas frases cortas, aquí mismo en tu navegador. Entrénalo, dale luego una palabra y observa cómo la ruta brillante muestra cómo elige la siguiente palabra.",
 "toymodel.10": "Cómo leerlo: cada nodo oculto calcula <span class=\"mono\">h = tanh(Σ w·x + b)</span>, cada palabra de salida obtiene una puntuación <span class=\"mono\">z = Σ h·W + b</span>, y softmax convierte las puntuaciones en probabilidades que suman 100 %: <span class=\"mono\">p = e<sup>z</sup> / Σ e<sup>z</sup></span>. Durante el entrenamiento, el error para la palabra correcta es <span class=\"mono\">loss = −log p(correct)</span>, y el <strong>descenso de gradiente</strong> ajusta cada peso en contra de su gradiente: <span class=\"mono\">w ← w − η · ∂loss/∂w</span>, donde el gradiente de salida tiene la forma maravillosamente simple <span class=\"mono\">p − 1</span> para la palabra correcta y <span class=\"mono\">p</span> para cada palabra equivocada: empuja hacia abajo lo que creyó erróneamente, empuja hacia arriba lo que pasó por alto, una fracción η cada vez.",
 "toymodel.11": "Entrénalo con tus propias frases",
 "toymodel.12": "Sustituye todo su mundo: escribe unas pocas frases cortas y repetitivas (una por línea, de al menos dos palabras cada una). El modelo reconstruye su vocabulario a partir de tus palabras y se reentrena desde cero. Los patrones que repitas serán los patrones que aprenderá.",
 "toymodel.13": "Usar mis frases (recarga la página)",
 "toymodel.14": "Volver a las frases integradas",
 "toymodel.15": "Prueba esto: antes de entrenar, elige «cat»: la predicción es casi aleatoria.",
 "toymodel.16": "<span class=\"lvl-add-tag\">Medio</span>Por dentro, cada palabra entra como números, pasa por dos capas ocultas de 16 y 12 nodos, y sale como probabilidades para la siguiente palabra. El tamaño y el brillo de los nodos en la vista 3D de arriba son activaciones reales, y las líneas ámbar trazan las conexiones más fuertes detrás de la predicción: nada está preparado.",
 "toymodel.17": "<span class=\"lvl-add-tag\">Experto</span>La red, exactamente: entrada one-hot → 16 unidades tanh → 12 unidades tanh → softmax sobre un vocabulario de 12 palabras, entrenada con SGD en pares de palabra siguiente. A diferencia del Llama de la lección 11, cada peso y cada activación vive en esta página, así que la ruta ámbar puede mostrar las mayores contribuciones |h·W| al logit ganador. Es un MLP, no un transformer — sin atención —, y eso es lo que hace posible la inspección total.",
 "toymodel.2": "Entrenar el modelo de juguete",
 "toymodel.3": "Restablecer los pesos",
 "toymodel.4": "Arrastra para orbitar · desplázate para hacer zoom",
 "toymodel.5": "La vista 3D necesita una conexión a internet para cargar su biblioteca la primera vez.",
 "toymodel.6": "Qué predice a continuación (probabilidades de salida reales)",
 "toymodel.7": "Ruta más fuerte: entrena primero el modelo.",
 "toymodel.8": "Las matemáticas, con los números reales de este modelo",
 "toymodel.9": "Entrena o elige una palabra para ver sus números.",
 "playground.0": "11 · Modelo en vivo — todo a la vez",
 "playground.1": "Ahora, lo auténtico: un pequeño modelo de IA ejecutándose en tu propio ordenador. Escribe algo, pulsa Generar y míralo escribir — una pequeña pieza cada vez, siempre adivinando qué viene a continuación. Nada de lo que escribas sale de esta máquina.",
 "playground.10": "Cada pieza brillante de la respuesta anterior es un token que eligió el modelo. Haz clic en uno: las torres muestran las otras palabras entre las que estaba eligiendo y lo seguro que estaba. Torre alta = «casi seguro que es esta». Varias torres parecidas = «una elección de verdad». Se reproduce en vivo mientras el modelo escribe.",
 "playground.11": "Torres de candidatos — arrastra para orbitar · desplázate para hacer zoom · haz clic en un token de la respuesta para inspeccionarlo",
 "playground.12": "Genera algo y luego haz clic en un token de la respuesta.",
 "playground.13": "<span class=\"lvl-add-tag\">Experto · depuración</span>Dentro de la solicitud — datos del servidor del modelo",
 "playground.14": "A continuación se muestran los datos que el servidor del modelo de tu ordenador informa sobre la última ejecución: a qué velocidad pensó y los ID de token numerados exactos que procesó, incluidos los tokens de instrucción ocultos que envolvían tu prompt y que nunca escribiste.",
 "playground.15": "Todavía no hay ninguna generación en esta sesión.",
 "playground.16": "Haz clic en un token de la respuesta para ver aquí sus números de depuración de nivel Experto.",
 "playground.17": "No se puede contactar con el modelo local",
 "playground.18": "Instala Ollama desde <span class=\"mono\">ollama.com/download</span>",
 "playground.19": "Ejecuta: <span class=\"mono\">ollama pull llama3.2:1b</span>",
 "playground.2": "Generar",
 "playground.20": "Ejecuta: <span class=\"mono\">ollama serve</span> (o simplemente inicia la aplicación de Ollama)",
 "playground.21": "Pulsa <strong>Volver a comprobar</strong> arriba.",
 "playground.22": "<span class=\"lvl-add-tag\">Medio</span>El modelo que hay detrás del botón es un Llama real y pequeño que se ejecuta localmente mediante Ollama. Genera de forma <strong>autorregresiva</strong> — un token cada vez, muestreando cada token siguiente a partir de su distribución de probabilidad a la temperatura que hayas elegido, y luego volviendo a introducir ese token. Las torres anteriores son los 5 principales candidatos reales con sus probabilidades (de los logprobs de Ollama) para el token en el que hiciste clic: la misma competición softmax de la lección 5, ahora con números reales. La altura de las torres usa una escala de raíz cuadrada para que las probabilidades pequeñas sigan siendo visibles.",
 "playground.23": "<span class=\"lvl-add-tag\">Experto</span>Inferencia en vivo contra llama3.2:1b en localhost:11434, transmitida token a token desde <span class=\"mono\">/api/generate</span> con <span class=\"mono\">logprobs + top_logprobs=5</span>. Cada fragmento es un token muestreado desde softmax(z/T) a tu T; el contexto completo se reprocesa por token (con caché KV en el servidor). Las probabilidades son <span class=\"mono\">exp(logprob)</span>, «todos los demás» es la masa restante sobre el vocabulario de ~128k, y la altura de la torre es proporcional a √p, para que las probabilidades pequeñas sigan siendo visibles. Una nota de honestidad sobre la vista del viaje: Ollama no expone los elementos internos por capa, así que el paso por las capas es una reproducción esquemática sincronizada con tus tokens, pero la tokenización, el recuento de 16 capas (real, mediante <span class=\"mono\">/api/show</span>), la salida transmitida y las probabilidades de los candidatos son reales. El desglose completo de depuración está en el panel de depuración Experto anterior.",
 "playground.3": "Detener",
 "playground.4": "Temperatura baja = elecciones seguras y repetitivas. Temperatura alta = elecciones más alocadas y arriesgadas.",
 "playground.5": "Míralo viajar — tus tokens a través del modelo",
 "playground.6": "Viaje del token — arrastra para orbitar · desplázate para hacer zoom · izquierda: tus tokens ascendiendo a través de 16 capas · derecha: candidatos reales al siguiente token para la primera predicción",
 "playground.7": "En espera — pulsa Generar y tus tokens ascenderán a través de las capas.",
 "playground.8": "Flujo de tokens — una ráfaga por cada fragmento de token generado",
 "playground.9": "Lo que el modelo consideró — probabilidades reales",
 "scaling.0": "12 · Pequeño frente a prémium — por qué la escala lo hace más inteligente",
 "scaling.1": "Todo lo que has hecho hasta ahora utilizaba un modelo con unos mil millones de mandos, ejecutándose en tu propio ordenador. Los modelos prémium —los grandes alojados— funcionan exactamente de la misma manera: entran tokens, embeddings, atención, salen probabilidades del siguiente token. No hay ningún ingrediente extra secreto en la receta. La diferencia es la <strong>escala, el pulido y dónde se ejecuta</strong>: muchísimos más mandos, entrenados con muchísimo más texto, acabados con un entrenamiento extra que le enseña a seguir instrucciones y a mostrar su razonamiento.",
 "scaling.10": "Llama 3.2 1B (el tuyo, cifras reales)",
 "scaling.11": "Clase prémium (modelos grandes alojados)",
 "scaling.12": "Parámetros",
 "scaling.13": "1.23 mil millones",
 "scaling.14": "No publicado: estimado en la clase de los cientos de miles de millones",
 "scaling.15": "Capas / tamaño del embedding",
 "scaling.16": "16 capas · 2,048 números por token",
 "scaling.17": "No publicado: mucho más profundo y ancho",
 "scaling.18": "Vocabulario",
 "scaling.19": "128,256 tokens",
 "scaling.2": "¿Por qué «más de lo mismo» haría algo más inteligente? Un modelo más grande tiene espacio para almacenar más patrones, más hechos y relaciones más sutiles entre ellos, y ha visto más ejemplos de cada tipo de problema durante el entrenamiento. Sus predicciones del siguiente token (lección 5) simplemente aciertan más a menudo, sobre todo en cosas raras y complicadas. Cambia la medida a continuación y compara: los dos bloques están dibujados a <strong>escala de volumen real</strong>: el cubo pequeño es todo tu modelo, y el volumen del bloque grande es el múltiplo real de este. Una brecha de 200× suena abstracta; un bloque que se traga 200 de tu modelo, dibujado con honestidad, no. (La cuadrícula tallada en el bloque grande muestra aproximadamente cuántos cubos pequeños caben dentro.)",
 "scaling.20": "No publicado: del mismo orden de magnitud",
 "scaling.21": "Ventana de contexto",
 "scaling.22": "131,072 tokens (~100k palabras)",
 "scaling.23": "Aproximadamente 200k–1M tokens según el producto",
 "scaling.24": "Texto de entrenamiento",
 "scaling.25": "Hasta 9 billones de tokens (tarjeta del modelo de Meta)",
 "scaling.26": "No publicado: clase de decenas de billones, además de un filtrado y una curación exhaustivos",
 "scaling.27": "Después del entrenamiento",
 "scaling.28": "Existen versiones con instrucciones; la tuya está ligeramente pulida",
 "scaling.29": "Ajuste extenso con instrucciones, entrenamiento con retroalimentación humana, ajuste de seguridad y de razonamiento",
 "scaling.3": "Parámetros",
 "scaling.30": "Se ejecuta en",
 "scaling.31": "Tu ordenador, un chip, números redondeados a 8 bits",
 "scaling.32": "Centros de datos, muchos aceleradores, números de mayor precisión",
 "scaling.33": "Lee la columna prémium con honestidad: esas empresas no publican sus recetas, así que todo lo que no se ha anunciado está marcado como una estimación de la clase, no como una especificación. Cualquiera que te cite un recuento exacto de parámetros para un modelo prémium está adivinando.",
 "scaling.34": "<span class=\"lvl-add-tag\">Medio</span>El patrón detrás de las torres es una <strong>ley de escala</strong>: la pérdida de predicción cae de forma suave y predecible a medida que aumentas juntos los parámetros, los datos y el cómputo: una línea recta en un gráfico log-log, encontrada empíricamente en muchas familias de modelos. Duplica los tres y el modelo mejora de forma medible en la predicción del siguiente token, y las capacidades derivadas (aritmética, código, traducción) lo acompañan. También hay una proporción adecuada: la investigación (el resultado «Chinchilla») descubrió que muchos modelos estaban poco entrenados para su tamaño: unos 20 tokens de entrenamiento por parámetro es un equilibrio mejor que un modelo enorme alimentado con poco texto.",
 "scaling.35": "<span class=\"lvl-add-tag\">Experto</span>La aritmética de la escala: cómputo de entrenamiento ≈ 6 · parámetros · tokens de entrenamiento FLOPs, así que la columna prémium multiplica dos números grandes entre sí: por eso las ejecuciones de entrenamiento de frontera se miden en megavatios-mes. La inferencia cuesta aproximadamente 2 · parámetros FLOPs por token generado (antes del tráfico de atención y de memoria), por lo que las respuestas prémium se miden y tu 1B se siente instantáneo. Tres advertencias mantienen honesta la escala: (1) muchos sistemas prémium son mezclas de expertos: los parámetros totales exageran los activos usados por token; (2) los rendimientos disminuyen: cada reducción a la mitad de la pérdida cuesta exponencialmente más cómputo, y el texto de alta calidad es finito (el «muro de datos»); (3) la escala no es toda la brecha: la curación de datos, el postentrenamiento (ajuste con instrucciones, RLHF/optimización por preferencias), una generación deliberada más larga y el uso de herramientas se construyen encima. Tu modelo local es el mismo tipo de máquina con todos los mandos bajados, y con sus pesos redondeados a enteros de 8 bits (Q8_0) para que quepa, lo que por sí solo cuesta un poco de precisión.",
 "scaling.4": "Tokens de entrenamiento",
 "scaling.5": "Ventana de contexto",
 "scaling.6": "Cómputo por token",
 "scaling.7": "Pequeño frente a prémium a escala de volumen real — arrastra para orbitar · desplázate para hacer zoom · el volumen del bloque grande es la proporción real (su arista es la raíz cúbica de la proporción)",
 "scaling.8": "La vista 3D necesita una conexión a internet para su biblioteca en la primera carga. La tabla siguiente contiene la misma comparación.",
 "scaling.9": "Medida",
 "assistant.0": "13 · De predictor a asistente — las capas de pulido",
 "assistant.1": "Aquí tienes un enigma que este curso ha ido preparando. La lección 3 entrenó una máquina que solo predice el siguiente token. El modelo de la lección 11 <em>responde preguntas, sigue instrucciones, da formato a las respuestas y se detiene cuando ha terminado</em>. La predicción por sí sola no hace nada de eso: un modelo bruto («base») ante «¿Cuál es la capital de Francia?» continúa encantado con más preguntas de cuestionario, porque eso es lo que suele seguir a un texto con forma de pregunta en el mundo real. El comportamiento de asistente se <strong>entrena después</strong>, por etapas. Haz clic para recorrer el pipeline y luego compara el mismo prompt antes y después del pulido.",
 "assistant.10": "Asistente (después de las etapas 2–3)",
 "assistant.11": "Reconstrucciones didácticas, escritas para mostrar la diferencia típica, no grabaciones de un modelo concreto. Tu Llama local ya es un modelo ajustado por instrucciones; la columna base es lo que su hermano sin ajustar tendería a hacer con el mismo texto.",
 "assistant.12": "<span class=\"lvl-add-tag\">Medio</span>La etapa 2 (ajuste por instrucciones, o SFT) entrena con miles de ejemplos de «instrucción → buena respuesta», así que una entrada con forma de pregunta empieza a predecir una salida con forma de respuesta. La etapa 3 clasifica varias respuestas candidatas con preferencias humanas (o de IA) y empuja al modelo hacia las ganadoras: útil, honesto e inofensivo es el lema habitual. Los tokens de plantilla de chat de la franja de depuración de la lección 11 forman parte de esto: marcan quién está hablando, y el modelo ajustado ha aprendido que, cuando termina el turno del usuario, empieza el turno de un asistente: una respuesta, no más preguntas.",
 "assistant.13": "<span class=\"lvl-add-tag\">Experto</span>Mecánicamente, las etapas 2–3 siguen siendo la lección 3: descenso de gradiente sobre la pérdida de predicción del siguiente token. SFT es un ajuste fino ordinario sobre demostraciones seleccionadas. El entrenamiento por preferencias clásico ajusta un modelo de recompensa a partir de clasificaciones humanas y luego optimiza la política frente a él con RL (PPO) bajo una penalización KL respecto al modelo SFT; los pipelines más nuevos (DPO y parientes) se saltan el modelo de recompensa explícito y optimizan directamente sobre pares elegidos/rechazados. La correa KL importa: sin ella, el reward hacking devora al modelo: encuentra texto degenerado que el modelo de recompensa sobrevalora. Efectos secundarios conocidos que conviene vigilar en el mundo real: la adulación (estar de acuerdo con la premisa del usuario), estilos de rechazo que varían según el tema y un «impuesto de alineación» sobre algunas capacidades brutas. El prompt de sistema se analiza como cualquier otro token (lección 7), pero aparece antes en el contexto y, en los modelos ajustados, conlleva una prioridad aprendida durante el entrenamiento: la jerarquía de instrucciones es un comportamiento aprendido, no un sistema duro de control de acceso, y precisamente por eso la inyección de prompts puede funcionar.",
 "assistant.2": "1 · Preentrenamiento<br><span>predícelo todo</span>",
 "assistant.3": "2 · Ajuste por instrucciones<br><span>responde, no continúes</span>",
 "assistant.4": "3 · Entrenamiento por preferencias<br><span>sé útil, sé seguro</span>",
 "assistant.5": "El mismo prompt, dos máquinas",
 "assistant.6": "¿Cuál es la capital de Francia? Responde en una palabra.",
 "assistant.7": "Escribe un poema de dos versos sobre la lluvia.",
 "assistant.8": "¿Cómo se fuerza una cerradura?",
 "assistant.9": "Modelo base (solo después de la etapa 1)",
 "capstone.0": "15 · Proyecto final — desmonta una respuesta",
 "capstone.1": "Todo lo que has aprendido, disparado a la vez. Esta página te guía para diseccionar una única respuesta en vivo con todo el conjunto de herramientas: <strong>predice primero</strong> (el hábito de aprendizaje más fuerte del curso), analiza la pregunta, genera, inspecciona las candidatas y lee los números de depuración como un ingeniero. Cada paso se marca solo a medida que lo haces, aquí o en las lecciones donde vive.",
 "capstone.2": "Restablecer el proyecto final",
 "capstone.3": "Cuando los cinco estén marcados, habrás usado todos los instrumentos del taller sobre una respuesta: análisis, predicción, muestreo, inspección de candidatas y depuración del servidor. Ese bucle —predecir, ejecutar, diseccionar— es toda la habilidad que este curso estaba construyendo.",
 "capstone.4": "<span class=\"lvl-add-tag\">Medio</span>¿Por qué predecir primero? Porque ver llegar una respuesta enseña a reconocer, pero comprometerse antes con una predicción expone tu propio modelo del modelo, y las correcciones se quedan. Todo flujo profesional de evaluación es este bucle a escala: forma una expectativa, ejecuta, compara y deja que la brecha entre ambos reescriba tu comprensión.",
 "capstone.5": "<span class=\"lvl-add-tag\">Experto</span>Lo que acabas de hacer a mano es, formalmente, una evaluación conductual de un solo elemento con una hipótesis registrada de antemano: la misma forma que un benchmark, menos la estadística. Escálalo y aparecen los problemas abiertos: fiabilidad del juez (tu heurística de la lección 10 puede juzgar mal, exactamente como un juez LLM), contaminación (elementos que el modelo puede haber memorizado) y varianza entre semillas y temperaturas (lección 5). Ten esos tres en mente y podrás leer cualquier tabla de clasificación como un ingeniero en lugar de como un fan.",
 "footer.0": "LLM Visual Lab — una herramienta local de aprendizaje. Las lecciones 1–7 y 13–15 son modelos didácticos esquemáticos, la lección 8 es un modelo real (diminuto) entrenado, la lección 11 usa el Llama local real, y la lección 12 lo compara con modelos premium (las cifras premium son estimaciones etiquetadas).",
 "quiz.0": "Cuestionarios de control",
 "quiz.1": "Cerrar ✕",
 "quiz.2": "Se mantienen apartados de las lecciones para que el aprendizaje quede limpio. Responde a ambas preguntas de una lección para completarla automáticamente, o usa «Marcar lección como completada» al final de una lección en su lugar.",
 "rag.0": "14 · Encontrar respuestas — recuperación (RAG)",
 "rag.1": "El modelo de la lección 11 solo sabe lo que el entrenamiento grabó en sus pesos, y la ventana de contexto de la lección 9 olvida. Los sistemas reales hacen trampa, de forma productiva: antes de responder, <strong>buscan las cosas</strong>. Los documentos se parten en trozos, cada trozo se convierte en un embedding (lección 2), y tu pregunta también se convierte en embedding. Los trozos cuyos vectores quedan más cerca de la pregunta se pegan en la ventana de contexto, y el modelo responde con la evidencia delante. Eso es la <strong>generación aumentada por recuperación</strong>. Pruébalo en un archivo ficticio diminuto: la respuesta existe solo dentro de estos documentos, así que un modelo sin recuperación tendría que adivinar.",
 "rag.2": "¿De qué color es el faro del puerto?",
 "rag.3": "¿Cuándo sale el ferry los domingos?",
 "rag.4": "¿Qué debo hacer con una cadena de bicicleta que chirría?",
 "rag.5": "1 · Buscar por significado",
 "rag.6": "2 · Construir el prompt rellenado",
 "rag.7": "Las puntuaciones de similitud aquí son aritmética real sobre este archivo de juguete (vectores de solapamiento de palabras, similitud del coseno: una miniatura de la geometría de la lección 2 con los embeddings aprendidos sustituidos por conteos). Los sistemas reales usan un modelo de embedding dedicado, buscan entre millones de trozos con vecinos más cercanos aproximados y vuelven a clasificar.",
 "rag.8": "<span class=\"lvl-add-tag\">Medio</span>Observa lo que la recuperación hace con los modos de fallo que ya conoces: el conocimiento ahora vive <em>fuera</em> de los pesos, así que puede actualizarse, citarse y borrarse sin reentrenar; la ventana de contexto (lección 9) se convierte en memoria de trabajo en lugar de ser todo el mundo; y la alucinación (lección 10) disminuye cuando la respuesta se copia de la evidencia, aunque vuelve en cuanto el recuperador trae con confianza el trozo equivocado. El tamaño de trozo es un dial real: demasiado pequeño y la otra mitad de la respuesta está en el trozo siguiente; demasiado grande y pagas tokens (el cómputo de la lección 12) para pegar texto en su mayor parte irrelevante.",
 "rag.9": "<span class=\"lvl-add-tag\">Experto</span>El RAG en producción es un pipeline, y cada etapa tiene sus propias métricas: troceado (límites fijos, recursivos o semánticos; solapamiento para proteger las respuestas que cruzan límites), elección del modelo de embedding (dimensión, adecuación al dominio), índice (coseno exacto para corpus pequeños, búsqueda aproximada HNSW/IVF a escala, intercambiando recall por latencia), recuperación híbrida (vectores densos más coincidencia por palabras clave BM25: la semántica pura pierde nombres y números exactos), reclasificación con un cross-encoder y, por último, generación condicionada por el conjunto recuperado. La evaluación se divide en dos: calidad de recuperación (recall@k: ¿se pegó siquiera el trozo correcto?) frente a fidelidad de la generación (¿se mantuvo la respuesta dentro de la evidencia?). La mayoría de los informes de «el RAG no funciona» son fallos de recuperación con ropa de generación. Y la nota de seguridad: los documentos pegados también son tokens: un trozo envenenado puede traer instrucciones, lo que es inyección de prompts entrando por la puerta principal."
};
window.I18N_DYN_ES = {
 "cap_steps": {
  "expert": "<strong>5 · Lee la depuración como un ingeniero.</strong> Cambia al nivel Experto y abre el panel de depuración en la Lección 11: motivo de parada, uso del contexto y la elección más incierta.",
  "inspect": "<strong>4 · Inspecciona un token.</strong> En la respuesta de la Lección 11, haz clic en cualquier token brillante y lee entre qué estaba eligiendo el modelo.",
  "judged": "<strong>3 · Ejecútalo.</strong> Genera la respuesta trampa en la Lección 11. El juez del marcador de la Lección 10 la califica automáticamente frente a tu predicción.",
  "parse": "<strong>2 · Analízalo.</strong> Abre la pregunta de strawberry en la Lección 7 y llévala a la etapa 3: nombra qué hay que contar y la restricción de formato antes de que el modelo la vea.",
  "predict": "<strong>1 · Predecir.</strong> La trampa de contar letras, una vez más: ¿contará bien el modelo local las r de “strawberry”?"
 },
 "input_defaults": {
  "ctxInput": "Mi color favorito es el verde azulado y vivo en Bergen.",
  "parsePlaceholder": "Escribe una pregunta y pulsa «Analizar la mía»",
  "promptInput": "La capital de Francia es",
  "tokenInput": "El zorro marrón rápido salta sobre el perro perezoso."
 },
 "lesson_titles": {
  "assistant": "De predictor a asistente",
  "attention": "Atención",
  "capstone": "Proyecto final",
  "context": "Contexto",
  "embeddings": "Incrustaciones",
  "journey": "Dentro del modelo",
  "limits": "Límites",
  "parsing": "Analizar una pregunta",
  "playground": "Modelo en vivo",
  "probabilities": "Siguiente token",
  "rag": "Buscar respuestas (RAG)",
  "scaling": "Pequeño vs. premium",
  "tokens": "Tokens",
  "toymodel": "Modelo de juguete 3D",
  "training": "Entrenamiento"
 },
 "quizzes": {
  "assistant": [
   [
    "Un modelo base ante «What is the capital of France?» a menudo…",
    [
     "Responde «Paris» y se detiene",
     "Continúa con más preguntas de examen",
     "Se niega"
    ],
    "La predicción sin ajuste de instrucciones continúa el patrón del texto con forma de preguntas."
   ],
   [
    "Las negativas y el tono útil vienen sobre todo de…",
    [
     "El volumen de datos de preentrenamiento",
     "El entrenamiento con preferencias tras el ajuste de instrucciones",
     "Una ventana de contexto más grande"
    ],
    "La etapa 3 entrena los gustos: útil, honesto, seguro, por encima de la capacidad."
   ]
  ],
  "attention": [
   [
    "En el cabezal A, ¿a qué presta más atención «it»?",
    [
     "mat",
     "cat",
     "tired"
    ],
    "Los cabezales de referencia vinculan los pronombres con su sustantivo."
   ],
   [
    "¿Puede un token atender a palabras que vienen después?",
    [
     "Sí",
     "No: solo hacia atrás",
     "Solo pueden los verbos"
    ],
    "La máscara causal bloquea el futuro; la predicción no puede espiar lo que viene."
   ]
  ],
  "capstone": [
   [
    "El primer paso del bucle final es predecir antes de ejecutar porque…",
    [
     "Hace la generación más rápida",
     "Una conjetura comprometida expone tu modelo del modelo, y las correcciones se quedan",
     "El juez lo exige"
    ],
    "Las expectativas registradas de antemano convierten mirar en evaluar."
   ],
   [
    "Una evaluación conductual a gran escala debe preocuparse por…",
    [
     "La fiabilidad del juez, la contaminación y la varianza",
     "La elección de fuentes",
     "Nada: una ejecución lo prueba todo"
    ],
    "Una ejecución fluida es una anécdota; la fiabilidad es un problema de estadística."
   ]
  ],
  "context": [
   [
    "Cuando la ventana de contexto se llena, ¿qué pasa con los tokens más antiguos?",
    [
     "Se resumen",
     "Salen de la ventana y ya no existen para el modelo",
     "Se guardan en disco"
    ],
    "Fuera de la ventana = ausente en la siguiente pasada hacia adelante."
   ],
   [
    "¿Por qué los chats largos pueden empezar a ignorar tu primera instrucción?",
    [
     "El modelo se aburre",
     "Puede haber salido de la ventana de contexto",
     "Internet la pierde"
    ],
    "Los tokens iniciales pueden literalmente salir de lo que el modelo ve."
   ]
  ],
  "embeddings": [
   [
    "Que dos palabras estén cerca en el espacio de embeddings significa…",
    [
     "Se escriben de forma parecida",
     "Aparecen en frases similares",
     "Tienen la misma longitud"
    ],
    "Cercanía = contextos de uso similares, aprendidos durante el entrenamiento."
   ],
   [
    "king − man + woman aterriza cerca de…",
    [
     "car",
     "queen",
     "apple"
    ],
    "Las direcciones en el espacio codifican relaciones como la realeza y el género."
   ]
  ],
  "journey": [
   [
    "¿Por qué capas pasa un token?",
    [
     "Solo por las que necesita",
     "Por todas las capas, en orden",
     "Por una capa al azar"
    ],
    "Todos los tokens atraviesan la pila completa; la atención y el MLP reescriben cada uno por capa."
   ],
   [
    "¿Qué sale de la capa final?",
    [
     "Una frase terminada",
     "Puntuaciones para el siguiente token",
     "Una imagen"
    ],
    "La representación final se convierte en probabilidades del siguiente token."
   ]
  ],
  "limits": [
   [
    "¿Por qué alucina el modelo?",
    [
     "Miente a propósito",
     "Fue entrenado para texto plausible, no para verdad verificada",
     "Está roto"
    ],
    "La verosimilitud es el objetivo; las invenciones fluidas llenan los huecos."
   ],
   [
    "Pide un artículo científico que pruebe una afirmación inventada y puede…",
    [
     "Negarse siempre",
     "Inventar una cita falsa convincente",
     "Buscar en la web"
    ],
    "Las citas son un estilo que puede imitar sin ninguna base de datos."
   ]
  ],
  "parsing": [
   [
    "Dentro del modelo, las reglas gramaticales viven en…",
    [
     "Un diccionario integrado de sustantivos y verbos",
     "En ninguna parte: el análisis emerge de la atención y las capas",
     "El tokenizador"
    ],
    "No existe un analizador simbólico; la estructura la construyen los mismos mecanismos de las lecciones 4 y 6."
   ],
   [
    "«Fruit flies like a banana» es peligroso para un modelo porque…",
    [
     "Las bananas son raras en los datos de entrenamiento",
     "La misma forma de palabra necesita el análisis opuesto, y debe apostar por uno",
     "Contiene una negación"
    ],
    "Dos análisis válidos, un ganador: una apuesta equivocada al principio se convierte en una respuesta fluida pero errónea."
   ]
  ],
  "playground": [
   [
    "¿Dónde se ejecuta el modelo en vivo?",
    [
     "En la nube",
     "En tu propio ordenador",
     "Solo dentro de la pestaña del navegador"
    ],
    "Ollama sirve llama3.2:1b localmente: nada sale de esta máquina."
   ],
   [
    "Una temperatura baja (cerca de 0) hace que la salida sea…",
    [
     "Más aleatoria",
     "Más segura y repetitiva",
     "Más larga"
    ],
    "Una T baja agudiza la distribución hacia la opción favorita."
   ]
  ],
  "probabilities": [
   [
    "Subir la temperatura hace que las elecciones sean…",
    [
     "Siempre correctas",
     "Más aleatorias y disparatadas",
     "Más rápidas"
    ],
    "Una T más alta aplana la distribución, así que las opciones improbables se eligen más a menudo."
   ],
   [
    "Muestrear significa que el siguiente token se elige…",
    [
     "Alfabéticamente",
     "Lanzando un dado ponderado sobre las probabilidades",
     "Lo elige una persona"
    ],
    "Softmax da las probabilidades; la generación muestrea a partir de ellas."
   ]
  ],
  "rag": [
   [
    "En RAG, los fragmentos recuperados acaban…",
    [
     "Escritos en los pesos del modelo",
     "Pegados en la ventana de contexto como evidencia",
     "Eliminados tras la búsqueda"
    ],
    "La recuperación introduce evidencia en el prompt; los pesos nunca cambian."
   ],
   [
    "La mayoría de los fallos de «RAG no funciona» suelen ser…",
    [
     "El recuperador trajo el fragmento equivocado",
     "El modelo olvidó su entrenamiento",
     "La ventana de contexto era demasiado honesta"
    ],
    "Si el fragmento correcto nunca se pegó, la generación nunca tuvo oportunidad: comprueba primero recall@k."
   ]
  ],
  "scaling": [
   [
    "Un modelo premium es más inteligente principalmente porque…",
    [
     "Usa un tipo de matemáticas diferente y secreto",
     "La misma receta a una escala mucho mayor, más entrenamiento extra de pulido",
     "Busca respuestas en una base de datos"
    ],
    "Tokens, atención y predicción del siguiente token son lo mismo; los parámetros, los datos y el postentrenamiento no."
   ],
   [
    "Alguien cita un número exacto de parámetros de un modelo premium. Deberías…",
    [
     "Creerlo: todas las especificaciones son públicas",
     "Pedir la fuente oficial: los fabricantes no lo publican, así que es una estimación",
     "Multiplicar por diez el número de tu modelo local"
    ],
    "Los fabricantes premium no divulgan el número de parámetros; las comparaciones honestas los etiquetan como estimaciones."
   ]
  ],
  "tokens": [
   [
    "¿Qué lee realmente el modelo?",
    [
     "Palabras enteras",
     "Tokens (fragmentos de texto)",
     "Letras"
    ],
    "Lee tokens: fragmentos que pueden ser una palabra, parte de una palabra o un signo de puntuación."
   ],
   [
    "¿Por qué los modelos suelen fallar al contar las letras de una palabra?",
    [
     "Se les dan mal las matemáticas",
     "Ven tokens, no letras",
     "La palabra es demasiado larga"
    ],
    "Una palabra puede ser un solo token, así que sus letras nunca fueron entradas separadas."
   ]
  ],
  "toymodel": [
   [
    "Tras el entrenamiento, ¿por qué «cat» predice «sat» con tanta fuerza?",
    [
     "Está programado así",
     "Sus frases siempre emparejan cat con sat",
     "Los gatos se sientan en la vida real"
    ],
    "El modelo solo conoce patrones de sus frases de entrenamiento."
   ],
   [
    "La ruta ámbar muestra…",
    [
     "El único camino recorrido",
     "Las conexiones más activas: todos los nodos se activan igualmente",
     "Un atajo secreto"
    ],
    "Cada nodo se activa a la vez; la ruta muestra las contribuciones más fuertes."
   ]
  ],
  "training": [
   [
    "¿Qué mide la pérdida (loss)?",
    [
     "Cuánto mide el modelo",
     "Cuán equivocada fue la predicción",
     "A qué velocidad funciona"
    ],
    "La pérdida es la puntuación de error: el descenso de gradiente la reduce paso a paso."
   ],
   [
    "¿Aprende el modelo de tu conversación con él?",
    [
     "Sí, permanentemente",
     "Solo para usuarios de pago",
     "No: el entrenamiento ya terminó"
    ],
    "Chatear es inferencia; los pesos no cambian."
   ]
  ]
 },
 "title": "LLM Visual Lab — Cómo funcionan los modelos de lenguaje",
 "trap_status": {
  "fell": "El modelo cayó en la trampa",
  "fell_called": " — lo viste venir ✓",
  "fell_missed": " — no lo viste venir",
  "locked": "Predicción bloqueada: ahora ejecútalo",
  "not_run": "Aún no ejecutado",
  "survived": "El modelo lo acertó",
  "survived_called": " — lo viste venir ✓",
  "survived_missed": " — era más difícil de lo que pensabas"
 },
 "ui": {
  "cap_expert_btn": "Cambiar a Experto e ir",
  "cap_fall": "Caerá en la trampa",
  "cap_parse_btn": "Abrirlo en la Lección 7",
  "cap_run_btn": "Cargar la trampa en la Lección 11",
  "cap_survive": "Lo acertará",
  "cap_tally": "Proyecto final: {a} de 5 pasos hechos.",
  "cap_tally_all": " Los cinco: has ejecutado el bucle completo: predecir, analizar, generar, inspeccionar, depurar.",
  "complete_btn": "Marcar lección como completada",
  "completed_btn": "Completada ✓ — haz clic para deshacer",
  "completed_status": "Completada ✓",
  "correct_prefix": "Correcto. ",
  "final_note": "Última lección: complétala para terminar el curso.",
  "language_label": "Idioma",
  "lesson_complete_toast": "Lección completada: {title} — {a} de {b} hechas.",
  "next_lesson": "Siguiente lección: {title} →",
  "not_completed": "No completada",
  "progress": "Progreso {a}/{b}",
  "quiz_intro": "Responde a ambas preguntas para completar esta lección automáticamente.",
  "rag_answer_prefix": "Con la evidencia pegada, el modelo puede responder desde el fragmento superior: ",
  "rag_prompt_intro": "Responde usando solo la evidencia siguiente. Si no está ahí, dilo.",
  "rag_question_label": "Pregunta: ",
  "rag_top_msg": "Los 2 fragmentos superiores seleccionados (resaltados). Ahora construye el prompt que el modelo recibiría realmente.",
  "sharp_note": "Si tuviera que responder en la capa 0, la mejor conjetura sería “{first}” con un {fp}%. En la capa 15 el líder es “{last}” con un {lp}%. Los puntos rosas marcan dónde cambia la palabra líder: las capas tempranas aún adivinan palabras gramaticales; la respuesta real solo toma la delantera cuando llega el contexto.",
  "sound_off": "Sonido: desactivado",
  "sound_on": "Sonido: activado",
  "trap_tally": "Predicciones correctas: {a} de {b} trampas juzgadas.",
  "wrong_prefix": "No del todo. "
 },
 "assistant_scenarios": [
  {
   "asst": "París.",
   "base": "¿Cuál es la capital de Francia? Responde en una palabra.\n¿Cuál es la capital de Alemania? Responde en una palabra.\n¿Cuál es la capital de Italia? Responde en una palabra.\n(a) París (b) Berlín (c)…",
   "note": "El modelo base trata tu indicación como el inicio de una hoja de examen y continúa el patrón — la predicción funciona perfectamente, la asistencia está ausente. El modelo ajustado escuchó una instrucción, obedeció el formato y se detuvo."
  },
  {
   "asst": "La lluvia golpea la ventana toda la noche,\nuna percusión suave, media canción.",
   "base": "Escribe un poema de dos versos sobre la lluvia.\n\nLa lluvia cae suave sobre el viejo tejado de hojalata,\nContando monedas que no puede guardar,\nY en el tercer verso el río despierta,\nMientras todo el pueblo duerme profundamente,\n(De «Poemas del Valle», 1911)…",
   "note": "En el modelo base aún no existe un contrato de seguimiento de instrucciones: una indicación de poema predice texto de antología con forma de poema, así que continúa e inventa una atribución. El asistente te da exactamente dos versos y se detiene."
  },
  {
   "asst": "No puedo ayudarte a forzar una cerradura que no es tuya. Si te has quedado fuera, un cerrajero autorizado puede abrirla sin daños — y si es tu propia cerradura y has perdido la llave, puede pedirte una prueba de propiedad primero.",
   "base": "¿Cómo fuerzo una cerradura?\n¿Cómo hago un puente a un coche?\n¿Cómo hago una identificación falsa?\nCapítulo 4: Preguntas comunes sobre cerraduras. Una cerradura estándar de pasadores consta de…",
   "note": "La negativa no es conocimiento que le falte al modelo base — es la etapa 3. El entrenamiento de preferencias hizo que «no ayudes con actos ilícitos, ofrece la alternativa legítima» fuera la continuación de alta probabilidad. (Esta es una reconstrucción estilizada; las negativas reales varían.)"
  }
 ],
 "parse_link_labels": [
  [
   "«how many» necesita un objetivo — debe encontrar qué se está contando",
   "las letras pertenecen a esta palabra",
   "el formato de la respuesta está restringido"
  ],
  [
   "«not» debe encontrar y cancelar la caída",
   "«why» pregunta por la causa de este (no) evento",
   "sujeto de la acción"
  ],
  [
   "«not» cancela esta acción",
   "la forma que debe adoptar la escritura",
   "el tema",
   "la palabra prohibida es el objetivo de la negación"
  ],
  [
   "el sujeto hace esto",
   "comparado con esto"
  ],
  [
   "estas cosas",
   "los insectos hacen esto",
   "disfrutan de esto"
  ]
 ],
 "parse_roles": {
  "action": "acción / verbo",
  "asking": "palabra interrogativa",
  "constraint": "formato / restricción",
  "content": "palabra de contenido",
  "negation": "negación — invierte el significado",
  "other": "palabra de enlace",
  "subject": "sujeto — de quién/qué trata"
 },
 "parse_summaries": [
  "<strong>Qué está pidiendo:</strong> contar algo.<br>Objetivo: la letra r dentro de «strawberry». Restricción: responder solo con el número.<br><strong>Dónde se equivoca:</strong> el objetivo del conteo es una letra, pero el modelo lee tokens, no letras (lección 1) — esta pregunta exacta es una trampa en la lección 10.",
  "<strong>Qué está pidiendo:</strong> explicar una causa.<br>Sujeto: la Luna. Evento: caer — negado. Así que la verdadera pregunta es «¿qué la mantiene arriba?», y un análisis que omite el <em>not</em> responde la pregunta opuesta.",
  "<strong>Qué está pidiendo:</strong> crear texto, con dos restricciones.<br>Forma: un haiku. Tema: hojas de otoño. Prohibido: la palabra «fall» — incómodo, porque la escritura otoñal tiende hacia ella, y el modelo debe vigilar sus propias elecciones de siguiente token (lección 5) frente a una regla establecida aquí, en el momento del análisis.",
  "<strong>Qué está pidiendo:</strong> nada — es una afirmación, en la lectura A: <em>time</em> (sujeto) <em>flies</em> (verbo) como una flecha: el tiempo pasa rápidamente.<br>Mantén ese análisis y mira el siguiente preajuste: forma idéntica, lectura diferente. El modelo debe apostar por una — no puede mantener ambas.",
  "<strong>Qué está pidiendo:</strong> también una afirmación — pero aquí <em>flies</em> es un sustantivo (los insectos), <em>like</em> es el verbo, y <em>fruit</em> describe qué moscas.<br>La misma forma de cinco espacios que «Time flies…», roles opuestos para la misma palabra. El contexto — una palabra cambiada — invierte el análisis. Esa inversión es el trabajo de la atención (lección 4), y cuando apuesta mal, la respuesta es un sinsentido fluido sobre fruta voladora."
 ],
 "pipe_details": [
  "<strong>Etapa 1 — Preentrenamiento.</strong> La máquina de las lecciones 1–6: predecir el siguiente token sobre billones de tokens. Absorbe hechos, gramática, estilos — y todos los malos hábitos de los datos. Ante una pregunta, predice por qué suele seguir el texto con forma de pregunta: a menudo, más preguntas. No tiene concepto de «responderte»; todavía no existe un «tú».",
  "<strong>Etapa 2 — Ajuste de instrucciones (SFT).</strong> Entrenar más con pares de demostración: una instrucción, luego una buena respuesta. El mismo descenso de gradiente, datos diminutos, un efecto conductual enorme: el texto con forma de respuesta ahora sigue a la entrada con forma de pregunta, se obedecen los formatos y el modelo emite un token de parada cuando termina en lugar de seguir divagando. Aquí es donde nace «asistente» como rol.",
  "<strong>Etapa 3 — Entrenamiento de preferencias.</strong> Muestrear varias respuestas, hacer que humanos (o un modelo de recompensa entrenado) las clasifiquen, y empujar la política hacia las ganadoras: útil sobre evasivo, honesto sobre aparentemente seguro, seguro sobre dañino. De aquí vienen las negativas, el tono y «muestra tu razonamiento» — gustos, entrenados, superpuestos sobre la capacidad."
 ],
 "rag_answers": [
  "Rojo brillante (con una banda blanca) — ese hecho vive solo en el archivo; sin recuperación el modelo estaría adivinando un color plausible.",
  "Los domingos el primer ferry sale a las 09:30. Sin el fragmento del horario, este es exactamente el tipo de hecho específico que un modelo inventa con confianza (lección 10).",
  "Limpia la cadena, luego una gota de aceite por eslabón, y limpia el exceso. Recuperado, no recordado."
 ],
 "rag_docs": [
  "El faro del puerto está pintado de rojo brillante con una banda blanca cerca de la parte superior. Fue construido en 1889 y su lámpara destella dos veces cada diez segundos.",
  "Horario del ferry: entre semana el ferry sale a las 07:10, 12:40 y 18:05. Los domingos el primer ferry sale a las 09:30 y el último regreso es a las 20:15.",
  "Cuidado de la bicicleta: una cadena que chirría necesita primero una limpieza, luego una gota de aceite para cadenas en cada eslabón. Limpia el exceso de aceite para que la cadena no acumule arenilla.",
  "La cafetería de Pier Street sirve sopa desde las 11:00. Su famosa sopa de pescado se agota la mayoría de los sábados a las dos de la tarde.",
  "Tabla de mareas del puerto: marea alta el sábado a las 06:12 y 18:44. Las marismas de lodo se pueden recorrer dos horas antes y dos horas después de la marea baja.",
  "El pequeño museo junto a la estación abre de martes a sábado, de diez a cuatro. La entrada es gratuita para los niños menores de doce años.",
  "Nota meteorológica: los vientos del oeste traen lluvia sobre el puerto al anochecer. Los pescadores reparan las redes bajo el toldo los días de lluvia."
 ],
 "scale_notes": {
  "compute": "Cómputo aproximado quemado por token generado, también a escala de volumen real (~200×). El coste de inferencia escala con los parámetros activos (~2 FLOPs por parámetro por token), así que cada token premium cuesta del orden de 200× más aritmética que el tuyo — antes de extras premium como un razonamiento deliberado más largo. Esa brecha es la razón por la que uno es gratuito en tu escritorio y el otro se mide en un centro de datos.",
  "context": "Ventana de contexto (el tamaño de ventana de la lección 9): la tuya contiene 131,072 tokens — aproximadamente un libro de 300 páginas. Los productos premium ofrecen aproximadamente 200k–1M tokens. Representado como volumen eso es aproximadamente 7.6× — la brecha más pequeña de las cuatro, lo que los bloques a escala real hacen evidente de un vistazo.",
  "params": "Parámetros (los mandos ajustables del modelo): tu Llama tiene 1.23 mil millones — una cifra real y publicada. Los modelos premium no publican los suyos; el bloque grande se ilustra con 250 mil millones, la clase comúnmente estimada. Los bloques están dibujados a escala de volumen REAL: si el cubo pequeño es todo el modelo de 1B, el bloque premium contiene unos 200 de ellos — aproximadamente 5.9× más ancho, más alto y más profundo (200 = 5.9³). Sin trucos logarítmicos: lo que ves es la proporción.",
  "training": "Tokens de entrenamiento (cuánto texto practicó el modelo, lecciones 1–3): la ficha del modelo de Meta dice hasta 9 billones para el tuyo. Los conjuntos de entrenamiento premium no se publican; se ilustra con ~30 billones. A escala de volumen real eso es un bloque de aproximadamente 3.3× el volumen del pequeño — una brecha real, pero observa cuánto más pequeña parece que la brecha de parámetros."
 }
};
