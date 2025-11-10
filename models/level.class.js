class Level {
    enemies;
    backgroundObjects;
    collectableItems;           // ← konsistenter Name
    level_end_x = 4300;
    level_top_y = -130;
    level_bottom_y = 250;
  
    constructor(enemies, backgroundObjects, collectableItems = []) {
      this.enemies = enemies;
      this.backgroundObjects = backgroundObjects;
      this.collectableItems = collectableItems;  // ← richtiger Parametername
    }
  }