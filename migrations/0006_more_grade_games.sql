-- Extra games per grade (7–12). Keeps existing literature seeds.
-- Aim: a few solid games per class, mixed subjects + attention.

insert into games (title, description, type, subject, grade, content, is_public, tier, sort) values

-- ========== 7. SINIF ==========
(
  'Hafıza: Temel Geometri',
  'Şekilleri özellikleriyle eşleştir. Görsel bellek ve matematik temeli.',
  'memory',
  'Matematik',
  '7',
  '{"pairs":[{"id":"1","front":"Üçgen","back":"3 kenar, 3 açı"},{"id":"2","front":"Kare","back":"4 eşit kenar, 4 dik açı"},{"id":"3","front":"Dikdörtgen","back":"Karşılıklı kenarlar eşit"},{"id":"4","front":"Daire","back":"Merkeze eşit uzaklık"},{"id":"5","front":"Beşgen","back":"5 kenarlı çokgen"},{"id":"6","front":"Paralelkenar","back":"Karşılıklı kenarlar paralel"}]}',
  true, 0, 20
),
(
  'Quiz: 7. Sınıf Matematik',
  'Temel işlem, kesir ve yüzdeler. Hızlı ve doğru seç.',
  'quiz',
  'Matematik',
  '7',
  '{"questions":[{"q":"3/4 + 1/4 = ?","options":["1","1/2","2","3/8"],"answer":0},{"q":"0,5 × 20 = ?","options":["5","10","15","2"],"answer":1},{"q":"%25’in kesir karşılığı?","options":["1/2","1/4","1/5","2/5"],"answer":1},{"q":"12’nin %50’si?","options":["4","6","8","12"],"answer":1},{"q":"2³ = ?","options":["6","8","9","4"],"answer":1}]}',
  true, 0, 21
),
(
  'Eşleştir: Fen Kavramları (7)',
  'Madde, kuvvet ve enerji terimlerini eşleştir.',
  'match',
  'Fen',
  '7',
  '{"items":[{"left":"Kütle","right":"Maddenin miktarı"},{"left":"Hacim","right":"Maddenin kapladığı yer"},{"left":"Yoğunluk","right":"Kütle / hacim"},{"left":"Kuvvet","right":"Cismi hareket ettiren etki"},{"left":"Sürtünme","right":"Hareketi yavaşlatan kuvvet"}]}',
  true, 0, 22
),
(
  'Flashcards: İngilizce Fiiller (7)',
  'Sık kullanılan fiilleri ve Türkçe karşılıklarını öğren.',
  'flashcards',
  'İngilizce',
  '7',
  '{"cards":[{"front":"to begin","back":"başlamak"},{"front":"to decide","back":"karar vermek"},{"front":"to improve","back":"geliştirmek"},{"front":"to notice","back":"fark etmek"},{"front":"to prepare","back":"hazırlamak"},{"front":"to refuse","back":"reddetmek"},{"front":"to succeed","back":"başarmak"},{"front":"to wonder","back":"merak etmek"}]}',
  true, 0, 23
),
(
  'Sırala: Günlük Rutin',
  'Sabah rutinini doğru sıraya koy. Dikkat ve sıralama.',
  'sort',
  'Dikkat',
  '7',
  '{"items":[{"id":"a","text":"Uyanmak","order":1},{"id":"b","text":"Kahvaltı yapmak","order":2},{"id":"c","text":"Okula gitmek","order":3},{"id":"d","text":"Ders çalışmak","order":4}]}',
  true, 0, 24
),

-- ========== 8. SINIF ==========
(
  'Hafıza: Elementler (8)',
  'Sık kullanılan element sembollerini isimleriyle eşleştir.',
  'memory',
  'Fen',
  '8',
  '{"pairs":[{"id":"1","front":"H","back":"Hidrojen"},{"id":"2","front":"O","back":"Oksijen"},{"id":"3","front":"C","back":"Karbon"},{"id":"4","front":"N","back":"Azot"},{"id":"5","front":"Fe","back":"Demir"},{"id":"6","front":"Na","back":"Sodyum"}]}',
  true, 0, 30
),
(
  'Quiz: 8. Sınıf Türkçe',
  'Dil bilgisi ve anlam bilgisi soruları.',
  'quiz',
  'Türkçe',
  '8',
  '{"questions":[{"q":"Hangisi bağlaçtır?","options":["ve","hızlı","güzel","kitap"],"answer":0},{"q":"\"Gülüyorum\" fiilinin kipi?","options":["Emir","İstek","Bildirme","Şart"],"answer":2},{"q":"Hangisi zamirdir?","options":["ev","ben","mavi","koşmak"],"answer":1},{"q":"\"Güzelce\" kelimesinin türü?","options":["Sıfat","Zarf","İsim","Fiil"],"answer":1},{"q":"Eş anlamlısı \"büyük\" olan?","options":["küçük","iri","ince","kısa"],"answer":1}]}',
  true, 0, 31
),
(
  'Eşleştir: Coğrafya (8)',
  'Ülke–başkent eşleştirme.',
  'match',
  'Coğrafya',
  '8',
  '{"items":[{"left":"Türkiye","right":"Ankara"},{"left":"Fransa","right":"Paris"},{"left":"Japonya","right":"Tokyo"},{"left":"Almanya","right":"Berlin"},{"left":"İtalya","right":"Roma"},{"left":"Mısır","right":"Kahire"}]}',
  true, 0, 32
),
(
  'Flashcards: Matematik Formülleri (8)',
  'Alan ve çevre formüllerini pekiştir.',
  'flashcards',
  'Matematik',
  '8',
  '{"cards":[{"front":"Kare alan","back":"a²"},{"front":"Dikdörtgen alan","back":"a × b"},{"front":"Üçgen alan","back":"(taban × yükseklik) / 2"},{"front":"Daire alan","back":"πr²"},{"front":"Daire çevre","back":"2πr"},{"front":"Küp hacim","back":"a³"}]}',
  true, 0, 33
),
(
  'Çark: Renk ve Şekil',
  'Çarkı çevir, çıkan rengi veya şekli bul.',
  'wheel',
  'Dikkat',
  '8',
  '{"segments":[{"label":"Kırmızı","color":"#ef4444"},{"label":"Mavi","color":"#3b82f6"},{"label":"Yeşil","color":"#22c55e"},{"label":"Sarı","color":"#eab308"},{"label":"Mor","color":"#a855f7"},{"label":"Turuncu","color":"#f97316"}],"mode":"reveal"}',
  true, 0, 34
),

-- ========== 9. SINIF ==========
(
  'Hafıza: Biyoloji Hücre',
  'Hücre organellerini işlevleriyle eşleştir.',
  'memory',
  'Biyoloji',
  '9',
  '{"pairs":[{"id":"1","front":"Mitokondri","back":"Enerji üretimi"},{"id":"2","front":"Ribozom","back":"Protein sentezi"},{"id":"3","front":"Çekirdek","back":"Genetik kontrol"},{"id":"4","front":"Golgi","back":"Paketleme ve salgı"},{"id":"5","front":"Lizozom","back":"Sindirim enzimleri"},{"id":"6","front":"Hücre zarı","back":"Seçici geçirgenlik"}]}',
  true, 0, 40
),
(
  'Quiz: 9. Sınıf Tarih',
  'İlk çağ ve Türk tarihi temel sorular.',
  'quiz',
  'Tarih',
  '9',
  '{"questions":[{"q":"İstanbul’un fethi hangi yıldır?","options":["1453","1071","1299","1923"],"answer":0},{"q":"Malazgirt Savaşı hangi yılda?","options":["1071","1453","1517","1299"],"answer":0},{"q":"Osmanlı’nın kurucusu kimdir?","options":["Orhan","Osman Bey","Fatih","Yavuz"],"answer":1},{"q":"Cumhuriyet hangi yılda ilan edildi?","options":["1919","1920","1923","1938"],"answer":2},{"q":"Kurtuluş Savaşı’nın başlangıcı?","options":["1919","1920","1922","1923"],"answer":0}]}',
  true, 0, 41
),
(
  'Eşleştir: Kimya Temel',
  'Element ve bileşik kavramlarını eşleştir.',
  'match',
  'Kimya',
  '9',
  '{"items":[{"left":"Atom","right":"Maddenin en küçük yapı taşı"},{"left":"Molekül","right":"Atomların birleşmesi"},{"left":"Element","right":"Aynı cins atomlardan oluşan madde"},{"left":"Bileşik","right":"Farklı elementlerin birleşmesi"},{"left":"Karışım","right":"Saf olmayan madde karışımı"}]}',
  true, 0, 42
),
(
  'Flashcards: İngilizce Akademik (9)',
  'Sınav ve akademik metinlerde geçen kelimeler.',
  'flashcards',
  'İngilizce',
  '9',
  '{"cards":[{"front":"analyze","back":"çözümlemek"},{"front":"conclude","back":"sonuçlandırmak"},{"front":"evidence","back":"kanıt"},{"front":"hypothesis","back":"hipotez"},{"front":"significant","back":"önemli / anlamlı"},{"front":"summarize","back":"özetlemek"},{"front":"variable","back":"değişken"},{"front":"accurate","back":"doğru / kesin"}]}',
  true, 0, 43
),
(
  'Sırala: Bilimsel Yöntem',
  'Bilimsel araştırma adımlarını sıraya koy.',
  'sort',
  'Fen',
  '9',
  '{"items":[{"id":"a","text":"Gözlem / problem belirleme","order":1},{"id":"b","text":"Hipotez kurma","order":2},{"id":"c","text":"Deney yapma","order":3},{"id":"d","text":"Sonuç ve yorum","order":4}]}',
  true, 0, 44
),

-- ========== 10. SINIF ==========
(
  'Hafıza: Fizik Birimleri',
  'Temel fizik büyüklüklerini birimleriyle eşleştir.',
  'memory',
  'Fizik',
  '10',
  '{"pairs":[{"id":"1","front":"Kuvvet","back":"Newton (N)"},{"id":"2","front":"Enerji","back":"Joule (J)"},{"id":"3","front":"Güç","back":"Watt (W)"},{"id":"4","front":"Basınç","back":"Pascal (Pa)"},{"id":"5","front":"Hız","back":"m/s"},{"id":"6","front":"İvme","back":"m/s²"}]}',
  true, 0, 50
),
(
  'Quiz: 10. Sınıf Matematik',
  'Fonksiyon, üslü ve köklü ifadeler.',
  'quiz',
  'Matematik',
  '10',
  '{"questions":[{"q":"√144 = ?","options":["10","12","14","16"],"answer":1},{"q":"2⁵ = ?","options":["16","32","64","10"],"answer":1},{"q":"f(x)=2x+1 için f(3)=?","options":["5","6","7","8"],"answer":2},{"q":"3² + 4² = ?","options":["25","7","12","5"],"answer":0},{"q":"log₁₀100 = ?","options":["1","2","10","100"],"answer":1}]}',
  true, 0, 51
),
(
  'Eşleştir: Edebi Türler (10)',
  'Tür adlarını kısa tanımlarıyla eşleştir.',
  'match',
  'Edebiyat',
  '10',
  '{"items":[{"left":"Roman","right":"Uzun düzyazı anlatı"},{"left":"Hikâye","right":"Kısa düzyazı anlatı"},{"left":"Tiyatro","right":"Sahne için diyalog metni"},{"left":"Deneme","right":"Kişisel görüşlerle serbest düzyazı"},{"left":"Şiir","right":"Duygu ve imge ağırlıklı metin"}]}',
  true, 0, 52
),
(
  'Flashcards: Coğrafya Kavramları',
  'İklim, yer şekli ve nüfus terimleri.',
  'flashcards',
  'Coğrafya',
  '10',
  '{"cards":[{"front":"İklim","back":"Uzun süreli hava durumu ortalaması"},{"front":"Rölyef","back":"Yer şekilleri bütünü"},{"front":"Nüfus yoğunluğu","back":"Birim alandaki insan sayısı"},{"front":"Migrasyon","back":"Göç hareketi"},{"front":"Biyoçeşitlilik","back":"Canlı türlerinin çeşitliliği"},{"front":"Ekosistem","back":"Canlı-cansız çevre etkileşimi"}]}',
  true, 0, 53
),
(
  'Çark: Matematik İşlem',
  'Çarkı çevir, çıkan işlemi zihinden çöz.',
  'wheel',
  'Matematik',
  '10',
  '{"segments":[{"label":"15+27","color":"#ef4444"},{"label":"8×9","color":"#3b82f6"},{"label":"144÷12","color":"#22c55e"},{"label":"25²","color":"#eab308"},{"label":"√81","color":"#a855f7"},{"label":"50% of 80","color":"#f97316"}],"mode":"reveal"}',
  true, 0, 54
),

-- ========== 11. SINIF ==========
(
  'Hafıza: Kimya Bağlar',
  'Bağ türlerini özellikleriyle eşleştir.',
  'memory',
  'Kimya',
  '11',
  '{"pairs":[{"id":"1","front":"İyonik bağ","back":"Metal + ametal, elektron transferi"},{"id":"2","front":"Kovalent bağ","back":"Ametaller arası elektron paylaşımı"},{"id":"3","front":"Metalik bağ","back":"Metaller arası serbest elektron"},{"id":"4","front":"Hidrojen bağı","back":"H ile N/O/F arası zayıf çekim"},{"id":"5","front":"Van der Waals","back":"Moleküller arası zayıf kuvvet"},{"id":"6","front":"Polar kovalent","back":"Eşit olmayan elektron paylaşımı"}]}',
  true, 0, 60
),
(
  'Quiz: 11. Sınıf Biyoloji',
  'Genetik ve hücre bölünmesi temelleri.',
  'quiz',
  'Biyoloji',
  '11',
  '{"questions":[{"q":"DNA’nın açılımı nedir?","options":["Deoksiribonükleik asit","Ribonükleik asit","Protein","Enzim"],"answer":0},{"q":"Mitoz sonucu kaç hücre oluşur?","options":["1","2","4","8"],"answer":1},{"q":"Mayoz hangi hücrelerde olur?","options":["Vücut","Üreme","Sinir","Kas"],"answer":1},{"q":"Gen nedir?","options":["Protein","Kalıtım birimi","Hücre","Organel"],"answer":1},{"q":"Kromozom nerede bulunur?","options":["Sitoplazma","Çekirdek","Mitokondri","Ribozom"],"answer":1}]}',
  true, 0, 61
),
(
  'Eşleştir: Tarih Dönemleri',
  'Dönemleri önemli olaylarla eşleştir.',
  'match',
  'Tarih',
  '11',
  '{"items":[{"left":"Tanzimat","right":"1839 – ıslahat fermanları"},{"left":"Meşrutiyet","right":"Anayasal monarşi denemeleri"},{"left":"Milli Mücadele","right":"1919–1922 Kurtuluş"},{"left":"Cumhuriyet","right":"1923 sonrası modernleşme"},{"left":"İkinci Dünya Savaşı","right":"1939–1945 küresel savaş"}]}',
  true, 0, 62
),
(
  'Flashcards: Fizik Formülleri (11)',
  'Kuvvet, enerji, hareket formülleri.',
  'flashcards',
  'Fizik',
  '11',
  '{"cards":[{"front":"F = m·a","back":"Newton’un 2. yasası"},{"front":"E = m·c²","back":"Kütle-enerji eşdeğerliği"},{"front":"W = F·d","back":"İş formülü"},{"front":"P = W/t","back":"Güç formülü"},{"front":"v = s/t","back":"Ortalama hız"},{"front":"a = Δv/Δt","back":"İvme"}]}',
  true, 0, 63
),
(
  'Sırala: Edebiyat Dönemleri',
  'Türk edebiyatı dönemlerini kronolojik sıraya koy.',
  'sort',
  'Edebiyat',
  '11',
  '{"items":[{"id":"a","text":"Tanzimat","order":1},{"id":"b","text":"Servet-i Fünûn","order":2},{"id":"c","text":"Millî Edebiyat","order":3},{"id":"d","text":"Cumhuriyet","order":4}]}',
  true, 0, 64
),

-- ========== 12. SINIF ==========
(
  'Hafıza: YKS Matematik',
  'Sık çıkan kavramları eşleştir. Sınav odaklı dikkat.',
  'memory',
  'Matematik',
  '12',
  '{"pairs":[{"id":"1","front":"Türev","back":"Anlık değişim oranı"},{"id":"2","front":"İntegral","back":"Alan / antiderivatif"},{"id":"3","front":"Limit","back":"Yaklaşma değeri"},{"id":"4","front":"Fonksiyon","back":"Her x için tek y"},{"id":"5","front":"Logaritma","back":"Üssün tersi"},{"id":"6","front":"Trigonometri","back":"Açı-kenar ilişkileri"}]}',
  true, 0, 70
),
(
  'Quiz: 12. Sınıf Edebiyat',
  'YKS tarzı edebiyat soruları.',
  'quiz',
  'Edebiyat',
  '12',
  '{"questions":[{"q":"\"Tutunamayanlar\" yazarı?","options":["Yaşar Kemal","Oğuz Atay","Orhan Pamuk","Yakup Kadri"],"answer":1},{"q":"Garip akımı öncüsü?","options":["Ahmet Haşim","Orhan Veli","Necip Fazıl","Attilâ İlhan"],"answer":1},{"q":"\"Sefiller\" yazarı?","options":["Balzac","Victor Hugo","Zola","Flaubert"],"answer":1},{"q":"Divan’da gazel beyit sayısı genelde?","options":["Tek","Çift","Hep 5","Hep 10"],"answer":0},{"q":"\"Kürk Mantolu Madonna\" yazarı?","options":["Sabahattin Ali","Reşat Nuri","Halide Edip","Peyami Safa"],"answer":0}]}',
  true, 0, 71
),
(
  'Eşleştir: Biyoloji İleri',
  'Genetik ve evrim kavramları.',
  'match',
  'Biyoloji',
  '12',
  '{"items":[{"left":"Mutasyon","right":"DNA’da kalıcı değişiklik"},{"left":"Adaptasyon","right":"Çevreye uyum"},{"left":"Seçilim","right":"Uygun özelliklerin aktarılması"},{"left":"Homolog organ","right":"Ortak kökenden farklı işlev"},{"left":"Analog organ","right":"Farklı kökenden benzer işlev"}]}',
  true, 0, 72
),
(
  'Flashcards: Kimya Denklem',
  'Tepkime türleri ve denge.',
  'flashcards',
  'Kimya',
  '12',
  '{"cards":[{"front":"Yükseltgenme","back":"Elektron kaybı"},{"front":"İndirgenme","back":"Elektron kazanımı"},{"front":"Katalizör","back":"Tepkime hızını artıran madde"},{"front":"Denge","back":"İleri ve geri hız eşitliği"},{"front":"Endotermik","back":"Isı alan tepkime"},{"front":"Ekzotermik","back":"Isı veren tepkime"}]}',
  true, 0, 73
),
(
  'Çark: YKS Kelime',
  'Çarkı çevir, çıkan kelimeyi tanımla veya kullan.',
  'wheel',
  'Türkçe',
  '12',
  '{"segments":[{"label":"Paradoks","color":"#ef4444"},{"label":"Analoji","color":"#3b82f6"},{"label":"İroni","color":"#22c55e"},{"label":"Metafor","color":"#eab308"},{"label":"Antitez","color":"#a855f7"},{"label":"Hiperbol","color":"#f97316"}],"mode":"reveal"}',
  true, 0, 74
),

-- Extra mixed attention / multi-grade
(
  'Hafıza: Dikkat Sayıları',
  'Sayıları ve basit işlem sonuçlarını eşleştir. Dikkat çalışması.',
  'memory',
  'Dikkat',
  '7-9',
  '{"pairs":[{"id":"1","front":"7+8","back":"15"},{"id":"2","front":"9×3","back":"27"},{"id":"3","front":"20-6","back":"14"},{"id":"4","front":"48÷6","back":"8"},{"id":"5","front":"5²","back":"25"},{"id":"6","front":"√36","back":"6"}]}',
  true, 0, 80
),
(
  'Quiz: Genel Kültür Hızlı',
  'Kısa genel kültür soruları. Hız ve doğruluk.',
  'quiz',
  'Genel',
  '8-12',
  '{"questions":[{"q":"Türkiye’nin başkenti?","options":["İstanbul","Ankara","İzmir","Bursa"],"answer":1},{"q":"Dünya’nın en büyük okyanusu?","options":["Atlas","Hint","Pasifik","Arktik"],"answer":2},{"q":"Su’nun kimyasal formülü?","options":["CO₂","H₂O","O₂","NaCl"],"answer":1},{"q":"Işık hızı yaklaşık?","options":["300 km/s","300.000 km/s","30 km/s","3.000 km/s"],"answer":1}]}',
  true, 0, 81
),
(
  'Eşleştir: İngilizce Zıt Anlam',
  'Zıt anlamlı kelime çiftlerini eşleştir.',
  'match',
  'İngilizce',
  '9-11',
  '{"items":[{"left":"Hot","right":"Cold"},{"left":"Big","right":"Small"},{"left":"Fast","right":"Slow"},{"left":"Happy","right":"Sad"},{"left":"Day","right":"Night"},{"left":"Up","right":"Down"}]}',
  true, 0, 82
);

