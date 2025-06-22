import json

with open('quran.json', 'r', encoding='utf-8') as f:
    quran = json.load(f)

with open('quran_tefsir.json', 'r', encoding='utf-8') as f:
    quran_tefsir = json.load(f)

tefsir_map = {}
for surah in quran_tefsir.get('surahs', []):
    surah_num = str(surah.get('surah_number'))
    ayahs = surah.get('ayahs', [])
    tefsir_map[surah_num] = [ayah.get('text', '') for ayah in ayahs]

quran_with_tefsir = {}

for surah_num, ayat_list in quran.items():
    combined_ayat = []
    tefsir_ayat_list = tefsir_map.get(surah_num, [])
    for i, ayah in enumerate(ayat_list):
        ayah_text = ayah.get('text', '')
        ayah_tefsir = tefsir_ayat_list[i] if i < len(tefsir_ayat_list) else ''
        combined_ayat.append({
            'text': ayah_text,
            'tefsir': ayah_tefsir
        })
    quran_with_tefsir[surah_num] = combined_ayat

with open('quran_with_tefsir.json', 'w', encoding='utf-8') as f:
    json.dump(quran_with_tefsir, f, ensure_ascii=False, indent=2)

print("Combined Quran with tefsir saved to quran_with_tefsir.json")