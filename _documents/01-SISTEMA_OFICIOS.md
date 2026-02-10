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

## 📊 Sistema de Experiencia y Progresión de Niveles

### 🎯 Objetivo de Diseño
- **Evitar grind excesivo**: No se puede llegar al nivel máximo en un día
- **Curva desafiante**: Aumenta exponencialmente por cada tier
- **Tiempo realista**: ~30-40 días de juego activo para nivel 100
- **Misma curva para todos**: Todos los oficios comparten la misma progresión

### 📈 Tabla de Experiencia Necesaria por Nivel

| Nivel | Tier | XP Acumulada | XP Requerida | Tiempo Estimado* |
|-------|------|--------------|--------------|------------------|
| 1 | T1 | 0 | 100 | 10 ciclos |
| 2 | T1 | 100 | 150 | 15 ciclos |
| 3 | T1 | 250 | 200 | 20 ciclos |
| 4 | T1 | 450 | 250 | 25 ciclos |
| 5 | T1 | 700 | 300 | 30 ciclos |
| 6 | T1 | 1,000 | 350 | 35 ciclos |
| 7 | T1 | 1,350 | 400 | 40 ciclos |
| 8 | T1 | 1,750 | 450 | 45 ciclos |
| 9 | T1 | 2,200 | 500 | 50 ciclos |
| 10 | T1 | 2,700 | 550 | 55 ciclos |
| 11 | T1 | 3,250 | 600 | 60 ciclos |
| 12 | T1 | 3,850 | 700 | 70 ciclos |
| 13 | T1 | 4,550 | 800 | 80 ciclos |
| 14 | T1 | 5,350 | 900 | 90 ciclos |
| 15 | T1 | 6,250 | 1,000 | 100 ciclos |
| 16 | T1 | 7,250 | 1,100 | 110 ciclos |
| 17 | T1 | 8,350 | 1,200 | 120 ciclos |
| 18 | T1 | 9,550 | 1,300 | 130 ciclos |
| 19 | T1 | 10,850 | 1,400 | 140 ciclos |
| 20 | T1 | 12,250 | 1,500 | 150 ciclos |
| 21 | T2 | 13,750 | 1,600 | 160 ciclos |
| 22 | T2 | 15,350 | 1,750 | 175 ciclos |
| 23 | T2 | 17,100 | 1,900 | 190 ciclos |
| 24 | T2 | 19,000 | 2,100 | 210 ciclos |
| 25 | T2 | 21,100 | 2,300 | 230 ciclos |
| 26 | T2 | 23,400 | 2,500 | 250 ciclos |
| 27 | T2 | 25,900 | 2,700 | 270 ciclos |
| 28 | T2 | 28,600 | 2,900 | 290 ciclos |
| 29 | T2 | 31,500 | 3,100 | 310 ciclos |
| 30 | T2 | 34,600 | 3,300 | 330 ciclos |
| 31 | T2 | 37,900 | 3,500 | 350 ciclos |
| 32 | T2 | 41,400 | 3,700 | 370 ciclos |
| 33 | T2 | 45,100 | 3,900 | 390 ciclos |
| 34 | T2 | 49,000 | 4,100 | 410 ciclos |
| 35 | T2 | 53,100 | 4,300 | 430 ciclos |
| 36 | T2 | 57,400 | 4,500 | 450 ciclos |
| 37 | T2 | 61,900 | 4,700 | 470 ciclos |
| 38 | T2 | 66,600 | 4,900 | 490 ciclos |
| 39 | T2 | 71,500 | 5,100 | 510 ciclos |
| 40 | T2 | 76,600 | 5,300 | 530 ciclos |
| 41 | T3 | 81,900 | 5,500 | 550 ciclos |
| 42 | T3 | 87,400 | 5,800 | 580 ciclos |
| 43 | T3 | 93,200 | 6,100 | 610 ciclos |
| 44 | T3 | 99,300 | 6,400 | 640 ciclos |
| 45 | T3 | 105,700 | 6,700 | 670 ciclos |
| 46 | T3 | 112,400 | 7,000 | 700 ciclos |
| 47 | T3 | 119,400 | 7,300 | 730 ciclos |
| 48 | T3 | 126,700 | 7,600 | 760 ciclos |
| 49 | T3 | 134,300 | 7,900 | 790 ciclos |
| 50 | T3 | 142,200 | 8,200 | 820 ciclos |
| 51 | T3 | 150,400 | 8,500 | 850 ciclos |
| 52 | T3 | 158,900 | 8,800 | 880 ciclos |
| 53 | T3 | 167,700 | 9,100 | 910 ciclos |
| 54 | T3 | 176,800 | 9,400 | 940 ciclos |
| 55 | T3 | 186,200 | 9,700 | 970 ciclos |
| 56 | T3 | 195,900 | 10,000 | 1,000 ciclos |
| 57 | T3 | 205,900 | 10,300 | 1,030 ciclos |
| 58 | T3 | 216,200 | 10,600 | 1,060 ciclos |
| 59 | T3 | 226,800 | 10,900 | 1,090 ciclos |
| 60 | T3 | 237,700 | 11,200 | 1,120 ciclos |
| 61 | T4 | 248,900 | 11,500 | 1,150 ciclos |
| 62 | T4 | 260,400 | 11,900 | 1,190 ciclos |
| 63 | T4 | 272,300 | 12,300 | 1,230 ciclos |
| 64 | T4 | 284,600 | 12,700 | 1,270 ciclos |
| 65 | T4 | 297,300 | 13,100 | 1,310 ciclos |
| 66 | T4 | 310,400 | 13,500 | 1,350 ciclos |
| 67 | T4 | 323,900 | 13,900 | 1,390 ciclos |
| 68 | T4 | 337,800 | 14,300 | 1,430 ciclos |
| 69 | T4 | 352,100 | 14,700 | 1,470 ciclos |
| 70 | T4 | 366,800 | 15,100 | 1,510 ciclos |
| 71 | T4 | 381,900 | 15,500 | 1,550 ciclos |
| 72 | T4 | 397,400 | 15,900 | 1,590 ciclos |
| 73 | T4 | 413,300 | 16,300 | 1,630 ciclos |
| 74 | T4 | 429,600 | 16,700 | 1,670 ciclos |
| 75 | T4 | 446,300 | 17,100 | 1,710 ciclos |
| 76 | T4 | 463,400 | 17,500 | 1,750 ciclos |
| 77 | T4 | 480,900 | 17,900 | 1,790 ciclos |
| 78 | T4 | 498,800 | 18,300 | 1,830 ciclos |
| 79 | T4 | 517,100 | 18,700 | 1,870 ciclos |
| 80 | T4 | 535,800 | 19,100 | 1,910 ciclos |
| 81 | T5 | 554,900 | 19,500 | 1,950 ciclos |
| 82 | T5 | 574,400 | 20,000 | 2,000 ciclos |
| 83 | T5 | 594,400 | 20,500 | 2,050 ciclos |
| 84 | T5 | 614,900 | 21,000 | 2,100 ciclos |
| 85 | T5 | 635,900 | 21,500 | 2,150 ciclos |
| 86 | T5 | 657,400 | 22,000 | 2,200 ciclos |
| 87 | T5 | 679,400 | 22,500 | 2,250 ciclos |
| 88 | T5 | 701,900 | 23,000 | 2,300 ciclos |
| 89 | T5 | 724,900 | 23,500 | 2,350 ciclos |
| 90 | T5 | 748,400 | 24,000 | 2,400 ciclos |
| 91 | T5 | 772,400 | 24,500 | 2,450 ciclos |
| 92 | T5 | 796,900 | 25,000 | 2,500 ciclos |
| 93 | T5 | 821,900 | 25,500 | 2,550 ciclos |
| 94 | T5 | 847,400 | 26,000 | 2,600 ciclos |
| 95 | T5 | 873,400 | 26,500 | 2,650 ciclos |
| 96 | T5 | 899,900 | 27,000 | 2,700 ciclos |
| 97 | T5 | 926,900 | 27,500 | 2,750 ciclos |
| 98 | T5 | 954,400 | 28,000 | 2,800 ciclos |
| 99 | T5 | 982,400 | 28,500 | 2,850 ciclos |
| 100 | T5 | 1,010,900 | 29,000 | 2,900 ciclos |
| 101 | T6 | 1,039,900 | 29,500 | 2,950 ciclos |
| 102 | T6 | 1,069,400 | 30,000 | 3,000 ciclos |
| 103 | T6 | 1,099,400 | 30,500 | 3,050 ciclos |
| 104 | T6 | 1,129,900 | 31,000 | 3,100 ciclos |
| 105 | T6 | 1,160,900 | 31,500 | 3,150 ciclos |
| 106 | T6 | 1,192,400 | 32,000 | 3,200 ciclos |
| 107 | T6 | 1,224,400 | 32,500 | 3,250 ciclos |
| 108 | T6 | 1,256,900 | 33,000 | 3,300 ciclos |
| 109 | T6 | 1,289,900 | 33,500 | 3,350 ciclos |
| 110 | T6 | 1,323,400 | 34,000 | 3,400 ciclos |
| 111 | T6 | 1,357,400 | 34,500 | 3,450 ciclos |
| 112 | T6 | 1,391,900 | 35,000 | 3,500 ciclos |
| 113 | T6 | 1,426,900 | 35,500 | 3,550 ciclos |
| 114 | T6 | 1,462,400 | 36,000 | 3,600 ciclos |
| 115 | T6 | 1,498,400 | 36,500 | 3,650 ciclos |
| 116 | T6 | 1,534,900 | 37,000 | 3,700 ciclos |
| 117 | T6 | 1,571,900 | 37,500 | 3,750 ciclos |
| 118 | T6 | 1,609,400 | 38,000 | 3,800 ciclos |
| 119 | T6 | 1,647,400 | 38,500 | 3,850 ciclos |
| 120 | T6 | 1,685,900 | 39,000 | 3,900 ciclos |
| 121 | T7 | 1,724,900 | 39,500 | 3,950 ciclos |
| 122 | T7 | 1,764,400 | 40,000 | 4,000 ciclos |
| ... | T7 | ... | +500 por nivel | ... |
| 200 | T7 | 6,245,000+ | 80,000 | 8,000+ ciclos |

*Tiempo estimado en ciclos promedio (varía según oficio y productos)

### 📊 Análisis de Tiempo de Progresión

#### Tiempo Total Estimado por Tier (con promedio de 1 ciclo cada 45s)

| Tier | Niveles | Ciclos Totales | Horas | Días (8h/día) |
|------|---------|----------------|-------|---------------|
| T1 | 1-20 | ~1,500 | 18.75 | 2.3 |
| T2 | 21-40 | ~5,300 | 66.25 | 8.3 |
| T3 | 41-60 | ~9,500 | 118.75 | 14.8 |
| T4 | 61-80 | ~14,200 | 177.5 | 22.2 |
| T5 | 81-100 | ~19,000 | 237.5 | 29.7 |
| T6 | 101-120 | ~23,800 | 297.5 | 37.2 |
| **T7 (120)** | **Nivel Max** | **~40,000** | **500** | **62.5** |

**Tiempo total para Nivel 100**: ~48 días a 8 horas/día
**Tiempo total para Nivel 120**: ~104 días a 8 horas/día

### 🎮 Mecanismos de Progresión Rápida (Opcionales)

1. **Paralelismo**: Ejecutar múltiples oficios simultáneamente
   - Combina Minería (40s) + Pesca (35s) = +75 XP en paralelo
   
2. **Productos de Alto XP**: 
   - Minería T7 da 350+ XP por ciclo
   - Herrería T7 da 2,560 XP por ciclo (MÁS RÁPIDO)
   
3. **Automatización**: Los ciclos continuos mientras el juego esté activo

### ⚡ Fórmula de Experiencia

```
XP_siguiente_nivel = 100 + (nivel_actual × 50) + (tier × 300)

Ejemplos:
- Nivel 1: 100 XP
- Nivel 5: 100 + (5 × 50) = 350 XP
- Nivel 20: 100 + (20 × 50) + (T1 × 300) = 1,500 XP
- Nivel 60: 100 + (60 × 50) + (T3 × 300) = 11,200 XP
- Nivel 100: 100 + (100 × 50) + (T5 × 300) = 29,000 XP
```

### 🏆 Rewards y Hitos de Progresión

| Hito | Nivel | Recompensa | Descripción |
|------|-------|-----------|-------------|
| Iniciado | 10 | Desbloquea productos T1 mejorados | Primera recompensa |
| Aprendiz | 20 | Acceso a T2 completo | Transición de tier |
| Oficial | 40 | Desbloquea mejor equipo T2 | Progreso medio |
| Experto | 60 | Acceso a T4 y recompensas | Zona media-alta |
| Maestro | 80 | Desbloquea armas legendarias | Top tier |
| Leyenda | 100 | Acceso a contenido T6 | Casi máximo |
| Divino | 120 | Máxima maestría del oficio | Nivel cap |

---

**Documento creado**: 1 de febrero de 2026  
**Versión**: 1.0 - Diseño Inicial  
**Estado**: Listo para implementación
