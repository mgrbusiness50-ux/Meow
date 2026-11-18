import { INITIAL_EGYPT_GEO_NODES, GeoLevel, GeoNode } from './egyptGeoData.ts';

export type { GeoLevel, GeoNode };

export function normalizeArabic(text: string): string {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}

const nodeById = new Map<string, GeoNode>();
const childrenByParentId = new Map<string, GeoNode[]>();

function rebuildIndexes(nodes: GeoNode[]): void {
  nodes.forEach((node) => {
    nodeById.set(node.id, node);
  });
  childrenByParentId.clear();
  for (const node of nodeById.values()) {
    const parentKey = node.parentId ?? '__root__';
    const existing = childrenByParentId.get(parentKey);
    if (existing) {
      existing.push(node);
    } else {
      childrenByParentId.set(parentKey, [node]);
    }
  }
}

rebuildIndexes(INITIAL_EGYPT_GEO_NODES);

/**
 * Extensible registry hook: allows appending additional Egyptian administrative nodes
 * or villages/hamlets in the future without changing filter or UI logic.
 */
export function registerGeoNodes(nodes: GeoNode[]): void {
  if (!Array.isArray(nodes) || nodes.length === 0) return;
  rebuildIndexes(nodes);
}

export function getGeoNodeById(id?: string): GeoNode | undefined {
  if (!id) return undefined;
  return nodeById.get(id);
}

export function getCountryNode(): GeoNode {
  return (
    nodeById.get('eg') || {
      id: 'eg',
      name: 'مصر',
      level: 'country',
      parentId: null,
      governorateId: '',
      lat: 26.8206,
      lng: 30.8025,
    }
  );
}

export function getGovernorates(): GeoNode[] {
  return [...(childrenByParentId.get('eg') || [])].filter((n) => n.level === 'governorate');
}

function findNodeMatch(candidates: GeoNode[], query?: string): GeoNode | undefined {
  if (!query) return undefined;
  const byId = nodeById.get(query);
  if (byId && candidates.some((c) => c.id === byId.id)) {
    return byId;
  }
  const normQuery = normalizeArabic(query);
  if (!normQuery) return undefined;

  const exact = candidates.find(
    (c) =>
      normalizeArabic(c.name) === normQuery ||
      (c.aliases || []).some((a) => normalizeArabic(a) === normQuery)
  );
  if (exact) return exact;

  return candidates.find(
    (c) =>
      normalizeArabic(c.name).includes(normQuery) ||
      normQuery.includes(normalizeArabic(c.name)) ||
      (c.aliases || []).some((a) => {
        const na = normalizeArabic(a);
        return na.includes(normQuery) || normQuery.includes(na);
      })
  );
}

export function getMarkazesForGovernorate(govIdOrName?: string): GeoNode[] {
  if (!govIdOrName) return [];
  const govNode =
    getGeoNodeById(govIdOrName) || findNodeMatch(getGovernorates(), govIdOrName);
  if (!govNode) return [];
  return [...(childrenByParentId.get(govNode.id) || [])].filter((n) => n.level === 'markaz');
}

export function getCitiesForMarkaz(markazIdOrName?: string, governorateId?: string): GeoNode[] {
  if (!markazIdOrName) return [];
  let markazNode = getGeoNodeById(markazIdOrName);
  if (!markazNode || markazNode.level !== 'markaz') {
    const scope = governorateId
      ? getMarkazesForGovernorate(governorateId)
      : Array.from(nodeById.values()).filter((n) => n.level === 'markaz');
    markazNode = findNodeMatch(scope, markazIdOrName);
  }
  if (!markazNode) return [];
  return [...(childrenByParentId.get(markazNode.id) || [])].filter((n) => n.level === 'city');
}

export function getVillagesForCity(cityIdOrName?: string, markazId?: string): GeoNode[] {
  if (!cityIdOrName) return [];
  let cityNode = getGeoNodeById(cityIdOrName);
  if (!cityNode || cityNode.level !== 'city') {
    const scope = markazId
      ? getCitiesForMarkaz(markazId)
      : Array.from(nodeById.values()).filter((n) => n.level === 'city');
    cityNode = findNodeMatch(scope, cityIdOrName);
  }
  if (!cityNode) return [];
  return [...(childrenByParentId.get(cityNode.id) || [])].filter((n) => n.level === 'village');
}

export function getAllCitiesForGovernorateNodes(govIdOrName?: string): GeoNode[] {
  const markazes = getMarkazesForGovernorate(govIdOrName);
  const results: GeoNode[] = [];
  for (const m of markazes) {
    results.push(...getCitiesForMarkaz(m.id));
  }
  return results;
}

export interface ResolvedLocationLineage {
  country: GeoNode;
  governorate?: GeoNode;
  markaz?: GeoNode;
  city?: GeoNode;
  village?: GeoNode;
  deepest?: GeoNode;
}

export function getGeoLineage(nodeId?: string): ResolvedLocationLineage {
  const country = getCountryNode();
  const node = getGeoNodeById(nodeId);
  if (!node) return { country };

  let governorate: GeoNode | undefined;
  let markaz: GeoNode | undefined;
  let city: GeoNode | undefined;
  let village: GeoNode | undefined;

  if (node.level === 'village') {
    village = node;
    city = getGeoNodeById(node.cityId || node.parentId || undefined);
    markaz = getGeoNodeById(node.markazId || city?.parentId || undefined);
    governorate = getGeoNodeById(node.governorateId);
  } else if (node.level === 'city') {
    city = node;
    markaz = getGeoNodeById(node.markazId || node.parentId || undefined);
    governorate = getGeoNodeById(node.governorateId);
  } else if (node.level === 'markaz') {
    markaz = node;
    governorate = getGeoNodeById(node.governorateId);
  } else if (node.level === 'governorate') {
    governorate = node;
  }

  return {
    country,
    governorate,
    markaz,
    city,
    village,
    deepest: village || city || markaz || governorate || country,
  };
}

export interface LocationLookupInput {
  locationId?: string;
  governorateId?: string;
  markazId?: string;
  cityId?: string;
  villageId?: string;
  governorate?: string;
  markaz?: string;
  city?: string;
  area?: string;
  village?: string;
}

export function resolveLocationLineage(input: LocationLookupInput): ResolvedLocationLineage {
  const country = getCountryNode();

  // 1. Prefer deterministic stable node IDs (zero collision between same-named settlements)
  const explicitId = input.villageId || input.cityId || input.markazId || input.governorateId || input.locationId;
  if (explicitId && nodeById.has(explicitId)) {
    const lineage = getGeoLineage(explicitId);
    // Allow narrowing further if a child text hint was provided without child ID
    if (lineage.city && !lineage.village && (input.village || input.area)) {
      const matchedVillage = findNodeMatch(
        getVillagesForCity(lineage.city.id),
        input.village || input.area
      );
      if (matchedVillage) {
        return getGeoLineage(matchedVillage.id);
      }
    }
    return lineage;
  }

  // 2. Hierarchical text resolution scoped strictly parent -> child
  const govs = getGovernorates();
  let govNode =
    findNodeMatch(govs, input.governorate) ||
    findNodeMatch(govs, input.city) ||
    findNodeMatch(govs, input.area);

  let markazNode: GeoNode | undefined;
  let cityNode: GeoNode | undefined;
  let villageNode: GeoNode | undefined;

  if (govNode) {
    const govMarkazes = getMarkazesForGovernorate(govNode.id);
    markazNode = findNodeMatch(govMarkazes, input.markaz);

    if (markazNode) {
      const mkzCities = getCitiesForMarkaz(markazNode.id);
      cityNode =
        findNodeMatch(mkzCities, input.city) ||
        findNodeMatch(mkzCities, input.area);
    }

    if (!cityNode) {
      const allGovCities = getAllCitiesForGovernorateNodes(govNode.id);
      cityNode =
        findNodeMatch(allGovCities, input.area) ||
        findNodeMatch(allGovCities, input.city);
      if (cityNode && !markazNode) {
        markazNode = getGeoNodeById(cityNode.markazId);
      }
    }

    if (cityNode) {
      const cityVillages = getVillagesForCity(cityNode.id);
      villageNode =
        findNodeMatch(cityVillages, input.village) ||
        findNodeMatch(cityVillages, input.area);
    } else {
      // Search villages within governorate
      const allGovVillages = Array.from(nodeById.values()).filter(
        (n) => n.level === 'village' && n.governorateId === govNode!.id
      );
      villageNode =
        findNodeMatch(allGovVillages, input.village) ||
        findNodeMatch(allGovVillages, input.area);
      if (villageNode) {
        cityNode = getGeoNodeById(villageNode.cityId);
        markazNode = getGeoNodeById(villageNode.markazId);
      }
    }
  } else {
    // No governorate hint yet: resolve deepest unique text match from cities or villages
    const allVillages = Array.from(nodeById.values()).filter((n) => n.level === 'village');
    const allCities = Array.from(nodeById.values()).filter((n) => n.level === 'city');

    villageNode =
      findNodeMatch(allVillages, input.village) ||
      findNodeMatch(allVillages, input.area);
    if (villageNode) {
      return getGeoLineage(villageNode.id);
    }

    cityNode =
      findNodeMatch(allCities, input.area) ||
      findNodeMatch(allCities, input.city);
    if (cityNode) {
      return getGeoLineage(cityNode.id);
    }
  }

  return {
    country,
    governorate: govNode,
    markaz: markazNode,
    city: cityNode,
    village: villageNode,
    deepest: villageNode || cityNode || markazNode || govNode || country,
  };
}

export function resolveLocationCoordinates(
  input: LocationLookupInput & { lat?: number; lng?: number }
): { lat: number; lng: number } | null {
  if (
    typeof input.lat === 'number' &&
    typeof input.lng === 'number' &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lng)
  ) {
    return { lat: input.lat, lng: input.lng };
  }
  const lineage = resolveLocationLineage(input);
  const node = lineage.village || lineage.city || lineage.markaz || lineage.governorate;
  if (node) {
    return { lat: node.lat, lng: node.lng };
  }
  return null;
}

export function calculateDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(R * c * 10) / 10;
}

// ============================================================================
// Backwards-Compatible Exports Derived Dynamically from Hierarchy Registry
// ============================================================================

export const EGYPT_GOVERNORATE_NAMES: string[] = getGovernorates().map((g) => g.name);

export const EGYPT_GOVERNORATES_CITIES: Record<string, string[]> = Object.fromEntries(
  getGovernorates().map((gov) => {
    const cities = getAllCitiesForGovernorateNodes(gov.id);
    const names = new Set<string>();
    cities.forEach((c) => {
      names.add(c.name);
      getVillagesForCity(c.id).forEach((v) => names.add(v.name));
    });
    return [gov.name, Array.from(names)];
  })
);

export function getCitiesForGovernorate(governorate: string): string[] {
  const cities = getAllCitiesForGovernorateNodes(governorate);
  const names = new Set<string>();
  cities.forEach((c) => {
    names.add(c.name);
    getVillagesForCity(c.id).forEach((v) => names.add(v.name));
  });
  return Array.from(names);
}

export function findGovernorateByCity(cityName: string): string | undefined {
  const lineage = resolveLocationLineage({ city: cityName, area: cityName });
  return lineage.governorate?.name;
}

export const CAT_BREEDS: string[] = [
  'بلدي (ماو مصري)',
  'شيرازي (فارسي)',
  'سيامي',
  'هيمالايا',
  'سكوتش فولد',
  'بريطاني قصير الشعر',
  'راغدول',
  'مين كون',
  'بنغالي',
  'سفينكس (الفرعوني)',
  'حبشي',
  'روسي أزرق',
  'تركي أنغورا',
  'بيرمان',
  'أمريكي قصير الشعر',
  'نرويجي غابات',
  'كورنيش ريكس',
  'ديفون ريكس',
  'بومباي',
  'صومالي',
  'تونكينيز',
  'مانكس',
  'سيبيري',
  'بورمي',
  'شرقي قصير الشعر',
  'هجين / مختلط',
  'سلالة أخرى',
];

export const DOG_BREEDS: string[] = [
  'بلدي',
  'جيرمن شيبرد (الراعي الألماني)',
  'غولدن ريتريفر',
  'لابرادور ريتريفر',
  'هاسكي سيبيري',
  'روتوايلر',
  'بيت بول',
  'دوبرمان',
  'بولدوغ فرنسي',
  'كان كورسو',
  'شيواوا',
  'مالينوا بلجيكي',
  'بوكسر',
  'شيتزو',
  'يوركشاير ترير',
  'بودل',
  'داشهوند',
  'بيغل',
  'سامويد',
  'جريت دان',
  'سانت برنارد',
  'شار بي',
  'بوسطن ترير',
  'أكيتا',
  'هجين / مختلط',
  'سلالة أخرى',
];
