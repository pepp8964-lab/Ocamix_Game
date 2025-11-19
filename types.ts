
export type IngredientType = 'meat' | 'veg' | 'fruit' | 'spice' | 'liquid' | 'grain' | 'weird' | 'magic' | 'cosmic' | 'tech' | 'office' | 'dungeon';
export type ProcessingState = 'raw' | 'chopped' | 'boiled' | 'fried' | 'baked' | 'seasoned' | 'cracked' | 'blended' | 'magic_infused' | 'burnt' | 'waste' | 'frozen' | 'smashed' | 'grated' | 'radiated';

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  type: IngredientType;
  price: number;
  tier: 1 | 2 | 3 | 4 | 5; // 1=Common, 5=Legendary
  desc: string;
  baseId?: string; // If this is a processed version of another item
  state: ProcessingState;
  isCustom?: boolean; // Flag for user-created items
}

export interface ItemRegistry {
  [id: string]: Ingredient;
}

export interface CharacterAppearance {
  head: string;
  body: string;
  hand: string;
  bg: string;
}

export interface PlayerProfile {
  gold: number;
  xp: number;
  level: number;
  inventory: { [itemId: string]: number }; // ID -> Quantity
  appearance: CharacterAppearance;
  name: string;
  water: number; // 0-100
}

export enum ToolType {
  KNIFE = 'KNIFE',       // Нарізати
  PAN = 'PAN',           // Смажити
  POT = 'POT',           // Варити
  OVEN = 'OVEN',         // Запікати
  BLENDER = 'BLENDER',   // Збити
  MAGIC_WAND = 'MAGIC_WAND', // Чаклувати
  HANDS = 'HANDS',       // Місити
  FREEZER = 'FREEZER',   // Заморозити
  HAMMER = 'HAMMER',     // Відбити
  GRATER = 'GRATER',     // Натерти
  MICROWAVE = 'MICROWAVE' // Гріти
}

export type ActionType = ToolType;

export interface CookingRule {
  inputId?: string; // Specific item ID
  inputCategory?: IngredientType; // OR Specific Category (New logic)
  tool: ToolType;
  requiresWater?: boolean;
  outputId?: string; // Specific output ID
  failureOutputId?: string; // If minigame fails
  description: string;
}

export interface Critic {
  id: string;
  name: string;
  persona: string;
  request?: string; 
  preferences?: string;
  avatar: string;
}

export interface Review {
  criticName: string;
  persona: string; // Need this for reply context
  text: string;
  score: number;
  reply?: string; // AI response to player's excuse
}

export interface DishResult {
  name: string;
  description: string;
  reviews: Review[];
  totalScore: number;
  rewardGold: number;
  rewardXp: number;
  steps: { action: string; description: string; icon: string }[];
}

export enum GameState {
  MENU = 'MENU',
  SHOP = 'SHOP',
  CHARACTER = 'CHARACTER',
  KITCHEN = 'KITCHEN',
  RESULT = 'RESULT',
}