create table if not exists games (
  id serial primary key,
  title text not null,
  description text not null default '',
  type text not null check (type in ('memory', 'match', 'quiz', 'flashcards', 'sort')),
  subject text not null default '',
  grade text not null default '',
  content jsonb not null default '{}',
  is_public boolean not null default true,
  tier int not null default 0,
  thumbnail text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists games_public_idx on games (is_public);
create index if not exists games_type_idx on games (type);
create index if not exists games_sort_idx on games (sort);

-- Seed Wordwall-style educational games
insert into games (title, description, type, subject, grade, content, is_public, tier, sort) values
(
  'Hafıza Kartları: Geometri',
  'Temel geometri şekillerini eşleştir. Dikkat ve görsel bellek çalışması.',
  'memory',
  'Matematik',
  '7-8',
  '{"pairs":[{"id":"1","front":"Üçgen","back":"3 kenarlı çokgen"},{"id":"2","front":"Kare","back":"4 eşit kenar, 4 dik açı"},{"id":"3","front":"Daire","back":"Merkezden eşit uzaklıkta noktalar"},{"id":"4","front":"Dikdörtgen","back":"Karşılıklı kenarlar eşit, 4 dik açı"},{"id":"5","front":"Beşgen","back":"5 kenarlı çokgen"},{"id":"6","front":"Altıgen","back":"6 kenarlı çokgen"}]}',
  true, 0, 1
),
(
  'Eşleştir: Bilim Terimleri',
  'Bilim kavramlarını doğru tanımlarıyla eşleştir.',
  'match',
  'Fen',
  '7-9',
  '{"items":[{"left":"Fotosentez","right":"Bitkilerin ışıkla besin üretmesi"},{"left":"Hücre","right":"Canlıların en küçük yapı birimi"},{"left":"Atom","right":"Maddenin en küçük yapı taşı"},{"left":"Yerçekimi","right":"Dünya''nın cisimleri çekmesi"},{"left":"Sürtünme","right":"Yüzeylerin birbirine direnci"}]}',
  true, 0, 2
),
(
  'Quiz: Türkçe Dil Bilgisi',
  'Temel dil bilgisi soruları. Hızlı düşün, doğru seç.',
  'quiz',
  'Türkçe',
  '8-10',
  '{"questions":[{"q":"Aşağıdakilerden hangisi bağlaçtır?","options":["ve","hızlı","güzel","kitap"],"answer":0},{"q":"\"Gülüyorum\" fiilinin kipı nedir?","options":["Emir","İstek","Bildirme","Şart"],"answer":2},{"q":"Hangisi zamirdir?","options":["ev","ben","mavi","koşmak"],"answer":1},{"q":"\"Güzelce\" kelimesinin türü nedir?","options":["Sıfat","Zarf","İsim","Fiil"],"answer":1}]}',
  true, 0, 3
),
(
  'Flashcards: İngilizce Kelimeler',
  'Günlük İngilizce kelimeleri öğren. Kartı çevir, hatırla.',
  'flashcards',
  'İngilizce',
  '7-12',
  '{"cards":[{"front":"Apple","back":"Elma"},{"front":"Book","back":"Kitap"},{"front":"Water","back":"Su"},{"front":"Friend","back":"Arkadaş"},{"front":"School","back":"Okul"},{"front":"Teacher","back":"Öğretmen"},{"front":"Happy","back":"Mutlu"},{"front":"Quick","back":"Hızlı"}]}',
  true, 0, 4
),
(
  'Sırala: Tarih Olayları',
  'Tarihi olayları doğru kronolojik sıraya koy.',
  'sort',
  'Tarih',
  '9-11',
  '{"items":[{"id":"a","text":"İstanbul''un Fethi","order":3},{"id":"b","text":"Malazgirt Savaşı","order":1},{"id":"c","text":"Cumhuriyet''in İlanı","order":4},{"id":"d","text":"Kurtuluş Savaşı başlangıcı","order":2}]}',
  true, 0, 5
),
(
  'Hafıza: Element Sembolleri',
  'Element isimleri ve sembollerini eşleştir.',
  'memory',
  'Kimya',
  '9-12',
  '{"pairs":[{"id":"1","front":"H","back":"Hidrojen"},{"id":"2","front":"O","back":"Oksijen"},{"id":"3","front":"C","back":"Karbon"},{"id":"4","front":"N","back":"Azot"},{"id":"5","front":"Fe","back":"Demir"},{"id":"6","front":"Au","back":"Altın"}]}',
  true, 0, 6
),
(
  'Quiz: Matematik Hızlı',
  'Temel işlem soruları. Süreye karşı yarış.',
  'quiz',
  'Matematik',
  '7-9',
  '{"questions":[{"q":"12 × 8 = ?","options":["86","96","106","76"],"answer":1},{"q":"√144 = ?","options":["10","11","12","13"],"answer":2},{"q":"3² + 4² = ?","options":["25","7","12","5"],"answer":0},{"q":"0.5 + 0.25 = ?","options":["0.7","0.75","0.8","1"],"answer":1}]}',
  true, 0, 7
),
(
  'Eşleştir: Coğrafya',
  'Ülkeler ve başkentlerini eşleştir.',
  'match',
  'Coğrafya',
  '8-10',
  '{"items":[{"left":"Türkiye","right":"Ankara"},{"left":"Fransa","right":"Paris"},{"left":"Japonya","right":"Tokyo"},{"left":"Brezilya","right":"Brasilia"},{"left":"Mısır","right":"Kahire"}]}',
  true, 0, 8
),
(
  'Flashcards: Biyoloji Terimleri',
  'Biyoloji kavramlarını pekiştir.',
  'flashcards',
  'Biyoloji',
  '9-12',
  '{"cards":[{"front":"DNA","back":"Genetik bilgi taşıyan molekül"},{"front":"Mitokondri","back":"Hücrenin enerji santrali"},{"front":"Fotosentez","back":"Işık enerjisiyle organik madde üretimi"},{"front":"Enzim","back":"Biyolojik katalizör"},{"front":"Hücre zarı","back":"Hücreyi çevreleyen seçici geçirgen yapı"}]}',
  true, 1, 9
),
(
  'Sırala: Matematik İşlem Önceliği',
  'İşlemleri doğru sırayla düzenle.',
  'sort',
  'Matematik',
  '7-8',
  '{"items":[{"id":"a","text":"Parantez içi","order":1},{"id":"b","text":"Üslü ifadeler","order":2},{"id":"c","text":"Çarpma / Bölme","order":3},{"id":"d","text":"Toplama / Çıkarma","order":4}]}',
  true, 0, 10
);
