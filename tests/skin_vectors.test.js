'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const InspectLink = require('../src/InspectLink');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wearLabel(w) {
  if (w == null)  return null;
  if (w < 0.07)   return 'Factory New';
  if (w < 0.15)   return 'Minimal Wear';
  if (w < 0.38)   return 'Field-Tested';
  if (w < 0.45)   return 'Well-Worn';
  return 'Battle-Scarred';
}

// Memoized decode — avoids repeating deserialization inside each test()
function decoded(url) {
  decoded._cache ??= new Map();
  if (!decoded._cache.has(url)) decoded._cache.set(url, InspectLink.deserialize(url));
  return decoded._cache.get(url);
}

// ---------------------------------------------------------------------------
// Data-driven helpers
// ---------------------------------------------------------------------------

/**
 * Weapon skin vector: verifies defIndex, paintIndex, quality, rarity, wear label.
 * @param {string} name - human-readable test name (market_hash_name)
 * @param {string} url  - full steam:// inspect URL
 * @param {object} exp  - { defIndex, paintIndex, quality, rarity, wear }
 */
function weaponSkin(name, url, exp) {
  describe(name, () => {
    test('defIndex',   () => assert.equal(decoded(url).defIndex,   exp.defIndex));
    test('paintIndex', () => assert.equal(decoded(url).paintIndex, exp.paintIndex));
    test('quality',    () => assert.equal(decoded(url).quality,    exp.quality));
    test('rarity',     () => assert.equal(decoded(url).rarity,     exp.rarity));
    test(`wear = ${exp.wear}`, () => assert.equal(wearLabel(decoded(url).paintWear), exp.wear));
  });
}

/**
 * Direct item vector (sticker / patch / sticker-slab / charm):
 * paintIndex=0, paintWear=null, exactly one sticker or keychain.
 * @param {string} name
 * @param {string} url
 * @param {object} exp  - { defIndex, quality, rarity, stickerId }
 */
function directItem(name, url, exp) {
  describe(name, () => {
    test('defIndex',   () => assert.equal(decoded(url).defIndex,   exp.defIndex));
    test('quality',    () => assert.equal(decoded(url).quality,    exp.quality));
    test('rarity',     () => assert.equal(decoded(url).rarity,     exp.rarity));
    test('paintIndex = 0',   () => assert.equal(decoded(url).paintIndex, 0));
    test('paintWear = null', () => assert.equal(decoded(url).paintWear,  null));
    test('stickerId', () => {
      const item = decoded(url);
      const st = item.stickers?.length === 1
        ? item.stickers[0]
        : item.keychains?.length === 1
          ? item.keychains[0]
          : null;
      assert.ok(st !== null, 'expected exactly one sticker or keychain');
      assert.equal(st.stickerId ?? st.id, exp.stickerId);
    });
  });
}

// ===========================================================================
// ★ Bloodhound Gloves (defIndex 5027, quality 3)
// ===========================================================================

describe('★ Bloodhound Gloves', () => {
  // paintIndex 10008 = Bronzed
  weaponSkin('Bronzed (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20F1E14F7170744AF0E952D6D169BFD9F7C1F2C938153108F2B161F39972717171FD81F9D607BE76',
    { defIndex: 5027, paintIndex: 10008, quality: 3, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Bronzed (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FCEC7B22160146FDE45FDBDC64B2D4FACCFFC451041B08FFBC27FE947F7C7C7CF08CF441179E5F',
    { defIndex: 5027, paintIndex: 10008, quality: 3, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Bronzed (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20F7E7117909734CF6EF54D0D76FB9DFF1C7F4CF3C702218F4B73AF49F74777777FB87FF000E319B',
    { defIndex: 5027, paintIndex: 10008, quality: 3, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Bronzed (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20E1F1217F6A7D54E0F942C6C179AFC9E7D1E2D915607316E2A1A6891AE291E916B2B89B',
    { defIndex: 5027, paintIndex: 10008, quality: 3, rarity: 6, wear: 'Well-Worn' });

  // paintIndex 10006 = Charred
  weaponSkin('Charred (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20EAFA0F6B3E1852EBF249CDCA7CA4C2ECDAE9D259500613E9AA7BEF82696A6A6AE69AE2AF10A3C6',
    { defIndex: 5027, paintIndex: 10006, quality: 3, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Charred (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FCEC5249776046FDE45FDBDC6AB2D4FACCFFC434264108FFBC77FD947F7C7C7CF08CF8CE65E0F6',
    { defIndex: 5027, paintIndex: 10006, quality: 3, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Charred (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FBEB1D63136340FAE358DCDB6DB5D3FDCBF8C34F057C0BF8BB08F893787B7B7BF78BF313E44EC3',
    { defIndex: 5027, paintIndex: 10006, quality: 3, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Charred (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FDED276F2A5E46FCE55EDADD6BB3D5FBCDFEC547565C0BFEBD0EFC957E7D7D7DF18DF558ECF64F',
    { defIndex: 5027, paintIndex: 10006, quality: 3, rarity: 6, wear: 'Well-Worn' });

  // paintIndex 10039 = Guerrilla
  weaponSkin('Guerrilla (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20DCCC55757F786DDDC47FFBFC6B92F4DAECDFE453075026DF9C84B45ADDACD46B7B0A25',
    { defIndex: 5027, paintIndex: 10039, quality: 3, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Guerrilla (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20F7E72B15430C46F6EF54D0D740B9DFF1C7F4CF0A754F04F4B7F99F74777777FB87FFB98F90F7',
    { defIndex: 5027, paintIndex: 10039, quality: 3, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Guerrilla (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20F9E9477B764F4EF8E15ADED94EB7D1FFC9FAC16A132809FAB96EFD917A797979F589FD6E589782',
    { defIndex: 5027, paintIndex: 10039, quality: 3, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Guerrilla (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20C7D742037F267EC6DF64E0E77089EFC1F7C4FF66213631C4870BC4AF44474747CBB7C3911C75AA',
    { defIndex: 5027, paintIndex: 10039, quality: 3, rarity: 6, wear: 'Well-Worn' });
});

// ===========================================================================
// Patch (defIndex 4609, quality 4, paintIndex 0 — direct item)
// ===========================================================================

describe('Patch', () => {
  directItem('Abandon Hope',
    'steam://run/730//+csgo_econ_action_preview%20CEDECED64FEAEECEE6CDFECAACCBC6CEDE07E8A6CEBED9B4AECB2C',
    { defIndex: 4609, quality: 4, rarity: 3, stickerId: 4937 });
  directItem('Alyx',
    'steam://run/730//+csgo_econ_action_preview%20EEFEEEF66FCACEEEC6EBDEEA8CEBE6EEFE03CD86EE9EE6E3D9881D',
    { defIndex: 4609, quality: 4, rarity: 5, stickerId: 4589 });
  directItem('Anchors Aweigh',
    'steam://run/730//+csgo_econ_action_preview%20CEDECED64FEAEECEE6CDFECAACCBC6CEDE04E8A6CEBED9CCAF7F76',
    { defIndex: 4609, quality: 4, rarity: 3, stickerId: 4938 });
  directItem('Aquatic Offensive',
    'steam://run/730//+csgo_econ_action_preview%20AFBFAFB72E8B8FAF87AA9FABCDAAA7AFBF7C89C7AFDFB827205F48',
    { defIndex: 4609, quality: 4, rarity: 5, stickerId: 4947 });
  directItem('Astralis (Gold) | Stockholm 2021',
    'steam://run/730//+csgo_econ_action_preview%204656465EC76266466E42764224434E4656AC612E46364EF9CAB405',
    { defIndex: 4609, quality: 4, rarity: 4, stickerId: 5098 });
  directItem('Astralis | Stockholm 2021',
    'steam://run/730//+csgo_econ_action_preview%20E4F4E4FC65C0C4E4CCE7D4E086E1ECE4F40DC38CE494ECAE0ACB4A',
    { defIndex: 4609, quality: 4, rarity: 3, stickerId: 5097 });
  directItem('BIG (Gold) | Stockholm 2021',
    'steam://run/730//+csgo_econ_action_preview%20EFFFEFF76ECBCFEFC7EBDFEB8DEAE7EFFF1FC887EF9FE73A5B9A39',
    { defIndex: 4609, quality: 4, rarity: 4, stickerId: 5104 });
  directItem('BIG | Stockholm 2021',
    'steam://run/730//+csgo_econ_action_preview%20DDCDDDC55CF9FDDDF5DEEDD9BFD8D5DDCD32FAB5DDADD54AEBB682',
    { defIndex: 4609, quality: 4, rarity: 3, stickerId: 5103 });
  directItem('Bayonet Frog',
    'steam://run/730//+csgo_econ_action_preview%20BCACBCA43D989CBC94B98CB8DEB9B4BCAC709AD4BCCCAB7429E7E6',
    { defIndex: 4609, quality: 4, rarity: 5, stickerId: 4940 });
  directItem('Black Mesa',
    'steam://run/730//+csgo_econ_action_preview%20ECFCECF46DC8CCECC4E8DCE88EE9E4ECFC19CF84EC9CE4AACE4670',
    { defIndex: 4609, quality: 4, rarity: 4, stickerId: 4597 });
});

// ===========================================================================
// Sticker (defIndex 1209, quality 4, paintIndex 0 — direct item)
// ===========================================================================

describe('Sticker', () => {
  directItem('sk0R (Glitter) | Antwerp 2022',
    'steam://run/730//+csgo_econ_action_preview%200A1A0A12B3032A0A220E3A0E680F020A1ABB27620A7A027C088379',
    { defIndex: 1209, quality: 4, rarity: 4, stickerId: 5809 });
  directItem('sk0R (Glitter) | Paris 2023',
    'steam://run/730//+csgo_econ_action_preview%20BAAABAA203B39ABA92BE8ABED8BFB2BAAA1C82D2BACAB2986CD642',
    { defIndex: 1209, quality: 4, rarity: 4, stickerId: 7206 });
  directItem('sk0R (Glitter) | Rio 2022',
    'steam://run/730//+csgo_econ_action_preview%20E3F3E3FB5AEAC3E3CBE7D3E781E6EBE3F308D18BE393EBD4D234F8',
    { defIndex: 1209, quality: 4, rarity: 4, stickerId: 6507 });
  directItem('sk0R (Gold) | Antwerp 2022',
    'steam://run/730//+csgo_econ_action_preview%206373637BDA6A43634B65536701666B6373D04E0B63136B33D061C4',
    { defIndex: 1209, quality: 4, rarity: 6, stickerId: 5811 });
  directItem('sk0R (Gold) | Budapest 2025',
    'steam://run/730//+csgo_econ_action_preview%206E7E6E76D7674E6E46685E6A0C6B666E7EE73E066E1E665BFA0985',
    { defIndex: 1209, quality: 4, rarity: 6, stickerId: 10249 });
  directItem('sk0R (Gold) | Paris 2023',
    'steam://run/730//+csgo_econ_action_preview%207E6E7E66C7775E7E56784E7A1C7B767E6ED646167E0E76E66314CC',
    { defIndex: 1209, quality: 4, rarity: 6, stickerId: 7208 });
  directItem('sk0R (Gold) | Rio 2022',
    'steam://run/730//+csgo_econ_action_preview%2050405048E9597050785660543255585040BD62385020585020EB74',
    { defIndex: 1209, quality: 4, rarity: 6, stickerId: 6509 });
  directItem('sk0R (Holo) | Budapest 2025',
    'steam://run/730//+csgo_econ_action_preview%20D4C4D4CC6DDDF4D4FCD1E4D0B6D1DCD4C45C84BCD4A4DC5488C954',
    { defIndex: 1209, quality: 4, rarity: 5, stickerId: 10248 });
  directItem('Doppler Poison Frog (Foil)',
    'steam://run/730//+csgo_econ_action_preview%20FFEFFFE746F6DFFFD7FACFFB9DFAF7FFEF45D997FF8FE88D6A7CAA',
    { defIndex: 1209, quality: 4, rarity: 5, stickerId: 4922 });
});

// ===========================================================================
// Sticker Slab (defIndex 1355, quality 8, paintIndex 0 — direct item)
// ===========================================================================

describe('Sticker Slab', () => {
  directItem('100 Thieves (Holo) | 2020 RMR',
    'steam://run/730//+csgo_econ_action_preview%20D6C6D6CE1DDCF6D6FED2E6DEBED6A6D674D7D1DED6C6F3B674F3DAD42436',
    { defIndex: 1355, quality: 8, rarity: 4, stickerId: 37 });
  directItem('3DMAX (Foil) | Austin 2025',
    'steam://run/730//+csgo_econ_action_preview%2071617169BA7B51715975417919710171D370767971615411E232AAD13E39',
    { defIndex: 1355, quality: 8, rarity: 4, stickerId: 37 });
  directItem('3DMAX | Budapest 2025',
    'steam://run/730//+csgo_econ_action_preview%20F6E6F6EE3DFCD6F6DEF5C6FE9EF686F654F7F1FEF6E6D3964BBCCA75A74E',
    { defIndex: 1355, quality: 8, rarity: 3, stickerId: 37 });
  directItem('910 | Copenhagen 2024',
    'steam://run/730//+csgo_econ_action_preview%20BCACBCA477B69CBC94BF8CB4D4BCCCBC1EBDBBB4BCAC99DC0780F1F5B66C',
    { defIndex: 1355, quality: 8, rarity: 3, stickerId: 37 });
  directItem('9INE (Glitter) | Paris 2023',
    'steam://run/730//+csgo_econ_action_preview%202F3F2F37E4250F2F072B1F27472F5F2F8D2E28272F3F0A4FC21C9C92B837',
    { defIndex: 1355, quality: 8, rarity: 4, stickerId: 37 });
  directItem('9INE (Holo) | Paris 2023',
    'steam://run/730//+csgo_econ_action_preview%200717071FCC0D27072F02370F6F077707A506000F07172267E93468900DE7',
    { defIndex: 1355, quality: 8, rarity: 5, stickerId: 37 });
  directItem('9z Team (Glitter) | Rio 2022',
    'steam://run/730//+csgo_econ_action_preview%2079697961B2735979517D497111790979DB787E7179695C19935796311761',
    { defIndex: 1355, quality: 8, rarity: 4, stickerId: 37 });
  directItem('9z Team (Gold) | Antwerp 2022',
    'steam://run/730//+csgo_econ_action_preview%20A3B3A3BB68A983A38BA593ABCBA3D3A301A2A4ABA3B386C3558A9CBFB4EB',
    { defIndex: 1355, quality: 8, rarity: 6, stickerId: 37 });
});

// ===========================================================================
// Sticker Slab — paintKit field (proto field 12 inside Sticker sub-message)
// keychains[0].stickerId is always 37 (placeholder); paintKit holds the
// actual slab variant ID.
// ===========================================================================

describe('Sticker Slab — paintKit', () => {
  describe('rarity=5, paintKit=7256', () => {
    const url = 'steam://run/730//+csgo_econ_action_preview%20918191895A9BB191B994A199F991E191339096999181B4F149A98D5C0889';
    test('defIndex = 1355',           () => assert.equal(decoded(url).defIndex,              1355));
    test('paintIndex = 0',            () => assert.equal(decoded(url).paintIndex,               0));
    test('rarity = 5',                () => assert.equal(decoded(url).rarity,                   5));
    test('quality = 8',               () => assert.equal(decoded(url).quality,                  8));
    test('keychains.length = 1',      () => assert.equal(decoded(url).keychains.length,          1));
    test('keychains[0].stickerId = 37', () => assert.equal(decoded(url).keychains[0].stickerId, 37));
    test('keychains[0].paintKit = 7256', () => assert.equal(decoded(url).keychains[0].paintKit, 7256));
  });

  describe('rarity=3, paintKit=275', () => {
    const url = 'steam://run/730//+csgo_econ_action_preview%20CBDBCBD300C1EBCBE3C8FBC3A3CBBBCB69CACCC3CBDBEEAB58C9B8B67C83';
    test('defIndex = 1355',           () => assert.equal(decoded(url).defIndex,              1355));
    test('rarity = 3',                () => assert.equal(decoded(url).rarity,                   3));
    test('quality = 8',               () => assert.equal(decoded(url).quality,                  8));
    test('keychains.length = 1',      () => assert.equal(decoded(url).keychains.length,          1));
    test('keychains[0].stickerId = 37', () => assert.equal(decoded(url).keychains[0].stickerId, 37));
    test('keychains[0].paintKit = 275', () => assert.equal(decoded(url).keychains[0].paintKit,  275));
  });
});

// ===========================================================================
// Charm / Keychain (defIndex 1355, quality 4, paintIndex 0 — direct item)
// ===========================================================================

describe('Charm', () => {
  directItem('Big Brain',
    'steam://run/730//+csgo_econ_action_preview%20FEEE6A7D77764CFFE635F4DEFED6FACEFA96FF8EE95CFFF9F6FEEEC3AE22F26C84C0CC',
    { defIndex: 1355, quality: 4, rarity: 4, stickerId: 61 });
  directItem('Big Kev',
    'steam://run/730//+csgo_econ_action_preview%20FFEF5F6D740345FEE734F5DFFFD7FCCFFB977C7F7F7FF38FE85DFEF7F7FFEFF7AF5249FA2B9B368D',
    { defIndex: 1355, quality: 4, rarity: 3, stickerId: 8 });
  directItem('Biomech',
    'steam://run/730//+csgo_econ_action_preview%20FFEF6227781351FEE734F5DFFFD7FCCFFB9777FD8FE85DFEF7F7FFEFC1AF1D35FCE73EF887',
    { defIndex: 1355, quality: 4, rarity: 3, stickerId: 62 });
  directItem('Bomb Tag',
    'steam://run/730//+csgo_econ_action_preview%20FDED0F75110E46FCE536F7DDFDD5F9CDF9957E7D7D7DF18DFD5FFCF5F5FDEDB5AD7F7FFE3EDD1F37',
    { defIndex: 1355, quality: 4, rarity: 4, stickerId: 72 });
  directItem('Butane Buddy',
    'steam://run/730//+csgo_econ_action_preview%20FEEE50136D5B44FFE635F4DEFED6F8CEFA96B68EE95CFFF6F6FEEEAFAE1476FFC3A69860',
    { defIndex: 1355, quality: 4, rarity: 6, stickerId: 81 });
  directItem("Chicken Lil'",
    'steam://run/730//+csgo_econ_action_preview%20FFEF62304D0449FEE734F5DFFFD7FBCFFB97FE8FE85DFEF7F7FFEFFAAF2F6FFA1A5F3FA1',
    { defIndex: 1355, quality: 4, rarity: 4, stickerId: 5 });
  directItem('Dead Weight',
    'steam://run/730//+csgo_econ_action_preview%20FFEF4152411B51FEE734F5DFFFD7FCCFFB978C8FE85DFEF7F7FFEFD6AF156DFB6E8D3FE1',
    { defIndex: 1355, quality: 4, rarity: 3, stickerId: 41 });
  directItem('Diamond Dog',
    'steam://run/730//+csgo_econ_action_preview%20FFEF2019453344FEE734F5DFFFD7FACFFB977C7F7F7FF38FE85DFEF7F7FFEFF4AF2702FAFDEA17DD',
    { defIndex: 1355, quality: 4, rarity: 5, stickerId: 11 });
  directItem('Die-cast AK',
    'steam://run/730//+csgo_econ_action_preview%20FFEF6343494B44FEE734F5DFFFD7FBCFFB97CA8FE85DFEF7F7FFEFEDAF211AFB3F819387',
    { defIndex: 1355, quality: 4, rarity: 4, stickerId: 18 });
  directItem('Diner Dog',
    'steam://run/730//+csgo_econ_action_preview%20FAEA4502227C41FBE231F0DAFAD2FFCAFE92797A7A7AF68AFA58FBF2F2FAEAF7AA4650F943A72452',
    { defIndex: 1355, quality: 4, rarity: 5, stickerId: 13 });
  directItem('Disco MAC',
    'steam://run/730//+csgo_econ_action_preview%20FEEE4C7A740844FFE635F4DEFED6FACEFA967D7E7E7EF28EE95CFFF6F6FEEEE7AE0452FF9064A0FA',
    { defIndex: 1355, quality: 4, rarity: 4, stickerId: 25 });
  directItem('Dr. Brian',
    'steam://run/730//+csgo_econ_action_preview%20FFEF7760520046FEE734F5DFFFD7FBCFFB97E68FE85DFEF7F7FFEFADAF286FFE5A62D843',
    { defIndex: 1355, quality: 4, rarity: 4, stickerId: 82 });
});

// ===========================================================================
// M249 (defIndex 14, quality 4)
// ===========================================================================

describe('M249', () => {
  // paintIndex 902 = Aztec
  weaponSkin('Aztec (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FAEA4C181C3C4DFBE2F4DA7CFDD2FECAFEC27D4A6303F9BA69FB92797A7A7AF68AF2CBF9853A',
    { defIndex: 14, paintIndex: 902, quality: 4, rarity: 4, wear: 'Battle-Scarred' });
  weaponSkin('Aztec (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF5F19062B49FEE7F1DF79F8D7FBCFFBC76F100114FCBF4AF9977C7F7F7FF38FF762CB77DF',
    { defIndex: 14, paintIndex: 902, quality: 4, rarity: 4, wear: 'Factory New' });
  weaponSkin('Aztec (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF123D380548FEE7F1DF79F8D7FBCFFBC7254F470AFCBF00FA977C7F7F7FF38FFB820A385F',
    { defIndex: 14, paintIndex: 902, quality: 4, rarity: 4, wear: 'Field-Tested' });
  weaponSkin('Aztec (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20F9E95C11097543F8E1F7D97FFED1FDC9FDC130734209FAB9C6917A797979F589F1BB959C74',
    { defIndex: 14, paintIndex: 902, quality: 4, rarity: 4, wear: 'Minimal Wear' });
  weaponSkin('Aztec (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF2D7C370195E7F1DF79F8D7FBCFFBC705277508FCBF7CFE97E78FF71C3B8649',
    { defIndex: 14, paintIndex: 902, quality: 4, rarity: 4, wear: 'Well-Worn' });

  // paintIndex 75 = Blizzard Marbleized
  weaponSkin('Blizzard Marbleized (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20CDDD66012C1977CCD5C3ED86E5CFFDC9F5792A7534CE8D52C8A54E4D4D4DC1BDCDDB82C8B9',
    { defIndex: 14, paintIndex: 75, quality: 4, rarity: 2, wear: 'Battle-Scarred' });
  weaponSkin('Blizzard Marbleized (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20F8E83E687F1E42F9E0F6D8B3D0FAC8FCC0264C4514FBB831F99AF7F0F9E870C2C568619D45BDA84915449AF7F0FBE870C2C534923BC6BD187AE6469AF7F0FBE870C2C5D3A150C6BD1823FF469AF7F0FBE870C2C5F8E7B843BDD88283C49AF7F0F8E870C2C504476346BD08CC55C4907BFA88FCED3A19E8',
    { defIndex: 14, paintIndex: 75, quality: 4, rarity: 2, wear: 'Factory New' });
  weaponSkin('Blizzard Marbleized (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20BDAD5470307210BCA5B39DF695BF8DB9851E77564FBEFD1ABBD536BFCDBD8BB92549',
    { defIndex: 14, paintIndex: 75, quality: 4, rarity: 2, wear: 'Field-Tested' });
  weaponSkin('Blizzard Marbleized (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%207B6BC6E2C99BC17A63755B3053794B7F43FB90D38B783BBF79137A0B7BB4E85527',
    { defIndex: 14, paintIndex: 75, quality: 4, rarity: 2, wear: 'Minimal Wear' });
  weaponSkin('Blizzard Marbleized (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20E1F10A297F095AE0F9EFC1AAC9E3D1E5D953766A17E2A111E38962616161ED91E1ABC42BAA',
    { defIndex: 14, paintIndex: 75, quality: 4, rarity: 2, wear: 'Well-Worn' });
});

// ===========================================================================
// AK-47 (defIndex 7, quality 4)
// ===========================================================================

describe('AK-47', () => {
  // paintIndex 1397 = Aphrodite
  weaponSkin('Aphrodite (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF6505056144FEE7F8DF0AF5D7F9CFFBC72B147B07FCBF36F8977C7F7F7FF38FE8A4E1089F',
    { defIndex: 7, paintIndex: 1397, quality: 4, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Aphrodite (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20F8E8274E436B42F9E0FFD80DF2D0FEC8FCC032144A1FFBB866F99036F988EFD520D55D',
    { defIndex: 7, paintIndex: 1397, quality: 4, rarity: 6, wear: 'Factory New' });
  weaponSkin('Aphrodite (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE49231A7444FFE6F9DE0BF4D6F8CEFAC620064C0BFDBE66FD967CFC8EE992E8F506',
    { defIndex: 7, paintIndex: 1397, quality: 4, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Aphrodite (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FDED3D312B0E47FCE5FADD08F7D5FBCDF9C51E170310FEBD22F9957E7D7D7DF18DEAD801493D',
    { defIndex: 7, paintIndex: 1397, quality: 4, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Aphrodite (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF531A393944FEE7F8DF0AF5D7F9CFFBC702562E09FCBF00FD9DF0F7FCEF46B3C23F6559C4BABFDB27C4977C7F7F7FF38FE8068F5D0E',
    { defIndex: 7, paintIndex: 1397, quality: 4, rarity: 6, wear: 'Well-Worn' });

  // paintIndex 474 = Aquamarine Revenge
  weaponSkin('Aquamarine Revenge (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF725F241745FEE7F8DF25FCD7F9CFFBC736065A07FCBF53FB9DEBF7FDEF1BCCD2FFFFEF3EC21BD56943BA7DC6A5C19DEBF7FFEF1BCCD2FFFFDDBCC21E0FC841BA3552CCC19DE6F7FFEF1BCCE25B8FC2C0D2FFFF3FBFC24F15DE41BA0BE9DBC19DE6F7FCEF1BCCE2CCCCCCC0D2FFFFCEBCC2AF0BCFC1BACBE7FEC19DE6F7FCEF1BCCE2D6A3B0C0D2FFFF0F3EC27160BDC1BACBE715C2977C7F7F7FF38FFB1BDDA49A',
    { defIndex: 7, paintIndex: 474, quality: 4, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Aquamarine Revenge (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF03373B0949FEE7F8DF25FCD7F9CFFBC75C094313FCBF2DFD977C7F7F7FF38FFB494F34FF',
    { defIndex: 7, paintIndex: 474, quality: 4, rarity: 6, wear: 'Factory New' });
  weaponSkin('Aquamarine Revenge (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF6A23074D49FEE7F8DF25FCD7F9CFFBC72814340BFCBF25F8977C7F7F7FF38FFBEBE6D31F',
    { defIndex: 7, paintIndex: 474, quality: 4, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Aquamarine Revenge (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF4A37370945FEE7F8DF25FCD7F9CFFBC7273C0510FCBFD89DFAF7FFEF7BDA9DFAF7FEEF7BDA9DFAF7FDEF7BDA9DFAF7FCEF7BDA977C7F7F7FF38FFBAFB624C3',
    { defIndex: 7, paintIndex: 474, quality: 4, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Aquamarine Revenge (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF71011D5444FEE7F8DF25FCD7F9CFFBC74A442609FCBF77FE977C7F7F7FF38FF7BC2AF89F',
    { defIndex: 7, paintIndex: 474, quality: 4, rarity: 6, wear: 'Well-Worn' });
});

// ===========================================================================
// ★ Bayonet (defIndex 500, quality 3)
// ===========================================================================

describe('★ Bayonet', () => {
  // paintIndex 573 = Autotronic
  weaponSkin('Autotronic (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FAEA52740E3F40FBE20EF9DA47FED2FCCAF9C2197A3A02F9BA73FE927AF88AFE20017CC6',
    { defIndex: 500, paintIndex: 573, quality: 3, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Autotronic (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20ACBC2B713B7316ADB458AF8C11A884AA9CAF943E66514BAFEC18ADC42F2C2C2CA0DCA49199870A',
    { defIndex: 500, paintIndex: 573, quality: 3, rarity: 6, wear: 'Factory New' });
  weaponSkin('Autotronic (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20F1E1021A7F0846F0E905F2D14CF5D9F7C1F2C913051804F2B1A899FE81F55419B9C5',
    { defIndex: 500, paintIndex: 573, quality: 3, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Autotronic (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20DECE60204A7962DFC62ADDFE63DAF6D8EEDDE61E581030DD9E3FDBB65C5E5E5ED2AEDA765F48ED',
    { defIndex: 500, paintIndex: 573, quality: 3, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Autotronic (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20ABBB6948385811AAB35FA88B16AF83AD9BA8931754125DA8EB15ADC3282B2B2BA7DBAF056B4C1A',
    { defIndex: 500, paintIndex: 573, quality: 3, rarity: 6, wear: 'Well-Worn' });

  // paintIndex 563 = Black Laminate
  weaponSkin('Black Laminate (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20E9F967421B6A52E8F11DEAC95AEDC1EFD9EAD151357A13EAA9F0816A696969E599E15044EAC9',
    { defIndex: 500, paintIndex: 563, quality: 3, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Black Laminate (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20CFDF5348555374CED73BCCEF7CCBE7C9FFCCF74D495E25CC8F0ECEA74C4F4F4FC3BFC78B3F99C6',
    { defIndex: 500, paintIndex: 563, quality: 3, rarity: 6, wear: 'Factory New' });
  weaponSkin('Black Laminate (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20F8E84955755F43F9E00CFBD84BFCD0FEC8FBC01E2D340DFBB805F9907B787878F488FC03325642',
    { defIndex: 500, paintIndex: 563, quality: 3, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Black Laminate (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20F3E3345C484558F2EB07F0D340F7DBF5C3F0CB1D6E4403F0B34DF69BF283FB61FD04F4',
    { defIndex: 500, paintIndex: 563, quality: 3, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Black Laminate (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20F1E13D7E785A4BF0E905F2D142F5D9F7C1F2C95B523B07F2B105F29972717171FD81F5D3A10FB3',
    { defIndex: 500, paintIndex: 563, quality: 3, rarity: 6, wear: 'Well-Worn' });

  // Doppler — paintIndex encodes phase: 418=Phase1, 421=Phase4
  weaponSkin('Doppler Phase 4 (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF4873655244FEE70BFCDF5AFCD7F9CFFCC7674F4B1AFCBFC4977C7F7F7FF38FFBBE878D7F',
    { defIndex: 500, paintIndex: 421, quality: 3, rarity: 6, wear: 'Factory New' });
  weaponSkin('Doppler Phase 1 (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20F7E7344A0D714CF6EF03F4D755F4DFF1C7F4CF7703381BF4B737F49F74777777FB87FFC44E5702',
    { defIndex: 500, paintIndex: 418, quality: 3, rarity: 6, wear: 'Minimal Wear' });

  // Gamma Doppler — paintIndex encodes phase: 569=Phase1, 572=Phase4
  weaponSkin('Gamma Doppler Phase 4 (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FCEC2A275C7A47FDE408FFDC40F8D4FACCFFC47C3F3F1BFFBC58F894F98CF42F5270CB',
    { defIndex: 500, paintIndex: 572, quality: 3, rarity: 6, wear: 'Factory New' });
  weaponSkin('Gamma Doppler Phase 1 (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20ACBC2E627F2917ADB458AF8C15A884AA9CAF941D634940AFEC05AAC42F2C2C2CA0DCA479D738F8',
    { defIndex: 500, paintIndex: 569, quality: 3, rarity: 6, wear: 'Minimal Wear' });
});

// ===========================================================================
// MAG-7 (defIndex 27, quality 4)
// ===========================================================================

describe('MAG-7', () => {
  // paintIndex 1089 = BI83 Spectrum
  weaponSkin('BI83 Spectrum (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20F7E7327F07414CF6EFECD736FFDFF3C7F3CF7F7E6900F4B750F09F74777777FB87FF01D3FDB7',
    { defIndex: 27, paintIndex: 1089, quality: 4, rarity: 4, wear: 'Battle-Scarred' });
  weaponSkin('BI83 Spectrum (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FCEC0264174746FDE4E7DC3DF4D4F8CCF8C4084D5610FFBC76FA947F7C7C7CF08CF4A2F61C3C',
    { defIndex: 27, paintIndex: 1089, quality: 4, rarity: 4, wear: 'Factory New' });
  weaponSkin('BI83 Spectrum (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20F8E8513F373A43F9E0E3D839F0D0FCC8FCC02C59470BFBB85CFE907B787878F488F02803F938',
    { defIndex: 27, paintIndex: 1089, quality: 4, rarity: 4, wear: 'Field-Tested' });
  weaponSkin('BI83 Spectrum (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FCEC542D7C7347FDE4E7DC3DF4D4F8CCF8C4657E1613FFBC67F9947F7C7C7CF08CF8720F937C',
    { defIndex: 27, paintIndex: 1089, quality: 4, rarity: 4, wear: 'Minimal Wear' });
  weaponSkin('BI83 Spectrum (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF343B4F1945FEE7E4DF3EF7D7FBCFFBC71D4D2709FCBF6EFC9DFAF7FFEF53D1977C7F7F7FF38FFB1D9A2F2A',
    { defIndex: 27, paintIndex: 1089, quality: 4, rarity: 4, wear: 'Well-Worn' });

  // paintIndex 39 = Bulldozer
  weaponSkin('Bulldozer (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE2F70327042FFE6E5DED9D6FACEFAC6743B5309FDBE47FA9CFBF6FEEE25D89CFBF6FFEE25D8967D7E7E7EF28EFE8AA16B71',
    { defIndex: 27, paintIndex: 39, quality: 4, rarity: 4, wear: 'Battle-Scarred' });
  weaponSkin('Bulldozer (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20D2C21B2631076BD3CAC9F2F5FAD6E2D6EA2B66653ED19239D6BA05D3A2D6192FDE6E',
    { defIndex: 27, paintIndex: 39, quality: 4, rarity: 4, wear: 'Factory New' });
  weaponSkin('Bulldozer (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FBEB2D4625674AFAE3E0DBDCD3FFCBFFC33D494709F8BBBE99FEF3FBEB76DE99FEF3FAEB75DE99FEF3F9EB75DE99FEF3F8EB76DE93C48BFBE91FD22D',
    { defIndex: 27, paintIndex: 39, quality: 4, rarity: 4, wear: 'Field-Tested' });
  weaponSkin('Bulldozer (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FBEB5E4C35534EFAE3E0DBDCD3FFCBFFC32F13710BF8BB26FD936AF98BFB975EAD2F',
    { defIndex: 27, paintIndex: 39, quality: 4, rarity: 4, wear: 'Minimal Wear' });
  weaponSkin('Bulldozer (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FDED3D6C4A7B46FCE5E6DDDAD5F9CDF9C5650B6B0BFEBD2CFA957E7D7D7DF18DFD686E169A',
    { defIndex: 27, paintIndex: 39, quality: 4, rarity: 4, wear: 'Well-Worn' });
});

// ===========================================================================
// CZ75-Auto (defIndex 63, quality 4)
// ===========================================================================

describe('CZ75-Auto', () => {
  // paintIndex 298 = Army Sheen
  weaponSkin('Army Sheen (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20F2E26226474A41F3EACDD258F0DAF3C2F6CA2A5C011AF1B241F09A71727272FE82E518A06652',
    { defIndex: 63, paintIndex: 298, quality: 4, rarity: 1, wear: 'Factory New' });
  weaponSkin('Army Sheen (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20F6E63D7E5B474CF7EEC9D65CF4DEF7C6F2CE41243404F5B64DF49E75767676FA86EEB85E7A56',
    { defIndex: 63, paintIndex: 298, quality: 4, rarity: 1, wear: 'Field-Tested' });
  weaponSkin('Army Sheen (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20ADBD4E69341116ACB5928D07AF85AC9DA9953925375DAEED3DACC52E2D2D2DA1DDBA5795BC0D',
    { defIndex: 63, paintIndex: 298, quality: 4, rarity: 1, wear: 'Minimal Wear' });

  // paintIndex 325 = Chalice
  weaponSkin('Chalice (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20C2D27518522C74C3DAFDE207C0EAC6F2C6FA7C485A24C18202C0AA41424242CEB2C6FD6488A2',
    { defIndex: 63, paintIndex: 325, quality: 4, rarity: 4, wear: 'Factory New' });
  weaponSkin('Chalice (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%202B3BFEB8A9A9902A33140BEE29032F1B2F13F3F3AAC6286BC52F43A8ABABAB275B33FC47EA2B',
    { defIndex: 63, paintIndex: 325, quality: 4, rarity: 4, wear: 'Minimal Wear' });

  // paintIndex 1036 = Circaetus
  weaponSkin('Circaetus (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE2C692D3944FFE6C1DE72F6D6FDCEFAC610182509FDBE66FA96FF8EF6B70CF762',
    { defIndex: 63, paintIndex: 1036, quality: 4, rarity: 3, wear: 'Battle-Scarred' });
  weaponSkin('Circaetus (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20ECFC0F07482A57EDF4D3CC60E4C4EFDCE8D41B324305EFAC27EE846F6C6C6CE09CE4D9779CAC',
    { defIndex: 63, paintIndex: 1036, quality: 4, rarity: 3, wear: 'Factory New' });
  weaponSkin('Circaetus (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF0225143744FEE7C0DF73F7D7FCCFFBC73F59130EFCBF75FD977C7F7F7FF38FF7ABF9117F',
    { defIndex: 63, paintIndex: 1036, quality: 4, rarity: 3, wear: 'Field-Tested' });
  weaponSkin('Circaetus (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20F9E967755C5D45F8E1C6D975F1D1FAC9FDC132486316FAB97FFB911BFB89F1FBF7314E',
    { defIndex: 63, paintIndex: 1036, quality: 4, rarity: 3, wear: 'Minimal Wear' });
  weaponSkin('Circaetus (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF7B1F7F7682E7C0DF73F7D7FCCFFBC730245A09FCBF23FA979A8FF7A2C80178',
    { defIndex: 63, paintIndex: 1036, quality: 4, rarity: 3, wear: 'Well-Worn' });
});

// ===========================================================================
// MAC-10 (defIndex 17, quality 4)
// ===========================================================================

describe('MAC-10', () => {
  // paintIndex 1295 = Acid Hex
  weaponSkin('Acid Hex (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF2D0E1D1947FEE7EEDF70F5D7FDCFFBC72A2E2F08FCBFFD97E88FE7C40C9340',
    { defIndex: 17, paintIndex: 1295, quality: 4, rarity: 2, wear: 'Battle-Scarred' });
  weaponSkin('Acid Hex (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF797A490F44FEE7EEDF70F5D7FDCFFBC7216F7C15FCBF57FD9705FE8FE7E77CB7FC',
    { defIndex: 17, paintIndex: 1295, quality: 4, rarity: 2, wear: 'Factory New' });
  weaponSkin('Acid Hex (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF5E40283744FEE7EEDF70F5D7FDCFFBC73609490CFCBF43F897F58FE7096C7CE7',
    { defIndex: 17, paintIndex: 1295, quality: 4, rarity: 2, wear: 'Field-Tested' });
  weaponSkin('Acid Hex (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE1A2B0D4C45FFE6EFDE71F4D6FCCEFAC66C032512FDBE46F8967D7E7E7EF28EE649793EBE',
    { defIndex: 17, paintIndex: 1295, quality: 4, rarity: 2, wear: 'Minimal Wear' });
  weaponSkin('Acid Hex (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20EFFF086F206154EEF7FECF60E5C7EDDFEBD74D0B4619ECAF6BED876C6F6F6FE39FF759F692EF',
    { defIndex: 17, paintIndex: 1295, quality: 4, rarity: 2, wear: 'Well-Worn' });

  // paintIndex 965 = Allure
  weaponSkin('Allure (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE12547E0847FFE6EFDE3BF9D6FACEFAC64B727906FDBE34FF967D7E7E7EF28EF64BDA525E',
    { defIndex: 17, paintIndex: 965, quality: 4, rarity: 4, wear: 'Battle-Scarred' });
  weaponSkin('Allure (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE775A383D4EFFE6EFDE3BF9D6FACEFAC6783A1714FDBEB696FA8EF6B4E0DC5D',
    { defIndex: 17, paintIndex: 965, quality: 4, rarity: 4, wear: 'Factory New' });
  weaponSkin('Allure (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF7004711B4DFEE7EEDF3AF8D7FBCFFBC73177600CFCBF18F897998FF78DB88B97',
    { defIndex: 17, paintIndex: 965, quality: 4, rarity: 4, wear: 'Field-Tested' });
  weaponSkin('Allure (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF0D651B4F49FEE7EEDF3AF8D7FBCFFBC77173610FFCBF45F997EB8FF7B92AB9CB',
    { defIndex: 17, paintIndex: 965, quality: 4, rarity: 4, wear: 'Minimal Wear' });
  weaponSkin('Allure (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FDED764E435E46FCE5ECDD38FAD5F9CDF9C558035C0BFEBD3EFC957E7D7D7DF18DF585287C3D',
    { defIndex: 17, paintIndex: 965, quality: 4, rarity: 4, wear: 'Well-Worn' });
});

// ===========================================================================
// AWP (defIndex 9, quality 4)
// ===========================================================================

describe('AWP', () => {
  // paintIndex 788 = Acheron
  weaponSkin('Acheron (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF5722161E45FEE7F6DF6BF9D7FCCFFBC745260B08FCBF6DF99DE6F7FCEF53CBE2FFFF7FC0D2FFFFBFBFC2FF009543BAFFC181C5977DFD8FE75DFEE8F7FFEFC1C23C52F5BFBAE687BBC0B2ED4ACABEAF6B02FA0F88B7BD',
    { defIndex: 9, paintIndex: 788, quality: 4, rarity: 3, wear: 'Battle-Scarred' });
  weaponSkin('Acheron (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FAEA7E3F633141FBE2F3DA6EFCD2F9CAFEC20B2F5F1BF9BAE998FFF2F9EA7AD492797A7A7AF68AFEC6E2E116',
    { defIndex: 9, paintIndex: 788, quality: 4, rarity: 3, wear: 'Factory New' });
  weaponSkin('Acheron (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE7232704E4AFFE6F7DE6AF8D6FDCEFAC62312750AFDBE79FC9CFBF6FDEE10D89CF1F6FEEE0ACDC37E111345BBFE6A16479CF1F6FAEE0ACDC3944FAD40BBFE849FC59CF1F6FAEE0ACDC34EDBCC43BBDE5660C29CF1F6FCEE0ACDC3DFB85BC3BBA26B6F4396B48EFA7108E109',
    { defIndex: 9, paintIndex: 788, quality: 4, rarity: 3, wear: 'Field-Tested' });
  weaponSkin('Acheron (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF4F34682B44FEE7F6DF6BF9D7FCCFFBC7231F0111FCBF0FFB97EE8FE75DFEE9F7FFEFDAC21B418BBEBABA4661C0B2C4BECBBE9F08B5FD6D6769',
    { defIndex: 9, paintIndex: 788, quality: 4, rarity: 3, wear: 'Minimal Wear' });
  weaponSkin('Acheron (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF0063463245FEE7F6DF6BF9D7FCCFFBC730406309FCBF3AFA977C7F7F7FF38FE7D828C89F',
    { defIndex: 9, paintIndex: 788, quality: 4, rarity: 3, wear: 'Well-Worn' });

  // paintIndex 1324 = Arsenic Spill
  weaponSkin('Arsenic Spill (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF5E54556E45FEE7F6DF53F5D7FCCFFBC749143D08FCBF8C97757F7F7FF38FE7612FF441',
    { defIndex: 9, paintIndex: 1324, quality: 4, rarity: 3, wear: 'Battle-Scarred' });
  weaponSkin('Arsenic Spill (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF206B7A6044FEE7F6DF53F5D7FCCFFBC702167113FCBF6DFD977C7F7F7FF38FE7C63D433F',
    { defIndex: 9, paintIndex: 1324, quality: 4, rarity: 3, wear: 'Factory New' });
  weaponSkin('Arsenic Spill (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF5E661D6F44FEE7F6DF53F5D7FCCFFBC70E1F000BFCBF76F9977C7F7F7FF38FE796622A1F',
    { defIndex: 9, paintIndex: 1324, quality: 4, rarity: 3, wear: 'Field-Tested' });
  weaponSkin('Arsenic Spill (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF530B127944FEE7F6DF53F5D7FCCFFBC712403D0FFCBF2BFE977C7F7F7FF38FFB51D9A8FF',
    { defIndex: 9, paintIndex: 1324, quality: 4, rarity: 3, wear: 'Minimal Wear' });
  weaponSkin('Arsenic Spill (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF763A2E6944FEE7F6DF53F5D7FCCFFBC7060B6F08FCBF919DEBF7FCEF0ACCE2FFFF7FC0C2FFB1B144BAFFE7CBC59DF5F7FDEF0ACCE21E85ABC09DF5F7FEEF0ACCE23233B3C09DEBF7FDEF0ACCE2FFFF7FC0C26FBAF1C2BAFFBFF3479DEBF7FDEF0ACCE25B8FC2C0C275C3EA42BAFF65F845977C7F7F7FF38FE72A760747',
    { defIndex: 9, paintIndex: 1324, quality: 4, rarity: 3, wear: 'Well-Worn' });

  // paintIndex 279 = Asiimov
  weaponSkin('Asiimov (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE1B47225D45FFE6F7DE69FCD6F8CEFAC6295B0106FDBEAF9CFBF6FEEE6BDB9CFBF6FFEE2FCD9CFBF6FCEE0CDA9CFBF6FDEE6BDB9CF1F6FDEE53DBC3AADEB9C0BB7E2394C5967D7E7E7EF28EFA87108FF2',
    { defIndex: 9, paintIndex: 279, quality: 4, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Asiimov (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FEEE65354E3A6AFFE6F7DE69FCD6F8CEFAC65D16570AFDBEC79CFBF6FEEE0EFC9CFBF6FFEE0EFC9CFBF6FCEE0EFC9CFBF6FDEE0EFC96FF8EFA5CFFE9F6FEEEF2C3120CF9BFBB0A7151C1B33CB6CDBFAE4678FCFC5128D5',
    { defIndex: 9, paintIndex: 279, quality: 4, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Asiimov (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF6E567D4944FEE7F6DF68FDD7F9CFFBC7040B6908FCBF11FB9DF0F7FBEF24DEC28779CBC2BA0FD893429DFAF7FDEF40E09DFAF7FBEF35E29DF0F7FFEF40E0C263DC6841BACB5E5B42977C7F7F7FF38FF79EA8160F',
    { defIndex: 9, paintIndex: 279, quality: 4, rarity: 6, wear: 'Well-Worn' });
});

// ===========================================================================
// Glock-18 | Gamma Doppler (defIndex 4, quality 4)
// paintIndex encodes phase: 1119=Emerald 1120=Ph1 1121=Ph2 1122=Ph3 1123=Ph4
// ===========================================================================

describe('Glock-18 | Gamma Doppler', () => {
  // Each URL has a different random phase (paint index differs per item)
  weaponSkin('Phase 4 (Battle-Scarred)',
    'steam://run/730//+csgo_econ_action_preview%20FDED2B53064248FCE5F9DD1EF5D5FBCDF9C5193D1D0AFEBD70FA957E7D7D7DF18DEA382DF5DD',
    { defIndex: 4, paintIndex: 1123, quality: 4, rarity: 6, wear: 'Battle-Scarred' });
  weaponSkin('Emerald (Factory New)',
    'steam://run/730//+csgo_econ_action_preview%20FDED226D0A2047FCE5F9DD22F5D5FBCDF9C536557A11FEBD4BF995B68DF9CF0A1531',
    { defIndex: 4, paintIndex: 1119, quality: 4, rarity: 6, wear: 'Factory New' });
  weaponSkin('Phase 3 (Field-Tested)',
    'steam://run/730//+csgo_econ_action_preview%20FFEF435F467844FEE7FBDF1DF7D7F9CFFBC7264A590BFCBF4BFE977C7F7F7FF38FE88ED2AB9F',
    { defIndex: 4, paintIndex: 1122, quality: 4, rarity: 6, wear: 'Field-Tested' });
  weaponSkin('Phase 2 (Minimal Wear)',
    'steam://run/730//+csgo_econ_action_preview%20FBEB1A414C2843FAE3FFDB1AF3D3FDCBFFC3371F2D14F8BB10FF99FEF3FBEB10DD99FEF3FAEB10DD99FEF3F9EB10DD99F4F3F8EB32C8C6FB136F40BE1BC370C793787B7B7BF78BEC06102CAD',
    { defIndex: 4, paintIndex: 1121, quality: 4, rarity: 6, wear: 'Minimal Wear' });
  weaponSkin('Phase 4 (Well-Worn)',
    'steam://run/730//+csgo_econ_action_preview%20FAEA364B474340FBE2FEDA19F2D2FCCAFEC21426340CF9BA09FF98F0F2F9EA5ED4E7FAFA7AC592797A7A7AF68AEDA15DDA7E',
    { defIndex: 4, paintIndex: 1123, quality: 4, rarity: 6, wear: 'Well-Worn' });
});
