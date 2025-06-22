// Global variables
let quranData = {};
let currentSurahIndex = 0;
let fontSize = 1.5; // Default Arabic font size in rem

// DOM elements
const surahListElement = document.getElementById('surah-list');
const versesContainer = document.getElementById('verses-container');
const surahNameElement = document.getElementById('surah-name');
const surahNumberElement = document.getElementById('surah-number');
const verseCountElement = document.getElementById('verse-count');
const prevSurahBtn = document.getElementById('prev-surah');
const nextSurahBtn = document.getElementById('next-surah');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const increaseFontBtn = document.getElementById('increase-font');
const decreaseFontBtn = document.getElementById('decrease-font');

const surahNames = [
    "الفَاتِحَةِ","البَقَرَةِ","آلِ عِمۡرَانَ","النِّسَاءِ","المَائ‍ِدَةِ","الأَنعَامِ","الأَعۡرَافِ","الأَنفَالِ","التَّوۡبَةِ","يُونُسَ",
    "هُودٍ","يُوسُفَ","الرَّعۡدِ","إِبۡرَاهِيمَ","الحِجۡرِ","النَّحۡلِ","الإِسۡرَاءِ","الكَهۡفِ","مَرۡيَمَ","طه",
    "الأَنبيَاءِ","الحَجِّ","المُؤۡمِنُونَ","النُّورِ","الفُرۡقَانِ","الشُّعَرَاءِ","النَّمۡلِ","القَصَصِ","العَنكَبُوتِ","الرُّومِ",
    "لُقۡمَانَ","السَّجۡدَةِ","الأَحۡزَابِ","سَبَإٍ","فَاطِرٍ","يسٓ","الصَّافَّاتِ","صٓ","الزُّمَرِ","غَافِرٍ",
    "فُصِّلَتۡ","الشُّورَىٰ","الزُّخۡرُفِ","الدُّخَانِ","الجَاثِيَةِ","الأَحۡقَافِ","مُحَمَّدٍ","الفَتۡحِ","الحُجُرَاتِ","قٓ",
    "الذَّارِيَاتِ","الطُّورِ","النَّجۡمِ","القَمَرِ","الرَّحۡمَٰنُ","الوَاقِعَةِ","الحَدِيدِ","المُجَادِلَةِ","الحَشۡرِ","المُمۡتَحَنَةِ",
    "الصَّفِّ","الجُمُعَةِ","المُنَافِقُونَ","التَّغَابُنِ","الطَّلَاقِ","التَّحۡرِيمِ","المُلۡكِ","القَلَمِ","الحَاقَّةِ","المَعَارِجِ",
    "نُوحٍ","الجِنِّ","المُزَّمِّلِ","المُدَّثِّرِ","القِيَامَةِ","الإِنسَانِ","المُرۡسَلَاتِ","النَّبَإِ","النَّازِعَاتِ","عَبَسَ",
    "التَّكۡوِيرِ","الانفِطَارِ","المُطَفِّفِينَ","الانشِقَاقِ","البُرُوجِ","الطَّارِقِ","الأَعۡلَىٰ","الغَاشِيَةِ","الفَجۡرِ","البَلَدِ",
    "الشَّمۡسِ","اللَّيۡلِ","الضُّحَىٰ","الشَّرۡحِ","التِّينِ","العَلَقِ","القَدۡرِ","البَيِّنَةِ","الزَّلۡزَلَةِ","العَادِيَاتِ",
    "القَارِعَةِ","التَّكَاثُرِ","العَصۡرِ","الهُمَزَةِ","الفِيلِ","قُرَيۡشٍ","المَاعُونِ","الكَوۡثَرِ","الكَافِرُونَ","النَّصۡرِ",
    "المَسَدِ","الإِخۡلَاصِ","الفَلَقِ","النَّاسِ"
];

async function init() {
    try {
        versesContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        
        const response = await fetch('quran_with_tefsir.json');
        quranData = await response.json();
        
        renderSurahList();
        
        loadSurah(currentSurahIndex);
        
        setupEventListeners();
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
        
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            fontSize = parseFloat(savedFontSize);
            updateFontSize();
        }
    } catch (error) {
        console.error('Error loading Quran data:', error);
        versesContainer.innerHTML = '<div class="error">Failed to load Quran data. Please try again later.</div>';
    }
}

function renderSurahList() {
    surahListElement.innerHTML = '';
    const surahNumbers = Object.keys(quranData).sort((a, b) => Number(a) - Number(b));
    surahNumbers.forEach((surahNum, index) => {
        const surahItem = document.createElement('div');
        surahItem.className = 'surah-item';
        surahItem.dataset.index = index;
        
        surahItem.innerHTML = `
            <div class="surah-number">${surahNum}</div>
            <div class="surah-name">${surahNames[index] || ''}</div>
        `;
        
        surahItem.addEventListener('click', () => {
            currentSurahIndex = index;
            loadSurah(currentSurahIndex);
            document.querySelectorAll('.surah-item').forEach(item => {
                item.classList.remove('active');
            });
            surahItem.classList.add('active');
        });
        
        surahListElement.appendChild(surahItem);
    });
}

function loadSurah(index) {
    const surahNumbers = Object.keys(quranData).sort((a, b) => Number(a) - Number(b));
    const surahNum = surahNumbers[index];
    const verses = quranData[surahNum];

    surahNameElement.textContent = surahNames[index] || `Surah ${surahNum}`;
    surahNumberElement.textContent = `Surah ${surahNum}`;
    verseCountElement.textContent = `${verses.length} verses`;

    renderVerses(verses);

    prevSurahBtn.disabled = index === 0;
    nextSurahBtn.disabled = index === surahNumbers.length - 1;

    window.scrollTo(0, 0);

    document.querySelectorAll('.surah-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.index) === index) {
            item.classList.add('active');
        }
    });
}

function renderVerses(verses) {
    versesContainer.innerHTML = '';
    verses.forEach((verse, idx) => {
        const verseElement = document.createElement('div');
        verseElement.className = 'verse';
        verseElement.innerHTML = `
            <div class="verse-number">${idx + 1}</div>
            <div class="verse-text" style="font-size: ${fontSize}rem">${verse.text}</div>
            <div class="verse-tefsir">${verse.tefsir ? verse.tefsir : ''}</div>
        `;
        versesContainer.appendChild(verseElement);
    });
}

function searchVerses() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
        loadSurah(currentSurahIndex);
        return;
    }
    versesContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    const results = [];
    const surahNumbers = Object.keys(quranData).sort((a, b) => Number(a) - Number(b));
    surahNumbers.forEach((surahNum, surahIdx) => {
        const verses = quranData[surahNum];
        verses.forEach((verse, idx) => {
            if (
                (verse.text && verse.text.toLowerCase().includes(searchTerm)) ||
                (verse.tefsir && verse.tefsir.toLowerCase().includes(searchTerm))
            ) {
                results.push({
                    surahNum,
                    surahIdx,
                    verseIdx: idx,
                    verse
                });
            }
        });
    });
    displaySearchResults(results);
}

function displaySearchResults(results) {
    versesContainer.innerHTML = '';
    if (results.length === 0) {
        versesContainer.innerHTML = '<div class="no-results">No verses found matching your search.</div>';
        return;
    }
    const resultsHeader = document.createElement('h3');
    resultsHeader.textContent = `Found ${results.length} verse(s) matching "${searchInput.value}"`;
    versesContainer.appendChild(resultsHeader);
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'verse search-result';
        resultElement.innerHTML = `
            <div class="verse-header">
                <span class="surah-name">${surahNames[result.surahIdx] || `Surah ${result.surahNum}`}</span>
                <span class="verse-number">(${result.surahNum}:${result.verseIdx + 1})</span>
            </div>
            <div class="verse-text" style="font-size: ${fontSize}rem">${result.verse.text}</div>
            <div class="verse-tefsir">${result.verse.tefsir ? result.verse.tefsir : ''}</div>
        `;
        resultElement.addEventListener('click', () => {
            currentSurahIndex = result.surahIdx;
            loadSurah(currentSurahIndex);
            searchInput.value = '';
        });
        versesContainer.appendChild(resultElement);
    });
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('theme', 'dark');
    }
}

function increaseFont() {
    if (fontSize < 2.5) {
        fontSize += 0.1;
        updateFontSize();
    }
}

function decreaseFont() {
    if (fontSize > 1.0) {
        fontSize -= 0.1;
        updateFontSize();
    }
}

function updateFontSize() {
    document.querySelectorAll('.verse-text').forEach(text => {
        text.style.fontSize = `${fontSize}rem`;
    });
    localStorage.setItem('fontSize', fontSize.toString());
}

function setupEventListeners() {
    prevSurahBtn.addEventListener('click', () => {
        if (currentSurahIndex > 0) {
            currentSurahIndex--;
            loadSurah(currentSurahIndex);
        }
    });
    nextSurahBtn.addEventListener('click', () => {
        const surahNumbers = Object.keys(quranData).sort((a, b) => Number(a) - Number(b));
        if (currentSurahIndex < surahNumbers.length - 1) {
            currentSurahIndex++;
            loadSurah(currentSurahIndex);
        }
    });
    searchBtn.addEventListener('click', searchVerses);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchVerses();
        }
    });
    themeToggleBtn.addEventListener('click', toggleTheme);
    increaseFontBtn.addEventListener('click', increaseFont);
    decreaseFontBtn.addEventListener('click', decreaseFont);
}

document.addEventListener('DOMContentLoaded', init);