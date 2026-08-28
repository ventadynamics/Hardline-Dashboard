import type { Faction, GameMap, GameMode, Unit } from "@/types";

/**
 * Placeholder game canon. No canon exists yet (owner-confirmed): every name
 * here is invented and will be replaced by API/database values. Nothing
 * outside src/data may reference these names directly.
 */

export const FACTIONS: Faction[] = [
  {
    id: "police",
    code: "PD",
    name: "ПОЛИЦИЯ",
    fullName: "Объединённый департамент полиции",
    side: "law",
    colorToken: "blue",
    description:
      "Патрульные экипажи, спецподразделения и тяжёлая техника департамента. Контроль улиц, штурмовые операции, удержание периметра.",
  },
  {
    id: "syndicate",
    code: "SYN",
    name: "СИНДИКАТ",
    fullName: "Криминальный синдикат «Редлайн»",
    side: "crime",
    colorToken: "red",
    description:
      "Организованные группировки города: быстрые рейды, засады, контроль трасс и промзон. Скорость и внезапность вместо брони.",
  },
  {
    id: "guard",
    code: "NG",
    name: "НАЦГВАРДИЯ",
    fullName: "Части национальной гвардии",
    side: "military",
    colorToken: "olive",
    description:
      "Развёрнутые в городе армейские части: бронетехника, вертолёты, тяжёлое вооружение. Медленнее, но держат удар.",
  },
];

export const MODES: GameMode[] = [
  {
    id: "conquest",
    code: "CQ",
    name: "ЗАХВАТ",
    description: "Контроль ключевых точек района. Побеждает сторона, удержавшая большинство объектов.",
  },
  {
    id: "assault",
    code: "AS",
    name: "ШТУРМ",
    description: "Атака укреплённого объекта против обороняющейся стороны. Волны с нарастающим темпом.",
  },
  {
    id: "blockade",
    code: "BL",
    name: "БЛОКАДА",
    description: "Окружение и удержание квартала. Ресурсы сторон ограничены, каждая потеря критична.",
  },
  {
    id: "convoy",
    code: "CV",
    name: "КОНВОЙ",
    description: "Проводка колонны через враждебный район. Одна сторона сопровождает, другая перехватывает.",
  },
];

export const MAPS: GameMap[] = [
  {
    id: "downtown",
    code: "DWT",
    name: "DOWNTOWN",
    setting: "Деловой центр",
    description: "Стеклянные башни, узкие перекрёстки и многоуровневые парковки. Ближние дистанции, вертикальный контроль.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE", "DELTA"],
    image: null,
  },
  {
    id: "harbor",
    code: "HRB",
    name: "HARBOR",
    setting: "Портовые терминалы",
    description: "Контейнерные ряды, краны и причалы. Длинные линии обстрела вдоль доков, тяжёлая техника решает.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO"],
    image: null,
  },
  {
    id: "railyard",
    code: "RLY",
    name: "RAILYARD",
    setting: "Сортировочная станция",
    description: "Составы, депо и эстакады. Коридорные бои между вагонами, скрытые фланги.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE"],
    image: null,
  },
  {
    id: "civic",
    code: "CVC",
    name: "CIVIC CENTER",
    setting: "Административный квартал",
    description: "Мэрия, суд и площадь. Открытый центр под перекрёстным огнём, тяжёлые штурмы зданий.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE", "DELTA"],
    image: null,
  },
  {
    id: "interstate",
    code: "I95",
    name: "INTERSTATE",
    setting: "Магистраль и развязки",
    description: "Многоуровневая трасса, заторы и съезды. Карта техники: скорость, тараны, засады под мостами.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE"],
    image: null,
  },
  {
    id: "hillside",
    code: "HLS",
    name: "HILLSIDE",
    setting: "Жилые холмы",
    description: "Частный сектор на склонах, серпантины и задние дворы. Пехотные бои на средней дистанции.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE", "DELTA"],
    image: null,
  },
  {
    id: "refinery",
    code: "RFN",
    name: "REFINERY",
    setting: "Нефтеперерабатывающий завод",
    description: "Трубопроводы, резервуары и эстакады. Взрывоопасное окружение, контроль узких проходов.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO"],
    image: null,
  },
  {
    id: "strip",
    code: "MTL",
    name: "MOTEL STRIP",
    setting: "Придорожная полоса",
    description: "Мотели, заправки и неон вдоль шоссе. Ночная карта ближнего боя с быстрыми ротациями.",
    objectives: ["ALPHA", "BRAVO", "CHARLIE"],
    image: null,
  },
];

function unitStats(health: number, armor: number, firepower: number, range: number, mobility: number) {
  return { health, armor, firepower, range, mobility };
}

export const UNITS: Unit[] = [
  /* --- police ------------------------------------------------------ */
  { id: "pd-patrol", code: "PTR", name: "ПАТРУЛЬНЫЙ ЭКИПАЖ", factionId: "police", role: "infantry", roleName: "Пехота", isVehicle: false, stats: unitStats(45, 20, 40, 45, 60), description: "Базовое отделение департамента. Дешёвые, быстрые, держат точки числом." },
  { id: "pd-swat", code: "SWT", name: "ШТУРМОВАЯ ГРУППА", factionId: "police", role: "infantry", roleName: "Штурм", isVehicle: false, stats: unitStats(60, 45, 65, 40, 50), description: "Тяжёлая пехота для зачистки зданий. Щиты, дробовики, светошумовые." },
  { id: "pd-marksman", code: "MRK", name: "СНАЙПЕРСКАЯ ПАРА", factionId: "police", role: "recon", roleName: "Разведка", isVehicle: false, stats: unitStats(35, 10, 70, 90, 40), description: "Наблюдение и точечное подавление с крыш. Уязвимы вблизи." },
  { id: "pd-cruiser", code: "CRS", name: "ПАТРУЛЬНЫЙ КРУЗЕР", factionId: "police", role: "vehicle", roleName: "Транспорт", isVehicle: true, stats: unitStats(50, 30, 35, 40, 85), description: "Быстрый перехватчик. Переброска отделений и преследование по трассам." },
  { id: "pd-bastion", code: "BST", name: "БРОНЕМАШИНА «БАСТИОН»", factionId: "police", role: "armor", roleName: "Бронетехника", isVehicle: true, stats: unitStats(80, 75, 55, 50, 45), description: "Штурмовой бронеавтомобиль SWAT. Таран баррикад, прикрытие пехоты." },
  { id: "pd-heli", code: "AIR", name: "ВЕРТОЛЁТ НАБЛЮДЕНИЯ", factionId: "police", role: "air", roleName: "Авиация", isVehicle: true, stats: unitStats(40, 20, 30, 80, 90), description: "Глаза департамента. Подсветка целей и корректировка штурмов." },
  /* --- syndicate --------------------------------------------------- */
  { id: "syn-soldiers", code: "SLD", name: "БОЕВИКИ", factionId: "syndicate", role: "infantry", roleName: "Пехота", isVehicle: false, stats: unitStats(40, 15, 50, 40, 70), description: "Уличные бойцы синдиката. Агрессивные рывки и численное давление." },
  { id: "syn-enforcers", code: "ENF", name: "ГРУППА ПОДАВЛЕНИЯ", factionId: "syndicate", role: "infantry", roleName: "Штурм", isVehicle: false, stats: unitStats(55, 35, 70, 35, 55), description: "Ветераны с тяжёлым вооружением. Ломают оборону в ближнем бою." },
  { id: "syn-spotter", code: "SPT", name: "НАВОДЧИК", factionId: "syndicate", role: "recon", roleName: "Разведка", isVehicle: false, stats: unitStats(30, 5, 35, 75, 80), description: "Скрытное наблюдение и метки для засад. Почти незаметен." },
  { id: "syn-muscle", code: "MSC", name: "МАСЛКАР «РЕДЛАЙН»", factionId: "syndicate", role: "vehicle", roleName: "Транспорт", isVehicle: true, stats: unitStats(45, 20, 40, 35, 95), description: "Форсированный маслкар. Самая быстрая машина игры, тараны и отходы." },
  { id: "syn-guntruck", code: "GTK", name: "БРОНИРОВАННЫЙ ПИКАП", factionId: "syndicate", role: "armor", roleName: "Бронетехника", isVehicle: true, stats: unitStats(65, 50, 65, 55, 60), description: "Кустарная броня и крупный калибр в кузове. Дёшево и злобно." },
  { id: "syn-drone", code: "DRN", name: "РАЗВЕДЫВАТЕЛЬНЫЙ ДРОН", factionId: "syndicate", role: "air", roleName: "Авиация", isVehicle: true, stats: unitStats(20, 5, 15, 70, 95), description: "Коммерческий дрон с камерой. Разведка периметра и корректировка." },
  /* --- guard ------------------------------------------------------- */
  { id: "ng-rifles", code: "RFL", name: "МОТОСТРЕЛКИ", factionId: "guard", role: "infantry", roleName: "Пехота", isVehicle: false, stats: unitStats(55, 40, 55, 55, 45), description: "Регулярная пехота гвардии. Универсальны, устойчивы, медлительны." },
  { id: "ng-engineers", code: "ENG", name: "ИНЖЕНЕРНОЕ ОТДЕЛЕНИЕ", factionId: "guard", role: "support", roleName: "Поддержка", isVehicle: false, stats: unitStats(45, 30, 35, 40, 40), description: "Ремонт техники, заграждения и мины. Основа обороны гвардии." },
  { id: "ng-recon", code: "RCN", name: "ГРУППА РАЗВЕДКИ", factionId: "guard", role: "recon", roleName: "Разведка", isVehicle: false, stats: unitStats(40, 20, 55, 80, 55), description: "Армейская разведка с дальнобойной оптикой и связью." },
  { id: "ng-humvee", code: "HMV", name: "БРОНЕАВТОМОБИЛЬ HMV", factionId: "guard", role: "vehicle", roleName: "Транспорт", isVehicle: true, stats: unitStats(60, 55, 50, 55, 70), description: "Рабочая лошадка гвардии. Пулемётная турель и переброска отделений." },
  { id: "ng-apc", code: "APC", name: "БТР «ГАРНИЗОН»", factionId: "guard", role: "armor", roleName: "Бронетехника", isVehicle: true, stats: unitStats(95, 90, 75, 60, 35), description: "Тяжёлый бронетранспортёр. Медленный, почти неуязвимый для стрелковки." },
  { id: "ng-heli", code: "HLO", name: "ТРАНСПОРТНЫЙ ВЕРТОЛЁТ", factionId: "guard", role: "air", roleName: "Авиация", isVehicle: true, stats: unitStats(55, 35, 45, 65, 80), description: "Высадка отделений в глубину карты. Ключ к быстрым захватам." },
];

/* ------------------------------------------------------------------ */
/* Name pools                                                          */
/* ------------------------------------------------------------------ */

export const PLAYER_NAMES: string[] = [
  "RAVEN", "KILO", "VANTAGE", "Mason", "Redline", "SPECTRE", "HAVOC", "Decker",
  "DIESEL", "Ruiz", "NOMAD", "Vex", "CROSSCUT", "Marlow", "STATIC", "Boone",
  "WARDEN", "Calloway", "PIVOT", "Reyes", "GRAVEL", "Sutter", "LONGSHOT", "Ash",
  "TRIPWIRE", "Hollis", "BRAVO-6", "Kane", "SIDEWINDER", "Mercer", "OVERPASS",
  "Dray", "CAUTION", "Fenn", "ROADBLOCK", "Ivers", "NIGHTCAP", "Sloan", "TREMOR",
  "Vasquez", "LOWRIDE", "Colt", "SIGNAL-9", "Harlan", "DUSTOFF", "Pryce",
  "HOLLOW", "Nash", "CINDER", "Wilks", "TORQUE", "Reid", "PAROLE", "Otero",
  "SKYLINE", "Brandt", "MUZZLE", "Ferris", "CHECKPOINT", "Delgado", "AXLE",
  "Monroe", "FLATLINE", "Sable", "RICOCHET", "Torres", "CURB", "Ellison",
  "SPOTTER", "Grady", "IGNITION", "Vaughn", "TAILLIGHT", "Osei", "BREACHER",
  "Lindqvist", "SIREN", "Cormac", "GRIDIRON", "Palmer", "SLUG", "Renner",
  "WHITELINE", "Ito", "BACKDRAFT", "Sorrell", "MAGNUM", "Keller", "OFFRAMP",
  "Draper", "NIGHTSTICK", "Beaumont", "VULTURE", "Quinn", "PAYLOAD", "Ryker",
  "CROSSTOWN", "Alva", "DEADBOLT", "Merrit",
];

export const CLAN_POOL: { tag: string; name: string; motto: string }[] = [
  { tag: "NS", name: "NIGHTSHIFT", motto: "Город не спит — и мы тоже" },
  { tag: "RDL", name: "REDLINE", motto: "Скорость решает всё" },
  { tag: "BLK", name: "BLACKOUT", motto: "Свет гаснет — начинаем" },
  { tag: "XF", name: "CROSSFIRE", motto: "Всегда под перекрёстным" },
  { tag: "HP", name: "HOLLOWPOINT", motto: "Один выстрел — одно решение" },
  { tag: "GRD", name: "GRIDLOCK", motto: "Держим каждый перекрёсток" },
  { tag: "STL", name: "STATE LINE", motto: "До границы штата — наши" },
  { tag: "CRF", name: "CURFEW", motto: "После полуночи улицы наши" },
  { tag: "DSP", name: "DISPATCH", motto: "Первыми на вызове" },
  { tag: "IRS", name: "IRONSIGHT", motto: "Без оптики, по-старому" },
  { tag: "LC", name: "LAST CALL", motto: "Последний звонок за нами" },
  { tag: "MRD", name: "MERIDIAN", motto: "Точно по координатам" },
  { tag: "WTW", name: "WATCHTOWER", motto: "Видим всё, что движется" },
  { tag: "FLN", name: "FELONY", motto: "Статья найдётся" },
];

export const RANK_TITLES: string[] = [
  "НОВОБРАНЕЦ",
  "ПАТРУЛЬНЫЙ",
  "СЕРЖАНТ",
  "СТАРШИЙ СЕРЖАНТ",
  "ЛЕЙТЕНАНТ",
  "СТАРШИЙ ЛЕЙТЕНАНТ",
  "КАПИТАН",
  "МАЙОР",
  "ПОЛКОВНИК",
  "КОМАНДЕР",
];

export function rankForLevel(level: number): string {
  const idx = Math.min(RANK_TITLES.length - 1, Math.floor((level - 1) / 5));
  return RANK_TITLES[idx];
}

export interface TaskTemplate {
  code: string;
  title: string;
  description: string;
  totals: number[];
  reward: string | null;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  { code: "WIN", title: "ВЫИГРАТЬ МАТЧИ", description: "Победы в любом режиме засчитываются всем составом клана.", totals: [5, 10, 15], reward: "+40 к клановому MMR" },
  { code: "VEH", title: "УНИЧТОЖИТЬ ТЕХНИКУ", description: "Уничтоженная техника противника любой категории.", totals: [15, 25, 40], reward: "Эмблема недели" },
  { code: "OBJ", title: "ЗАХВАТИТЬ ТОЧКИ", description: "Захваты объектов в режимах «Захват» и «Блокада».", totals: [25, 40, 60], reward: "+25 к клановому MMR" },
  { code: "ELIM", title: "УНИЧТОЖИТЬ ЮНИТЫ ПРОТИВНИКА", description: "Суммарные потери, нанесённые всем составом клана.", totals: [80, 100, 150], reward: null },
  { code: "CONV", title: "ПРОВЕСТИ КОНВОИ", description: "Успешные проводки колонн в режиме «Конвой».", totals: [3, 5, 8], reward: "Камуфляж колонны" },
  { code: "HOLD", title: "УДЕРЖАТЬ ОБОРОНУ", description: "Матчи «Штурма», в которых оборона не отдала объект.", totals: [4, 6, 10], reward: null },
];
