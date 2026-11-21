import { Pet } from '../types.ts';
import { resolveLocationLineage } from '../data/egyptLocations.ts';

export function formatPetSpecies(species: Pet['species']): string {
  return species === 'dog' ? 'كلب 🐶' : 'قطة 🐱';
}

export function formatPetSpeciesShort(species: Pet['species']): string {
  return species === 'dog' ? 'كلب' : 'قطة';
}

export function formatPetAgeFull(ageYears: number, ageMonths: number): string {
  const y = Number.isFinite(ageYears) && ageYears > 0 ? ageYears : 0;
  const m = Number.isFinite(ageMonths) && ageMonths > 0 ? ageMonths : 0;

  if (y > 0 && m > 0) {
    return `${y} سنة و ${m} شهر`;
  }
  if (y > 0) {
    return `${y} سنة`;
  }
  if (m > 0) {
    return `${m} شهر`;
  }
  return '';
}

export function formatVaccinationStatus(status: Pet['vaccinationStatus']): string {
  if (status === 'fully_vaccinated') return 'مُطعم بالكامل';
  if (status === 'partially_vaccinated') return 'مطعم جزئياً';
  return 'غير مُطعم';
}

export function formatPetLocation(pet: Partial<Pet>): string {
  const lineage = resolveLocationLineage(pet);
  const parts: string[] = [];
  const pushUnique = (val?: string) => {
    const clean = (val || '').trim();
    if (!clean) return;
    if (!parts.includes(clean)) parts.push(clean);
  };
  pushUnique(lineage.village?.name || pet.village || pet.area);
  pushUnique(lineage.city?.name || pet.city);
  pushUnique(lineage.markaz?.name || pet.markaz);
  pushUnique(lineage.governorate?.name || pet.governorate);
  return parts.join('، ');
}
