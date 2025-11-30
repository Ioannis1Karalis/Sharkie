/**
 * Creates and returns Level 1.
 *
 * Spawns:
 * - Enemies: multiple PufferFish (red/green), several JellyFish, and one Endboss.
 * - Background tiles: repeated water/floor/light layers at 880px intervals.
 * - Collectables: coins (arc & line placements) and poison bottles (left/right variants).
 *
 * All coordinates are world-space pixels. The order of arrays is significant for
 * rendering (background first, then collectables).
 *
 * @returns {Level} Fully configured level instance.
 */
function createLevel1() {
  return new Level(
    [
      new PufferFishRed(),
      new PufferFishGreen(),
      new PufferFishRed(550, 150),
      new PufferFishGreen(2150, 250),
      new PufferFishRed(1750, 200),
      new PufferFishRed(2850, 100),
      new PufferFishGreen(2850, 200),
      new PufferFishRed(2850, 300),
      new JellyFish(850, 200),
      new JellyFish(2100, 200),
      new JellyFish(2900, 200),
      new JellyFish(3400, 200),
      new JellyFish(3900, 200),
      new Endboss(),
    ],
    [
      new BackgroundObject("img/4.Background/Layers/5. Water/D2.png", -880, 0),
      new BackgroundObject("img/4.Background/Layers/4.Fondo 2/D2.png", -880, 0),
      new BackgroundObject("img/4.Background/Layers/3.Fondo 1/D2.png", -880, 0),
      new BackgroundObject("img/4.Background/Layers/2. Floor/D2.png", -880, 0),
      new BackgroundObject("img/4.Background/Layers/1. Light/2.png", -880, 0),

      new BackgroundObject("img/4.Background/Layers/5. Water/D1.png", 0, 0),
      new BackgroundObject("img/4.Background/Layers/4.Fondo 2/D1.png", 0, 0),
      new BackgroundObject("img/4.Background/Layers/3.Fondo 1/D1.png", 0, 0),
      new BackgroundObject("img/4.Background/Layers/2. Floor/D1.png", 0, 0),
      new BackgroundObject("img/4.Background/Layers/1. Light/1.png", 0, 0),

      new BackgroundObject("img/4.Background/Layers/5. Water/D2.png", 880, 0),
      new BackgroundObject("img/4.Background/Layers/4.Fondo 2/D2.png", 880, 0),
      new BackgroundObject("img/4.Background/Layers/3.Fondo 1/D2.png", 880, 0),
      new BackgroundObject("img/4.Background/Layers/2. Floor/D2.png", 880, 0),
      new BackgroundObject("img/4.Background/Layers/1. Light/2.png", 880, 0),

      new BackgroundObject("img/4.Background/Layers/5. Water/D1.png", 880 * 2,0),
      new BackgroundObject("img/4.Background/Layers/4.Fondo 2/D1.png", 880 * 2,0),
      new BackgroundObject("img/4.Background/Layers/3.Fondo 1/D1.png", 880 * 2,0),
      new BackgroundObject("img/4.Background/Layers/2. Floor/D1.png", 880 * 2,0),
      new BackgroundObject("img/4.Background/Layers/1. Light/1.png", 880 * 2,0),

      new BackgroundObject("img/4.Background/Layers/5. Water/D2.png",880 * 3,0),
      new BackgroundObject("img/4.Background/Layers/4.Fondo 2/D2.png", 880 * 3,0),
      new BackgroundObject("img/4.Background/Layers/3.Fondo 1/D2.png", 880 * 3,0),
      new BackgroundObject("img/4.Background/Layers/2. Floor/D2.png", 880 * 3,0),
      new BackgroundObject("img/4.Background/Layers/1. Light/2.png", 880 * 3,0),

      new BackgroundObject("img/4.Background/Layers/5. Water/D1.png", 880 * 4,0),
      new BackgroundObject("img/4.Background/Layers/4.Fondo 2/D1.png", 880 * 4,0),
      new BackgroundObject("img/4.Background/Layers/3.Fondo 1/D1.png", 880 * 4,0),
      new BackgroundObject("img/4.Background/Layers/2. Floor/D1.png", 880 * 4,0),
      new BackgroundObject("img/4.Background/Layers/1. Light/1.png", 880 * 4,0),

      new BackgroundObject("img/4.Background/Layers/5. Water/D2.png", 880 * 5,0),
      new BackgroundObject("img/4.Background/Layers/4.Fondo 2/D2.png", 880 * 5,0),
      new BackgroundObject("img/4.Background/Layers/3.Fondo 1/D2.png", 880 * 5,0),
      new BackgroundObject("img/4.Background/Layers/2. Floor/D2.png", 880 * 5,0),
      new BackgroundObject("img/4.Background/Layers/1. Light/2.png", 880 * 5,0),
    ],
    [
      Collectable.coin(600, 200),
      Collectable.coin(675, 170),
      Collectable.coin(750, 150),
      Collectable.coin(825, 170),
      Collectable.coin(900, 200),

      Collectable.coin(2350, 310),
      Collectable.coin(2425, 20),
      Collectable.coin(2500, 20),
      Collectable.coin(2575, 20),
      Collectable.coin(2650, 310),

      Collectable.poisonLeft(225, 390),
      Collectable.poisonLeft(730, 400),
      Collectable.poisonRight(1930, 390),
      Collectable.poisonLeft(2530, 390),
      Collectable.poisonRight(2900, 390),
      Collectable.poisonRight(3750, 390),
    ]
  );
}