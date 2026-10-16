-- Add wheel (çark) game type
alter table games drop constraint if exists games_type_check;
alter table games add constraint games_type_check check (type in ('memory', 'match', 'quiz', 'flashcards', 'sort', 'wheel'));

-- Sample wheel game
insert into games (title, description, type, subject, grade, content, is_public, tier, sort) values
(
  'Çark: Kelime Avı',
  'Çarkı çevir, çıkan kelimeyi bul ve işaretle. Dikkat ve kelime dağarcığı.',
  'wheel',
  'Türkçe',
  '7-9',
  '{"segments":[{"label":"Güneş","color":"#ef4444"},{"label":"Ay","color":"#3b82f6"},{"label":"Yıldız","color":"#eab308"},{"label":"Bulut","color":"#22c55e"},{"label":"Rüzgar","color":"#a855f7"},{"label":"Yağmur","color":"#06b6d4"},{"label":"Kar","color":"#f97316"},{"label":"Gökkuşağı","color":"#ec4899"}],"mode":"reveal"}',
  true, 0, 10
)
on conflict do nothing;
