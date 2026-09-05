/** Пробельный текстовый узел: переносы строк и табы из шаблонов WP. */
export const isWhitespaceText = (node: Node): boolean =>
    node.nodeType === Node.TEXT_NODE && !node.textContent?.trim();
