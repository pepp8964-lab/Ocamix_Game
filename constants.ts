
import { Ingredient, ToolType, CookingRule, IngredientType } from './types';

// --- LEVELS ---
export const LEVELS_XP = [0, 100, 500, 1500, 4000, 10000, 25000, 60000, 100000];

// --- ITEMS DATABASE ---
const mkItem = (id: string, name: string, emoji: string, type: IngredientType, price: number, tier: any, desc: string, state: any = 'raw'): Ingredient => ({
  id, name, emoji, type, price, tier, desc, state
});

export const BASE_INGREDIENTS: Ingredient[] = [
  // --- TIER 1: BASICS (Cheap, 5-25 Gold) ---
  mkItem('water_drop', 'Вода', '💧', 'liquid', 0, 1, 'H2O', 'raw'),
  mkItem('egg', 'Яйце', '🥚', 'meat', 10, 1, 'Крихке'),
  mkItem('bread', 'Хліб', '🍞', 'grain', 12, 1, 'М\'який'),
  mkItem('potato', 'Картопля', '🥔', 'veg', 8, 1, 'Брудна'),
  mkItem('tomato', 'Помідор', '🍅', 'veg', 10, 1, 'Червоний'),
  mkItem('onion', 'Цибуля', '🧅', 'veg', 8, 1, 'Слізогінна'),
  mkItem('carrot', 'Морква', '🥕', 'veg', 9, 1, 'Хрустка'),
  mkItem('apple', 'Яблуко', '🍎', 'fruit', 12, 1, 'Солодке'),
  mkItem('banana', 'Банан', '🍌', 'fruit', 15, 1, 'Калій'),
  mkItem('salt', 'Сіль', '🧂', 'spice', 5, 1, 'Біла смерть'),
  mkItem('pepper', 'Перець', '⚫', 'spice', 6, 1, 'Чорний'),
  mkItem('sugar', 'Цукор', '🍬', 'spice', 6, 1, 'Солодкий'),
  mkItem('flour', 'Борошно', '🥡', 'grain', 10, 1, 'Пшеничне'),
  mkItem('cucumber', 'Огірок', '🥒', 'veg', 9, 1, 'Зелений'),
  mkItem('cabbage', 'Капуста', '🥬', 'veg', 11, 1, 'Сто одежинок'),
  mkItem('beetroot', 'Буряк', '🍠', 'veg', 10, 1, 'Для борщу'),
  mkItem('garlic', 'Часник', '🧄', 'veg', 12, 1, 'Анти-вампір'),
  mkItem('corn', 'Кукурудза', '🌽', 'veg', 14, 1, 'Солодка'),
  mkItem('peas', 'Горох', '🟢', 'veg', 8, 1, 'Дрібний'),
  mkItem('milk', 'Молоко', '🥛', 'liquid', 15, 1, 'Коров\'яче'),
  mkItem('butter', 'Масло', '🧈', 'liquid', 20, 1, 'Вершкове'),
  mkItem('rice', 'Рис', '🍚', 'grain', 18, 1, 'Басматі'),
  mkItem('pasta', 'Паста', '🍝', 'grain', 20, 1, 'Італія'),
  mkItem('orange', 'Апельсин', '🍊', 'fruit', 18, 1, 'Цитрус'),
  mkItem('pear', 'Груша', '🍐', 'fruit', 16, 1, 'Дюшес'),
  mkItem('grape', 'Виноград', '🍇', 'fruit', 22, 1, 'Ізабелла'),
  mkItem('chicken_wing', 'Крильце', '🍗', 'meat', 25, 1, 'Сире'),
  mkItem('pork_chop', 'Свинина', '🥩', 'meat', 30, 1, 'Шматок'),
  mkItem('sausage', 'Сосиска', '🌭', 'meat', 15, 1, 'Студентська'),
  mkItem('ketchup', 'Кетчуп', '🥫', 'spice', 12, 1, 'Томатний'),
  mkItem('mayo', 'Майонез', '🏺', 'spice', 12, 1, 'Провансаль'),
  mkItem('tea_bag', 'Пакетик чаю', '🏷️', 'liquid', 5, 1, 'Ліптон'),
  mkItem('cracker', 'Крекер', '🍪', 'grain', 8, 1, 'Солоний'),
  mkItem('ice_cream', 'Морозиво', '🍦', 'liquid', 20, 1, 'Ванільне'),
  mkItem('lollipop', 'Льодяник', '🍭', 'spice', 5, 1, 'На паличці'),
  mkItem('gum', 'Жуйка', '🍬', 'spice', 5, 1, 'М\'ятна'),

  // --- TIER 2: SUPERMARKET (Medium, 30-150 Gold) ---
  mkItem('cheese', 'Сир', '🧀', 'meat', 45, 2, 'Чеддер'),
  mkItem('salmon', 'Лосось', '🐟', 'meat', 120, 2, 'Свіжа риба'),
  mkItem('chili', 'Чилі', '🌶️', 'spice', 40, 2, 'Вогонь!'),
  mkItem('lemon', 'Лимон', '🍋', 'fruit', 35, 2, 'Кислий'),
  mkItem('mushroom', 'Гриб', '🍄', 'veg', 50, 2, 'Лісовий'),
  mkItem('shrimp', 'Креветка', '🦐', 'meat', 140, 2, 'Морська'),
  mkItem('honey', 'Мед', '🍯', 'liquid', 60, 2, 'Бджолиний'),
  mkItem('yogurt', 'Йогурт', '🥣', 'liquid', 35, 2, 'Грецький'),
  mkItem('chocolate', 'Шоколад', '🍫', 'spice', 45, 2, 'Чорний'),
  mkItem('coffee', 'Кава', '☕', 'spice', 55, 2, 'Арабіка'),
  mkItem('tea', 'Чай', '🍵', 'liquid', 30, 2, 'Зелений'),
  mkItem('bacon', 'Бекон', '🥓', 'meat', 70, 2, 'Копчений'),
  mkItem('ham', 'Шинка', '🍖', 'meat', 65, 2, 'Пармська'),
  mkItem('tuna', 'Тунець', '🐟', 'meat', 110, 2, 'Червоний'),
  mkItem('squid', 'Кальмар', '🦑', 'meat', 95, 2, 'Слизький'),
  mkItem('avocado', 'Авокадо', '🥑', 'veg', 85, 2, 'Модний'),
  mkItem('pineapple', 'Ананас', '🍍', 'fruit', 90, 2, 'Тропік'),
  mkItem('mango', 'Манго', '🥭', 'fruit', 95, 2, 'Соковите'),
  mkItem('kiwi', 'Ківі', '🥝', 'fruit', 50, 2, 'Волохате'),
  mkItem('coconut', 'Кокос', '🥥', 'fruit', 60, 2, 'Твердий'),
  mkItem('watermelon', 'Кавун', '🍉', 'fruit', 40, 2, 'Гігант'),
  mkItem('pumpkin', 'Гарбуз', '🎃', 'veg', 35, 2, 'Геловін'),
  mkItem('olive_oil', 'Олія', '🍾', 'liquid', 75, 2, 'Оливкова'),
  mkItem('vinegar', 'Оцет', '🧴', 'liquid', 25, 2, 'Бальзамік'),
  mkItem('soy_sauce', 'Соя', '🍶', 'spice', 40, 2, 'Солона'),
  mkItem('wasabi', 'Васабі', '🟢', 'spice', 50, 2, 'Гостре!'),
  mkItem('cinnamon', 'Кориця', '🪵', 'spice', 30, 2, 'Паличка'),
  mkItem('vanilla', 'Ваніль', '🌼', 'spice', 100, 2, 'Стручок'),
  mkItem('ginger', 'Імбир', '🫚', 'spice', 45, 2, 'Корінь'),
  mkItem('mint', 'М\'ята', '🌿', 'spice', 25, 2, 'Свіжа'),
  mkItem('peach', 'Персик', '🍑', 'fruit', 45, 2, 'Соковитий'),
  mkItem('cherry', 'Вишня', '🍒', 'fruit', 50, 2, 'Кисла'),
  mkItem('strawberry', 'Полуниця', '🍓', 'fruit', 55, 2, 'Літня'),
  mkItem('blueberry', 'Чорниця', '🫐', 'fruit', 60, 2, 'Лісова'),
  mkItem('olive', 'Оливка', '🫒', 'veg', 40, 2, 'Грецька'),
  mkItem('basil', 'Базилік', '🍃', 'spice', 30, 2, 'Італійський'),
  mkItem('thyme', 'Чебрець', '🌿', 'spice', 30, 2, 'Пахучий'),
  mkItem('paprika', 'Паприка', '🌶️', 'spice', 35, 2, 'Солодка'),
  mkItem('curry', 'Каррі', '🍛', 'spice', 40, 2, 'Індійське'),
  mkItem('baguette', 'Багет', '🥖', 'grain', 30, 2, 'Французький'),
  mkItem('croissant', 'Круасан', '🥐', 'grain', 40, 2, 'Масляний'),

  // --- TIER 3: GOURMET & WEIRD (High, 200-900 Gold) ---
  mkItem('lobster', 'Лобстер', '🦞', 'meat', 450, 3, 'Живий'),
  mkItem('octopus', 'Восьминіг', '🐙', 'meat', 400, 3, '8 ніг'),
  mkItem('crab', 'Краб', '🦀', 'meat', 380, 3, 'Камчатський'),
  mkItem('oyster', 'Устриця', '🦪', 'meat', 250, 3, 'Перлина?'),
  mkItem('steak_ribeye', 'Рібай', '🥩', 'meat', 500, 3, 'Преміум'),
  mkItem('duck', 'Качка', '🦆', 'meat', 300, 3, 'Пекінська'),
  mkItem('turkey', 'Індичка', '🦃', 'meat', 280, 3, 'Різдвяна'),
  mkItem('blue_cheese', 'Дорблю', '🧀', 'meat', 220, 3, 'З пліснявою'),
  mkItem('durian', 'Дуріан', '🍈', 'fruit', 600, 3, 'Смердить'),
  mkItem('dragon_fruit', 'Пітахайя', '🐲', 'fruit', 350, 3, 'Кактус'),
  mkItem('pomegranate', 'Гранат', '🍅', 'fruit', 200, 3, 'Вибуховий'),
  mkItem('fig', 'Інжир', '🌰', 'fruit', 250, 3, 'Солодкий'),
  mkItem('sushi_rice', 'Рис для суші', '🍚', 'grain', 150, 3, 'Клейкий'),
  mkItem('quinoa', 'Кіноа', '🌾', 'grain', 180, 3, 'Суперфуд'),
  mkItem('couscous', 'Кус-кус', '🟡', 'grain', 160, 3, 'Дрібний'),
  mkItem('maple_syrup', 'Сироп', '🍁', 'liquid', 250, 3, 'Кленовий'),
  mkItem('wine_red', 'Вино', '🍷', 'liquid', 400, 3, 'Червоне'),
  mkItem('champagne', 'Шампанське', '🍾', 'liquid', 550, 3, 'Ігристе'),
  mkItem('beer', 'Пиво', '🍺', 'liquid', 100, 3, 'Крафтове'),
  mkItem('whiskey', 'Віскі', '🥃', 'liquid', 600, 3, 'Витримка'),
  mkItem('cactus', 'Кактус', '🌵', 'weird', 200, 3, 'Колючий'),
  mkItem('scorpion', 'Скорпіон', '🦂', 'weird', 400, 3, 'Отруйний'),
  mkItem('spider', 'Павук', '🕷️', 'weird', 300, 3, 'Хрусткий'),
  mkItem('snake', 'Змія', '🐍', 'weird', 500, 3, 'Довга'),
  mkItem('bat_wing', 'Крило кажана', '🦇', 'weird', 350, 3, 'Нічне'),
  mkItem('bone', 'Кістка', '🦴', 'weird', 50, 3, 'Для бульйону'),
  mkItem('old_boot', 'Черевик', '🥾', 'weird', 10, 3, 'Старий'),
  mkItem('fish_bone', 'Скелет риби', '🐟', 'weird', 5, 3, 'Залишки'),
  mkItem('rabbit', 'Кролик', '🐇', 'meat', 280, 3, 'Дієтичний'),
  mkItem('venison', 'Оленина', '🦌', 'meat', 450, 3, 'Дичина'),
  mkItem('artichoke', 'Артишок', '🥬', 'veg', 220, 3, 'Колючий'),
  mkItem('asparagus', 'Спаржа', '🎋', 'veg', 200, 3, 'Елітна'),
  mkItem('truffle_oil', 'Трюфельна олія', '🏺', 'liquid', 800, 3, 'Ароматна'),
  mkItem('rose_water', 'Трояндова вода', '🌹', 'liquid', 300, 3, 'Турецька'),

  // --- TIER 4: RPG, DUNGEON & OFFICE (Expensive, 1000-5000 Gold) ---
  mkItem('truffle', 'Трюфель', '🌑', 'veg', 1200, 4, 'Елітний гриб'),
  mkItem('wagyu', 'Вагю', '🥓', 'meat', 2500, 4, 'Мармурове'),
  mkItem('saffron', 'Шафран', '🏵️', 'spice', 2000, 4, 'Червоне золото'),
  mkItem('caviar', 'Ікра', '⚫', 'meat', 1800, 4, 'Осетрова'),
  mkItem('foie_gras', 'Фуа-гра', '🦆', 'meat', 1500, 4, 'Делікатес'),
  mkItem('gold_leaf', 'Золото', '✨', 'spice', 3000, 4, 'Їстівне 24К'),
  
  mkItem('slime_goo', 'Слиз Слайма', '🟢', 'dungeon', 800, 4, 'Липкий'),
  mkItem('goblin_ear', 'Вухо Гобліна', '👂', 'dungeon', 600, 4, 'Брудне'),
  mkItem('troll_fat', 'Жир Троля', '🏺', 'dungeon', 900, 4, 'Регенерує'),
  mkItem('dragon_scale', 'Луска Дракона', '🛡️', 'dungeon', 4000, 4, 'Тверда'),
  mkItem('skeleton_rib', 'Ребро Скелета', '💀', 'dungeon', 500, 4, 'Кальцій'),
  mkItem('eyeball', 'Око', '👁️', 'dungeon', 750, 4, 'Стежить'),
  mkItem('vampire_dust', 'Прах Вампіра', '⚱️', 'dungeon', 1200, 4, 'Давній'),
  mkItem('ectoplasm', 'Ектоплазма', '👻', 'dungeon', 1500, 4, 'Примарна'),
  mkItem('zombie_brain', 'Мозок Зомбі', '🧠', 'dungeon', 2000, 4, 'Несвіжий'),
  mkItem('mummy_wrap', 'Бинт Мумії', '🧻', 'dungeon', 800, 4, 'Пильний'),
  
  mkItem('mana_potion', 'Зілля Мани', '🧪', 'magic', 1500, 4, 'Синє'),
  mkItem('health_potion', 'Зілля Здоров\'я', '🍷', 'magic', 1500, 4, 'Червоне'),
  mkItem('fairy_dust', 'Пилок Феї', '✨', 'magic', 2200, 4, 'Літає'),
  mkItem('ghost_pepper', 'Примарний Перець', '👻', 'spice', 1800, 4, 'Проходить крізь'),
  mkItem('mandrake', 'Мандрагора', '🌱', 'magic', 2500, 4, 'Кричить'),
  mkItem('witch_brew', 'Відвар Відьми', '🍵', 'magic', 1800, 4, 'Зелений'),
  
  mkItem('stapler', 'Степлер', '🖇️', 'office', 150, 4, 'Залізний'),
  mkItem('paper', 'Папір', '📄', 'office', 20, 4, 'А4'),
  mkItem('coffee_mug', 'Кружка', '☕', 'office', 100, 4, 'Брудна'),
  mkItem('laptop', 'Ноутбук', '💻', 'office', 4000, 4, 'Гарячий'),
  mkItem('mouse', 'Мишка', '🖱️', 'office', 500, 4, 'Комп\'ютерна'),
  mkItem('cactus_office', 'Кактус', '🌵', 'office', 200, 4, 'Від радіації'),
  mkItem('pen', 'Ручка', '🖊️', 'office', 50, 4, 'Синя'),
  mkItem('pencil', 'Олівець', '✏️', 'office', 30, 4, 'Грифельний'),
  mkItem('shredded_paper', 'Папір', '🗑️', 'office', 10, 4, 'Зі шредера'),
  mkItem('keyboard', 'Клавіатура', '⌨️', 'office', 800, 4, 'Механічна'),
  mkItem('printer_ink', 'Чорнило', '🖨️', 'office', 3000, 4, 'Дорожче за кров'),

  // --- TIER 5: LEGENDARY, COSMIC & TECH (Absurd, 5000+ Gold) ---
  mkItem('phoenix_egg', 'Яйце Фенікса', '🔥', 'magic', 15000, 5, 'Відроджується'),
  mkItem('unicorn_horn', 'Ріг Єдинорога', '🦄', 'magic', 30000, 5, 'Святий'),
  mkItem('dragon_meat', 'М\'ясо Дракона', '🥩', 'dungeon', 12000, 5, 'Легендарне'),
  mkItem('hydra_head', 'Голова Гідри', '🐍', 'dungeon', 18000, 5, 'Їх багато'),
  
  mkItem('floppy_disk', 'Дискета', '💾', 'tech', 1000, 5, '1.44mb смаку'),
  mkItem('iphone', 'Смартфон', '📱', 'tech', 8000, 5, 'Яблучний'),
  mkItem('gpu', 'Відеокарта', '📟', 'tech', 25000, 5, 'RTX On'),
  mkItem('motherboard', 'Материнка', 'green', 'tech', 5000, 5, 'Кремній'),
  mkItem('battery', 'Батарейка', '🔋', 'tech', 300, 5, 'Кислий літій'),
  mkItem('fiber_cable', 'Оптоволокно', '🧵', 'tech', 1500, 5, 'Швидке'),
  mkItem('usb_stick', 'Флешка', '💾', 'tech', 800, 5, '32 Гб'),
  mkItem('cpu', 'Процесор', '🧠', 'tech', 12000, 5, 'Багатоядерний'),
  mkItem('hard_drive', 'Жорсткий диск', '💽', 'tech', 2000, 5, 'Шумний'),
  mkItem('ram', 'Оперативка', '🎫', 'tech', 4000, 5, 'Швидка'),
  
  mkItem('meteorite', 'Метеорит', '☄️', 'cosmic', 6000, 5, 'З космосу'),
  mkItem('moon_rock', 'Місячний камінь', '🌑', 'cosmic', 9000, 5, 'Сирний?'),
  mkItem('star_fragment', 'Уламок Зірки', '✨', 'cosmic', 45000, 5, 'Гарячий'),
  mkItem('alien_egg', 'Яйце Чужого', '🥚', 'cosmic', 12000, 5, 'Небезпечне'),
  mkItem('black_hole_soup', 'Чорна діра', '⚫', 'cosmic', 99999, 5, 'Нескінченна вага'),
  mkItem('ufo_part', 'Деталь НЛО', '🛸', 'cosmic', 22000, 5, 'Невідомий метал'),
  mkItem('dark_matter', 'Темна матерія', '🌌', 'cosmic', 60000, 5, 'Загадкова'),
  mkItem('stardust', 'Зоряний пил', '✨', 'cosmic', 8000, 5, 'Блискучий'),
  mkItem('void_essence', 'Есенція Пустоти', '🕳️', 'cosmic', 70000, 5, 'Ніщо'),
  mkItem('time_crystal', 'Часовий Кристал', '⏳', 'magic', 50000, 5, 'Змінює час'),
  mkItem('antimatter', 'Антиматерія', '⚛️', 'cosmic', 100000, 5, 'Вибух всесвіту'),
];

// Specific Logic Items (Outputs)
export const PROCESSED_ITEMS: Ingredient[] = [
  mkItem('mess', 'Місиво', '💩', 'weird', 0, 1, 'Неїстівне', 'waste'),
  mkItem('burnt_food', 'Вуглина', '⚫', 'weird', 0, 1, 'Згоріло', 'burnt'),
  mkItem('egg_fried', 'Яєчня', '🍳', 'meat', 0, 1, 'Глазунья', 'fried'),
  mkItem('egg_boiled', 'Варене яйце', '🥚', 'meat', 0, 1, 'Круте', 'boiled'),
  mkItem('popcorn', 'Попкорн', '🍿', 'grain', 0, 1, 'З кукурудзи', 'fried'),
  mkItem('glass_shards', 'Уламки', '💎', 'weird', 0, 1, 'Гостро', 'cracked'),
  mkItem('wet_electronics', 'Замкнуло', '⚡', 'tech', 0, 1, 'Іскрить', 'boiled'),
  mkItem('ice_cube', 'Лід', '🧊', 'liquid', 0, 1, 'Холодний', 'frozen'),
];

export const ALL_ITEMS = [...BASE_INGREDIENTS, ...PROCESSED_ITEMS];
export const INGREDIENTS = ALL_ITEMS;

// --- COOKING LOGIC ---
export const PROCESSING_RULES: CookingRule[] = [
  // SPECIFIC RECIPES
  { inputId: 'egg', tool: ToolType.PAN, outputId: 'egg_fried', description: 'Смаження' },
  { inputId: 'egg', tool: ToolType.POT, requiresWater: true, outputId: 'egg_boiled', description: 'Варіння' },
  { inputId: 'battery', tool: ToolType.POT, outputId: 'wet_electronics', description: 'Вибух' },
  { inputId: 'iphone', tool: ToolType.BLENDER, outputId: 'glass_shards', description: 'Will it blend?' },
  { inputId: 'water_drop', tool: ToolType.FREEZER, outputId: 'ice_cube', description: 'Заморозка' },

  // CATEGORY RULES 
  // PAN
  { inputCategory: 'meat', tool: ToolType.PAN, description: 'Стейк' },
  { inputCategory: 'veg', tool: ToolType.PAN, description: 'Гриль' },
  { inputCategory: 'dungeon', tool: ToolType.PAN, description: 'Печеня' },
  
  // POT
  { inputCategory: 'veg', tool: ToolType.POT, requiresWater: true, description: 'Суп' },
  { inputCategory: 'grain', tool: ToolType.POT, requiresWater: true, description: 'Каша' },
  { inputCategory: 'meat', tool: ToolType.POT, requiresWater: true, description: 'Бульйон' },

  // KNIFE
  { inputCategory: 'veg', tool: ToolType.KNIFE, description: 'Нарізка' },
  { inputCategory: 'fruit', tool: ToolType.KNIFE, description: 'Салат' },
  { inputCategory: 'meat', tool: ToolType.KNIFE, description: 'Тартар' },
  { inputId: 'cheese', tool: ToolType.KNIFE, description: 'Кубики' },

  // BLENDER
  { inputCategory: 'fruit', tool: ToolType.BLENDER, description: 'Смузі' },
  { inputCategory: 'veg', tool: ToolType.BLENDER, description: 'Пюре' },

  // OVEN
  { inputCategory: 'grain', tool: ToolType.OVEN, description: 'Випічка' },
  { inputCategory: 'meat', tool: ToolType.OVEN, description: 'Запікання' },

  // NEW TOOLS
  { inputCategory: 'meat', tool: ToolType.HAMMER, description: 'Відбивна' },
  { inputCategory: 'dungeon', tool: ToolType.HAMMER, description: 'Розплющення' },
  
  { inputId: 'cheese', tool: ToolType.GRATER, description: 'Тертий сир' },
  { inputCategory: 'veg', tool: ToolType.GRATER, description: 'Стружка' },
  
  { inputCategory: 'liquid', tool: ToolType.FREEZER, description: 'Лід' },
  { inputCategory: 'meat', tool: ToolType.FREEZER, description: 'Заморозка' },

  { inputCategory: 'tech', tool: ToolType.MICROWAVE, description: 'Радіація' },
  { inputId: 'popcorn', tool: ToolType.MICROWAVE, description: 'Розігрів' },
];

export const COOKING_ACTIONS = [
  { type: ToolType.KNIFE, emoji: '🔪', label: 'Нарізати', color: 'bg-red-500' },
  { type: ToolType.PAN, emoji: '🍳', label: 'Смажити', color: 'bg-orange-500' },
  { type: ToolType.POT, emoji: '🍲', label: 'Варити', color: 'bg-blue-500' },
  { type: ToolType.OVEN, emoji: '🔥', label: 'Запікати', color: 'bg-red-700' },
  { type: ToolType.BLENDER, emoji: '🌪️', label: 'Збити', color: 'bg-gray-500' },
  { type: ToolType.MAGIC_WAND, emoji: '🪄', label: 'Магія', color: 'bg-purple-500' },
  { type: ToolType.HANDS, emoji: '🖐️', label: 'Місити', color: 'bg-amber-700' },
  { type: ToolType.FREEZER, emoji: '❄️', label: 'Морозити', color: 'bg-cyan-400' },
  { type: ToolType.HAMMER, emoji: '🔨', label: 'Відбити', color: 'bg-stone-500' },
  { type: ToolType.GRATER, emoji: '🧀', label: 'Натерти', color: 'bg-yellow-400' },
  { type: ToolType.MICROWAVE, emoji: '☢️', label: 'Гріти', color: 'bg-green-500' },
];

// --- COSMETICS ---
export const CHAR_HEADS = [
  { id: 'h1', emoji: '🙂' }, { id: 'h2', emoji: '😎' }, { id: 'h3', emoji: '👹' },
  { id: 'h4', emoji: '👽' }, { id: 'h5', emoji: '🤖' }, { id: 'h6', emoji: '🎃' },
  { id: 'h7', emoji: '🤡' }, { id: 'h8', emoji: '🐱' }, { id: 'h9', emoji: '🐼' },
  { id: 'h10', emoji: '🐸' }, { id: 'h11', emoji: '🦊' }, { id: 'h12', emoji: '🦁' }
];
export const CHAR_BODIES = [
  { id: 'b1', emoji: '👕' }, { id: 'b2', emoji: '🧥' }, { id: 'b3', emoji: '👘' },
  { id: 'b4', emoji: '🦺' }, { id: 'b5', emoji: '👗' }, { id: 'b6', emoji: '👔' },
  { id: 'b7', emoji: '🥋' }, { id: 'b8', emoji: '🥻' }, { id: 'b9', emoji: '🧑‍🚀' }
];
export const CHAR_HANDS = [
  { id: 'ha1', emoji: '🔪' }, { id: 'ha2', emoji: '🔥' }, { id: 'ha3', emoji: '🥕' },
  { id: 'ha4', emoji: '🍷' }, { id: 'ha5', emoji: '🔫' }, { id: 'ha6', emoji: '🧪' },
  { id: 'ha7', emoji: '⚔️' }, { id: 'ha8', emoji: '🎮' }, { id: 'ha9', emoji: '🎸' }
];
export const CHAR_BGS = [
  { id: 'bg1', class: 'bg-gradient-to-br from-slate-900 to-black' }, 
  { id: 'bg2', class: 'bg-gradient-to-br from-purple-900 to-indigo-900' },
  { id: 'bg3', class: 'bg-gradient-to-br from-green-900 to-emerald-900' }, 
  { id: 'bg4', class: 'bg-gradient-to-br from-red-900 to-rose-900' },
  { id: 'bg5', class: 'bg-gradient-to-br from-blue-900 to-cyan-900' },
  { id: 'bg6', class: 'bg-gradient-to-br from-amber-900 to-orange-900' },
  { id: 'bg7', class: 'bg-gradient-to-br from-pink-900 to-fuchsia-900' }
];
