import { ensureUserPetProfile } from "./grant-points";
import { petSpecies, petSpeciesBySlug, petTierBySlug, petTiers, type PetGrowthStage, type PetSpeciesDefinition, type PetTierDefinition } from "./catalog";
import { getPointsRemaining, getStarFill, PET_TIER_MAX_POINTS } from "./scoring";

export type CurrentUserPetCardData = {
  tierSlug: PetTierDefinition["slug"];
  tierName: string;
  tierFlavor: string;
  speciesSlug: string;
  speciesName: string;
  speciesTitle: string;
  family: PetSpeciesDefinition["family"];
  motionPreset: PetSpeciesDefinition["motionPreset"];
  visualStyle: string;
  traitKeywords: string[];
  colors: PetSpeciesDefinition["colors"];
  growthStageConfig: PetSpeciesDefinition["growthStageConfig"];
  currentPoints: number;
  totalRequiredPoints: number;
  stage: PetGrowthStage;
  starFill: number[];
  nextTierName: string | null;
  pointsRemaining: number;
  isMaxTier: boolean;
};

export type PetDexTierData = {
  slug: PetTierDefinition["slug"];
  name: string;
  flavor: string;
  unlocked: boolean;
  current: boolean;
  species: Array<{
    slug: string;
    name: string;
    title: string;
    unlocked: boolean;
    isCurrent: boolean;
    colors: PetSpeciesDefinition["colors"];
    visualStyle: string;
  }>;
};

export type PetDexPageData = {
  currentPet: CurrentUserPetCardData;
  tiers: PetDexTierData[];
};

function mapProfileToCardData(profile: Awaited<ReturnType<typeof ensureUserPetProfile>>): CurrentUserPetCardData {
  const tier = petTierBySlug[profile.currentTier.slug];
  const species = petSpeciesBySlug[profile.currentSpecies.slug];
  const currentOrder = tier.sortOrder;
  const nextTier = petTiers.find((item) => item.sortOrder === currentOrder + 1) ?? null;

  return {
    tierSlug: tier.slug,
    tierName: tier.name,
    tierFlavor: tier.flavor,
    speciesSlug: species.slug,
    speciesName: species.name,
    speciesTitle: species.title,
    family: species.family,
    motionPreset: species.motionPreset,
    visualStyle: species.visualStyle,
    traitKeywords: species.traitKeywords,
    colors: species.colors,
    growthStageConfig: species.growthStageConfig,
    currentPoints: profile.currentPoints,
    totalRequiredPoints: PET_TIER_MAX_POINTS,
    stage: profile.currentStage as PetGrowthStage,
    starFill: getStarFill(profile.currentPoints),
    nextTierName: nextTier?.name ?? null,
    pointsRemaining: getPointsRemaining(profile.currentPoints),
    isMaxTier: nextTier === null,
  };
}

export async function getCurrentUserPetCardData(userId: string) {
  const profile = await ensureUserPetProfile(userId);
  return mapProfileToCardData(profile);
}

export async function getPetDexPageData(userId: string): Promise<PetDexPageData> {
  const profile = await ensureUserPetProfile(userId);
  const currentPet = mapProfileToCardData(profile);
  const currentTierOrder = petTierBySlug[currentPet.tierSlug].sortOrder;

  return {
    currentPet,
    tiers: petTiers.map((tier) => ({
      slug: tier.slug,
      name: tier.name,
      flavor: tier.flavor,
      unlocked: tier.sortOrder <= currentTierOrder,
      current: tier.slug === currentPet.tierSlug,
      species: petSpecies
        .filter((item) => item.tierSlug === tier.slug)
        .map((item) => ({
          slug: item.slug,
          name: item.name,
          title: item.title,
          unlocked: tier.sortOrder <= currentTierOrder,
          isCurrent: item.slug === currentPet.speciesSlug,
          colors: item.colors,
          visualStyle: item.visualStyle,
        })),
    })),
  };
}
