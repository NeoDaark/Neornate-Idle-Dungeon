# 👨‍💻 Dev Console - Guía de Uso

## ¿Cuándo está disponible?

La consola **solo está disponible en modo desarrollo** (`npm run dev`). Se desactiva automáticamente en producción.

## Cómo activarla

- **Presiona F1** en cualquier momento
- O haz clic en el botón flotante �️ en la esquina inferior derecha (si la consola está cerrada)

## Comandos Disponibles

### 1. **skill** - Modificar skills

```bash
skill set MINERIA 50          # Establecer Minería a nivel 50
skill xp FUNDICION 1000       # Añadir 1000 XP a Fundición
```

**Skills disponibles:**
- `MINERIA` (⛏️)
- `TALA` (🌲)
- `FUNDICION` (🔥)
- `HERRERIA` (🔨)
- `PESCA` (🎣)
- `COCINA` (🍳)
- `AVENTURA` (🗺️)

### 2. **inventory** - Gestionar inventario

```bash
inventory add carbon 100              # Añadir 100 carbones
inventory add hierro_ingot 50         # Añadir 50 lingotes de hierro
inventory clear                       # Limpiar todo el inventario
```

**Items útiles:**
- `carbon`, `cobre`, `hierro`, `plata`, etc. (minerales)
- `carbon_ingot`, `cobre_ingot`, `hierro_ingot`, etc. (lingotes)
- `madera_blanda`, `roble`, `caoba`, etc. (maderas)

### 3. **player** - Modificar datos del jugador

```bash
player level 75               # Establecer nivel del jugador a 75
player gold 10000            # Establecer oro a 10,000
```

### 4. **state** - Ver estado actual

```bash
state                         # Muestra toda la información del juego
```

Mostrará:
- Nivel y oro del jugador
- Niveles de todos los skills
- XP actual
- Inventario completo

### 5. **clear** - Limpiar logs

```bash
clear                         # Limpia la consola (no afecta al juego)
```

### 6. **help** o **?** - Ver ayuda

```bash
help                          # Muestra todos los comandos disponibles
?                             # Alias de help
```

## Ejemplos Prácticos

### Testear farmeo rápido
```bash
# Preparar para farmear fundición avanzada
skill set FUNDICION 80
inventory add mithril 50
player gold 50000
```

### Resetear a principios
```bash
skill set MINERIA 1
skill set TALA 1
inventory clear
player level 1
player gold 0
```

### Testear sin materiales (bug testing)
```bash
skill set FUNDICION 50
inventory clear
# Ahora si intentas fundir, se detiene automáticamente
```

## Notas Técnicas

- Máximo 50 logs en pantalla (los más antiguos se descartan)
- Los cambios se guardan automáticamente en `localStorage`
- La consola no interfiere con el game loop
- Los errores se muestran en rojo en la consola (y en el DevTools del navegador)
- El botón flotante solo aparece cuando la consola está **cerrada**

## Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| `F1` | Toggle consola (abrir/cerrar) |
| `Enter` | Ejecutar comando |
| `Esc` | (No hace nada aún, usa `F1` para cerrar) |

## Troubleshooting

### "Comando desconocido: xyz"
- Verifica la ortografía del comando
- Escribe `help` para ver la lista completa

### "Item no encontrado: xyz"
- El item debe existir en `skillProducts.ts`
- Intenta con `inventory add carbon 1` como prueba

### "Skill no encontrado: xyz"
- Usa los nombres en MAYÚSCULAS
- Skills válidos: MINERIA, TALA, FUNDICION, HERRERIA, PESCA, COCINA, AVENTURA

### Los cambios no se guardan
- Los datos se guardan automáticamente en `localStorage`
- Abre el DevTools (F12) → Console → escribe `localStorage.getItem('neornate_skills')` para verificar
