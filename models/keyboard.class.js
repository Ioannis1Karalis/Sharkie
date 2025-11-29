/**
 * Tracks the current keyboard input state for gameplay.
 * These flags are toggled by global keydown/keyup listeners and
 * are read by the game loop to control movement and actions.
 *
 * @extends MovableObject
 * @property {boolean} LEFT  - Move left input.
 * @property {boolean} RIGHT - Move right input.
 * @property {boolean} UP    - Move up input.
 * @property {boolean} DOWN  - Move down input.
 * @property {boolean} SPACE - Primary action (e.g., poison bubble).
 * @property {boolean} D     - Secondary action (e.g., normal bubble).
 */
class Keyboard extends MovableObject {
  /** @type {boolean} */ LEFT = false;
  /** @type {boolean} */ RIGHT = false;
  /** @type {boolean} */ UP = false;
  /** @type {boolean} */ DOWN = false;
  /** @type {boolean} */ SPACE = false;
  /** @type {boolean} */ D = false;
}
