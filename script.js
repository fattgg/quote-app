const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy');

async function fetchQuote() {
    quoteEl.textContent = 'Loading...';
    authorEl.textContent = '—';

    try {
        const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://zenquotes.io/api/random') + `?t=${Date.now()}`;
        const res = await fetch(url);
        const data = await res.json();
        quoteEl.textContent = `"${data[0].q}"`;
        authorEl.textContent = `— ${data[0].a}`;
    } catch (err) {
        console.error(err);
        quoteEl.textContent = 'Failed to load quote.';
        authorEl.textContent = '';
    }
}

newQuoteBtn.addEventListener('click', () => {
    newQuoteBtn.disabled = true;
    fetchQuote();
    setTimeout(() => newQuoteBtn.disabled = false, 5000);
});


copyBtn.addEventListener('click', () => {
    const text = `${quoteEl.textContent} ${authorEl.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => copyBtn.textContent = "📋 Copy", 2000);
    });
});

fetchQuote();
