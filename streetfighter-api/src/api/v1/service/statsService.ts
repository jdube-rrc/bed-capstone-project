import { dataStore } from '../../../utils/dataLoader';

function parseDamage(damage?: string): number[] {
  if (!damage || typeof damage !== 'string') return [];
  // Match numbers like 400, 1,200 etc.
  const matches = damage.match(/\d{1,3}(?:,\d{3})*/g);
  if (!matches) return [];
  return matches.map((m) => Number(m.replace(/,/g, ''))).filter((n) => !Number.isNaN(n));
}

export function topByMaxMoveDamage(limit = 10) {
  const list = dataStore.getAll();
  const results = list.map((c) => {
    let max = 0;
    const topMoves: Array<{ name: string; damage: number }> = [];
    if (Array.isArray(c.categories)) {
      c.categories.forEach((cat: any) => {
        if (Array.isArray(cat.moves)) {
          cat.moves.forEach((mv: any) => {
            const nums = parseDamage(mv.damage);
            const moveMax = nums.length ? Math.max(...nums) : 0;
            if (moveMax > max) {
              max = moveMax;
              topMoves.length = 0;
              topMoves.push({ name: mv.name || 'unknown', damage: moveMax });
            } else if (moveMax === max && moveMax > 0) {
              topMoves.push({ name: mv.name || 'unknown', damage: moveMax });
            }
          });
        }
      });
    }

    return { character: c.character, maxDamage: max, topMoves };
  });

  results.sort((a, b) => b.maxDamage - a.maxDamage);
  return results.slice(0, limit);
}

export function topByAverageMoveDamage(limit = 10) {
  const list = dataStore.getAll();
  const results = list.map((c) => {
    let sum = 0;
    let count = 0;
    if (Array.isArray(c.categories)) {
      c.categories.forEach((cat: any) => {
        if (Array.isArray(cat.moves)) {
          cat.moves.forEach((mv: any) => {
            const nums = parseDamage(mv.damage);
            if (nums.length) {
              // treat move damage as the average of listed numbers for that move
              const avg = nums.reduce((s, n) => s + n, 0) / nums.length;
              sum += avg;
              count += 1;
            }
          });
        }
      });
    }
    const avgDamage = count ? sum / count : 0;
    return { character: c.character, avgDamage: Math.round(avgDamage), movesCount: count };
  });

  results.sort((a, b) => b.avgDamage - a.avgDamage);
  return results.slice(0, limit);
}
