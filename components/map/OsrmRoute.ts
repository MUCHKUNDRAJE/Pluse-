import { fetchOsrmRoute, RouteSegment } from '@/lib/osrm';

export interface RouteOptions {
  ambulancePos: [number, number];
  targetPos: [number, number];
}

export async function getCalculatedRoute(options: RouteOptions): Promise<RouteSegment> {
  const { ambulancePos, targetPos } = options;
  return await fetchOsrmRoute(
    ambulancePos[0],
    ambulancePos[1],
    targetPos[0],
    targetPos[1]
  );
}
