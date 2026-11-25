/* v213 staged layout: original question labels unchanged. Not loaded by live game yet. */
(function(root){
"use strict";
const scenes={
  "F01": {
    "file": "f01-ivy-wall-v213.webp",
    "boxes": [
      [
        27,
        48.2,
        22,
        7
      ],
      [
        54,
        48.2,
        22,
        7
      ],
      [
        81,
        48.2,
        22,
        7
      ],
      [
        36,
        63,
        27,
        8
      ],
      [
        76,
        63,
        27,
        8
      ]
    ],
    "patterns": {
      "ilk_dal|büyüme|gün": [
        0,
        3,
        1
      ],
      "sol_dal|sağ_dal": [
        0,
        2
      ],
      "bugün|gelişim": [
        0,
        3
      ],
      "sabah|akşam_büyüme": [
        0,
        3
      ],
      "sol ilk gün|sağ ilk gün|sol büyüme|sağ büyüme|gün": [
        0,
        2,
        3,
        4,
        1
      ],
      "sol kol|sağ kol|sol korunma|sağ korunma": [
        0,
        2,
        3,
        4
      ],
      "sol kol|sağ kol|dökülen": [
        0,
        2,
        1
      ],
      "sol sarmaşık kolu|sağ sarmaşık kolu|iki kolun ortak sayacı": [
        0,
        2,
        1
      ],
      "sol kol|sağ kol|toplam": [
        0,
        2,
        1
      ],
      "kol A|kol B|kol C|sol geçit": [
        0,
        1,
        2,
        3
      ],
      "sol kol|sağ kol|sol kopan|sağ kopan": [
        0,
        2,
        3,
        4
      ]
    }
  },
  "F02": {
    "file": "f02-light-stairs-v213.webp",
    "boxes": [
      [
        64,
        9.5,
        32,
        6
      ],
      [
        63,
        67.6,
        39,
        5
      ],
      [
        63,
        59.3,
        35,
        4.8
      ],
      [
        63,
        51.6,
        31,
        4.5
      ],
      [
        64,
        44.5,
        28,
        4.3
      ]
    ],
    "patterns": {
      "basamak_1|basamak_2": [
        1,
        2
      ],
      "giriş|hasarlı_taş": [
        1,
        2
      ],
      "basamak_sayısı|her_basamak": [
        0,
        1
      ],
      "basamak_A|basamak_B|basamak_C": [
        1,
        2,
        3
      ],
      "ilk|orta|son|çalışma oranları": [
        1,
        2,
        3,
        0
      ],
      "ilk enerji|kapı tüketimi|uyarı|uyarı kullanımı": [
        1,
        3,
        2,
        4
      ],
      "sol|sağ|harcama": [
        1,
        2,
        0
      ],
      "ilk basamak levhası|orta basamak levhası|son basamak levhası|üst sayaç": [
        1,
        2,
        3,
        0
      ],
      "ilk basamak|orta basamak|son basamak|güç sayacı": [
        1,
        2,
        3,
        0
      ],
      "basamak 1|basamak 2|basamak 3|basamak 4": [
        1,
        2,
        3,
        4
      ],
      "alt basamak|üst basamak|aktarım": [
        1,
        4,
        0
      ]
    }
  },
  "F03": {
    "file": "f03-fog-turbine-v213.webp",
    "boxes": [
      [
        16.4,
        38.5,
        15,
        5.5
      ],
      [
        36.5,
        54.5,
        14,
        5.3
      ],
      [
        55,
        54.5,
        14,
        5.3
      ],
      [
        73.8,
        54.5,
        14,
        5.3
      ],
      [
        88,
        67,
        15,
        5.5
      ]
    ],
    "patterns": {
      "giriş|filtre_1|filtre_2": [
        0,
        1,
        2
      ],
      "giriş|filtre_sayısı|her_filtre": [
        0,
        1,
        2
      ],
      "çıkış|tüpe_ayrılan": [
        3,
        4
      ],
      "çıkış|tüpe_giden": [
        3,
        4
      ],
      "giriş|1. filtre|2. filtre|gözlem kolu": [
        0,
        1,
        2,
        4
      ],
      "A borusu|B borusu|A geçirgenliği|B geçirgenliği": [
        0,
        2,
        1,
        3
      ],
      "giriş|ayrılan|ana hat": [
        0,
        1,
        4
      ],
      "türbin giriş vanası|birinci filtre|ikinci filtre|üçüncü filtre|gözlem tüpü kolu": [
        0,
        1,
        2,
        3,
        4
      ],
      "giriş|filtre 1|filtre 2|filtre 3|tüp payı": [
        0,
        1,
        2,
        3,
        4
      ]
    }
  },
  "F21": {
    "file": "f21-matching.webp",
    "boxes": [
      [
        22.4,
        17.8,
        24,
        6.8
      ],
      [
        22.4,
        28.8,
        24,
        6.8
      ],
      [
        22.4,
        39.8,
        24,
        6.8
      ],
      [
        22.4,
        50.6,
        24,
        6.8
      ],
      [
        22.4,
        61.5,
        24,
        6.8
      ],
      [
        81.6,
        17.8,
        24,
        6.8
      ],
      [
        81.6,
        28.8,
        24,
        6.8
      ],
      [
        81.6,
        39.8,
        24,
        6.8
      ],
      [
        81.6,
        50.6,
        24,
        6.8
      ],
      [
        81.6,
        61.5,
        24,
        6.8
      ]
    ],
    "patterns": {
      "kök_taşı_1|kök_taşı_2|kök_taşı_3|kök_taşı_4|kök_taşı_5|üs_taşı_1|üs_taşı_2|üs_taşı_3|üs_taşı_4|üs_taşı_5": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "köklü taş 1|köklü taş 2|köklü taş 3|köklü taş 4|köklü taş 5|üslü taş 1|üslü taş 2|üslü taş 3|üslü taş 4|üslü taş 5": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ]
    }
  }
};
function plan(q){const s=scenes[q?.obstacleId];if(!s)return null;const labels=q.visual?.labels||[];const key=labels.map(l=>l.anchor).join("|");const slots=s.patterns[key];if(!slots||slots.length!==labels.length)return null;return {file:s.file,character:"erdem-ciko-onayli-v180.png",matching:q.obstacleId==="F21",labels:labels.map((l,i)=>({anchor:l.anchor,value:l.value,slot:slots[i],box:s.boxes[slots[i]].slice()}))};}
const api={plan,scenes};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKScenePlanV213=api;
})(typeof window!=="undefined"?window:globalThis);
