# 🤖 Prompts para Generación de Ores con IA

## 📋 Información General

Estos prompts están optimizados para:
- **Herramienta**: Google Gemini
- **Estilo**: Pixel art isométrico o top-down
- **Tamaño**: 32x32 pixels
- **Formato**: PNG con transparencia
- **Tema**: Ores/Minerales para juego RPG Idle

---

## 🪨 Prompts por Ore

### 1️⃣ COBRE (Copper)

```
Isometric pixel art ore of copper, metallic orange-reddish color, 
rough crystalline texture, shiny reflective surface, pixel art style, 
top-down view, grey background, no shadows
```

---

### 2️⃣ CARBÓN (Coal)

```
Pixel art coal ore sprite, isometric view, dark black and grey colors 
with rough texture, coal crystal formation, subtle shadow, 
grey background, no shadows
```

---

### 3️⃣ HIERRO (Iron)

```
Pixel art iron ore sprite, isometric perspective, metallic grey color 
with orange-brown rust accents, rough metallic texture, cubic crystalline 
structure, grey background, no shadows
```

---

### 4️⃣ PLATA (Silver)

```
Pixel art silver ore sprite, isometric view, bright metallic silver color, 
shiny reflective surface, crystalline faceted structure, bright highlights, 
grey background, no shadows
```

---

### 5️⃣ TUNGSTENO (Tungsten)

```
Pixel art tungsten ore sprite, isometric perspective, dark metallic grey 
color, dense heavy appearance, angular crystal formation, strong metallic 
sheen, grey background, no shadows
```

---

### 6️⃣ ORO (Gold)

```
Pixel art gold ore sprite, isometric perspective, bright golden yellow 
color, radiant luminous appearance, shiny reflective surface, wealth 
appearance, grey background, no shadows
```

---

### 7️⃣ PLATINO (Platinum)

```
Pixel art platinum ore sprite, isometric perspective, pale silver-white 
color, premium metallic sheen, crystalline faceted structure, bright 
reflections, elegant appearance, grey background, no shadows
```

---

### 8️⃣ OBSIDIANA (Obsidian)

```
Pixel art obsidian ore sprite, isometric perspective, pure jet black 
color with dark purple-blue reflections, smooth glass-like surface, 
volcanic appearance, sharp angular edges, grey background, no shadows
```

---

### 9️⃣ COBALTO (Cobalt)

```
Pixel art cobalt ore sprite, isometric perspective, deep blue metallic 
color, vibrant rich appearance, crystalline structure with bright 
highlights, intense color, exotic appearance, grey background, no shadows
```

---

### 🔟 MITHRIL (Mithril/Mythril)

```
Pixel art mithril ore sprite, isometric perspective, shimmering silvery-blue 
color, magical luminous appearance, ethereal glow, crystalline mystical 
structure, bright highlights, legendary appearance, grey background, no shadows
```

---

### 1️⃣1️⃣ ORICALCO (Orichalcum)

```
Pixel art orichalcum ore sprite, isometric perspective, radiant golden-copper 
color with mystical light, divine metallic sheen, crystalline structure with 
prismatic reflections, legendary mythical appearance, grey background, no shadows
```

---

### 1️⃣2️⃣ ADAMANTITA (Adamantite)

```
Pixel art adamantite ore sprite, isometric perspective, deep purple-pink 
color, indestructible legendary appearance, crystalline geometric structure, 
bright magical reflections, unbreakable metallic sheen, grey background, no shadows
```

---

### 1️⃣3️⃣ TITANIO (Titanium)

```
Pixel art titanium ore sprite, isometric perspective, silvery-grey metallic 
color, extreme durability appearance, strong angular crystalline structure, 
intense metallic sheen, powerful legendary appearance, grey background, no shadows
```

---

### 1️⃣4️⃣ DRACONITA (Dragonite)

```
Pixel art dragonite ore sprite, isometric perspective, blood-red crimson 
color with dark purple accents, draconic legendary appearance, jagged 
intimidating structure, inner glow effect, divine power appearance, grey background, no shadows
```

---

## 🎨 Workflow en Google Gemini

### Paso 1: Acceder a Google Gemini
1. Ve a https://gemini.google.com/
2. Inicia sesión con tu cuenta Google

### Paso 2: Generar la Imagen
1. Copia el prompt correspondiente al ore que necesites
2. Pégalo en el chat
3. Gemini generará la imagen automáticamente

### Paso 3: Descargar y Procesar
1. Descarga la imagen generada como PNG
2. Abre en un editor (Krita, Photoshop)
3. Redimensiona a 32x32 pixels si es necesario
4. Guarda en `src/assets/sprites/custom/ores/`

---

## 📝 Naming Convention

Guarda los archivos con este formato:

```
ore_{material}_custom_{version}.png

Ejemplos:
- ore_copper_custom_v1.png
- ore_carbon_custom_v1.png
- ore_iron_custom_v2.png
- ore_gold_custom_v1.png
- ore_draconite_custom_v1.png
```

---

## 🔄 Prompts Alternativos Rápidos (Si Gemini falla)

Si el prompt principal no funciona bien, intenta estos genéricos:

```
"Simple pixel art {COLOR} ore crystal, 32x32 sprite, 
isometric RPG game asset, transparent background"

Ejemplos aplicados:
- "Simple pixel art copper orange ore crystal, 32x32 sprite..."
- "Simple pixel art black coal ore crystal, 32x32 sprite..."
- "Simple pixel art blue cobalt ore crystal, 32x32 sprite..."
```

---

## 💡 Tips para Mejores Resultados

1. **Color específico**: Siempre menciona el color exacto
2. **Tamaño**: Siempre especifica "32x32 pixels"
3. **Estilo**: "pixel art", "isometric", "game asset" son palabras clave
4. **Fondo**: "transparent background" es importante
5. **Negativo**: Usa siempre el prompt negativo para evitar blur

---

## 🎯 Próximos Pasos

Una vez generes las imágenes:
1. Refina en Krita si es necesario
2. Guarda en `src/assets/sprites/custom/ores/`
3. Crea spritesheets compilados
4. Integra en `skillProducts.ts`

---

**Creado**: 14 de febrero de 2026
**Versión**: 1.0
**Herramienta recomendada**: Google Gemini
