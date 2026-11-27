/* v214 staged semantic layout for all 21 approved forest scenes. No live activation. */
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
      "giriş|filtre 1|filtre 2|filtre 3|çıkış": [0,1,2,3,4],
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
  },
  "F04": {
    "file": "f04-light-gate-v211.webp",
    "boxes": [
      [
        50,
        12.6,
        34,
        7
      ],
      [
        21.7,
        56.6,
        13,
        6
      ],
      [
        40.7,
        56.6,
        13,
        6
      ],
      [
        59.4,
        56.6,
        13,
        6
      ],
      [
        78.1,
        56.6,
        13,
        6
      ]
    ],
    "patterns": {
      "katman|nokta": [
        0,
        1
      ],
      "toplam_katman|kapalı_katman|açık_katman_ışığı": [
        0,
        2,
        1
      ],
      "katman|her_katman|uyarı_lambası": [
        0,
        1,
        4
      ],
      "her katman|1. sönük|2. sönük|3. sönük": [
        0,
        1,
        2,
        3
      ],
      "katman sayısı|bir katman|arızalı oran": [
        0,
        1,
        2
      ],
      "ilk|ikinci|ilk sönük": [
        1,
        2,
        3
      ],
      "birinci ışık katmanı|ikinci ışık katmanı|üçüncü ışık katmanı": [
        1,
        2,
        3
      ],
      "katman 1|katman 2|katman 3": [
        1,
        2,
        3
      ]
    }
  },
  "F05": {
    "file": "f05-crystals.webp",
    "boxes": [
      [
        50,
        21,
        40,
        8
      ],
      [
        25.5,
        56,
        18,
        6
      ],
      [
        50.4,
        56,
        18,
        6
      ],
      [
        75.6,
        56,
        18,
        6
      ],
      [
        51,
        75.5,
        22,
        6
      ]
    ],
    "patterns": {
      "kristal": [
        1
      ],
      "kristal_1|kristal_2": [
        1,
        2
      ],
      "giriş|çarpan": [
        1,
        0
      ],
      "A|B": [
        1,
        2
      ],
      "başlangıç|çarpan": [
        1,
        0
      ],
      "A|B|C tüketim": [
        1,
        2,
        3
      ],
      "A kristal kaidesi|B kristal kaidesi|C kristal kaidesi, eksi göstergesi|büyük güçlendirici halka": [
        1,
        2,
        3,
        0
      ],
      "A|B|C, çıkarılan|güçlendirme": [
        1,
        2,
        3,
        0
      ],
      "kristal A|kristal B|kristal C|çarpan": [
        1,
        2,
        3,
        0
      ],
      "A|B|çarpan|kayıp": [
        1,
        2,
        0,
        4
      ]
    }
  },
  "F06": {
    "file": "f06-mushroom-islands.webp",
    "boxes": [
      [
        50,
        21,
        38,
        8
      ],
      [
        20,
        55.4,
        19,
        6
      ],
      [
        50.5,
        55,
        19,
        6
      ],
      [
        81,
        55.4,
        19,
        6
      ],
      [
        62,
        76.4,
        28,
        7
      ]
    ],
    "patterns": {
      "ada_A|ada_B": [
        1,
        2
      ],
      "toplam_mantar|ada_A|ada_B": [
        0,
        1,
        2
      ],
      "ada_sayısı|bir_adadaki": [
        0,
        1
      ],
      "A|B|C": [
        1,
        2,
        3
      ],
      "A|B|C|toplam": [
        1,
        2,
        3,
        0
      ],
      "A mantar adası|B mantar adası|C mantar adası|üç adanın ortak sayacı": [
        1,
        2,
        3,
        0
      ],
      "A adası|B adası|C adası|toplam": [
        1,
        2,
        3,
        0
      ],
      "A adası|B adası|C adası|A payı": [
        1,
        2,
        3,
        4
      ],
      "A adası|B adası|C adası|seçim": [
        1,
        2,
        3,
        4
      ]
    }
  },
  "F07": {
    "file": "f07-square-platform.webp",
    "boxes": [
      [
        25.5,
        15.4,
        16,
        5
      ],
      [
        20.8,
        43.4,
        5,
        10
      ],
      [
        55.2,
        52.7,
        18,
        4
      ],
      [
        55,
        71.4,
        30,
        6
      ]
    ],
    "patterns": {
      "dış_kare_kenarı": [
        3
      ],
      "kenardaki_taş": [
        3
      ],
      "kenar": [
        3
      ],
      "dış kenar|iç kenar": [
        3,
        2
      ],
      "kenar|bir taş alanı": [
        3,
        0
      ],
      "uzun kenar|kısa kenar": [
        3,
        1
      ],
      "platformun dış kenarındaki ölçü çizgisi|ortadaki kare boşluğun kenarı|bir taşın bilgi levhası": [
        3,
        2,
        0
      ],
      "dış kenar|iç kenar|bir taş": [
        3,
        2,
        0
      ],
      "dış kare|iç kare|taş yüzeyi": [
        3,
        2,
        0
      ],
      "dış kenar|gölge kenarı|aydınlanma": [
        3,
        2,
        0
      ]
    },
    "rotatedSlots": [
      1
    ]
  },
  "F08": {
    "file": "f08-broken-bridge.webp",
    "boxes": [
      [
        25.5,
        22.5,
        23,
        7
      ],
      [
        75,
        22.5,
        23,
        7
      ],
      [
        24,
        49.4,
        20,
        7
      ],
      [
        79,
        49.4,
        20,
        7
      ],
      [
        50,
        70.7,
        29,
        8
      ]
    ],
    "patterns": {
      "depo|kırık": [
        4,
        2
      ],
      "gereken|sandık": [
        0,
        4
      ],
      "sıra_sayısı|sıradaki_tahta|kırık": [
        0,
        1,
        2
      ],
      "gereken|eldeki": [
        0,
        4
      ],
      "başlangıç|sol kırık|sağ kırık|onarım": [
        0,
        2,
        3,
        4
      ],
      "A|B|A sağlam|B sağlam": [
        0,
        1,
        2,
        3
      ],
      "başlangıç|zarar gören|değiştirilen": [
        0,
        2,
        4
      ],
      "sol köprü bölümündeki levha|sağ köprü bölümündeki levha": [
        0,
        1
      ],
      "sol|sağ|sol hasarlı|sağ hasarlı": [
        0,
        1,
        2,
        3
      ],
      "sol|sağ|sol kırık|sağ kırık|onarım": [
        0,
        1,
        2,
        3,
        4
      ],
      "sol|sağ|kırık oranları": [
        0,
        1,
        4
      ]
    }
  },
  "F09": {
    "file": "f09-rope-workshop.webp",
    "boxes": [
      [
        50,
        8,
        37,
        6
      ],
      [
        22,
        23,
        15,
        4
      ],
      [
        81,
        23,
        15,
        4
      ],
      [
        49.5,
        54,
        23,
        5
      ],
      [
        50,
        66,
        21,
        5
      ]
    ],
    "patterns": {
      "halat|parça_sayısı": [
        1,
        4
      ],
      "halat|kullanılan": [
        1,
        3
      ],
      "parça_A|parça_B": [
        1,
        2
      ],
      "halat|hasarlı bölüm|bölme": [
        1,
        3,
        4
      ],
      "ilk halat|ikinci|kesilen": [
        1,
        2,
        3
      ],
      "başlangıç|kullanılan": [
        1,
        3
      ],
      "A halatının uzunluk levhası|B halatının uzunluk levhası|A halatının kesim noktası|B halatının kesim noktası": [
        1,
        2,
        3,
        4
      ],
      "A halatı|B halatı|kesilen": [
        1,
        2,
        3
      ],
      "A halatı|B halatı|hasarlı": [
        1,
        2,
        3
      ],
      "A halatı|B halatı|kesilen|örtüşme": [
        1,
        2,
        3,
        4
      ]
    }
  },
  "F10": {
    "file": "f10-light-rectangle.webp",
    "boxes": [
      [
        23.5,
        28,
        19,
        6
      ],
      [
        82,
        34.5,
        18,
        5
      ],
      [
        50,
        64.5,
        40,
        7
      ]
    ],
    "patterns": {
      "uzun_kenar|kısa_kenar": [
        2,
        0
      ],
      "sıra|sütun": [
        0,
        2
      ],
      "uzun kenar|kısa kenar": [
        2,
        0
      ],
      "uzun|kısa": [
        2,
        0
      ],
      "uzun kenar ölçüsü|kısa kenar ölçüsü|çevre üzerindeki ışıklı alan etiketi": [
        2,
        0,
        1
      ],
      "uzun kenar|kısa kenar|aydınlanan": [
        2,
        0,
        1
      ],
      "uzun kenar|kısa kenar|tur": [
        2,
        0,
        1
      ]
    }
  },
  "F11": {
    "file": "f11-water-gates.webp",
    "boxes": [
      [
        26,
        27.5,
        22,
        6
      ],
      [
        26,
        39,
        22,
        6
      ],
      [
        62,
        27.5,
        22,
        6
      ],
      [
        62,
        39,
        22,
        6
      ],
      [
        85.4,
        64,
        20,
        6
      ]
    ],
    "patterns": {
      "kapak|süre": [
        0,
        1
      ],
      "kapak_A|kapak_B": [
        0,
        2
      ],
      "giriş|yan_kanal": [
        0,
        4
      ],
      "A_kapağı|B_kapağı": [
        0,
        2
      ],
      "A debi|A süre|B debi|B süre": [
        0,
        1,
        2,
        3
      ],
      "A|B|süre|yan kola": [
        0,
        2,
        1,
        4
      ],
      "A|B|A tıkalı|süre": [
        0,
        2,
        1,
        3
      ],
      "A su kapağı|A zaman göstergesi|B su kapağı|B zaman göstergesi|tali kanalın düğmesi": [
        0,
        1,
        2,
        3,
        4
      ],
      "A akış|A süre|B akış|B süre|ayrılan": [
        0,
        1,
        2,
        3,
        4
      ],
      "A akış|A süre|B akış|B süre|şişe sayısı": [
        0,
        1,
        2,
        3,
        4
      ],
      "A akış|A süre|B akış|B süre": [
        0,
        1,
        2,
        3
      ]
    }
  },
  "F12": {
    "file": "f12-forked-path.webp",
    "boxes": [
      [
        25,
        32.6,
        34,
        9
      ],
      [
        75,
        32.6,
        34,
        9
      ]
    ],
    "patterns": {
      "A_yolu|B_yolu": [
        0,
        1
      ],
      "A yolu|B yolu": [
        0,
        1
      ],
      "A|B": [
        0,
        1
      ],
      "A yolunun tabelası|B yolunun tabelası": [
        0,
        1
      ]
    }
  },
  "F13": {
    "file": "f13-cube-lock.webp",
    "boxes": [
      [
        15.5,
        25,
        22,
        7
      ],
      [
        84,
        25,
        22,
        7
      ],
      [
        15.5,
        46.3,
        22,
        7
      ],
      [
        84,
        46.3,
        22,
        7
      ],
      [
        50,
        62.8,
        34,
        8
      ]
    ],
    "patterns": {
      "açık_yüz|yüz_başı": [
        4,
        0
      ],
      "mühürlü|açık_yüz_başı|sönen": [
        4,
        0,
        1
      ],
      "etkin_yüz|işaret": [
        4,
        0
      ],
      "açık_yüz|bir_yüzde": [
        4,
        0
      ],
      "mühürlü_yüz|açık_yüzde|sönmüş": [
        4,
        0,
        1
      ],
      "işaretli_yüz|her_yüzde": [
        4,
        0
      ],
      "açık yüz|her yüzde|bir yüzde sönük": [
        4,
        0,
        1
      ],
      "mühürlü|açık|işaret/yüz|sönük": [
        1,
        4,
        0,
        2
      ],
      "etkin yüz|her yüz|bir yüzde sönük": [
        4,
        0,
        1
      ],
      "birinci açık yüz|ikinci açık yüz|üçüncü açık yüz|dördüncü açık yüz|kilit üzerindeki sayaç": [
        0,
        1,
        2,
        3,
        4
      ],
      "açık yüz 1|açık yüz 2|açık yüz 3|açık yüz 4": [
        0,
        1,
        2,
        3
      ]
    }
  },
  "F14": {
    "file": "f14-gears.webp",
    "boxes": [
      [
        42.7,
        41,
        28,
        8
      ],
      [
        15,
        22,
        19,
        8
      ],
      [
        86.6,
        22,
        19,
        8
      ],
      [
        15,
        59.8,
        19,
        8
      ],
      [
        86.6,
        59.8,
        19,
        8
      ]
    ],
    "patterns": {
      "büyük_çark|küçük_çark": [
        0,
        2
      ],
      "parça_1|parça_2": [
        1,
        2
      ],
      "çark_A|çark_B": [
        0,
        2
      ],
      "büyük|küçük": [
        0,
        2
      ],
      "mekanizma|yuvalar": [
        0,
        1
      ],
      "anahtar|yuvanın etiketi": [
        0,
        1
      ],
      "çark|anahtar sayısı": [
        0,
        1
      ],
      "çarkın ortasındaki güç levhası|birinci güç yuvası|ikinci güç yuvası|üçüncü güç yuvası|dördüncü güç yuvası": [
        0,
        1,
        2,
        3,
        4
      ],
      "merkez|yuvalar": [
        0,
        1
      ],
      "merkez": [
        0
      ]
    }
  },
  "F15": {
    "file": "f15-mirrors.webp",
    "boxes": [
      [
        20.3,
        50,
        26,
        7
      ],
      [
        81,
        50,
        26,
        7
      ],
      [
        50,
        64.5,
        44,
        9
      ]
    ],
    "patterns": {
      "sol_ayna|sağ_ayna": [
        0,
        1
      ],
      "ayna_1|ayna_2|ek_ışık": [
        0,
        1,
        2
      ],
      "sol|sağ|üst_sınır": [
        0,
        1,
        2
      ],
      "sol ayna|sağ ayna|ışık küresi": [
        0,
        1,
        2
      ],
      "sol|sağ|eklenen": [
        0,
        1,
        2
      ],
      "ayna A|ayna B|ek": [
        0,
        1,
        2
      ],
      "sol ayna|sağ ayna|ışık küresinin altındaki levha": [
        0,
        1,
        2
      ],
      "sol ayna|sağ ayna|ek ışık": [
        0,
        1,
        2
      ]
    }
  },
  "F16": {
    "file": "f16-inscriptions.webp",
    "boxes": [
      [
        26,
        33.6,
        39,
        9
      ],
      [
        74,
        33.6,
        39,
        9
      ],
      [
        26,
        53,
        39,
        9
      ],
      [
        74,
        53,
        39,
        9
      ]
    ],
    "patterns": {
      "levha_A|levha_B|levha_C|levha_D": [
        0,
        1,
        2,
        3
      ],
      "A taş levhası|B taş levhası|C taş levhası|D taş levhası": [
        0,
        1,
        2,
        3
      ],
      "A levhası|B levhası|C levhası|D levhası": [
        0,
        1,
        2,
        3
      ]
    }
  },
  "F17": {
    "file": "f17-blue-powder.webp",
    "boxes": [
      [
        19.4,
        26.7,
        22,
        8
      ],
      [
        19.4,
        50.3,
        22,
        8
      ],
      [
        81,
        26.7,
        22,
        8
      ],
      [
        81,
        50.3,
        22,
        8
      ],
      [
        50,
        65.4,
        36,
        9
      ]
    ],
    "patterns": {
      "şişe_sayısı|şişedeki_toz": [
        0,
        1
      ],
      "şişe|ayrılan|bir_şişede": [
        0,
        4,
        1
      ],
      "şişe_sayısı|şişe_başına|kullanılan": [
        0,
        1,
        4
      ],
      "şişe|şişe başına|dökülen şişe": [
        0,
        1,
        4
      ],
      "A şişe|A gram/şişe|B şişe|B gram/şişe": [
        0,
        1,
        2,
        3
      ],
      "şişe sayısı|her şişe|kullanılan": [
        0,
        1,
        4
      ],
      "A rafındaki levha|B rafındaki levha|A rafının uyarı simgesi|B rafının uyarı simgesi": [
        0,
        2,
        1,
        3
      ],
      "A rafı|B rafı|kayıp": [
        0,
        2,
        4
      ],
      "A rafı|B rafı|kullanılan": [
        0,
        2,
        4
      ]
    }
  },
  "F18": {
    "file": "f18-signal-repeater.webp",
    "boxes": [
      [
        17.6,
        48.5,
        18,
        8
      ],
      [
        82.9,
        48.5,
        18,
        8
      ],
      [
        33,
        64,
        23,
        7
      ],
      [
        67,
        64,
        23,
        7
      ]
    ],
    "patterns": {
      "anten_A|anten_B|süre": [
        0,
        1,
        2
      ],
      "A anteni|B anteni|süre": [
        0,
        1,
        2
      ],
      "A/dk|B/dk|süre|kayıp": [
        0,
        1,
        2,
        3
      ],
      "A/dk|B/dk|süre": [
        0,
        1,
        2
      ],
      "A anteninin sayacı|B anteninin sayacı|ortak zaman göstergesi|iletim hattının filtre işareti": [
        0,
        1,
        2,
        3
      ],
      "A anteni|B anteni|süre|ulaşan oran": [
        0,
        1,
        2,
        3
      ]
    }
  },
  "F19": {
    "file": "f19-stone-support.webp",
    "boxes": [
      [
        25,
        39.8,
        30,
        8
      ],
      [
        75,
        39.8,
        30,
        8
      ],
      [
        29,
        71,
        28,
        8
      ],
      [
        71,
        71,
        28,
        8
      ]
    ],
    "patterns": {
      "destek_1|destek_2": [
        0,
        1
      ],
      "destek_A|destek_B|örtüşme": [
        0,
        1,
        2
      ],
      "A destek|B destek|örtüşme": [
        0,
        1,
        2
      ],
      "ilk uzunluk|ikinci uzunluk|ortak": [
        0,
        1,
        2
      ],
      "A|B|ortak": [
        0,
        1,
        2
      ],
      "ilk taş desteğin boy ölçüsü|ikinci desteğin boy ölçüsü|üst üste binen işaretli bölge|eş parça ayırma referansı": [
        0,
        1,
        2,
        3
      ],
      "A taşı|B taşı|örtüşme": [
        0,
        1,
        2
      ],
      "A taşı|B taşı|örtüşme|kesim": [
        0,
        1,
        2,
        3
      ],
      "A taşı|B taşı|örtüşme|kullanılan": [
        0,
        1,
        2,
        3
      ]
    }
  },
  "F20": {
    "file": "f20-observatory-gate.webp",
    "boxes": [
      [
        20.1,
        50.2,
        21,
        8
      ],
      [
        50,
        50.2,
        21,
        8
      ],
      [
        80,
        50.2,
        21,
        8
      ]
    ],
    "patterns": {
      "sol_halka|orta_halka|sağ_halka": [
        0,
        1,
        2
      ],
      "sol halka|orta halka|sağ halka": [
        0,
        1,
        2
      ],
      "sol altın halka|orta altın halka|sağ altın halka": [
        0,
        1,
        2
      ]
    }
  }
};
// v223: pixel-calibrated interior centres from the 21 original WebP files.
const measuredV223={"F01":[[26.83,48.37,22,7.17],[53.95,48.37,22,7.17],[81.06,48.37,22,7.17],[36.32,62.88,27,8.11],[76.16,62.88,27,8.11]],"F02":[[63.96,9.53,32.15,6],[62.48,67.7,39,5],[62.72,59.21,35,4.8],[63.36,51.56,31,4.5],[64.27,44.5,28,4.3]],"F03":[[16.35,38.28,15.22,5.5],[36.48,54.35,14,5.56],[55.18,54.35,14,5.56],[73.64,54.35,14,5.56],[88.4,67.03,16.2,5.69]],"F04":[[50,12.56,36.2,8.1],[21.61,56.6,15.0,8.0],[40.59,56.6,15.0,8.0],[59.45,56.6,15.0,8.0],[78.39,56.6,15.0,8.0]],"F05":[[50,20.77,40,8.37],[25.32,55.7,18,6.36],[50.6,55.7,18,6.36],[75.8,55.7,18,6.36],[50.8,75.48,22,6]],"F06":[[50.2,20.93,38,8.11],[20.22,55.3,19,6],[50.64,54.7,19,6],[81.14,55.42,19,6],[61.8,76.63,28,7.1]],"F07":[[25.72,15.39,16.58,5.4],[20.73,42.78,5,10],[55.26,52.51,18.23,4],[55.06,71.21,30.36,6]],"F08":[[25.44,22.41,23,7],[75.16,22.45,23.04,7],[23.84,49.08,20,7],[79.11,49.08,20.1,7],[49.48,70.49,29,8]],"F09":[[50,7.93,38.61,6.36],[21.85,22.93,15.5,4.22],[80.98,23.21,15.29,4.15],[49.48,54.15,24.04,5],[50,65.99,22.54,5]],"F10":[[23.6,28.07,19,6.3],[81.86,34.53,18,5.4],[50.24,64.55,40,7.56]],"F11":[[26,27.43,22,6.03],[26,38.92,22,6.03],[62.2,27.43,22,6.03],[62.24,38.92,22,6.03],[85.57,63.8,20,6.48]],"F12":[[25.12,32.46,34,9],[74.96,32.46,34,9]],"F13":[[15.63,24.72,22,7.5],[84.37,24.72,22,7.5],[15.63,45.89,22,7.56],[84.45,45.89,22,7.56],[50.08,62.64,34.02,8.37]],"F14":[[42.7,40.99,29.35,8],[15.15,21.81,19,8],[86.56,21.81,19,8],[15.11,59.57,19,8.17],[86.56,59.57,19,8.17]],"F21":[[22.41,17.5,24,6.8],[22.37,28.47,24,6.8],[22.41,39.47,24,6.8],[22.41,50.4,24,6.8],[22.45,61.36,24,6.8],[82.42,17.5,24,6.8],[81.78,28.47,24,6.8],[81.78,39.47,24,6.8],[81.82,50.4,24,6.8],[81.78,61.36,24,6.8]],"F15":[[20.41,49.92,26,7],[80.82,49.92,26,7],[50,64.51,44,9]],"F16":[[26.36,33.25,39,9.72],[73.64,33.25,39,9.72],[26.32,52.87,39,9.72],[73.68,52.87,39,9.72]],"F17":[[19.18,26.52,22,8],[19.18,50.16,22,8],[81.06,26.52,22,8],[81.02,50.16,22,8],[50.04,65.31,36.24,9]],"F18":[[17.34,48.41,18.88,8.17],[83.09,48.41,18.66,8.17],[33.41,63.72,23,7.56],[67.03,63.72,23,7.56]],"F19":[[25,39.67,30.07,8],[75.32,39.71,30.22,8],[29.39,70.73,28.49,8.04],[71.53,70.69,28.28,8]],"F20":[[20.14,50.16,21.75,8],[50.16,50.16,21.67,8],[80.06,50.16,21.82,8]]};
for(const [id,boxes] of Object.entries(measuredV223))scenes[id].boxes=boxes;
// F03 alternate flow questions need meaningful labels instead of a duplicate schematic panel.
function f03Caption(q,l){
 if(q.obstacleId!=="F03")return {};
 if(q.f03EquationV249&&l.anchor==="çıkış")return {caption:"Çıkış",displayValue:l.value};
 const key=q.visual.labels.map(x=>x.anchor).join("|");
 const map=key==="A borusu|B borusu|A geçirgenliği|B geçirgenliği"?{"A borusu":"A girişi","B borusu":"B girişi","A geçirgenliği":"A payı","B geçirgenliği":"B payı"}:key==="giriş|ayrılan|ana hat"?{"giriş":"Giriş","ayrılan":"Yan kol","ana hat":"Ana hat"}:key==="giriş|filtre_sayısı|her_filtre"?{"filtre_sayısı":"Geçiş sayısı","her_filtre":"Her geçiş"}:key.startsWith("çıkış|")?{"çıkış":"Çıkış","tüpe_ayrılan":"Tüp payı","tüpe_giden":"Tüp payı"}:null;
 return map?.[l.anchor]?{caption:map[l.anchor],displayValue:l.value}:{};
}
function f04Plan(q,s){
 const source=q.visual.labels,values=Object.fromEntries(source.map(l=>[l.anchor,String(l.value)])),key=source.map(l=>l.anchor).join("|"),out=[];
 function add(slot,anchor,caption,value){
  if(value===undefined||value===null||String(value)==="")throw Error(q.id+" eksik levha "+anchor);
  out.push({anchor,value:String(value),slot,box:s.boxes[slot].slice(),rotation:0,caption,displayValue:String(value),forceStack:slot!==0});
 }
 if(key==="katman|nokta"){
  add(0,"katman","Katman sayısı",values.katman);add(1,"nokta","Her biri",values.nokta);
 }else if(key==="toplam_katman|kapalı_katman|açık_katman_ışığı"){
  add(0,"toplam_katman","Katman sayısı",values.toplam_katman);add(1,"açık_katman_ışığı","Her açık",values.açık_katman_ışığı);add(2,"kapalı_katman","Kapalı",values.kapalı_katman);
 }else if(key==="katman|her_katman|uyarı_lambası"){
  add(0,"katman","Katman sayısı",values.katman);add(1,"her_katman","Her biri",values.her_katman);add(4,"uyarı_lambası","Ek lamba",values.uyarı_lambası);
 }else if(key==="her katman|1. sönük|2. sönük|3. sönük"){
  add(0,"her katman","Her katmanda lamba",values["her katman"]);
  for(let i=1;i<=3;i++)add(i,i+". sönük",i+". sönük",values[i+". sönük"]);
 }else if(key==="katman sayısı|bir katman|arızalı oran"){
  add(0,"katman sayısı","Katman sayısı",values["katman sayısı"]);add(1,"bir katman","Her biri",values["bir katman"]);add(2,"arızalı oran","Arızalı",values["arızalı oran"]);
 }else if(key==="ilk|ikinci|ilk sönük"){
  // The source prompt explicitly names the first and second layers.
  add(0,"katman sayısı","Katman sayısı","2");add(1,"ilk","1. katman",values.ilk);add(2,"ikinci","2. katman",values.ikinci);add(3,"ilk sönük","1. sönük",values["ilk sönük"]);
 }else if(key==="birinci ışık katmanı|ikinci ışık katmanı|üçüncü ışık katmanı"||key==="katman 1|katman 2|katman 3"){
  const parsed=source.map(l=>String(l.value).match(/^(\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?: lamba)?;\s*(sönük|kapanan|yanan):?\s*(\d+\/\d+)$/u));
  if(parsed.some(m=>!m)||parsed.some(m=>m[1]!==parsed[0][1]||m[2]!==parsed[0][2]))throw Error(q.id+" ortak katman verisi");
  add(0,"her katman","Her katmanda lamba",parsed[0][1]);
  parsed.forEach((m,i)=>add(i+1,source[i].anchor,(i+1)+". "+(m[2]==="kapanan"?"kapalı":m[2]),m[3]));
 }else return null;
 return {file:s.file,character:"erdem-ciko-onayli-v180.png",matching:false,labels:out};
}
function plan(q){const s=scenes[q?.obstacleId];if(!s)return null;if(q.obstacleId==="F04")return f04Plan(q,s);let labels=q.visual?.labels||[];const key=labels.map(l=>l.anchor).join("|");let slots=s.patterns[key];if(q.obstacleId==="F02"&&key==="basamak_sayısı|her_basamak"){const n=Number(labels[0].value),v=labels[1].value;if(!Number.isInteger(n)||n<1||n>4)return null;labels=[{anchor:"basamak_sayısı",value:n+" basamak"},...Array.from({length:n},(_,i)=>({anchor:(i+1)+". basamak",value:v}))];slots=Array.from({length:n+1},(_,i)=>i);}if(!slots||slots.length!==labels.length)return null;return {file:s.file,character:"erdem-ciko-onayli-v180.png",matching:q.obstacleId==="F21",labels:labels.map((l,i)=>({anchor:l.anchor,value:l.value,slot:slots[i],box:s.boxes[slots[i]].slice(),rotation:(s.rotatedSlots||[]).includes(slots[i])?-72.9:0,...f03Caption(q,l),...(q.obstacleId==="F01"&&q.f01Revision==="f01-v229"?((typeof module!=="undefined"&&module.exports&&typeof require==="function"?require("./f01-revision-v229.js"):root.MTKF01RevisionV229)?.label(q,l)||{}):{})}))};}
const api={version:"v250",plan,scenes};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKScenePlanV214=api;
})(typeof window!=="undefined"?window:globalThis);
