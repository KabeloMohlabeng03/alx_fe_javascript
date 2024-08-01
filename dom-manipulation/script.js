let quotes = [
    { text: "Quote 1", category: "Category A" },
    { text: "Quote 2", category: "Category B" }
  ];
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
  }
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Initial load from localStorage if available
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);