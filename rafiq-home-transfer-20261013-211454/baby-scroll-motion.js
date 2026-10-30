// Distance-driven pose: no clock advance or inertia after scrolling stops.
export function scrollPose(distance, range, reduced = false) {
  if (reduced) return {blend: 0, time: 0};
  const progress = Math.min(1, Math.max(0, distance / Math.max(1, range)));
  const t = Math.min(1, progress / .22);
  return {blend: t*t*(3-2*t), time: Math.max(0, progress-.22)*Math.max(1, range)/280};
}
