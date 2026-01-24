export type CategoryKey = "food" | "drink" | "coffee" | "outdoors";

export const CATEGORY_OPTIONS: { id: CategoryKey; label: string }[] = [
  { id: "food", label: "Comida" },
  { id: "drink", label: "Bebida" },
  { id: "coffee", label: "Café" },
  { id: "outdoors", label: "Aire Libre" },
];

export const GOOGLE_TYPE_MAPPING: Record<CategoryKey, string[]> = {
  food: ["restaurant", "bakery", "meal_takeaway"],

  drink: ["bar", "night_club", "casino"],

  coffee: ["cafe", "coffee_shop"],

  outdoors: ["park", "tourist_attraction", "amusement_park", "aquarium", "zoo"],
};
