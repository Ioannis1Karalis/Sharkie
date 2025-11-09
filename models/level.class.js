class Level {
    enemies;
    backgroundObjects;
    coins;
    level_end_x = 720 * 5;
    level_top_y = -130;
    level_bottom_y = 250;
  
    constructor(enemies, backgroundObjects, coins) {
      this.enemies = enemies;
      this.backgroundObjects = backgroundObjects;
      this.coins = coins || [];   // <<<< WICHTIG
    }
}