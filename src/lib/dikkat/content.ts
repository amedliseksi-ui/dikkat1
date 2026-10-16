export const FALLBACK = {
  phone: "0535 238 17 65",
  tel: "+905352381765",
  whatsapp: "905352381765",
  address: "Güvenevler Mah. 1943 Sokak, Dede Apt. No:11A",
  city: "Yenişehir / Mersin",
  branch: "Forum kuzey tarafı, kurslar bölgesi",
  instagram: "https://www.instagram.com/dikkat.egitim.kurumu/",
};

export const programs = [
  {
    id: "yazili",
    kicker: "9 · 10 · 11 · 12. sınıf",
    title: "Yazılı hazırlık",
    text: "1. dönem yazılılarınız başlıyor. Hazırlık grupları için bize ulaşın.",
    image: "/posters/yazili.jpg",
    alt: "9, 10, 11 ve 12. sınıf yazılı hazırlık afişi",
    points: ["1. dönem yazılıları", "Hazırlık grupları", "Forum kuzey, kurslar bölgesi"],
  },
  {
    id: "vip",
    kicker: "1, 2 veya 4 kişilik",
    title: "VIP özel grup",
    text: "İster tüm dersler, ister ihtiyacın olanlar. Gün ve saatler sana özel.",
    image: "/posters/vip.jpg",
    alt: "VIP eğitim afişi: özel gruplar ve esnek ders saatleri",
    points: ["Küçük özel grup", "Tüm ders veya seçmeli", "Gün ve saat sana özel"],
  },
  {
    id: "okuma",
    kicker: "Anlayarak hızlı okuma",
    title: "Hızlı okuma",
    text: "Bloklayarak okuma, göz sıçratma, dikkat ve görme alanı çalışmaları.",
    image: "/posters/okuma.jpg",
    alt: "Anlayarak hızlı okuma eğitimi afişi",
    points: ["Bloklayarak okuma", "Dikkat geliştirme", "Sağ ve sol beyin egzersizleri"],
  },
  {
    id: "birebir",
    kicker: "Tek öğrenci, tek program",
    title: "Birebir ders",
    text: "Eksiğin kalabalıkta kaybolmaz. Öğretmeninle baş başa ilerlersin.",
    image: "/photos/birebir.jpg",
    alt: "Öğretmen ve öğrencinin birebir çalıştığı ders",
    points: ["Kişisel program", "VIP grup bu pakete dahil", "Tüm föy arşivi açık"],
  },
] as const;

export const posters = [
  { src: "/posters/hizmet.jpg", alt: "Kayıtlar devam ediyor: VIP eğitim duyurusu", caption: "Kayıtlar açık" },
  { src: "/posters/mezun.jpg", alt: "Mezun gruplar ve 7. sınıftan 12. sınıfa tüm seviyeler", caption: "Tüm seviyeler" },
  { src: "/posters/vip.jpg", alt: "VIP eğitim afişi", caption: "VIP eğitim" },
  { src: "/posters/yazili.jpg", alt: "Yazılı hazırlık afişi", caption: "Yazılılar" },
  { src: "/posters/okuma.jpg", alt: "Hızlı okuma afişi", caption: "Hızlı okuma" },
  { src: "/posters/cunku.jpg", alt: "Çünkü Dikkatli olan kazanır", caption: "Sloganımız" },
  { src: "/posters/cagri.jpg", alt: "İletişim çağrısı: telefon ve Yenişehir adresi", caption: "Bize ulaşın" },
] as const;

export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return `tel:${FALLBACK.tel}`;
  if (digits.startsWith("90")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+9${digits}`;
  return `tel:+${digits}`;
}

export function waHref(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  const n = digits.startsWith("90") ? digits : digits.startsWith("0") ? `9${digits}` : digits;
  const base = `https://wa.me/${n || FALLBACK.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatIban(value: string) {
  return value.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

export function luhnOk(num: string) {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 15 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function cardBrand(num: string) {
  const d = num.replace(/\D/g, "");
  if (d.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "Mastercard";
  if (d.startsWith("9792") || d.startsWith("65")) return "Troy";
  if (d.startsWith("3")) return "Amex";
  return "Kart";
}

export function errText(err: unknown) {
  const raw =
    err instanceof Error
      ? err.message
      : err && typeof err === "object" && "message" in err && typeof err.message === "string"
        ? err.message
        : "";
  if (!raw) return "İşlem tamamlanamadı.";
  if (raw === "Unauthorized") return "Devam etmek için giriş yapın.";
  return raw;
}
