/**
 * Represents a single game level configuration: enemies, background tiles,
 * and collectible items, plus movement boundaries used by the world.
 *
 * @property {MovableObject[]} enemies
 *   Enemy instances placed in the level (e.g., JellyFish, PufferFish*, Endboss).
 * @property {BackgroundObject[]} backgroundObjects
 *   Ordered background layers/tiles drawn behind gameplay.
 * @property {Collectable[]} collectableItems
 *   Pickups available in this level (coins, poison bottles, etc.).
 * @property {number} level_end_x
 *   Right-most world coordinate where the level ends (camera clamp/logic).
 * @property {number} level_top_y
 *   Upper vertical bound (negative values are above origin).
 * @property {number} level_bottom_y
 *   Lower vertical bound for player/enemy movement.
 *
 * @constructor
 * @param {MovableObject[]} enemies
 * @param {BackgroundObject[]} backgroundObjects
 * @param {Collectable[]} [collectableItems=[]]
 */
class Level {
  enemies;
  backgroundObjects;
  collectableItems;
  level_end_x = 4300;
  level_top_y = -130;
  level_bottom_y = 270;

  constructor(enemies, backgroundObjects, collectableItems = []) {
    this.enemies = enemies;
    this.backgroundObjects = backgroundObjects;
    this.collectableItems = collectableItems;
  }
}
