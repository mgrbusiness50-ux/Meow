export type GeoLevel = 'country' | 'governorate' | 'markaz' | 'city' | 'village';

export interface GeoNode {
  id: string;
  name: string;
  level: GeoLevel;
  parentId: string | null;
  governorateId: string;
  markazId?: string;
  cityId?: string;
  lat: number;
  lng: number;
  aliases?: string[];
}

const rawNodes: GeoNode[] = [];

function gov(id: string, name: string, lat: number, lng: number, aliases?: string[]): string {
  rawNodes.push({
    id,
    name,
    level: 'governorate',
    parentId: 'eg',
    governorateId: id,
    lat,
    lng,
    aliases,
  });
  return id;
}

function mkz(
  id: string,
  name: string,
  governorateId: string,
  lat: number,
  lng: number,
  aliases?: string[]
): string {
  rawNodes.push({
    id,
    name,
    level: 'markaz',
    parentId: governorateId,
    governorateId,
    markazId: id,
    lat,
    lng,
    aliases,
  });
  return id;
}

function cty(
  id: string,
  name: string,
  markazId: string,
  governorateId: string,
  lat: number,
  lng: number,
  aliases?: string[]
): string {
  rawNodes.push({
    id,
    name,
    level: 'city',
    parentId: markazId,
    governorateId,
    markazId,
    cityId: id,
    lat,
    lng,
    aliases,
  });
  return id;
}

function vil(
  id: string,
  name: string,
  cityId: string,
  markazId: string,
  governorateId: string,
  lat: number,
  lng: number,
  aliases?: string[]
): string {
  rawNodes.push({
    id,
    name,
    level: 'village',
    parentId: cityId,
    governorateId,
    markazId,
    cityId,
    lat,
    lng,
    aliases,
  });
  return id;
}

// Root Country Node
rawNodes.push({
  id: 'eg',
  name: 'مصر',
  level: 'country',
  parentId: null,
  governorateId: '',
  lat: 26.8206,
  lng: 30.8025,
  aliases: ['جمهورية مصر العربية', 'Egypt'],
});

// Helper to create an urban markaz + city + neighborhoods cleanly when the urban aqsam/city hierarchy aligns
function addMarkazWithUnits(
  govId: string,
  mkzId: string,
  mkzName: string,
  mkzLat: number,
  mkzLng: number,
  cities: Array<{
    id: string;
    name: string;
    lat?: number;
    lng?: number;
    aliases?: string[];
    villages?: Array<{ id: string; name: string; lat?: number; lng?: number; aliases?: string[] }>;
  }>,
  mkzAliases?: string[]
): void {
  mkz(mkzId, mkzName, govId, mkzLat, mkzLng, mkzAliases);
  cities.forEach((c, idx) => {
    const cLat = c.lat ?? mkzLat + idx * 0.002;
    const cLng = c.lng ?? mkzLng + idx * 0.002;
    cty(c.id, c.name, mkzId, govId, cLat, cLng, c.aliases);
    c.villages?.forEach((v, vIdx) => {
      vil(
        v.id,
        v.name,
        c.id,
        mkzId,
        govId,
        v.lat ?? cLat + (vIdx + 1) * 0.0015,
        v.lng ?? cLng + (vIdx + 1) * 0.0015,
        v.aliases
      );
    });
  });
}

// ============================================================================
// 1. القاهرة (Cairo)
// ============================================================================
gov('gov_cairo', 'القاهرة', 30.0444, 31.2357, ['محافظة القاهرة', 'Cairo']);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_heliopolis', 'قسم مصر الجديدة', 30.091, 31.329, [
  {
    id: 'cty_cairo_heliopolis',
    name: 'مصر الجديدة',
    lat: 30.091,
    lng: 31.329,
    villages: [
      { id: 'vil_cairo_korba', name: 'الكوربة', lat: 30.089, lng: 31.324 },
      { id: 'vil_cairo_almaza', name: 'ألماظة', lat: 30.088, lng: 31.351 },
      { id: 'vil_cairo_ard_elgolf', name: 'أرض الجولف', lat: 30.081, lng: 31.337 },
      { id: 'vil_cairo_roxy', name: 'روكسي', lat: 30.093, lng: 31.317 },
      { id: 'vil_cairo_merghany', name: 'الميرغني', lat: 30.086, lng: 31.333 },
    ],
  },
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_nozha', 'قسم النزهة', 30.114, 31.375, [
  {
    id: 'cty_cairo_nozha',
    name: 'النزهة',
    lat: 30.114,
    lng: 31.365,
    villages: [
      { id: 'vil_cairo_sheraton', name: 'مساكن شيراتون', lat: 30.104, lng: 31.379, aliases: ['شيراتون'] },
      { id: 'vil_cairo_nozha_gadida', name: 'النزهة الجديدة', lat: 30.123, lng: 31.361 },
      { id: 'vil_cairo_hegaz', name: 'الحجاز', lat: 30.109, lng: 31.348 },
    ],
  },
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_nasr_city', 'قسم مدينة نصر', 30.056, 31.339, [
  {
    id: 'cty_cairo_nasr_1',
    name: 'مدينة نصر',
    lat: 30.056,
    lng: 31.339,
    villages: [
      { id: 'vil_cairo_abbas_akkad', name: 'عباس العقاد', lat: 30.062, lng: 31.338 },
      { id: 'vil_cairo_makram_ebeid', name: 'مكرم عبيد', lat: 30.064, lng: 31.346 },
      { id: 'vil_cairo_zahraa_nasr', name: 'زهراء مدينة نصر', lat: 30.043, lng: 31.385 },
      { id: 'vil_cairo_hay_asher', name: 'الحي العاشر', lat: 30.049, lng: 31.381 },
      { id: 'vil_cairo_hay_sades', name: 'الحي السادس', lat: 30.061, lng: 31.318 },
      { id: 'vil_cairo_ezbet_elhggana', name: 'عزبة الهجانة (مدينة الأمل)', lat: 30.068, lng: 31.391 },
    ],
  },
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_new_cairo', 'قسم القاهرة الجديدة', 30.007, 31.491, [
  {
    id: 'cty_cairo_tagamoa_5',
    name: 'التجمع الخامس',
    lat: 30.007,
    lng: 31.434,
    villages: [
      { id: 'vil_cairo_narges', name: 'حي النرجس', lat: 30.008, lng: 31.454 },
      { id: 'vil_cairo_yasmin', name: 'حي الياسمين', lat: 30.036, lng: 31.448 },
      { id: 'vil_cairo_lotus', name: 'حي اللوتس', lat: 30.024, lng: 31.498 },
      { id: 'vil_cairo_andalus', name: 'حي الأندلس', lat: 30.001, lng: 31.503 },
      { id: 'vil_cairo_banafseg', name: 'حي البنفسج', lat: 30.046, lng: 31.464 },
    ],
  },
  {
    id: 'cty_cairo_tagamoa_1',
    name: 'التجمع الأول',
    lat: 30.056,
    lng: 31.448,
    villages: [
      { id: 'vil_cairo_rehab', name: 'الرحاب', lat: 30.059, lng: 31.494 },
      { id: 'vil_cairo_qoronfol', name: 'القرنفل', lat: 30.052, lng: 31.482 },
    ],
  },
  {
    id: 'cty_cairo_madinaty',
    name: 'مدينتي',
    lat: 30.089,
    lng: 31.643,
  },
  {
    id: 'cty_cairo_tagamoa_3',
    name: 'التجمع الثالث',
    lat: 29.989,
    lng: 31.436,
    villages: [
      { id: 'vil_cairo_kattameya', name: 'القطامية', lat: 29.994, lng: 31.419 },
    ],
  },
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_shorouk_badr', 'قسم الشروق وبدر', 30.125, 31.629, [
  { id: 'cty_cairo_shorouk', name: 'الشروق', lat: 30.125, lng: 31.629 },
  { id: 'cty_cairo_badr', name: 'مدينة بدر', lat: 30.136, lng: 31.716 },
  { id: 'cty_cairo_new_admin', name: 'العاصمة الإدارية الجديدة', lat: 30.008, lng: 31.741 },
  { id: 'cty_cairo_hadayek_asima', name: 'حدائق العاصمة', lat: 30.119, lng: 31.792 },
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_maadi', 'قسم المعادي', 29.96, 31.258, [
  {
    id: 'cty_cairo_maadi',
    name: 'المعادي',
    lat: 29.96,
    lng: 31.258,
    villages: [
      { id: 'vil_cairo_degla', name: 'دجلة المعادي', lat: 29.962, lng: 31.278 },
      { id: 'vil_cairo_sakanat', name: 'ثكنات المعادي', lat: 29.954, lng: 31.257 },
      { id: 'vil_cairo_sarayat', name: 'سرايات المعادي', lat: 29.963, lng: 31.261 },
      { id: 'vil_cairo_zahraa_maadi', name: 'زهراء المعادي', lat: 29.963, lng: 31.309 },
      { id: 'vil_cairo_maadi_gadida', name: 'المعادي الجديدة', lat: 29.974, lng: 31.281 },
    ],
  },
  { id: 'cty_cairo_tora', name: 'طرة', lat: 29.936, lng: 31.284, villages: [
    { id: 'vil_cairo_tora_balad', name: 'طرة البلد', lat: 29.935, lng: 31.275 },
    { id: 'vil_cairo_tora_asmant', name: 'طرة الأسمنت', lat: 29.927, lng: 31.288 },
  ]},
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_basatin_dar', 'قسم البساتين ودار السلام', 29.985, 31.266, [
  { id: 'cty_cairo_basatin', name: 'البساتين', lat: 29.992, lng: 31.274, villages: [
    { id: 'vil_cairo_saqr_quraish', name: 'صقر قريش', lat: 29.978, lng: 31.285 },
  ]},
  { id: 'cty_cairo_dar_salam', name: 'دار السلام', lat: 29.984, lng: 31.242, villages: [
    { id: 'vil_cairo_hadayek_maadi', name: 'حدائق المعادي', lat: 29.972, lng: 31.25 },
  ]},
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_mokattam', 'قسم المقطم والخليفة', 30.011, 31.298, [
  { id: 'cty_cairo_mokattam', name: 'المقطم', lat: 30.011, lng: 31.308, villages: [
    { id: 'vil_cairo_hadaba_olya', name: 'الهضبة العليا', lat: 30.012, lng: 31.31 },
    { id: 'vil_cairo_hadaba_wosta', name: 'الهضبة الوسطى', lat: 29.995, lng: 31.296 },
    { id: 'vil_cairo_asmarat', name: 'الأسمرات', lat: 29.991, lng: 31.326 },
  ]},
  { id: 'cty_cairo_khalifa', name: 'الخليفة', lat: 30.023, lng: 31.264 },
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_west', 'أقسام وسط القاهرة والزمالك', 30.048, 31.233, [
  { id: 'cty_cairo_zamalek', name: 'الزمالك', lat: 30.061, lng: 31.219 },
  { id: 'cty_cairo_qasr_elnil', name: 'قصر النيل (جاردن سيتي ووسط البلد)', lat: 30.039, lng: 31.231, villages: [
    { id: 'vil_cairo_garden_city', name: 'جاردن سيتي', lat: 30.035, lng: 31.232 },
    { id: 'vil_cairo_wust_elbalad', name: 'وسط البلد', lat: 30.046, lng: 31.238 },
  ]},
  { id: 'cty_cairo_abdeen', name: 'عابدين', lat: 30.042, lng: 31.247 },
  { id: 'cty_cairo_boulaq', name: 'بولاق أبو العلا', lat: 30.056, lng: 31.232 },
  { id: 'cty_cairo_mosky', name: 'الموسكي وباب الشعرية', lat: 30.052, lng: 31.254 },
  { id: 'cty_cairo_sayeda_zeinab', name: 'السيدة زينب', lat: 30.031, lng: 31.241 },
  { id: 'cty_cairo_masr_qadima', name: 'مصر القديمة (المنيل)', lat: 30.018, lng: 31.227, villages: [
    { id: 'vil_cairo_manial', name: 'المنيل', lat: 30.023, lng: 31.226 },
    { id: 'vil_cairo_fustat', name: 'الفسطاط', lat: 30.008, lng: 31.234 },
  ]},
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_north', 'أقسام شمال القاهرة وشبرا', 30.088, 31.251, [
  { id: 'cty_cairo_shubra', name: 'شبرا', lat: 30.077, lng: 31.245 },
  { id: 'cty_cairo_rod_farag', name: 'روض الفرج', lat: 30.075, lng: 31.236 },
  { id: 'cty_cairo_sahel', name: 'الساحل', lat: 30.093, lng: 31.241 },
  { id: 'cty_cairo_sharabiya', name: 'الشرابية', lat: 30.083, lng: 31.261 },
  { id: 'cty_cairo_zawya', name: 'الزاوية الحمراء', lat: 30.095, lng: 31.268 },
  { id: 'cty_cairo_hadayek_qobba', name: 'حدائق القبة', lat: 30.082, lng: 31.287 },
  { id: 'cty_cairo_zaitoun', name: 'الزيتون', lat: 30.104, lng: 31.309 },
  { id: 'cty_cairo_amiriya', name: 'الأميرية', lat: 30.107, lng: 31.292 },
  { id: 'cty_cairo_waili', name: 'الوايلي (العباسية)', lat: 30.068, lng: 31.278 },
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_east_old', 'أقسام شرق القاهرة والسلام والمرج', 30.137, 31.335, [
  { id: 'cty_cairo_matariya', name: 'المطرية', lat: 30.123, lng: 31.314 },
  { id: 'cty_cairo_ain_shams', name: 'عين شمس', lat: 30.131, lng: 31.335 },
  { id: 'cty_cairo_marg', name: 'المرج', lat: 30.155, lng: 31.341, villages: [
    { id: 'vil_cairo_ezbet_nakhl', name: 'عزبة النخل', lat: 30.139, lng: 31.324 },
    { id: 'vil_cairo_marg_gedida', name: 'المرج الجديدة', lat: 30.163, lng: 31.338 },
  ]},
  { id: 'cty_cairo_salam', name: 'السلام', lat: 30.171, lng: 31.409, villages: [
    { id: 'vil_cairo_el_nahda', name: 'حي النهضة', lat: 30.181, lng: 31.434 },
  ]},
]);

addMarkazWithUnits('gov_cairo', 'mkz_cairo_helwan', 'أقسام حلوان ومايو والتبين', 29.849, 31.334, [
  { id: 'cty_cairo_helwan', name: 'حلوان', lat: 29.849, lng: 31.334, villages: [
    { id: 'vil_cairo_maasara', name: 'المعصرة', lat: 29.903, lng: 31.299 },
    { id: 'vil_cairo_hadayek_helwan', name: 'حدائق حلوان', lat: 29.874, lng: 31.315 },
    { id: 'vil_cairo_wady_hof', name: 'وادي حوف', lat: 29.882, lng: 31.312 },
  ]},
  { id: 'cty_cairo_15may', name: 'مدينة 15 مايو', lat: 29.839, lng: 31.367 },
  { id: 'cty_cairo_tebbin', name: 'التبين', lat: 29.788, lng: 31.312 },
]);

// ============================================================================
// 2. الجيزة (Giza)
// ============================================================================
gov('gov_giza', 'الجيزة', 30.0131, 31.2089, ['محافظة الجيزة', 'Giza']);

addMarkazWithUnits('gov_giza', 'mkz_giza_dokki_agouza', 'قسم الدقي والعجوزة', 30.044, 31.207, [
  { id: 'cty_giza_dokki', name: 'الدقي', lat: 30.038, lng: 31.211, villages: [
    { id: 'vil_giza_mesaha', name: 'المساحة', lat: 30.039, lng: 31.213 },
    { id: 'vil_giza_behooth', name: 'البحوث', lat: 30.036, lng: 31.202 },
  ]},
  { id: 'cty_giza_agouza', name: 'العجوزة والمهندسين', lat: 30.056, lng: 31.203, villages: [
    { id: 'vil_giza_mohandessin', name: 'المهندسين', lat: 30.056, lng: 31.201 },
    { id: 'vil_giza_mit_okba', name: 'ميت عقبة', lat: 30.058, lng: 31.196 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_omraniya_talbiya', 'قسم العمرانية والطالبية', 30.001, 31.195, [
  { id: 'cty_giza_omraniya', name: 'العمرانية', lat: 30.002, lng: 31.196, villages: [
    { id: 'vil_giza_omraniya_sharq', name: 'العمرانية الشرقية', lat: 30.002, lng: 31.204 },
    { id: 'vil_giza_omraniya_gharb', name: 'العمرانية الغربية', lat: 30.004, lng: 31.192 },
  ]},
  { id: 'cty_giza_talbiya', name: 'الطالبية', lat: 29.999, lng: 31.179, villages: [
    { id: 'vil_giza_konaysa', name: 'الكنيسة', lat: 29.991, lng: 31.186 },
  ]},
  { id: 'cty_giza_south', name: 'قسم الجيزة (المنيب وساقية مكي)', lat: 29.988, lng: 31.211, villages: [
    { id: 'vil_giza_monib', name: 'المنيب', lat: 29.981, lng: 31.212 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_haram_bulaq', 'قسم الهرم وبولاق الدكرور', 29.986, 31.148, [
  { id: 'cty_giza_haram', name: 'الهرم وفيصل', lat: 29.989, lng: 31.149, villages: [
    { id: 'vil_giza_hadayek_ahram', name: 'حدائق الأهرام', lat: 29.975, lng: 31.097 },
    { id: 'vil_giza_nazlet_samman', name: 'نزلة السمان', lat: 29.978, lng: 31.142 },
    { id: 'vil_giza_kafr_tohormos', name: 'كفر طهرمس', lat: 30.015, lng: 31.169 },
    { id: 'vil_giza_maryoutiya', name: 'المريوطية', lat: 29.994, lng: 31.144 },
  ]},
  { id: 'cty_giza_bulaq', name: 'بولاق الدكرور', lat: 30.032, lng: 31.179, villages: [
    { id: 'vil_giza_safat_laban', name: 'صفط اللبن', lat: 30.036, lng: 31.167 },
    { id: 'vil_giza_zenin', name: 'زنين', lat: 30.031, lng: 31.185 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_imbaba_warraq', 'قسم إمبابة والوراق', 30.075, 31.208, [
  { id: 'cty_giza_imbaba', name: 'إمبابة والمنيرة', lat: 30.075, lng: 31.209, villages: [
    { id: 'vil_giza_kitkat', name: 'الكيت كات', lat: 30.066, lng: 31.213 },
    { id: 'vil_giza_ard_elgameya', name: 'أرض الجمعية', lat: 30.071, lng: 31.201 },
  ]},
  { id: 'cty_giza_warraq', name: 'الوراق', lat: 30.104, lng: 31.213, villages: [
    { id: 'vil_giza_tanash', name: 'طناش', lat: 30.119, lng: 31.196 },
    { id: 'vil_giza_warrak_arab', name: 'وراق العرب', lat: 30.102, lng: 31.205 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_october', 'أقسام 6 أكتوبر والشيخ زايد', 29.961, 30.928, [
  { id: 'cty_giza_october', name: 'مدينة 6 أكتوبر', lat: 29.961, lng: 30.928, villages: [
    { id: 'vil_giza_hosary', name: 'الحي الأول والثاني (الحصري)', lat: 29.972, lng: 30.944 },
    { id: 'vil_giza_motamayez', name: 'الحي المتميز', lat: 29.988, lng: 30.968 },
    { id: 'vil_giza_west_somid', name: 'غرب سوميد', lat: 29.981, lng: 30.958 },
  ]},
  { id: 'cty_giza_hadayek_october', name: 'حدائق أكتوبر', lat: 29.914, lng: 31.023 },
  { id: 'cty_giza_sheikh_zayed', name: 'الشيخ زايد', lat: 30.044, lng: 30.978, villages: [
    { id: 'vil_giza_zayed_beverly', name: 'بيفرلي هيلز (زايد)', lat: 30.061, lng: 30.957 },
    { id: 'vil_giza_zayed_16', name: 'الحي السادس عشر', lat: 30.055, lng: 30.972 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_kardasa_awsim', 'مركز كرداسة وأوسيم ومنشأة القناطر', 30.088, 31.115, [
  { id: 'cty_giza_kardasa', name: 'كرداسة', lat: 30.032, lng: 31.111, villages: [
    { id: 'vil_giza_nahya', name: 'ناهيا', lat: 30.044, lng: 31.132 },
    { id: 'vil_giza_birk_khiam', name: 'برك الخيام', lat: 30.061, lng: 31.133 },
    { id: 'vil_giza_kafr_hakim', name: 'كفر حكيم', lat: 30.071, lng: 31.124 },
    { id: 'vil_giza_abu_rawash', name: 'أبو رواش', lat: 30.043, lng: 31.095 },
  ]},
  { id: 'cty_giza_awsim', name: 'أوسيم', lat: 30.123, lng: 31.135, villages: [
    { id: 'vil_giza_baragil', name: 'البراجيل', lat: 30.081, lng: 31.163 },
    { id: 'vil_giza_bashtil', name: 'بشتيل', lat: 30.084, lng: 31.178 },
    { id: 'vil_giza_kom_bera', name: 'كوم برة', lat: 30.105, lng: 31.128 },
  ]},
  { id: 'cty_giza_manshaat_qanater', name: 'منشأة القناطر', lat: 30.175, lng: 31.106, villages: [
    { id: 'vil_giza_nekla', name: 'نكلا', lat: 30.141, lng: 31.093 },
    { id: 'vil_giza_wardan', name: 'وردان', lat: 30.258, lng: 30.945 },
    { id: 'vil_giza_abu_ghaleb', name: 'أبو غالب', lat: 30.228, lng: 30.958 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_abu_nomros_hawamdiya', 'مركز أبو النمرس والحوامدية', 29.932, 31.239, [
  { id: 'cty_giza_abu_nomros', name: 'أبو النمرس', lat: 29.959, lng: 31.213, villages: [
    { id: 'vil_giza_manial_shiha', name: 'منيل شيحة', lat: 29.943, lng: 31.246 },
    { id: 'vil_giza_shabramant', name: 'شبرامنت', lat: 29.936, lng: 31.196 },
    { id: 'vil_giza_tarsa', name: 'ترسا', lat: 29.961, lng: 31.201 },
  ]},
  { id: 'cty_giza_hawamdiya', name: 'الحوامدية', lat: 29.898, lng: 31.258, villages: [
    { id: 'vil_giza_om_khonan', name: 'أم خنان', lat: 29.883, lng: 31.248 },
    { id: 'vil_giza_mona_amir', name: 'منى الأمير', lat: 29.914, lng: 31.252 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_badrashin_ayat', 'مركز البدرشين والعياط', 29.85, 31.269, [
  { id: 'cty_giza_badrashin', name: 'مدينة البدرشين', lat: 29.85, lng: 31.269, villages: [
    { id: 'vil_giza_saqqara', name: 'سقارة', lat: 29.869, lng: 31.219 },
    { id: 'vil_giza_mit_rahina', name: 'ميت رهينة', lat: 29.849, lng: 31.254 },
    { id: 'vil_giza_dahshur', name: 'دهشور', lat: 29.798, lng: 31.229 },
    { id: 'vil_giza_mazghona', name: 'مزغونة', lat: 29.754, lng: 31.257 },
    { id: 'vil_giza_maraziq', name: 'المرازيق', lat: 29.811, lng: 31.263 },
    { id: 'vil_giza_abu_sir_badrashin', name: 'أبو صير (البدرشين)', lat: 29.895, lng: 31.219 },
  ]},
  { id: 'cty_giza_ayat', name: 'العياط', lat: 29.619, lng: 31.257, villages: [
    { id: 'vil_giza_matania', name: 'المتانيا', lat: 29.669, lng: 31.251 },
    { id: 'vil_giza_tahma', name: 'طهما', lat: 29.644, lng: 31.239 },
    { id: 'vil_giza_bermbel_west', name: 'بيدف والقطوري', lat: 29.591, lng: 31.261 },
  ]},
]);

addMarkazWithUnits('gov_giza', 'mkz_giza_saff_atfih_wahat', 'مركز الصف وأطفيح والواحات البحرية', 29.566, 31.281, [
  { id: 'cty_giza_saff', name: 'الصف', lat: 29.566, lng: 31.281, villages: [
    { id: 'vil_giza_akhsas', name: 'الأخصاص', lat: 29.631, lng: 31.278 },
    { id: 'vil_giza_ghomaza', name: 'غمازة الكبرى', lat: 29.538, lng: 31.284 },
  ]},
  { id: 'cty_giza_atfih', name: 'أطفيح', lat: 29.409, lng: 31.252, villages: [
    { id: 'vil_giza_sol', name: 'الصول', lat: 29.364, lng: 31.242 },
    { id: 'vil_giza_birmbel', name: 'برمبل', lat: 29.442, lng: 31.254 },
    { id: 'vil_giza_keremat', name: 'الكريمات', lat: 29.277, lng: 31.227 },
  ]},
  { id: 'cty_giza_wahat', name: 'الواحات البحرية (الباويطي)', lat: 28.348, lng: 28.865, villages: [
    { id: 'vil_giza_mandisha', name: 'منديشة', lat: 28.363, lng: 28.911 },
    { id: 'vil_giza_zabou', name: 'الزبو', lat: 28.368, lng: 28.925 },
  ]},
]);

// ============================================================================
// 3. الإسكندرية (Alexandria)
// ============================================================================
gov('gov_alex', 'الإسكندرية', 31.2001, 29.9187, ['محافظة الإسكندرية', 'Alexandria']);

addMarkazWithUnits('gov_alex', 'mkz_alex_sidi_gaber', 'قسم سيدي جابر', 31.219, 29.946, [
  { id: 'cty_alex_sidi_gaber', name: 'سيدي جابر', lat: 31.219, lng: 29.946 },
  { id: 'cty_alex_smouha', name: 'سموحة', lat: 31.213, lng: 29.942 },
  { id: 'cty_alex_roshdy', name: 'رشدي وكفر عبده', lat: 31.227, lng: 29.952, villages: [
    { id: 'vil_alex_kafr_abdo', name: 'كفر عبده', lat: 31.223, lng: 29.954 },
    { id: 'vil_alex_stanley', name: 'ستانلي', lat: 31.233, lng: 29.949 },
  ]},
]);

addMarkazWithUnits('gov_alex', 'mkz_alex_raml', 'قسم أول وثان الرمل', 31.241, 29.974, [
  { id: 'cty_alex_gleem_zizinia', name: 'جليم وزيزينيا وسان ستيفانو', lat: 31.241, lng: 29.961, villages: [
    { id: 'vil_alex_san_stefano', name: 'سان ستيفانو', lat: 31.244, lng: 29.969 },
    { id: 'vil_alex_lauran', name: 'لوران', lat: 31.249, lng: 29.975 },
    { id: 'vil_alex_tharwat', name: 'ثروت', lat: 31.246, lng: 29.97 },
  ]},
  { id: 'cty_alex_fleming_gianaclis', name: 'فلمنج وباكوس وجناكليس', lat: 31.236, lng: 29.965, villages: [
    { id: 'vil_alex_bakos', name: 'باكوس', lat: 31.231, lng: 29.969 },
    { id: 'vil_alex_gianaclis', name: 'جناكليس', lat: 31.241, lng: 29.976 },
  ]},
]);

addMarkazWithUnits('gov_alex', 'mkz_alex_montaza', 'قسم أول وثان المنتزه', 31.269, 30.008, [
  { id: 'cty_alex_sidi_bishr', name: 'سيدي بشر وميامي', lat: 31.261, lng: 29.992, villages: [
    { id: 'vil_alex_miami', name: 'ميامي', lat: 31.267, lng: 29.996 },
    { id: 'vil_alex_victoria', name: 'فيكتوريا والسيوف', lat: 31.249, lng: 29.988 },
  ]},
  { id: 'cty_alex_asafra_mandara', name: 'العصافرة والمندرة والمنتزه', lat: 31.277, lng: 30.011, villages: [
    { id: 'vil_alex_maamoura', name: 'المعمورة', lat: 31.292, lng: 30.029 },
    { id: 'vil_alex_abu_qir', name: 'أبو قير', lat: 31.321, lng: 30.062 },
  ]},
]);

addMarkazWithUnits('gov_alex', 'mkz_alex_center', 'أقسام وسط الإسكندرية (باب شرق ومحرم بك والعطارين والمنشية)', 31.201, 29.908, [
  { id: 'cty_alex_bab_sharq', name: 'باب شرق والشاطبي والأزاريطة', lat: 31.207, lng: 29.914, villages: [
    { id: 'vil_alex_ibrahimiya', name: 'الإبراهيمية', lat: 31.211, lng: 29.927 },
    { id: 'vil_alex_camp_caesar', name: 'كامب شيزار', lat: 31.21, lng: 29.921 },
  ]},
  { id: 'cty_alex_attarin_manshia', name: 'محطة الرمل والعطارين والمنشية', lat: 31.199, lng: 29.899, villages: [
    { id: 'vil_alex_anfoushi', name: 'بحري والأنفوشي', lat: 31.211, lng: 29.882 },
  ]},
  { id: 'cty_alex_moharram_bek', name: 'محرم بك وكرموز', lat: 31.187, lng: 29.912 },
]);

addMarkazWithUnits('gov_alex', 'mkz_alex_west', 'قسم الدخيلة والعامرية وبرج العرب', 31.077, 29.749, [
  { id: 'cty_alex_agami', name: 'العجمي والدخيلة', lat: 31.095, lng: 29.766, villages: [
    { id: 'vil_alex_bitash', name: 'البيطاش', lat: 31.121, lng: 29.786 },
    { id: 'vil_alex_hannoville', name: 'الهانوفيل', lat: 31.096, lng: 29.763 },
  ]},
  { id: 'cty_alex_amriya', name: 'العامرية', lat: 31.022, lng: 29.798, villages: [
    { id: 'vil_alex_king_mariout', name: 'كينج مريوط', lat: 30.988, lng: 29.711 },
  ]},
  { id: 'cty_alex_borg_alarab', name: 'برج العرب الجديدة والقديمة', lat: 30.896, lng: 29.552 },
]);

// ============================================================================
// 4. القليوبية (Qalyubia)
// ============================================================================
gov('gov_qalyubia', 'القليوبية', 30.465, 31.184, ['محافظة القليوبية', 'Qalyubia']);

addMarkazWithUnits('gov_qalyubia', 'mkz_qalyubia_banha', 'مركز وقسم بنها', 30.465, 31.184, [
  { id: 'cty_qalyubia_banha', name: 'مدينة بنها وبنها الجديدة', lat: 30.465, lng: 31.184, villages: [
    { id: 'vil_qalyubia_atrib', name: 'أتريب', lat: 30.469, lng: 31.196 },
    { id: 'vil_qalyubia_mit_asim', name: 'ميت عاصم', lat: 30.435, lng: 31.168 },
    { id: 'vil_qalyubia_sandanhur', name: 'سندنهور', lat: 30.419, lng: 31.198 },
    { id: 'vil_qalyubia_marsafa', name: 'مرصفا', lat: 30.402, lng: 31.162 },
  ]},
]);

addMarkazWithUnits('gov_qalyubia', 'mkz_qalyubia_shubra', 'قسم أول وثان شبرا الخيمة والخصوص', 30.128, 31.242, [
  { id: 'cty_qalyubia_shubra', name: 'شبرا الخيمة', lat: 30.128, lng: 31.242, villages: [
    { id: 'vil_qalyubia_behtim', name: 'بهتيم', lat: 30.141, lng: 31.278 },
    { id: 'vil_qalyubia_mit_nama', name: 'ميت نما', lat: 30.155, lng: 31.237 },
    { id: 'vil_qalyubia_monsha_khater', name: 'منشية عبد المنعم رياض', lat: 30.132, lng: 31.258 },
  ]},
  { id: 'cty_qalyubia_khosos', name: 'الخصوص', lat: 30.157, lng: 31.314 },
]);

addMarkazWithUnits('gov_qalyubia', 'mkz_qalyubia_obour_khanka', 'قسم العبور ومركز الخانكة وشبين القناطر', 30.228, 31.479, [
  { id: 'cty_qalyubia_obour', name: 'مدينة العبور والعبور الجديدة', lat: 30.228, lng: 31.479, villages: [
    { id: 'vil_qalyubia_obour_golf', name: 'حي الجولف والحي الأول (العبور)', lat: 30.219, lng: 31.472 },
  ]},
  { id: 'cty_qalyubia_khanka', name: 'الخانكة', lat: 30.211, lng: 31.368, villages: [
    { id: 'vil_qalyubia_abou_zaabal', name: 'أبو زعبل', lat: 30.246, lng: 31.347 },
    { id: 'vil_qalyubia_qalag', name: 'القلج', lat: 30.175, lng: 31.362 },
    { id: 'vil_qalyubia_siryaqos', name: 'سرياقوس', lat: 30.188, lng: 31.339 },
  ]},
  { id: 'cty_qalyubia_shibin_qanater', name: 'شبين القناطر', lat: 30.312, lng: 31.321, villages: [
    { id: 'vil_qalyubia_nawa', name: 'نوى', lat: 30.278, lng: 31.268 },
    { id: 'vil_qalyubia_tahanoub', name: 'طحنوب', lat: 30.305, lng: 31.275 },
  ]},
]);

addMarkazWithUnits('gov_qalyubia', 'mkz_qalyubia_qalyub_toukh', 'مركز قليوب والقناطر وطوخ وكفر شكر', 30.179, 31.206, [
  { id: 'cty_qalyubia_qalyub', name: 'قليوب', lat: 30.179, lng: 31.206, villages: [
    { id: 'vil_qalyubia_sindyoun', name: 'سنديون', lat: 30.229, lng: 31.213 },
    { id: 'vil_qalyubia_mit_halfa', name: 'ميت حلفا', lat: 30.165, lng: 31.224 },
  ]},
  { id: 'cty_qalyubia_qanater', name: 'القناطر الخيرية', lat: 30.193, lng: 31.137, villages: [
    { id: 'vil_qalyubia_shalqan', name: 'شلقان', lat: 30.178, lng: 31.148 },
    { id: 'vil_qalyubia_bassous', name: 'باسوس', lat: 30.148, lng: 31.178 },
  ]},
  { id: 'cty_qalyubia_toukh', name: 'طوخ وقها', lat: 30.354, lng: 31.201, villages: [
    { id: 'vil_qalyubia_moshtohor', name: 'مشتهر', lat: 30.351, lng: 31.239 },
    { id: 'vil_qalyubia_aghour', name: 'أجهور الكبرى', lat: 30.289, lng: 31.149 },
    { id: 'vil_qalyubia_namool', name: 'نامول', lat: 30.312, lng: 31.233 },
  ]},
  { id: 'cty_qalyubia_kafr_shokr', name: 'كفر شكر', lat: 30.546, lng: 31.266, villages: [
    { id: 'vil_qalyubia_esnit', name: 'أسنيت', lat: 30.517, lng: 31.246 },
  ]},
]);

// ============================================================================
// 5. الدقهلية (Dakahlia)
// ============================================================================
gov('gov_dakahlia', 'الدقهلية', 31.0409, 31.3785, ['محافظة الدقهلية', 'Dakahlia']);

addMarkazWithUnits('gov_dakahlia', 'mkz_dakahlia_mansoura', 'مركز وقسم المنصورة', 31.0409, 31.3785, [
  { id: 'cty_dakahlia_mansoura', name: 'المنصورة', lat: 31.0409, lng: 31.3785, villages: [
    { id: 'vil_dakahlia_torel', name: 'حي توريل والجامعة', lat: 31.042, lng: 31.391 },
    { id: 'vil_dakahlia_awish_hagar', name: 'أويش الحجر', lat: 30.985, lng: 31.368 },
    { id: 'vil_dakahlia_shawa', name: 'شاوة', lat: 31.028, lng: 31.441 },
    { id: 'vil_dakahlia_sandoub', name: 'سندوب', lat: 31.021, lng: 31.373 },
  ]},
  { id: 'cty_dakahlia_talkha', name: 'طلخا ونبروه', lat: 31.053, lng: 31.377, villages: [
    { id: 'vil_dakahlia_mit_antar', name: 'ميت عنتر', lat: 31.064, lng: 31.392 },
    { id: 'vil_dakahlia_kafra_tawila', name: 'كفر الطويلة', lat: 31.089, lng: 31.351 },
  ]},
]);

addMarkazWithUnits('gov_dakahlia', 'mkz_dakahlia_north', 'مركز بلقاس وشربين وجمصة والمنصورة الجديدة', 31.213, 31.361, [
  { id: 'cty_dakahlia_belqas', name: 'بلقاس', lat: 31.213, lng: 31.361, villages: [
    { id: 'vil_dakahlia_basandila', name: 'بسنديلة', lat: 31.266, lng: 31.425 },
  ]},
  { id: 'cty_dakahlia_gamasa', name: 'جمصة والمنصورة الجديدة', lat: 31.441, lng: 31.531 },
  { id: 'cty_dakahlia_sherbin', name: 'شربين', lat: 31.196, lng: 31.524, villages: [
    { id: 'vil_dakahlia_ras_elkhaleeg', name: 'رأس الخليج', lat: 31.251, lng: 31.564 },
  ]},
]);

addMarkazWithUnits('gov_dakahlia', 'mkz_dakahlia_south', 'مركز ميت غمر والسنبلاوين وأجا', 30.715, 31.259, [
  { id: 'cty_dakahlia_mit_ghamr', name: 'ميت غمر', lat: 30.715, lng: 31.259, villages: [
    { id: 'vil_dakahlia_mit_mohsen', name: 'ميت محسن', lat: 30.768, lng: 31.318 },
    { id: 'vil_dakahlia_damas', name: 'دماص', lat: 30.799, lng: 31.341 },
  ]},
  { id: 'cty_dakahlia_sinbellawin', name: 'السنبلاوين وتمي الأمديد', lat: 30.883, lng: 31.459, villages: [
    { id: 'vil_dakahlia_bermabal', name: 'برمبال وتمي الأمديد', lat: 30.922, lng: 31.522 },
  ]},
  { id: 'cty_dakahlia_aga', name: 'أجا', lat: 30.941, lng: 31.292, villages: [
    { id: 'vil_dakahlia_nosa_ghit', name: 'نوسا الغيط', lat: 30.996, lng: 31.312 },
  ]},
]);

addMarkazWithUnits('gov_dakahlia', 'mkz_dakahlia_east', 'مركز دكرنس ومنية النصر والمنزلة والمطرية', 31.089, 31.594, [
  { id: 'cty_dakahlia_dekernes', name: 'دكرنس وبني عبيد ومحلة دمنة', lat: 31.089, lng: 31.594 },
  { id: 'cty_dakahlia_menyet_nasr', name: 'منية النصر والكردي وميت سلسيل', lat: 31.124, lng: 31.644 },
  { id: 'cty_dakahlia_manzala', name: 'المنزلة والجمالية والمطرية (الدقهلية)', lat: 31.158, lng: 31.936 },
]);

// ============================================================================
// 6. الشرقية (Sharqia)
// ============================================================================
gov('gov_sharqia', 'الشرقية', 30.5877, 31.502, ['محافظة الشرقية', 'Sharqia']);

addMarkazWithUnits('gov_sharqia', 'mkz_sharqia_zagazig', 'مركز وقسم الزقازيق والقنايات', 30.5877, 31.502, [
  { id: 'cty_sharqia_zagazig', name: 'الزقازيق', lat: 30.5877, lng: 31.502, villages: [
    { id: 'vil_sharqia_kawmia', name: 'حي القومية وفلل الجامعة', lat: 30.586, lng: 31.491 },
    { id: 'vil_sharqia_shaiba', name: 'شيبة النكارية', lat: 30.573, lng: 31.478 },
    { id: 'vil_sharqia_bardin', name: 'بردين', lat: 30.491, lng: 31.471 },
    { id: 'vil_sharqia_zankalon', name: 'الزنكلون', lat: 30.546, lng: 31.448 },
  ]},
  { id: 'cty_sharqia_qanayat', name: 'القنايات', lat: 30.619, lng: 31.461 },
]);

addMarkazWithUnits('gov_sharqia', 'mkz_sharqia_ramadan_belbeis', 'قسم العاشر من رمضان ومركز بلبيس ومشتول السوق', 30.296, 31.741, [
  { id: 'cty_sharqia_10ramadan', name: 'العاشر من رمضان', lat: 30.296, lng: 31.741, villages: [
    { id: 'vil_sharqia_ramadan_mujawara', name: 'الأردنية والمجاورات', lat: 30.304, lng: 31.737 },
  ]},
  { id: 'cty_sharqia_belbeis', name: 'بلبيس', lat: 30.421, lng: 31.561, villages: [
    { id: 'vil_sharqia_inshas', name: 'أنشاص الرمل', lat: 30.369, lng: 31.454 },
  ]},
  { id: 'cty_sharqia_mashtoul', name: 'مشتول السوق', lat: 30.358, lng: 31.38 },
]);

addMarkazWithUnits('gov_sharqia', 'mkz_sharqia_minya_hehya', 'مركز منيا القمح وههيا وديرب نجم والإبراهيمية', 30.514, 31.348, [
  { id: 'cty_sharqia_minya_qamh', name: 'منيا القمح', lat: 30.514, lng: 31.348, villages: [
    { id: 'vil_sharqia_al_aziziya', name: 'العزيزية', lat: 30.493, lng: 31.326 },
  ]},
  { id: 'cty_sharqia_hehya', name: 'ههيا والإبراهيمية', lat: 30.671, lng: 31.588 },
  { id: 'cty_sharqia_deirb_negm', name: 'ديرب نجم', lat: 30.752, lng: 31.454 },
]);

addMarkazWithUnits('gov_sharqia', 'mkz_sharqia_faqous_north', 'مركز فاقوس وأبو حماد وأبو كبير والحسينية وكفر صقر', 30.728, 31.797, [
  { id: 'cty_sharqia_faqous', name: 'فاقوس والصالحية الجديدة والقرين', lat: 30.728, lng: 31.797 },
  { id: 'cty_sharqia_abu_hammad', name: 'أبو حماد وأبو كبير', lat: 30.531, lng: 31.671 },
  { id: 'cty_sharqia_kafr_saqr', name: 'كفر صقر وأولاد صقر', lat: 30.799, lng: 31.622 },
  { id: 'cty_sharqia_hussainiya', name: 'الحسينية وصان الحجر ومنشأة أبو عمر', lat: 30.861, lng: 31.916 },
]);

// ============================================================================
// 7. الغربية (Gharbia)
// ============================================================================
gov('gov_gharbia', 'الغربية', 30.7865, 31.0004, ['محافظة الغربية', 'Gharbia']);

addMarkazWithUnits('gov_gharbia', 'mkz_gharbia_tanta', 'مركز وقسم طنطا', 30.7865, 31.0004, [
  { id: 'cty_gharbia_tanta', name: 'طنطا', lat: 30.7865, lng: 31.0004, villages: [
    { id: 'vil_gharbia_seberbay', name: 'سبرباي', lat: 30.819, lng: 31.016 },
    { id: 'vil_gharbia_shobra_namla', name: 'شبرا النملة', lat: 30.799, lng: 30.946 },
    { id: 'vil_gharbia_mahalla_marhoum', name: 'محلة مرحوم', lat: 30.806, lng: 30.955 },
  ]},
]);

addMarkazWithUnits('gov_gharbia', 'mkz_gharbia_mahalla', 'مركز وقسم المحلة الكبرى وسمنود', 30.9706, 31.1669, [
  { id: 'cty_gharbia_mahalla', name: 'المحلة الكبرى', lat: 30.9706, lng: 31.1669, villages: [
    { id: 'vil_gharbia_sandisis', name: 'سندسيس', lat: 30.938, lng: 31.224 },
    { id: 'vil_gharbia_mahalla_abu_ali', name: 'محلة أبو علي', lat: 30.985, lng: 31.209 },
  ]},
  { id: 'cty_gharbia_samannoud', name: 'سمنود', lat: 30.961, lng: 31.241, villages: [
    { id: 'vil_gharbia_mahalla_zeyad', name: 'محلة زياد', lat: 30.916, lng: 31.239 },
  ]},
]);

addMarkazWithUnits('gov_gharbia', 'mkz_gharbia_zefta_santa', 'مركز زفتى والسنطة', 30.713, 31.241, [
  { id: 'cty_gharbia_zefta', name: 'زفتى', lat: 30.713, lng: 31.241 },
  { id: 'cty_gharbia_santa', name: 'السنطة', lat: 30.747, lng: 31.132 },
]);

addMarkazWithUnits('gov_gharbia', 'mkz_gharbia_kafrzayat_basyoun', 'مركز كفر الزيات وبسيون وقطور', 30.824, 30.816, [
  { id: 'cty_gharbia_kafr_zayat', name: 'كفر الزيات', lat: 30.824, lng: 30.816, villages: [
    { id: 'vil_gharbia_ebiar', name: 'إبيار', lat: 30.815, lng: 30.871 },
  ]},
  { id: 'cty_gharbia_basyoun', name: 'بسيون', lat: 30.935, lng: 30.813 },
  { id: 'cty_gharbia_qutour', name: 'قطور', lat: 30.972, lng: 30.955 },
]);

// ============================================================================
// 8. المنوفية (Monufia)
// ============================================================================
gov('gov_monufia', 'المنوفية', 30.5586, 31.012, ['محافظة المنوفية', 'Monufia']);

addMarkazWithUnits('gov_monufia', 'mkz_monufia_shibin', 'مركز وقسم شبين الكوم وبركة السبع وتلا والشهداء', 30.5586, 31.012, [
  { id: 'cty_monufia_shibin', name: 'شبين الكوم', lat: 30.5586, lng: 31.012, villages: [
    { id: 'vil_monufia_elmay', name: 'المي', lat: 30.517, lng: 30.985 },
    { id: 'vil_monufia_el_batanoon', name: 'البتانون', lat: 30.608, lng: 31.011 },
  ]},
  { id: 'cty_monufia_birket_sabaa', name: 'بركة السبع', lat: 30.631, lng: 31.084 },
  { id: 'cty_monufia_tala', name: 'تلا', lat: 30.681, lng: 30.942 },
  { id: 'cty_monufia_shohada', name: 'الشهداء', lat: 30.596, lng: 30.899 },
]);

addMarkazWithUnits('gov_monufia', 'mkz_monufia_menouf_ashmoun', 'مركز منوف وأشمون والباجور وقويسنا وسرس الليان', 30.466, 30.931, [
  { id: 'cty_monufia_menouf', name: 'منوف وسرس الليان', lat: 30.466, lng: 30.931 },
  { id: 'cty_monufia_ashmoun', name: 'أشمون', lat: 30.298, lng: 30.978, villages: [
    { id: 'vil_monufia_sobk_ahad', name: 'سبك الأحد', lat: 30.334, lng: 30.989 },
  ]},
  { id: 'cty_monufia_bagour', name: 'الباجور', lat: 30.431, lng: 31.033 },
  { id: 'cty_monufia_quesna', name: 'قويسنا', lat: 30.562, lng: 31.148 },
]);

addMarkazWithUnits('gov_monufia', 'mkz_monufia_sadat', 'قسم ومركز السادات', 30.381, 30.526, [
  { id: 'cty_monufia_sadat', name: 'مدينة السادات', lat: 30.381, lng: 30.526, villages: [
    { id: 'vil_monufia_el_khatatba', name: 'الخطاطبة', lat: 30.344, lng: 30.824 },
  ]},
]);

// ============================================================================
// 9. البحيرة (Beheira)
// ============================================================================
gov('gov_beheira', 'البحيرة', 31.036, 30.468, ['محافظة البحيرة', 'Beheira']);

addMarkazWithUnits('gov_beheira', 'mkz_beheira_damanhour', 'مركز وقسم دمنهور وأبو حمص وإيتاي البارود', 31.036, 30.468, [
  { id: 'cty_beheira_damanhour', name: 'دمنهور', lat: 31.036, lng: 30.468, villages: [
    { id: 'vil_beheira_shobrakheit', name: 'شبراخيت والرحمانية والمحمودية', lat: 31.028, lng: 30.713 },
  ]},
  { id: 'cty_beheira_abu_hommos', name: 'أبو حمص', lat: 31.098, lng: 30.312 },
  { id: 'cty_beheira_etay_baroud', name: 'إيتاي البارود', lat: 30.885, lng: 30.663, villages: [
    { id: 'vil_beheira_nikla_enab', name: 'نكلا العنب', lat: 30.873, lng: 30.717 },
  ]},
]);

addMarkazWithUnits('gov_beheira', 'mkz_beheira_kafr_dawar', 'مركز وقسم كفر الدوار ورشيد وإدكو', 31.132, 30.129, [
  { id: 'cty_beheira_kafr_dawar', name: 'كفر الدوار', lat: 31.132, lng: 30.129 },
  { id: 'cty_beheira_rashid', name: 'رشيد', lat: 31.404, lng: 30.416 },
  { id: 'cty_beheira_edku', name: 'إدكو', lat: 31.307, lng: 30.299 },
]);

addMarkazWithUnits('gov_beheira', 'mkz_beheira_desert_west', 'مركز كوم حمادة وبدر والنوبارية ووادي النطرون والدلنجات', 30.761, 30.697, [
  { id: 'cty_beheira_kom_hamada', name: 'كوم حمادة', lat: 30.761, lng: 30.697 },
  { id: 'cty_beheira_delengat', name: 'الدلنجات وحوش عيسى وأبو المطامير', lat: 30.826, lng: 30.535 },
  { id: 'cty_beheira_badr', name: 'مركز بدر (البحيرة) والنوبارية الجديدة', lat: 30.576, lng: 30.714 },
  { id: 'cty_beheira_wadi_natroun', name: 'وادي النطرون', lat: 30.376, lng: 30.354 },
]);

// ============================================================================
// 10. كفر الشيخ (Kafr El Sheikh)
// ============================================================================
gov('gov_kafr', 'كفر الشيخ', 31.1107, 30.9388, ['محافظة كفر الشيخ', 'Kafr El Sheikh']);

addMarkazWithUnits('gov_kafr', 'mkz_kafr_center', 'مركز وقسم كفر الشيخ والرياض وقلين وسيدي سالم', 31.1107, 30.9388, [
  { id: 'cty_kafr_city', name: 'كفر الشيخ ومسير', lat: 31.1107, lng: 30.9388 },
  { id: 'cty_kafr_qellin', name: 'قلين وسيدي سالم والرياض (كفر الشيخ)', lat: 31.046, lng: 30.854 },
]);

addMarkazWithUnits('gov_kafr', 'mkz_kafr_west', 'مركز دسوق وفوة ومطوبس', 31.132, 30.648, [
  { id: 'cty_kafr_desouk', name: 'دسوق', lat: 31.132, lng: 30.648, villages: [
    { id: 'vil_kafr_shaba', name: 'شباس الشهداء', lat: 31.158, lng: 30.714 },
  ]},
  { id: 'cty_kafr_fowa_motobas', name: 'فوة ومطوبس', lat: 31.203, lng: 30.549 },
]);

addMarkazWithUnits('gov_kafr', 'mkz_kafr_east', 'مركز بيلا والحامول والبرلس (بلطيم)', 31.175, 31.221, [
  { id: 'cty_kafr_bella_hamoul', name: 'بيلا والحامول', lat: 31.175, lng: 31.221 },
  { id: 'cty_kafr_baltim', name: 'بلطيم وبرج البرلس ومصيف بلطيم', lat: 31.554, lng: 31.093 },
]);

// ============================================================================
// 11. دمياط (Damietta)
// ============================================================================
gov('gov_damietta', 'دمياط', 31.4175, 31.8144, ['محافظة دمياط', 'Damietta']);

addMarkazWithUnits('gov_damietta', 'mkz_damietta_center', 'مركز وقسم دمياط ورأس البر ودمياط الجديدة', 31.4175, 31.8144, [
  { id: 'cty_damietta_city', name: 'دمياط وعزبة البرج', lat: 31.4175, lng: 31.8144, villages: [
    { id: 'vil_damietta_shuaraa', name: 'الشعراء', lat: 31.401, lng: 31.818 },
    { id: 'vil_damietta_ezbet_borg', name: 'عزبة البرج', lat: 31.503, lng: 31.841 },
  ]},
  { id: 'cty_damietta_ras_bar', name: 'رأس البر', lat: 31.511, lng: 31.838 },
  { id: 'cty_damietta_new', name: 'دمياط الجديدة', lat: 31.434, lng: 31.671 },
]);

addMarkazWithUnits('gov_damietta', 'mkz_damietta_south', 'مركز فارسكور والزرقا وكفر سعد وكفر البطيخ', 31.329, 31.716, [
  { id: 'cty_damietta_faraskour', name: 'فارسكور والزرقا والسرو والروضة', lat: 31.329, lng: 31.716 },
  { id: 'cty_damietta_kafr_saad', name: 'كفر سعد وكفر البطيخ وميت أبو غالب', lat: 31.356, lng: 31.685 },
]);

// ============================================================================
// 12. بورسعيد (Port Said)
// ============================================================================
gov('gov_portsaid', 'بورسعيد', 31.2653, 32.3019, ['محافظة بورسعيد', 'Port Said']);

addMarkazWithUnits('gov_portsaid', 'mkz_portsaid_city', 'أقسام بورسعيد (الشرق والمناخ والعرب والزهور والضواحي)', 31.2653, 32.3019, [
  { id: 'cty_portsaid_sharq', name: 'حي الشرق وحي العرب', lat: 31.267, lng: 32.308 },
  { id: 'cty_portsaid_manakh_zohour', name: 'حي المناخ وحي الزهور', lat: 31.266, lng: 32.275 },
  { id: 'cty_portsaid_dawahy_janoub', name: 'حي الضواحي وحي الغرب وحي الجنوب', lat: 31.241, lng: 32.271 },
]);

addMarkazWithUnits('gov_portsaid', 'mkz_portsaid_portfouad', 'قسم مدينة بورفؤاد', 31.247, 32.317, [
  { id: 'cty_portsaid_portfouad', name: 'بورفؤاد', lat: 31.247, lng: 32.317 },
]);

// ============================================================================
// 13. الإسماعيلية (Ismailia)
// ============================================================================
gov('gov_ismailia', 'الإسماعيلية', 30.5965, 32.2715, ['محافظة الإسماعيلية', 'Ismailia']);

addMarkazWithUnits('gov_ismailia', 'mkz_ismailia_center', 'أقسام ومركز الإسماعيلية وأبو صوير', 30.5965, 32.2715, [
  { id: 'cty_ismailia_city', name: 'الإسماعيلية والإسماعيلية الجديدة', lat: 30.5965, lng: 32.2715, villages: [
    { id: 'vil_ismailia_nafiesha', name: 'نفيشة', lat: 30.569, lng: 32.244 },
  ]},
  { id: 'cty_ismailia_abu_suweir', name: 'أبو صوير والتل الكبير والقصاصين الجديدة', lat: 30.561, lng: 32.104 },
]);

addMarkazWithUnits('gov_ismailia', 'mkz_ismailia_fayed_qantara', 'مركز فايد والقنطرة شرق والقنطرة غرب', 30.326, 32.301, [
  { id: 'cty_ismailia_fayed', name: 'فايد', lat: 30.326, lng: 32.301, villages: [
    { id: 'vil_ismailia_abu_sultan', name: 'أبو سلطان وسرابيوم', lat: 30.415, lng: 32.303 },
  ]},
  { id: 'cty_ismailia_qantara', name: 'القنطرة شرق والقنطرة غرب', lat: 30.851, lng: 32.312 },
]);

// ============================================================================
// 14. السويس (Suez)
// ============================================================================
gov('gov_suez', 'السويس', 29.9668, 32.5498, ['محافظة السويس', 'Suez']);

addMarkazWithUnits('gov_suez', 'mkz_suez_city', 'أقسام السويس (السويس والأربعين وفيصل وعتاقة والجناين)', 29.9668, 32.5498, [
  { id: 'cty_suez_suez', name: 'حي السويس وبورتوفيق', lat: 29.965, lng: 32.556 },
  { id: 'cty_suez_arbaeen_faisal', name: 'حي الأربعين وحي فيصل', lat: 29.974, lng: 32.521 },
  { id: 'cty_suez_ataqa_sokhna', name: 'حي عتاقة والعين السخنة وحي الجناين', lat: 29.602, lng: 32.319, villages: [
    { id: 'vil_suez_sokhna', name: 'العين السخنة', lat: 29.602, lng: 32.319 },
    { id: 'vil_suez_ganayen', name: 'قرى الجناين (كبريت وجنيفة)', lat: 30.088, lng: 32.519 },
  ]},
]);

// ============================================================================
// 15. الفيوم (Fayoum)
// ============================================================================
gov('gov_fayoum', 'الفيوم', 29.3084, 30.8428, ['محافظة الفيوم', 'Fayoum']);

addMarkazWithUnits('gov_fayoum', 'mkz_fayoum_center', 'مركز وقسم الفيوم وسنورس وطامية', 29.3084, 30.8428, [
  { id: 'cty_fayoum_city', name: 'الفيوم والفيوم الجديدة', lat: 29.3084, lng: 30.8428, villages: [
    { id: 'vil_fayoum_seila', name: 'سيلا ودمو', lat: 29.368, lng: 30.922 },
  ]},
  { id: 'cty_fayoum_sinnuris', name: 'سنورس وطامية', lat: 29.409, lng: 30.866, villages: [
    { id: 'vil_fayoum_fedemin', name: 'فيديمين', lat: 29.373, lng: 30.788 },
  ]},
]);

addMarkazWithUnits('gov_fayoum', 'mkz_fayoum_west', 'مركز إطسا وأبشواي ويوسف الصديق', 29.238, 30.791, [
  { id: 'cty_fayoum_itsa', name: 'إطسا', lat: 29.238, lng: 30.791 },
  { id: 'cty_fayoum_ibshaway_youssef', name: 'أبشواي ويوسف الصديق', lat: 29.359, lng: 30.681, villages: [
    { id: 'vil_fayoum_tunis', name: 'قرية تونس (بحيرة قارون)', lat: 29.423, lng: 30.489 },
  ]},
]);

// ============================================================================
// 16. بني سويف (Beni Suef)
// ============================================================================
gov('gov_benisuef', 'بني سويف', 29.0661, 31.0994, ['محافظة بني سويف', 'Beni Suef']);

addMarkazWithUnits('gov_benisuef', 'mkz_benisuef_center', 'مركز وقسم بني سويف وناصر والواسطى', 29.0661, 31.0994, [
  { id: 'cty_benisuef_city', name: 'بني سويف وبني سويف الجديدة', lat: 29.0661, lng: 31.0994 },
  { id: 'cty_benisuef_nasser', name: 'ناصر (بوش)', lat: 29.146, lng: 31.124 },
  { id: 'cty_benisuef_wasta', name: 'الواسطى', lat: 29.338, lng: 31.206, villages: [
    { id: 'vil_benisuef_meidum', name: 'ميدوم', lat: 29.388, lng: 31.157 },
  ]},
]);

addMarkazWithUnits('gov_benisuef', 'mkz_benisuef_south', 'مركز إهناسيا وببا والفشن وسمسطا', 28.918, 30.985, [
  { id: 'cty_benisuef_ehnasia', name: 'إهناسيا', lat: 29.086, lng: 30.935 },
  { id: 'cty_benisuef_beba', name: 'ببا وسمسطا والفشن', lat: 28.918, lng: 30.985 },
]);

// ============================================================================
// 17. المنيا (Minya)
// ============================================================================
gov('gov_minya', 'المنيا', 28.1099, 30.7503, ['محافظة المنيا', 'Minya']);

addMarkazWithUnits('gov_minya', 'mkz_minya_center', 'مركز وقسم المنيا وسمالوط وأبو قرقاص', 28.1099, 30.7503, [
  { id: 'cty_minya_city', name: 'المنيا والمنيا الجديدة', lat: 28.1099, lng: 30.7503, villages: [
    { id: 'vil_minya_talla', name: 'تلة ودمشير', lat: 28.128, lng: 30.706 },
  ]},
  { id: 'cty_minya_samalut', name: 'سمالوط', lat: 28.311, lng: 30.708 },
  { id: 'cty_minya_abou_qorqas', name: 'أبو قرقاص (الفكرية)', lat: 27.931, lng: 30.838 },
]);

addMarkazWithUnits('gov_minya', 'mkz_minya_north', 'مركز مغاغة وبني مزار ومطاي والعدوة', 28.649, 30.841, [
  { id: 'cty_minya_maghagha', name: 'مغاغة والعدوة (المنيا)', lat: 28.649, lng: 30.841 },
  { id: 'cty_minya_beni_mazar', name: 'بني مزار ومطاي', lat: 28.496, lng: 30.803 },
]);

addMarkazWithUnits('gov_minya', 'mkz_minya_south', 'مركز ملوي ودير مواس', 27.731, 30.842, [
  { id: 'cty_minya_mallawi', name: 'ملوي ودير مواس', lat: 27.731, lng: 30.842, villages: [
    { id: 'vil_minya_tuna_elgabal', name: 'تونا الجبل وتل العمارنة', lat: 27.741, lng: 30.709 },
  ]},
]);

// ============================================================================
// 18. أسيوط (Assiut)
// ============================================================================
gov('gov_assiut', 'أسيوط', 27.1783, 31.1859, ['محافظة أسيوط', 'Assiut']);

addMarkazWithUnits('gov_assiut', 'mkz_assiut_center', 'مركز وقسم أسيوط وأبنوب والفتح', 27.1783, 31.1859, [
  { id: 'cty_assiut_city', name: 'أسيوط وأسيوط الجديدة', lat: 27.1783, lng: 31.1859, villages: [
    { id: 'vil_assiut_mankabad', name: 'منقباد', lat: 27.203, lng: 31.106 },
  ]},
  { id: 'cty_assiut_abnoub_fath', name: 'أبنوب والفتح', lat: 27.269, lng: 31.151 },
]);

addMarkazWithUnits('gov_assiut', 'mkz_assiut_north', 'مركز ديروط والقوصية ومنفلوط', 27.556, 30.807, [
  { id: 'cty_assiut_dayrout', name: 'ديروط والقوصية', lat: 27.556, lng: 30.807 },
  { id: 'cty_assiut_manfalut', name: 'منفلوط', lat: 27.311, lng: 30.971 },
]);

addMarkazWithUnits('gov_assiut', 'mkz_assiut_south', 'مركز أبو تيج وصدفا والغنايم وساحل سليم والبداري', 27.044, 31.318, [
  { id: 'cty_assiut_abou_tig', name: 'أبو تيج وصدفا والغنايم', lat: 27.044, lng: 31.318 },
  { id: 'cty_assiut_sahel_badari', name: 'ساحل سليم والبداري', lat: 27.001, lng: 31.384 },
]);

// ============================================================================
// 19. سوهاج (Sohag)
// ============================================================================
gov('gov_sohag', 'سوهاج', 26.559, 31.6957, ['محافظة سوهاج', 'Sohag']);

addMarkazWithUnits('gov_sohag', 'mkz_sohag_center', 'مركز وقسم سوهاج وأخميم وساقلتة والمراغة والمنشأة', 26.559, 31.6957, [
  { id: 'cty_sohag_city', name: 'سوهاج وسوهاج الجديدة', lat: 26.559, lng: 31.6957 },
  { id: 'cty_sohag_akhmim', name: 'أخميم وأخميم الجديدة وساقلتة', lat: 26.564, lng: 31.745 },
  { id: 'cty_sohag_maragha_menshaa', name: 'المراغة والمنشأة', lat: 26.699, lng: 31.603 },
]);

addMarkazWithUnits('gov_sohag', 'mkz_sohag_north', 'مركز طهطا وطما وجهينة', 26.769, 31.502, [
  { id: 'cty_sohag_tahta_tama', name: 'طهطا وطما وجهينة', lat: 26.769, lng: 31.502 },
]);

addMarkazWithUnits('gov_sohag', 'mkz_sohag_south', 'مركز جرجا والبلينا ودار السلام والعسيرات', 26.338, 31.891, [
  { id: 'cty_sohag_girga_balyana', name: 'جرجا والبلينا والعسيرات', lat: 26.338, lng: 31.891, villages: [
    { id: 'vil_sohag_abydos', name: 'العرابة المدفونة (أبيدوس)', lat: 26.185, lng: 31.919 },
  ]},
  { id: 'cty_sohag_dar_salam', name: 'دار السلام (أولاد طوق)', lat: 26.265, lng: 32.047 },
]);

// ============================================================================
// 20. قنا (Qena)
// ============================================================================
gov('gov_qena', 'قنا', 26.1551, 32.716, ['محافظة قنا', 'Qena']);

addMarkazWithUnits('gov_qena', 'mkz_qena_center', 'مركز وقسم قنا وقوص وقفط ونقادة', 26.1551, 32.716, [
  { id: 'cty_qena_city', name: 'قنا وقنا الجديدة', lat: 26.1551, lng: 32.716, villages: [
    { id: 'vil_qena_dandara', name: 'دندرة', lat: 26.142, lng: 32.67 },
  ]},
  { id: 'cty_qena_qous_qift_naqada', name: 'قوص وقفط ونقادة', lat: 25.914, lng: 32.764 },
]);

addMarkazWithUnits('gov_qena', 'mkz_qena_north', 'مركز نجع حمادي ودشنا وأبو تشت وفرشوط والوقف', 26.049, 32.241, [
  { id: 'cty_qena_nag_hammadi', name: 'نجع حمادي ودشنا والوقف', lat: 26.049, lng: 32.241 },
  { id: 'cty_qena_abou_tesht', name: 'أبو تشت وفرشوط', lat: 26.115, lng: 32.118 },
]);

// ============================================================================
// 21. الأقصر (Luxor)
// ============================================================================
gov('gov_luxor', 'الأقصر', 25.6872, 32.6396, ['محافظة الأقصر', 'Luxor']);

addMarkazWithUnits('gov_luxor', 'mkz_luxor_center', 'قسم ومركز الأقصر وطيبة والبياضية والزينية والقرنة', 25.6872, 32.6396, [
  { id: 'cty_luxor_city', name: 'الأقصر وطيبة الجديدة والزينية والبياضية', lat: 25.6872, lng: 32.6396, villages: [
    { id: 'vil_luxor_karnak', name: 'الكرنك', lat: 25.718, lng: 32.657 },
  ]},
  { id: 'cty_luxor_qurna', name: 'القرنة (البر الغربي)', lat: 25.729, lng: 32.607 },
]);

addMarkazWithUnits('gov_luxor', 'mkz_luxor_south', 'مركز أرمنت وإسنا', 25.293, 32.554, [
  { id: 'cty_luxor_armant', name: 'أرمنت', lat: 25.622, lng: 32.536 },
  { id: 'cty_luxor_esna', name: 'إسنا', lat: 25.293, lng: 32.554 },
]);

// ============================================================================
// 22. أسوان (Aswan)
// ============================================================================
gov('gov_aswan', 'أسوان', 24.0889, 32.8998, ['محافظة أسوان', 'Aswan']);

addMarkazWithUnits('gov_aswan', 'mkz_aswan_center', 'مركز وقسم أسوان ودراو وأبو سمبل', 24.0889, 32.8998, [
  { id: 'cty_aswan_city', name: 'أسوان وأسوان الجديدة', lat: 24.0889, lng: 32.8998, villages: [
    { id: 'vil_aswan_gharb_suheil', name: 'غرب سهيل', lat: 24.058, lng: 32.868 },
  ]},
  { id: 'cty_aswan_daraw', name: 'دراو', lat: 24.404, lng: 32.927 },
  { id: 'cty_aswan_abu_simbel', name: 'أبو سمبل السياحية', lat: 22.346, lng: 31.616 },
]);

addMarkazWithUnits('gov_aswan', 'mkz_aswan_north', 'مركز كوم أمبو وإدفو ونصر النوبة', 24.476, 32.946, [
  { id: 'cty_aswan_kom_ombo', name: 'كوم أمبو ونصر النوبة', lat: 24.476, lng: 32.946 },
  { id: 'cty_aswan_edfu', name: 'إدفو والسباعية والرديسية والبصيلية', lat: 24.978, lng: 32.875 },
]);

// ============================================================================
// 23. البحر الأحمر (Red Sea)
// ============================================================================
gov('gov_redsea', 'البحر الأحمر', 27.2579, 33.8116, ['محافظة البحر الأحمر', 'Red Sea']);

addMarkazWithUnits('gov_redsea', 'mkz_redsea_hurghada', 'قسم أول وثان الغردقة ورأس غارب', 27.2579, 33.8116, [
  { id: 'cty_redsea_hurghada', name: 'الغردقة', lat: 27.2579, lng: 33.8116, villages: [
    { id: 'vil_redsea_elgouna', name: 'الجونة', lat: 27.394, lng: 33.678 },
    { id: 'vil_redsea_sahl_hasheesh', name: 'سهل حشيش ومكادي باي', lat: 27.039, lng: 33.889 },
  ]},
  { id: 'cty_redsea_ras_ghareb', name: 'رأس غارب', lat: 28.358, lng: 33.077 },
]);

addMarkazWithUnits('gov_redsea', 'mkz_redsea_south', 'قسم سفاجا والقصير ومرسى علم والشلاتين وحلايب', 26.749, 33.936, [
  { id: 'cty_redsea_safaga_quseir', name: 'سفاجا والقصير', lat: 26.749, lng: 33.936 },
  { id: 'cty_redsea_marsa_alam', name: 'مرسى علم والشلاتين وحلايب', lat: 25.067, lng: 34.879 },
]);

// ============================================================================
// 24. الوادي الجديد (New Valley)
// ============================================================================
gov('gov_newvalley', 'الوادي الجديد', 25.439, 30.5586, ['محافظة الوادي الجديد', 'New Valley']);

addMarkazWithUnits('gov_newvalley', 'mkz_newvalley_kharga', 'مركز الخارجة وباريس', 25.439, 30.5586, [
  { id: 'cty_newvalley_kharga', name: 'الخارجة وباريس', lat: 25.439, lng: 30.5586 },
]);

addMarkazWithUnits('gov_newvalley', 'mkz_newvalley_dakhla', 'مركز الداخلة والفرافرة وبلاط', 25.495, 28.983, [
  { id: 'cty_newvalley_dakhla', name: 'الداخلة (موط) وبلاط والفرافرة', lat: 25.495, lng: 28.983, villages: [
    { id: 'vil_newvalley_qasr', name: 'القصر الإسلامية (الداخلة)', lat: 25.694, lng: 28.885 },
  ]},
]);

// ============================================================================
// 25. مطروح (Matrouh)
// ============================================================================
gov('gov_matrouh', 'مطروح', 31.3543, 27.2373, ['محافظة مطروح', 'Matrouh']);

addMarkazWithUnits('gov_matrouh', 'mkz_matrouh_marsa', 'مركز وقسم مرسى مطروح والنجيلة وبراني والسلوم', 31.3543, 27.2373, [
  { id: 'cty_matrouh_marsa', name: 'مرسى مطروح', lat: 31.3543, lng: 27.2373 },
  { id: 'cty_matrouh_west', name: 'النجيلة وسيدي براني والسلوم', lat: 31.611, lng: 25.925 },
]);

addMarkazWithUnits('gov_matrouh', 'mkz_matrouh_alamein_east', 'قسم العلمين ومركز الحمام والضبعة وواحة سيوة', 30.835, 28.955, [
  { id: 'cty_matrouh_alamein', name: 'العلمين والعلمين الجديدة والحمام والضبعة', lat: 30.835, lng: 28.955, villages: [
    { id: 'vil_matrouh_sidi_abdelrahman', name: 'سيدي عبد الرحمن ومراسي', lat: 30.971, lng: 28.729 },
  ]},
  { id: 'cty_matrouh_siwa', name: 'سيوة', lat: 29.203, lng: 25.519 },
]);

// ============================================================================
// 26. شمال سيناء (North Sinai)
// ============================================================================
gov('gov_northsinai', 'شمال سيناء', 31.1321, 33.8033, ['محافظة شمال سيناء', 'North Sinai']);

addMarkazWithUnits('gov_northsinai', 'mkz_northsinai_arish', 'أقسام العريش والشيخ زويد ورفح', 31.1321, 33.8033, [
  { id: 'cty_northsinai_arish', name: 'العريش والشيخ زويد ورفح', lat: 31.1321, lng: 33.8033 },
]);

addMarkazWithUnits('gov_northsinai', 'mkz_northsinai_west', 'مركز بئر العبد والحسنة ونخل', 31.019, 33.012, [
  { id: 'cty_northsinai_bir_elabd', name: 'بئر العبد والحسنة ونخل', lat: 31.019, lng: 33.012 },
]);

// ============================================================================
// 27. جنوب سيناء (South Sinai)
// ============================================================================
gov('gov_southsinai', 'جنوب سيناء', 27.9158, 34.3299, ['محافظة جنوب سيناء', 'South Sinai']);

addMarkazWithUnits('gov_southsinai', 'mkz_southsinai_sharm', 'قسم شرم الشيخ ودهب ونويبع وطابا', 27.9158, 34.3299, [
  { id: 'cty_southsinai_sharm', name: 'شرم الشيخ', lat: 27.9158, lng: 34.3299 },
  { id: 'cty_southsinai_dahab_nuweiba', name: 'دهب ونويبع وطابا', lat: 28.509, lng: 34.513 },
]);

addMarkazWithUnits('gov_southsinai', 'mkz_southsinai_tor', 'قسم طور سيناء ورأس سدر وأبو رديس وأبو زنيمة وسانت كاترين', 28.241, 33.622, [
  { id: 'cty_southsinai_tor', name: 'طور سيناء وسانت كاترين', lat: 28.241, lng: 33.622 },
  { id: 'cty_southsinai_ras_sudr', name: 'رأس سدر وأبو زنيمة وأبو رديس', lat: 29.593, lng: 32.711 },
]);

export const INITIAL_EGYPT_GEO_NODES: GeoNode[] = rawNodes;
