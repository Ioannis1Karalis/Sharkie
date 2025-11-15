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
