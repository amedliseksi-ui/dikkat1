-- Replace generic seeds with literature-focused games (more volume + depth)
delete from games;

insert into games (title, description, type, subject, grade, content, is_public, tier, sort) values
(
  'Hafıza: Eser–Yazar',
  'Klasik Türk ve dünya edebiyatı eserlerini yazarlarıyla eşleştir. Görsel bellek ve edebiyat bilgisi.',
  'memory',
  'Edebiyat',
  '9-12',
  '{"pairs":[{"id":"1","front":"Çalıkuşu","back":"Reşat Nuri Güntekin"},{"id":"2","front":"Tutunamayanlar","back":"Oğuz Atay"},{"id":"3","front":"İnce Memed","back":"Yaşar Kemal"},{"id":"4","front":"Kürk Mantolu Madonna","back":"Sabahattin Ali"},{"id":"5","front":"Saatleri Ayarlama Enstitüsü","back":"Ahmet Hamdi Tanpınar"},{"id":"6","front":"Yaban","back":"Yakup Kadri Karaosmanoğlu"},{"id":"7","front":"Mai ve Siyah","back":"Halit Ziya Uşaklıgil"},{"id":"8","front":"Sefiller","back":"Victor Hugo"}]}',
  true, 0, 1
),
(
  'Eşleştir: Edebi Akımlar',
  'Edebiyat akımlarını özellikleriyle eşleştir. Servet-i Fünûn’dan postmodernizme.',
  'match',
  'Edebiyat',
  '10-12',
  '{"items":[{"left":"Romantizm","right":"Duygu, hayal, doğa ve bireysel özgürlük ön planda"},{"left":"Realizm","right":"Toplum ve bireyi nesnel gözlemle anlatma"},{"left":"Natüralizm","right":"Kalıtım ve çevre belirleyiciliği vurgusu"},{"left":"Sembolizm","right":"Simge, imge ve müzikaliteyle anlam kurma"},{"left":"Modernizm","right":"Bilinç akışı, parçalı anlatı, birey odaklı"},{"left":"Postmodernizm","right":"Metinlerarasılık, üstkurmaca, çoğul gerçeklik"}]}',
  true, 0, 2
),
(
  'Quiz: Türk Edebiyatı',
  'Şiir, roman, dönem ve yazar soruları. Hızlı düşün, doğru seç.',
  'quiz',
  'Edebiyat',
  '9-12',
  '{"questions":[{"q":"\"Çalıkuşu\" romanının yazarı kimdir?","options":["Halide Edip","Reşat Nuri Güntekin","Yakup Kadri","Peyami Safa"],"answer":1},{"q":"Tanzimat edebiyatının ilk romanı hangisidir?","options":["Araba Sevdası","İntibah","Taaşşuk-ı Talat ve Fitnat","Felatun Bey ile Rakım Efendi"],"answer":2},{"q":"\"Kendi Gök Kubbemiz\" kime aittir?","options":["Yahya Kemal","Nazım Hikmet","Orhan Veli","Cahit Sıtkı"],"answer":0},{"q":"Garip akımının öncülerinden biri kimdir?","options":["Ahmet Haşim","Orhan Veli","Necip Fazıl","Attilâ İlhan"],"answer":1},{"q":"\"Tutunamayanlar\" hangi türde eserdir?","options":["Şiir","Oyun","Roman","Deneme"],"answer":2},{"q":"Divan edebiyatında gazelin beyit sayısı genelde nasıldır?","options":["Tek sayılı","Çift sayılı","Hep 5","Hep 10"],"answer":0},{"q":"\"Mai ve Siyah\" hangi döneme aittir?","options":["Tanzimat","Servet-i Fünûn","Millî Edebiyat","Cumhuriyet"],"answer":1},{"q":"Yahya Kemal’in ünlü şiiri hangisidir?","options":["Sessiz Gemi","Han Duvarları","Otuz Beş Yaş","Kaldırımlar"],"answer":0}]}',
  true, 0, 3
),
(
  'Flashcards: Edebi Terimler',
  'Metafor, ironi, alegori… Temel edebiyat terimlerini kartlarla pekiştir.',
  'flashcards',
  'Edebiyat',
  '9-12',
  '{"cards":[{"front":"Metafor","back":"Bir şeyi başka bir şeyle özdeşleştirerek anlatma (eğretileme)"},{"front":"İroni","back":"Söylenenin tersini ima eden alaylı anlatım"},{"front":"Alegori","back":"Soyut bir fikrin somut kişiler/olaylarla simgelenmesi"},{"front":"Antitez","back":"Zıt kavramları yan yana getirerek vurgu yapma"},{"front":"Teşbih","back":"Benzetme; aralarında benzerlik kurma"},{"front":"Mübalağa","back":"Abartma sanatı"},{"front":"Hüsn-i talil","back":"Gerçek nedeni güzel bir nedene bağlama"},{"front":"Tenazur","back":"Anlamca ilgili sözcükleri bir arada kullanma"},{"front":"Kafiye","back":"Dize sonlarındaki ses benzerliği"},{"front":"Redif","back":"Kafiyeden sonra gelen aynı görevli ek/sözcük"}]}',
  true, 0, 4
),
(
  'Sırala: Edebiyat Dönemleri',
  'Türk edebiyatı dönemlerini kronolojik sıraya diz.',
  'sort',
  'Edebiyat',
  '10-12',
  '{"items":[{"id":"a","text":"Divan Edebiyatı","order":1},{"id":"b","text":"Tanzimat","order":2},{"id":"c","text":"Servet-i Fünûn","order":3},{"id":"d","text":"Fecr-i Âti","order":4},{"id":"e","text":"Millî Edebiyat","order":5},{"id":"f","text":"Cumhuriyet Dönemi","order":6}]}',
  true, 0, 5
),
(
  'Hafıza: Şiir–Şair',
  'Ünlü şiirleri şairleriyle eşleştir. Hafıza ve edebiyat kültürü.',
  'memory',
  'Edebiyat',
  '9-12',
  '{"pairs":[{"id":"1","front":"Sessiz Gemi","back":"Yahya Kemal"},{"id":"2","front":"Han Duvarları","back":"Faruk Nafiz Çamlıbel"},{"id":"3","front":"Otuz Beş Yaş","back":"Cahit Sıtkı Tarancı"},{"id":"4","front":"Kaldırımlar","back":"Necip Fazıl Kısakürek"},{"id":"5","front":"İstanbul''u Dinliyorum","back":"Orhan Veli"},{"id":"6","front":"Memleket İsterim","back":"Cahit Külebi"}]}',
  true, 0, 6
),
(
  'Eşleştir: Roman Karakterleri',
  'Karakterleri ait oldukları eserlerle eşleştir.',
  'match',
  'Edebiyat',
  '9-12',
  '{"items":[{"left":"Feride","right":"Çalıkuşu"},{"left":"Memed","right":"İnce Memed"},{"left":"Raif Efendi","right":"Kürk Mantolu Madonna"},{"left":"Hayri İrdal","right":"Saatleri Ayarlama Enstitüsü"},{"left":"Turgut Özben","right":"Tutunamayanlar"},{"left":"Ahmet Celal","right":"Yaban"}]}',
  true, 0, 7
),
(
  'Quiz: Dünya Edebiyatı',
  'Klasik ve modern dünya edebiyatından sorular.',
  'quiz',
  'Edebiyat',
  '10-12',
  '{"questions":[{"q":"\"Sefiller\" kimin eseridir?","options":["Balzac","Victor Hugo","Zola","Flaubert"],"answer":1},{"q":"\"Suç ve Ceza\" hangi yazara aittir?","options":["Tolstoy","Çehov","Dostoyevski","Gogol"],"answer":2},{"q":"Shakespeare''in trajedilerinden biri hangisidir?","options":["Hamlet","Don Kişot","Faust","Madame Bovary"],"answer":0},{"q":"\"Don Kişot\" hangi dilde yazılmıştır?","options":["Fransızca","İtalyanca","İspanyolca","Portekizce"],"answer":2},{"q":"Kafka''nın \"Dönüşüm\" eserinde Gregor neye dönüşür?","options":["Kuş","Böcek","Kurt","Balık"],"answer":1},{"q":"\"Yüzüklerin Efendisi\" kimin eseridir?","options":["C.S. Lewis","J.R.R. Tolkien","Rowling","Martin"],"answer":1}]}',
  true, 0, 8
),
(
  'Flashcards: Nazım Biçimleri',
  'Gazel, kaside, mesnevi… Divan nazım biçimlerini öğren.',
  'flashcards',
  'Edebiyat',
  '10-12',
  '{"cards":[{"front":"Gazel","back":"Aşk, şarap, güzellik; beyitlerle; matla ve makta"},{"front":"Kaside","back":"Övgü şiiri; nesib, girizgâh, methiye, fahriye"},{"front":"Mesnevi","back":"Her beyti kendi içinde kafiyeli uzun anlatı şiiri"},{"front":"Rubai","back":"Dört dizelik, aaba kafiyeli kısa şiir"},{"front":"Tuyuğ","back":"Türkçe dört dize; aruzla yazılan halk-divan köprüsü"},{"front":"Murabba","back":"Dörder dizelik bentlerden oluşan nazım biçimi"},{"front":"Şarkı","back":"Murabba türü; bestelenmeye elverişli, musikiyle bağlı"},{"front":"Terkib-i bent","back":"Bentler ve vasıta beyitleriyle kurulan uzun nazım"}]}',
  true, 0, 9
),
(
  'Sırala: Roman Olay Örgüsü',
  'Tipik bir romanın olay örgüsü basamaklarını doğru sıraya koy.',
  'sort',
  'Edebiyat',
  '9-11',
  '{"items":[{"id":"a","text":"Serim (giriş, kişiler ve mekân)","order":1},{"id":"b","text":"Düğüm (çatışmanın gelişmesi)","order":2},{"id":"c","text":"Doruk nokta (kriz)","order":3},{"id":"d","text":"Çözüm (sonuç)","order":4}]}',
  true, 0, 10
),
(
  'Hafıza: Edebi Türler',
  'Tür adlarını kısa tanımlarıyla eşleştir.',
  'memory',
  'Edebiyat',
  '8-11',
  '{"pairs":[{"id":"1","front":"Roman","back":"Uzun düzyazı anlatı"},{"id":"2","front":"Hikâye","back":"Kısa düzyazı anlatı"},{"id":"3","front":"Tiyatro","back":"Sahne için diyalog metni"},{"id":"4","front":"Deneme","back":"Kişisel görüşlerle serbest düzyazı"},{"id":"5","front":"Eleştiri","back":"Eseri değerlendirme yazısı"},{"id":"6","front":"Biyografi","back":"Bir kişinin yaşam öyküsü"}]}',
  true, 0, 11
),
(
  'Eşleştir: Şair–Dönem',
  'Şairleri temsil ettikleri dönem veya akımla eşleştir.',
  'match',
  'Edebiyat',
  '10-12',
  '{"items":[{"left":"Namık Kemal","right":"Tanzimat"},{"left":"Tevfik Fikret","right":"Servet-i Fünûn"},{"left":"Mehmet Âkif","right":"Millî Edebiyat"},{"left":"Orhan Veli","right":"Garip"},{"left":"Necip Fazıl","right":"Cumhuriyet / mistik çizgi"},{"left":"İlhan Berk","right":"İkinci Yeni"}]}',
  true, 0, 12
),
(
  'Quiz: Dil ve Anlatım',
  'Anlatım biçimleri, söz sanatları ve dil bilgisi karışık quiz.',
  'quiz',
  'Edebiyat',
  '9-12',
  '{"questions":[{"q":"\"Gözleri deniz gibi\" ifadesinde hangi sanat vardır?","options":["Abartma","Benzetme","Kişileştirme","Tevriye"],"answer":1},{"q":"Öyküleyici anlatımda asıl unsur nedir?","options":["Tartışma","Olay zinciri","Tanım","Kanıt"],"answer":1},{"q":"\"Rüzgâr fısıldadı\" hangi sanattır?","options":["Teşhis (kişileştirme)","Teşbih","İstiare","Kinaye"],"answer":0},{"q":"Bir metnin ana duygusu veya düşüncesi nedir?","options":["Tema","Konu","Olay","Kişi"],"answer":0},{"q":"\"Ağır ol ki molla desinler\" atasözünde hangi sanat belirgindir?","options":["Tecâhül-i ârif","Kinaye","Hüsn-i talil","Tenasüp"],"answer":1},{"q":"Lirik şiirde baskın öğe hangisidir?","options":["Olay","Duygu","Kanıt","Tartışma"],"answer":1}]}',
  true, 0, 13
),
(
  'Flashcards: Cumhuriyet Romanı',
  'Cumhuriyet dönemi yazar ve eserlerini kartlarla öğren.',
  'flashcards',
  'Edebiyat',
  '11-12',
  '{"cards":[{"front":"Yakup Kadri","back":"Yaban, Kiralık Konak, Ankara"},{"front":"Halide Edip","back":"Sinekli Bakkal, Ateşten Gömlek"},{"front":"Peyami Safa","back":"Dokuzuncu Hariciye Koğuşu, Fatih-Harbiye"},{"front":"Ahmet Hamdi Tanpınar","back":"Huzur, Saatleri Ayarlama Enstitüsü"},{"front":"Yaşar Kemal","back":"İnce Memed, Ortadirek"},{"front":"Orhan Kemal","back":"Bereketli Topraklar Üzerinde, Murtaza"},{"front":"Kemal Tahir","back":"Devlet Ana, Yorgun Savaşçı"},{"front":"Oğuz Atay","back":"Tutunamayanlar, Tehlikeli Oyunlar"}]}',
  true, 0, 14
),
(
  'Sırala: Şiir Okuma Adımları',
  'Bir şiiri çözümlerken izlenecek mantıklı sırayı bul.',
  'sort',
  'Edebiyat',
  '9-11',
  '{"items":[{"id":"a","text":"Şiiri birkaç kez sesli/sessiz oku","order":1},{"id":"b","text":"Biçim ve nazım birimini belirle","order":2},{"id":"c","text":"Söz sanatları ve imgeleri işaretle","order":3},{"id":"d","text":"Tema ve şairin tutumunu yorumla","order":4}]}',
  true, 0, 15
),
(
  'Hafıza: Mitoloji Motifleri',
  'Edebiyatta sık geçen mitolojik adları anlamlarıyla eşleştir.',
  'memory',
  'Edebiyat',
  '10-12',
  '{"pairs":[{"id":"1","front":"İkarus","back":"Güneşe uçup düşen mitolojik figür"},{"id":"2","front":"Odysseus","back":"Uzun yolculuk ve zekâ kahramanı"},{"id":"3","front":"Prometheus","back":"İnsanlığa ateşi getiren titan"},{"id":"4","front":"Orpheus","back":"Müziğiyle yeraltı dünyasını etkileyen şair"},{"id":"5","front":"Narsissos","back":"Kendi yansımasına âşık olan genç"},{"id":"6","front":"Sisifos","back":"Kayayı sürekli yukarı iten ceza figürü"}]}',
  true, 1, 16
),
(
  'Eşleştir: Anlatıcı Türleri',
  'Anlatıcı bakış açılarını tanımlarıyla eşleştir.',
  'match',
  'Edebiyat',
  '9-12',
  '{"items":[{"left":"Birinci kişi","right":"Olayları \"ben\" diliyle anlatır"},{"left":"Üçüncü kişi hâkim","right":"Her şeyi bilen, herkese giren anlatıcı"},{"left":"Üçüncü kişi gözlemci","right":"Dışarıdan bakar, iç dünyaya girmez"},{"left":"İkinci kişi","right":"Okura \"sen\" diye seslenir"},{"left":"Çoğul anlatıcı","right":"Birden fazla bakış açısı dönüşümlü kullanılır"}]}',
  true, 0, 17
),
(
  'Quiz: Şiir Bilgisi',
  'Ölçü, kafiye, nazım birimi ve şiir türleri.',
  'quiz',
  'Edebiyat',
  '9-12',
  '{"questions":[{"q":"Hece ölçüsünde en yaygın kalıp hangisidir?","options":["7''li","11''li","14''lü","16''lı"],"answer":1},{"q":"Aruz ölçüsü hangi edebiyat geleneğinde baskındır?","options":["Halk","Divan","Garip","İkinci Yeni"],"answer":1},{"q":"\"aaxa\" kafiye düzeni hangi nazımda sık görülür?","options":["Gazel","Rubai","Kaside","Mesnevi"],"answer":1},{"q":"Serbest şiirde asıl özellik nedir?","options":["Zorunlu kafiye","Ölçü ve kafiye zorunluluğunun kalkması","Sadece aruz","Sadece hece"],"answer":1},{"q":"Epik şiirin konusu genelde nedir?","options":["Aşk","Kahramanlık / savaş","Doğa betimlemesi","Günlük yaşam"],"answer":1}]}',
  true, 0, 18
);
