const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy');
const favoriteBtn = document.createElement('button');
const shareBtn = document.createElement('button');
const buttonsDiv = document.querySelector('.buttons');

favoriteBtn.innerHTML = '❤️ Favorite';
favoriteBtn.id = 'favorite';
shareBtn.innerHTML = '📤 Share';
shareBtn.id = 'share';
buttonsDiv.appendChild(favoriteBtn);
buttonsDiv.appendChild(shareBtn);

const loadingHTML = `
  <div class="loading">
    <div class="dot-flashing"></div>
  </div>
`;

let currentQuote = { q: '', a: '' };

async function fetchQuote() {
    quoteEl.innerHTML = loadingHTML;
    authorEl.textContent = '—';

    try {
        const res = await fetch('http://localhost:3000/api/quote');
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
        console.error('Fetch error:', err);
        quoteEl.textContent = 'Failed to load quote. Please try again.';
        authorEl.textContent = '';
    }
}

function getFavorites() {
    try {
        const favorites = localStorage.getItem('favoriteQuotes');
        if (!favorites) return [];
        return JSON.parse(favorites) || [];
    } catch (err) {
        console.error('Error reading favorites:', err);
        return [];
    }
}

function updateFavoriteButton() {
    try {
        const favorites = getFavorites();
        const isFavorite = favorites.some(fav =>
            fav.q === currentQuote.q && fav.a === currentQuote.a
        );
        favoriteBtn.innerHTML = isFavorite ? '❤️ Unfavorite' : '❤️ Favorite';
    } catch (err) {
        console.error('Error updating favorite button:', err);
    }
}

function toggleFavorite() {
    try {
        const favorites = getFavorites();
        const quoteIndex = favorites.findIndex(fav =>
            fav.q === currentQuote.q && fav.a === currentQuote.a
        );

        if (quoteIndex === -1) {
            favorites.push(currentQuote);
        } else {
            favorites.splice(quoteIndex, 1);
        }

        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
        updateFavoriteButton();
    } catch (err) {
        console.error('Error toggling favorite:', err);
    }
}

function showShareOptions() {
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
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

    document.body.appendChild(shareModal);

    document.querySelectorAll('.share-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            shareToService(service);
        });
    });

    document.querySelector('.close-share').addEventListener('click', () => {
        shareModal.remove();
    });
}

function shareToService(service) {
    const text = `${currentQuote.q} — ${currentQuote.a}`;
    let url;

    switch (service) {
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(`${text} ${window.location.href}`)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(`${text} ${window.location.href}`);
            alert('Link copied to clipboard!');
            document.querySelector('.share-modal')?.remove();
            return;
    }

    window.open(url, '_blank', 'width=600,height=400');
}

newQuoteBtn.addEventListener('click', fetchQuote);
favoriteBtn.addEventListener('click', toggleFavorite);
shareBtn.addEventListener('click', showShareOptions);

copyBtn.addEventListener('click', () => {
    try {
        const text = `${currentQuote.q} — ${currentQuote.a}`;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = "✅ Copied!";
            setTimeout(() => (copyBtn.textContent = "📋 Copy"), 2000);
        }).catch(err => console.error('Copy error:', err));
    } catch (err) {
        console.error('Copy error:', err);
    }
});

if (!localStorage.getItem('favoriteQuotes')) {
    localStorage.setItem('favoriteQuotes', JSON.stringify([]));
}

fetchQuote();