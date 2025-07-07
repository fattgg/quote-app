const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy');
const favoriteBtn = document.createElement('button');
const shareBtn = document.createElement('button');
const speakBtn = document.createElement('button');
const themeBtn = document.createElement('button');
const buttonsDiv = document.querySelector('.buttons');

favoriteBtn.innerHTML = '❤️ Favorite';
favoriteBtn.id = 'favorite';
shareBtn.innerHTML = '📤 Share';
shareBtn.id = 'share';
speakBtn.innerHTML = '🔊 Speak';
speakBtn.id = 'speak';
themeBtn.innerHTML = '🌓 Toggle Theme';
themeBtn.id = 'theme-toggle';
buttonsDiv.appendChild(favoriteBtn);
buttonsDiv.appendChild(shareBtn);
buttonsDiv.appendChild(speakBtn);
document.body.insertBefore(themeBtn, document.querySelector('.container'));

const speechSynth = window.speechSynthesis;
let currentUtterance = null;

const loadingHTML = `
  <div class="loading">
    <div class="dot-flashing"></div>
  </div>
`;

let currentQuote = { q: '', a: '' };

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function speakQuote() {
    speechSynth.cancel();
    if (currentQuote.q) {
        const text = `${currentQuote.q}. By ${currentQuote.a || 'Unknown'}`;
        currentUtterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynth.getVoices();
        const voice = voices.find(v => v.name === 'Google UK English Male') || voices[0];
        if (voice) currentUtterance.voice = voice;
        speakBtn.innerHTML = '⏹ Stop';
        currentUtterance.onend = () => speakBtn.innerHTML = '🔊 Speak';
        speechSynth.speak(currentUtterance);
    }
}

function stopSpeech() {
    speechSynth.cancel();
    speakBtn.innerHTML = '🔊 Speak';
}

async function animateQuoteTransition() {
    stopSpeech();
    quoteEl.classList.add('quote-exiting');
    authorEl.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 400));
    quoteEl.innerHTML = loadingHTML;
    authorEl.textContent = '—';
    quoteEl.classList.remove('quote-exiting');
    quoteEl.classList.add('quote-entering');
    await fetchQuote();
    quoteEl.classList.remove('quote-entering');
    authorEl.style.opacity = '1';
}

async function fetchQuote() {
    try {
        const res = await fetch('https://quote-backend-83nu.onrender.com/api/quote');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        currentQuote = {
            q: data.q || 'No quote available',
            a: data.a || 'Unknown'
        };
        quoteEl.textContent = `"${currentQuote.q}"`;
        authorEl.textContent = `— ${currentQuote.a}`;
        updateFavoriteButton();
    } catch (err) {
        quoteEl.textContent = 'Failed to load quote. Please try again.';
        authorEl.textContent = '';
    }
}

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
    } catch {
        return [];
    }
}

function updateFavoriteButton() {
    const isFavorite = getFavorites().some(fav => fav.q === currentQuote.q && fav.a === currentQuote.a);
    favoriteBtn.innerHTML = isFavorite ? '❤️ Unfavorite' : '❤️ Favorite';
}

function toggleFavorite() {
    const favorites = getFavorites();
    const index = favorites.findIndex(fav => fav.q === currentQuote.q && fav.a === currentQuote.a);
    index === -1 ? favorites.push(currentQuote) : favorites.splice(index, 1);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    updateFavoriteButton();
}

function showShareOptions() {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
    <div class="share-content">
      <h3>Share Quote</h3>
      <div class="share-buttons">
        <button class="share-option" data-service="twitter">Twitter</button>
        <button class="share-option" data-service="facebook">Facebook</button>
        <button class="share-option" data-service="whatsapp">WhatsApp</button>
        <button class="share-option" data-service="copy">Copy Link</button>
      </div>
      <button class="close-share">Close</button>
    </div>
  `;

    document.body.appendChild(modal);
    modal.querySelector('.close-share').addEventListener('click', () => modal.remove());

    modal.querySelectorAll('.share-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            const text = `${currentQuote.q} — ${currentQuote.a}`;
            if (service === 'copy') {
                navigator.clipboard.writeText(text);
                modal.remove();
            } else {
                const urls = {
                    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`,
                    whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
                };
                window.open(urls[service], '_blank', 'width=600,height=400');
            }
        });
    });
}

newQuoteBtn.addEventListener('click', animateQuoteTransition);
favoriteBtn.addEventListener('click', toggleFavorite);
shareBtn.addEventListener('click', showShareOptions);
themeBtn.addEventListener('click', toggleTheme);
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(`${currentQuote.q} — ${currentQuote.a}`)
        .then(() => {
            copyBtn.textContent = "✅ Copied!";
            setTimeout(() => copyBtn.textContent = "📋 Copy", 2000);
        });
});
speakBtn.addEventListener('click', () => {
    speakBtn.innerHTML === '🔊 Speak' ? speakQuote() : stopSpeech();
});

initTheme();
if (!localStorage.getItem('favoriteQuotes')) {
    localStorage.setItem('favoriteQuotes', '[]');
}
fetchQuote();
speechSynth.onvoiceschanged = () => console.log('Voices ready');