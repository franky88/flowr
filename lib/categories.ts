export type CategorySelectItem = { id: string; name: string; level: number };

export type CategoryNode = {
  id: string;
  name: string;
  parent: string | null;
  children?: CategoryNode[];
};

export function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const map = new Map<string, T>();
  for (const it of items) map.set(it.id, it);
  return [...map.values()];
}

export function flattenCategoryTree(
  roots: CategoryNode[],
  level = 0,
): Array<{ id: string; name: string; level: number }> {
  const out: Array<{ id: string; name: string; level: number }> = [];

  const walk = (node: CategoryNode, depth: number) => {
    out.push({ id: node.id, name: node.name, level: depth });
    for (const child of node.children ?? []) walk(child, depth + 1);
  };

  for (const r of roots) walk(r, level);
  return out;
}
