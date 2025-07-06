const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy');

async function fetchQuote() {
    quoteEl.textContent = 'Loading...';
    authorEl.textContent = '—';

    try {
        const res = await fetch('http://localhost:3000/api/quote');
        const data = await res.json();

        quoteEl.textContent = `"${data.q}"`;
        authorEl.textContent = data.a ? `— ${data.a}` : '— Unknown';
    } catch (err) {
        quoteEl.textContent = 'Failed to load quote.';
        authorEl.textContent = '';
        console.error(err);
    }
}

newQuoteBtn.addEventListener('click', fetchQuote);

copyBtn.addEventListener('click', () => {
    const text = `${quoteEl.textContent} ${authorEl.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => (copyBtn.textContent = "📋 Copy"), 2000);
    });
});

fetchQuote();
