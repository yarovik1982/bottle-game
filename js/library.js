export function isPointInRect(point, rect) {
  return point.x > rect.x &&
      point.x < rect.x + rect.width &&
      point.y > rect.y &&
      point.y < rect.y + rect.height
}

export function coinFlip() {
  return Math.random() - 0.5
}

export function clamp(min, val, max) {
  return Math.min(Math.max(val, min), max) || 0
}
