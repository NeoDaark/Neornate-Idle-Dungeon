# Sistema de Oficios - Neornate Idle Dungeon

## 📋 Estado Actual

### Oficios Implementados
- 1 Minería (⛏️)
- 2 Tala (🌲)
- 3 Fundición (🔥)
- 4 Herrería/Carpintería (🔨/🪵)
- 5 Pesca (🎣)
- 6 Cocina (🍳)
- 7 Aventuras (🗺️)


### Sistema de Niveles Actual
- Cada oficio tiene nivel independiente (1-100+)
- Productos desbloqueados por nivel
- XP progresivo: más difícil = más XP

### Mecánicas Implementadas
✅ Niveles independientes por oficio
✅ Productos con requisitos de nivel
✅ Sistema de materiales (requiere ingredientes para crafting)
✅ Dinero por venta de productos
✅ Consumo automático de materiales
✅ Interfaz expandible/contraible
✅ Indicadores de disponibilidad de materiales

---

## 🎯 Visión Futura: Sistema de Tiers

### Estructura de Tiers Globales

| Tier   | Nivel Mín | Nivel Máx | Descripción  |
|--------|-----------|-----------|--------------|
| **T1** | 0         | 20        | Principiante |
| **T2** | 20        | 40        | Aprendiz     |
| **T3** | 40        | 60        | Oficial      |
| **T4** | 60        | 80        | Experto      |
| **T5** | 80        | 100       | Maestro      |
| **T6** | 100       | 120       | Legendario   |
| **T7** | 120       | 200       | Divino       |

#### 📌 Regla Especial de Niveles
- **Desde nivel 120 en adelante**: Se acumula experiencia pero **NO sube de nivel**
- Es un sistema de "prestige" donde sigues ganando XP pero permanece en el mismo nivel
- Permite recompensas por XP acumulada total

---

## 🏭 Oficios Diseñados

### 1️⃣ MINERÍA (⛏️)
**Tipo**: Extracción de recursos  
**Duración**: ~40s por ciclo  
**Requisitos**: Nivel de minería

#### Productos por Tier

| Tier | Nivel   | Mineral    | Cantidad | XP  | Valor | Tiempo de combustion |
|------|---------|------------|----------|-----|-------|----------------------|
| T1   | 1-5     | Carbón     | 2        | 10  | 5g    | 5s                   |
| T1   | 5-10    | Cobre      | 2        | 15  | 8g    | -                    |
| T2   | 20-25   | Hierro     | 1        | 30  | 20g   | -                    |
| T2   | 25-30   | Plata      | 1        | 40  | 30g   | -                    |
| T3   | 40-45   | Tungsteno  | 1        | 60  | 50g   | -                    |
| T3   | 45-50   | Oro        | 1        | 75  | 75g   | -                    |
| T4   | 60-65   | Platino    | 1        | 100 | 120g  | -                    |
| T4   | 65-70   | Obsidiana  | 1        | 120 | 150g  | -                    |
| T5   | 80-85   | Cobalto    | 1        | 150 | 200g  | -                    |
| T5   | 85-90   | Mithril    | 1        | 180 | 250g  | -                    |
| T6   | 100-105 | Oricalco   | 1        | 220 | 350g  | -                    |
| T6   | 105-110 | Adamantita | 1        | 260 | 400g  | -                    |
| T7   | 120-150 | Titanio    | 1        | 350 | 600g  | -                    |
| T7   | 150-200 | Draconita  | 1        | 400 | 800g  | -                    |

---

### 2️⃣ TALA (🌲)
**Tipo**: Extracción de recursos  
**Duración**: ~45s por ciclo  
**Requisitos**: Nivel de tala

#### Productos por Tier

| Tier | Nivel   | Madera             | Cantidad | XP  | Valor | Tiempo de combustion    |
|------|---------|--------------------|----------|-----|-------|-------------------------|
| T1   | 1-5     | Madera Blanda      | 2        | 12  | 6g    | 5s                      |
| T1   | 5-10    | Madera Común       | 2        | 18  | 10g   | 5s                      |
| T2   | 20-25   | Madera de Roble    | 1        | 35  | 25g   | 8s                      |
| T2   | 25-30   | Madera de Nogal    | 1        | 45  | 35g   | 8s                      |
| T3   | 40-45   | Madera de Caoba    | 1        | 65  | 55g   | 11s                     |
| T3   | 45-50   | Madera de Ébano    | 1        | 80  | 85g   | 11s                     |
| T4   | 60-65   | Madera Pétreo      | 1        | 110 | 140g  | 14s                     |
| T4   | 65-70   | Madera Ancestral   | 1        | 130 | 170g  | 14s                     |
| T5   | 80-85   | Madera Cristalina  | 1        | 160 | 220g  | 17s                     |
| T5   | 85-90   | Madera Mágica      | 1        | 190 | 280g  | 17s                     |
| T6   | 100-105 | Madera Sagrada     | 1        | 240 | 380g  | 20s                     |
| T6   | 105-110 | Madera Primordial  | 1        | 280 | 450g  | 20s                     |
| T7   | 120-150 | Madera Dimensional | 1        | 380 | 650g  | 25s                     |
| T7   | 150-200 | Madera Divina      | 1        | 450 | 900g  | 25s                     |

---

### 3️⃣ FUNDICIÓN (🔥)
**Tipo**: Crafting (Convierte minerales + madera/carbón en lingotes)  
**Duración**: ~50s por ciclo  
**Requisitos**: Nivel de fundición, minerales + combustible

#### Proceso
- Recibe: 5 Mineral + 2 Carbón O Madera
- Produce: 1 Lingote

#### Productos por Tier

| Tier | Nivel   | Mineral    | Combustible       | Lingote               | XP  | Valor |
|------|---------|------------|-------------------|-----------------------|-----|-------|
| T1   | 1-5     | Cobre      | Madera o Carbón   | Lingote de Cobre      | 20  | 12g   |
| T1   | 5-10    | Carbón     | Madera o Carbón   | Lingote de Carbón     | 25  | 15g   |
| T2   | 20-25   | Hierro     | Madera o Carbón   | Lingote de Hierro     | 45  | 35g   |
| T2   | 25-30   | Plata      | Madera o Carbón   | Lingote de Plata      | 55  | 50g   |
| T3   | 40-45   | Tungsteno  | Madera o Carbón   | Lingote de Tungsteno  | 75  | 70g   |
| T3   | 45-50   | Oro        | Madera o Carbón   | Lingote de Oro        | 90  | 110g  |
| T4   | 60-65   | Platino    | Madera o Carbón   | Lingote de Platino    | 130 | 170g  |
| T4   | 65-70   | Obsidiana  | Madera o Carbón   | Lingote de Obsidiana  | 150 | 210g  |
| T5   | 80-85   | Cobalto    | Madera o Carbón   | Lingote de Cobalto    | 180 | 280g  |
| T5   | 85-90   | Mithril    | Madera o Carbón   | Lingote de Mithril    | 210 | 350g  |
| T6   | 100-105 | Oricalco   | Madera o Carbón   | Lingote de Oricalco   | 260 | 480g  |
| T6   | 105-110 | Adamantita | Madera o Carbón   | Lingote de Adamantita | 300 | 580g  |
| T7   | 120-150 | Titanio    | Madera o Carbón   | Lingote de Titanio    | 400 | 800g  |
| T7   | 150-200 | Draconita  | Madera o Carbón   | Lingote de Draconita  | 480 | 1100g |

---

### 4️⃣ HERRERÍA/CARPINTERIA (🔨/🪵)
**Tipo**: Crafting (Lingotes → Armas)  
**Duración**: ~55s por ciclo  
**Requisitos**: Nivel de herrería, lingotes

### Productos por Categoría
#### 🗡️ DAGAS (2 lingotes cada una)
| Tier | Nivel | Arma | Lingote | XP | Valor |
|------|-------|------|---------|----|----|
| T1 | 1 | Daga de Cobre | Cobre | 20 | 15g |
| T1 | 5 | Daga de Carbón | Carbón | 25 | 18g |
| T2 | 20 | Daga de Hierro | Hierro | 50 | 45g |
| T2 | 25 | Daga de Plata | Plata | 60 | 65g |
| T3 | 40 | Daga de Tungsteno | Tungsteno | 85 | 110g |
| T3 | 50 | Daga de Oro | Oro | 100 | 150g |
| T4 | 60 | Daga de Platino | Platino | 150 | 250g |
| T4 | 70 | Daga de Obsidiana | Obsidiana | 170 | 320g |
| T5 | 80 | Daga de Cobalto | Cobalto | 220 | 450g |
| T5 | 90 | Daga de Mithril | Mithril | 260 | 580g |
| T6 | 100 | Daga de Oricalco | Oricalco | 320 | 800g |
| T6 | 110 | Daga de Adamantita | Adamantita | 360 | 950g |
| T7 | 120 | Daga de Titanio | Titanio | 480 | 1400g |
| T7 | 150 | Daga de Draconita | Draconita | 560 | 1800g |

#### ⚔️ ESPADAS 1 MANO (4 lingotes cada una)
| Tier | Nivel | Arma | Lingote | XP | Valor |
|------|-------|------|---------|----|----|
| T1 | 5 | Espada Corta de Cobre | Cobre | 40 | 30g |
| T1 | 10 | Espada Corta de Carbón | Carbón | 50 | 40g |
| T2 | 22 | Espada Corta de Hierro | Hierro | 85 | 90g |
| T2 | 28 | Espada Corta de Plata | Plata | 105 | 135g |
| T3 | 42 | Espada Corta de Tungsteno | Tungsteno | 150 | 220g |
| T3 | 52 | Espada Corta de Oro | Oro | 180 | 300g |
| T4 | 62 | Espada Corta de Platino | Platino | 270 | 500g |
| T4 | 72 | Espada Corta de Obsidiana | Obsidiana | 310 | 650g |
| T5 | 82 | Espada Corta de Cobalto | Cobalto | 400 | 900g |
| T5 | 92 | Espada Corta de Mithril | Mithril | 480 | 1150g |
| T6 | 102 | Espada Corta de Oricalco | Oricalco | 600 | 1600g |
| T6 | 112 | Espada Corta de Adamantita | Adamantita | 680 | 1900g |
| T7 | 125 | Espada Corta de Titanio | Titanio | 900 | 2800g |
| T7 | 160 | Espada Corta de Draconita | Draconita | 1050 | 3600g |

#### ⚔️ ESPADAS 2 MANOS (6 lingotes cada una)
| Tier | Nivel | Arma | Lingote | XP | Valor |
|------|-------|------|---------|----|----|
| T1 | 10 | Espada Larga de Cobre | Cobre | 60 | 50g |
| T1 | 15 | Espada Larga de Carbón | Carbón | 75 | 65g |
| T2 | 25 | Espada Larga de Hierro | Hierro | 120 | 150g |
| T2 | 32 | Espada Larga de Plata | Plata | 150 | 210g |
| T3 | 45 | Espada Larga de Tungsteno | Tungsteno | 220 | 350g |
| T3 | 55 | Espada Larga de Oro | Oro | 270 | 480g |
| T4 | 65 | Espada Larga de Platino | Platino | 400 | 800g |
| T4 | 75 | Espada Larga de Obsidiana | Obsidiana | 460 | 1000g |
| T5 | 85 | Espada Larga de Cobalto | Cobalto | 600 | 1450g |
| T5 | 95 | Espada Larga de Mithril | Mithril | 720 | 1850g |
| T6 | 105 | Espada Larga de Oricalco | Oricalco | 900 | 2600g |
| T6 | 115 | Espada Larga de Adamantita | Adamantita | 1020 | 3100g |
| T7 | 130 | Espada Larga de Titanio | Titanio | 1350 | 4500g |
| T7 | 165 | Espada Larga de Draconita | Draconita | 1580 | 5800g |

#### 🪓 HACHAS 1 MANO (4 lingotes + 1 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 8 | Hacha Corta de Cobre | Cobre | Blanda | 45 | 35g |
| T1 | 12 | Hacha Corta de Carbón | Carbón | Común | 55 | 48g |
| T2 | 23 | Hacha Corta de Hierro | Hierro | Roble | 95 | 110g |
| T2 | 30 | Hacha Corta de Plata | Plata | Nogal | 120 | 160g |
| T3 | 43 | Hacha Corta de Tungsteno | Tungsteno | Caoba | 170 | 280g |
| T3 | 53 | Hacha Corta de Oro | Oro | Ébano | 210 | 380g |
| T4 | 63 | Hacha Corta de Platino | Platino | Pétreo | 310 | 620g |
| T4 | 73 | Hacha Corta de Obsidiana | Obsidiana | Ancestral | 360 | 800g |
| T5 | 83 | Hacha Corta de Cobalto | Cobalto | Cristalina | 480 | 1100g |
| T5 | 93 | Hacha Corta de Mithril | Mithril | Mágica | 570 | 1400g |
| T6 | 103 | Hacha Corta de Oricalco | Oricalco | Sagrada | 720 | 1950g |
| T6 | 113 | Hacha Corta de Adamantita | Adamantita | Primordial | 820 | 2350g |
| T7 | 128 | Hacha Corta de Titanio | Titanio | Dimensional | 1100 | 3400g |
| T7 | 162 | Hacha Corta de Draconita | Draconita | Divina | 1280 | 4500g |

#### 🪓 HACHAS 2 MANOS (6 lingotes + 1 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 15 | Hacha Grande de Cobre | Cobre | Blanda | 70 | 55g |
| T1 | 18 | Hacha Grande de Carbón | Carbón | Común | 85 | 75g |
| T2 | 28 | Hacha Grande de Hierro | Hierro | Roble | 140 | 180g |
| T2 | 35 | Hacha Grande de Plata | Plata | Nogal | 180 | 260g |
| T3 | 48 | Hacha Grande de Tungsteno | Tungsteno | Caoba | 250 | 450g |
| T3 | 58 | Hacha Grande de Oro | Oro | Ébano | 310 | 620g |
| T4 | 68 | Hacha Grande de Platino | Platino | Pétreo | 460 | 1000g |
| T4 | 78 | Hacha Grande de Obsidiana | Obsidiana | Ancestral | 540 | 1300g |
| T5 | 88 | Hacha Grande de Cobalto | Cobalto | Cristalina | 720 | 1800g |
| T5 | 98 | Hacha Grande de Mithril | Mithril | Mágica | 860 | 2300g |
| T6 | 108 | Hacha Grande de Oricalco | Oricalco | Sagrada | 1080 | 3200g |
| T6 | 118 | Hacha Grande de Adamantita | Adamantita | Primordial | 1230 | 3900g |
| T7 | 135 | Hacha Grande de Titanio | Titanio | Dimensional | 1650 | 5600g |
| T7 | 170 | Hacha Grande de Draconita | Draconita | Divina | 1920 | 7200g |

#### 🔨 MARTILLOS DE GUERRA (8 lingotes + 2 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 18 | Martillo de Cobre | Cobre | Blanda | 90 | 70g |
| T1 | 20 | Martillo de Carbón | Carbón | Común | 110 | 95g |
| T2 | 32 | Martillo de Hierro | Hierro | Roble | 180 | 240g |
| T2 | 38 | Martillo de Plata | Plata | Nogal | 220 | 350g |
| T3 | 52 | Martillo de Tungsteno | Tungsteno | Caoba | 330 | 600g |
| T3 | 62 | Martillo de Oro | Oro | Ébano | 410 | 850g |
| T4 | 72 | Martillo de Platino | Platino | Pétreo | 610 | 1350g |
| T4 | 82 | Martillo de Obsidiana | Obsidiana | Ancestral | 720 | 1750g |
| T5 | 92 | Martillo de Cobalto | Cobalto | Cristalina | 960 | 2450g |
| T5 | 102 | Martillo de Mithril | Mithril | Mágica | 1150 | 3100g |
| T6 | 112 | Martillo de Oricalco | Oricalco | Sagrada | 1440 | 4400g |
| T6 | 122 | Martillo de Adamantita | Adamantita | Primordial | 1640 | 5300g |
| T7 | 140 | Martillo de Titanio | Titanio | Dimensional | 2200 | 7800g |
| T7 | 175 | Martillo de Draconita | Draconita | Divina | 2560 | 10000g |

#### 🛡️ ESCUDOS (5 lingotes + 2 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 12 | Escudo de Cobre | Cobre | Blanda | 65 | 55g |
| T1 | 16 | Escudo de Carbón | Carbón | Común | 80 | 75g |
| T2 | 26 | Escudo de Hierro | Hierro | Roble | 130 | 160g |
| T2 | 34 | Escudo de Plata | Plata | Nogal | 165 | 240g |
| T3 | 46 | Escudo de Tungsteno | Tungsteno | Caoba | 240 | 420g |
| T3 | 56 | Escudo de Oro | Oro | Ébano | 300 | 580g |
| T4 | 66 | Escudo de Platino | Platino | Pétreo | 450 | 950g |
| T4 | 76 | Escudo de Obsidiana | Obsidiana | Ancestral | 530 | 1250g |
| T5 | 86 | Escudo de Cobalto | Cobalto | Cristalina | 720 | 1700g |
| T5 | 96 | Escudo de Mithril | Mithril | Mágica | 860 | 2200g |
| T6 | 106 | Escudo de Oricalco | Oricalco | Sagrada | 1080 | 3100g |
| T6 | 116 | Escudo de Adamantita | Adamantita | Primordial | 1230 | 3800g |
| T7 | 132 | Escudo de Titanio | Titanio | Dimensional | 1620 | 5400g |
| T7 | 168 | Escudo de Draconita | Draconita | Divina | 1890 | 7000g |

#### 🏹 ARCOS (3 lingotes + 4 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 10 | Arco de Cobre | Cobre | Blanda | 50 | 45g |
| T1 | 14 | Arco de Carbón | Carbón | Común | 65 | 60g |
| T2 | 24 | Arco de Hierro | Hierro | Roble | 105 | 140g |
| T2 | 30 | Arco de Plata | Plata | Nogal | 140 | 210g |
| T3 | 44 | Arco de Tungsteno | Tungsteno | Caoba | 200 | 360g |
| T3 | 54 | Arco de Oro | Oro | Ébano | 250 | 510g |
| T4 | 64 | Arco de Platino | Platino | Pétreo | 380 | 850g |
| T4 | 74 | Arco de Obsidiana | Obsidiana | Ancestral | 450 | 1100g |
| T5 | 84 | Arco de Cobalto | Cobalto | Cristalina | 600 | 1500g |
| T5 | 94 | Arco de Mithril | Mithril | Mágica | 720 | 1950g |
| T6 | 104 | Arco de Oricalco | Oricalco | Sagrada | 900 | 2850g |
| T6 | 114 | Arco de Adamantita | Adamantita | Primordial | 1050 | 3450g |
| T7 | 128 | Arco de Titanio | Titanio | Dimensional | 1400 | 5100g |
| T7 | 166 | Arco de Draconita | Draconita | Divina | 1650 | 6700g |

#### 🏹 BALLESTAS (3 lingotes + 6 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 15 | Ballesta de Cobre | Cobre | Blanda | 70 | 60g |
| T1 | 18 | Ballesta de Carbón | Carbón | Común | 85 | 80g |
| T2 | 28 | Ballesta de Hierro | Hierro | Roble | 140 | 190g |
| T2 | 36 | Ballesta de Plata | Plata | Nogal | 180 | 290g |
| T3 | 48 | Ballesta de Tungsteno | Tungsteno | Caoba | 270 | 510g |
| T3 | 58 | Ballesta de Oro | Oro | Ébano | 340 | 720g |
| T4 | 68 | Ballesta de Platino | Platino | Pétreo | 500 | 1200g |
| T4 | 78 | Ballesta de Obsidiana | Obsidiana | Ancestral | 590 | 1550g |
| T5 | 88 | Ballesta de Cobalto | Cobalto | Cristalina | 800 | 2100g |
| T5 | 98 | Ballesta de Mithril | Mithril | Mágica | 960 | 2750g |
| T6 | 108 | Ballesta de Oricalco | Oricalco | Sagrada | 1200 | 4000g |
| T6 | 118 | Ballesta de Adamantita | Adamantita | Primordial | 1380 | 4850g |
| T7 | 135 | Ballesta de Titanio | Titanio | Dimensional | 1850 | 7200g |
| T7 | 170 | Ballesta de Draconita | Draconita | Divina | 2160 | 9400g |

#### 🏹 FLECHAS Y VIROTES (1 lingote + 1 madera por 20 unidades)
| Tier | Nivel | Munición | Lingote | Madera | Cantidad | XP | Valor |
|------|-------|----------|---------|--------|----------|----|----|
| T1 | 5 | Flechas de Cobre | Cobre | Blanda | 20 | 8 | 6g |
| T1 | 8 | Virotes de Carbón | Carbón | Común | 20 | 10 | 8g |
| T2 | 20 | Flechas de Hierro | Hierro | Roble | 20 | 18 | 20g |
| T2 | 28 | Virotes de Plata | Plata | Nogal | 20 | 25 | 32g |
| T3 | 40 | Flechas de Tungsteno | Tungsteno | Caoba | 20 | 35 | 55g |
| T3 | 50 | Virotes de Oro | Oro | Ébano | 20 | 45 | 80g |
| T4 | 60 | Flechas de Platino | Platino | Pétreo | 20 | 65 | 140g |
| T4 | 70 | Virotes de Obsidiana | Obsidiana | Ancestral | 20 | 78 | 185g |
| T5 | 80 | Flechas de Cobalto | Cobalto | Cristalina | 20 | 110 | 280g |
| T5 | 90 | Virotes de Mithril | Mithril | Mágica | 20 | 130 | 380g |
| T6 | 100 | Flechas de Oricalco | Oricalco | Sagrada | 20 | 170 | 580g |
| T6 | 110 | Virotes de Adamantita | Adamantita | Primordial | 20 | 195 | 750g |
| T7 | 120 | Flechas de Titanio | Titanio | Dimensional | 20 | 280 | 1200g |
| T7 | 150 | Virotes de Draconita | Draconita | Divina | 20 | 330 | 1600g |

#### 🪄 VARITAS (2 lingotes + 3 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 8 | Varita de Cobre | Cobre | Blanda | 45 | 38g |
| T1 | 12 | Varita de Carbón | Carbón | Común | 58 | 52g |
| T2 | 22 | Varita de Hierro | Hierro | Roble | 95 | 130g |
| T2 | 30 | Varita de Plata | Plata | Nogal | 130 | 195g |
| T3 | 42 | Varita de Tungsteno | Tungsteno | Caoba | 190 | 340g |
| T3 | 52 | Varita de Oro | Oro | Ébano | 245 | 480g |
| T4 | 62 | Varita de Platino | Platino | Pétreo | 370 | 800g |
| T4 | 72 | Varita de Obsidiana | Obsidiana | Ancestral | 440 | 1050g |
| T5 | 82 | Varita de Cobalto | Cobalto | Cristalina | 590 | 1450g |
| T5 | 92 | Varita de Mithril | Mithril | Mágica | 710 | 1900g |
| T6 | 102 | Varita de Oricalco | Oricalco | Sagrada | 900 | 2750g |
| T6 | 112 | Varita de Adamantita | Adamantita | Primordial | 1030 | 3350g |
| T7 | 125 | Varita de Titanio | Titanio | Dimensional | 1380 | 5000g |
| T7 | 160 | Varita de Draconita | Draconita | Divina | 1610 | 6600g |

#### 🪄 BÁCULOS (5 lingotes + 5 madera)
| Tier | Nivel | Arma | Lingote | Madera | XP | Valor |
|------|-------|------|---------|--------|----|----|
| T1 | 15 | Báculo de Cobre | Cobre | Blanda | 75 | 65g |
| T1 | 20 | Báculo de Carbón | Carbón | Común | 95 | 90g |
| T2 | 28 | Báculo de Hierro | Hierro | Roble | 160 | 240g |
| T2 | 36 | Báculo de Plata | Plata | Nogal | 210 | 360g |
| T3 | 48 | Báculo de Tungsteno | Tungsteno | Caoba | 310 | 650g |
| T3 | 58 | Báculo de Oro | Oro | Ébano | 400 | 950g |
| T4 | 68 | Báculo de Platino | Platino | Pétreo | 620 | 1600g |
| T4 | 78 | Báculo de Obsidiana | Obsidiana | Ancestral | 730 | 2100g |
| T5 | 88 | Báculo de Cobalto | Cobalto | Cristalina | 980 | 2900g |
| T5 | 98 | Báculo de Mithril | Mithril | Mágica | 1180 | 3800g |
| T6 | 108 | Báculo de Oricalco | Oricalco | Sagrada | 1500 | 5500g |
| T6 | 118 | Báculo de Adamantita | Adamantita | Primordial | 1720 | 6700g |
| T7 | 135 | Báculo de Titanio | Titanio | Dimensional | 2300 | 10000g |
| T7 | 170 | Báculo de Draconita | Draconita | Divina | 2700 | 13000g |


---

### 5️⃣ PESCA (🎣) [MODIFICADO]
**Tipo**: Extracción de recursos  
**Duración**: ~35s por ciclo  
**Requisitos**: Nivel de pesca

#### Productos por Tier (Simplificado)

| Tier | Nivel   | Pez                  | Cantidad | XP  | Valor  |
|------|---------|----------------------|----------|-----|--------|
| T1   | 1-5     | Pez Común            | 3        | 10  | 5g     |
| T1   | 5-10    | Pez de Agua Fría     | 2        | 15  | 8g     |
| T2   | 20-25   | Pez de Agua Profunda | 1        | 35  | 20g    |
| T2   | 25-30   | Pez Plateado         | 1        | 45  | 35g    |
| T3   | 40-50   | Pez Dorado           | 1        | 70  | 60g    |
| T4   | 60-70   | Pez Mágico           | 1        | 120 | 150g   |
| T5   | 80-90   | Pez de Abismo        | 1        | 180 | 280g   |
| T6   | 100-110 | Pez Celestial        | 1        | 250 | 450g   |
| T7   | 120-200 | Pez Divino           | 1        | 350 | 700g   |

---

### 6️⃣ COCINA (🍳) [MODIFICADO]
**Tipo**: Crafting (Pez → Comida)  
**Duración**: ~30s por ciclo  
**Requisitos**: Nivel de cocina, peces

#### Productos por Tier

| Tier | Nivel | Ingrediente | Comida | Sanación | XP | Valor |
|------|-------|-------------|--------|----------|----|----|
| T1 | 1-5 | Pez Común | Estofado Simple | +20 | 15 | 10g |
| T1 | 5-10 | Pez de Agua Fría | Sopa Fría | +35 | 25 | 18g |
| T2 | 20-25 | Pez de Agua Profunda | Caldo de Profundidad | +60 | 45 | 40g |
| T2 | 25-30 | Pez Plateado | Filete Plateado | +80 | 55 | 60g |
| T3 | 40-50 | Pez Dorado | Banquete Dorado | +120 | 80 | 100g |
| T4 | 60-70 | Pez Mágico | Manjar Mágico | +180 | 140 | 200g |
| T5 | 80-90 | Pez de Abismo | Festín del Abismo | +260 | 210 | 350g |
| T6 | 100-110 | Pez Celestial | Banquete Celestial | +350 | 300 | 550g |
| T7 | 120-200 | Pez Divino | Néctar Divino | +500 | 400 | 800g |

---
### 7️⃣ AVENTURA (⚔️)
**Tipo**: Combat  
**Duración**: ~60s por ciclo  
**Requisitos**: Nivel de aventura

#### Productos por Tier
| Tier | Nivel | Recompensa | Cantidad | Rareza | XP | Valor |
|------|-------|-----------|----------|--------|----|----|
| T1 | 1-20 | Cristal Débil | 1-2 | 30% | 25 | 20g |
| T2 | 20-40 | Cristal Común | 1 | 50% | 60 | 50g |
| T3 | 40-60 | Cristal Refinado | 1 | 60% | 100 | 120g |
| T4 | 60-80 | Gema Preciosa | 1 | 70% | 160 | 250g |
| T5 | 80-100 | Gema Rara | 1 | 75% | 240 | 450g |
| T6 | 100-120 | Gema Legendaria | 1 | 80% | 320 | 750g |
| T7 | 120-200 | Gema Divina | 1 | 85% | 450 | 1200g |

Notas : 
Las gemas y cristales obtenidos pueden ser vendidos o utilizados para mejorar equipo. 
Cada tier ofrece mejores % de probabilidad en la mejora de equipo.

---

## 💾 Implementación Técnica

### Estructura JSON Propuesta
```javascript
export const SKILLS = {
    mineria: {
        name: "⛏️ Minería",
        tier: {
            T1: { minLevel: 0, maxLevel: 20 },
            T2: { minLevel: 20, maxLevel: 40 },
            // ...
        },
        products: {
            T1: [
                { name: "Carbón", level: 1, tier: "T1", quantity: 2, xp: 10 },
                { name: "Cobre", level: 5, tier: "T1", quantity: 2, xp: 15 },
            ],
            T2: [...]
        }
    }
}
```

---

**Documento creado**: 1 de febrero de 2026  
**Versión**: 1.0 - Diseño Inicial  
**Estado**: Listo para implementación
