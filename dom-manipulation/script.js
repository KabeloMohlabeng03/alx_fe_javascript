// Initial array of quotes
let quotes = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
];

// Mock server URL
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();
      return data.map(item => ({ text: item.title, category: "Server" })); // Assuming title as quote text and a default category
  } catch (error) {
      console.error('Failed to fetch quotes from server:', error);
      return [];
  }
}

// Sync quotes with server
async function syncQuotesWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  const mergedQuotes = mergeQuotes(quotes, serverQuotes);

  // Update local quotes
  quotes = mergedQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();

  // Notify user about sync
  alert('Quotes synced with server. Conflicts resolved if any.');
}

// Merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
  const merged = [...serverQuotes];
  localQuotes.forEach(localQuote => {
      if (!serverQuotes.some(serverQuote => serverQuote.text === localQuote.text)) {
          merged.push(localQuote);
      }
  });
  return merged;
}

// Populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];

  // Clear existing categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add new categories
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });

  // Restore last selected filter from local storage
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
      categoryFilter.value = selectedCategory;
  }
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear previous quote
  quoteDisplay.innerHTML = '';

  // Create and append new quote elements
  const quoteText = document.createElement('p');
  quoteText.textContent = `"${randomQuote.text}"`;

  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `Category: ${randomQuote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Save the last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  filteredQuotes.forEach(quote => {
      const quoteText = document.createElement('p');
      quoteText.textContent = `"${quote.text}"`;

      const quoteCategory = document.createElement('p');
      quoteCategory.textContent = `Category: ${quote.category}`;

      quoteDisplay.appendChild(quoteText);
      quoteDisplay.appendChild(quoteCategory);
  });

  // Save the selected category to local storage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
      // Add new quote to the array
      quotes.push({ text: newQuoteText, category: newQuoteCategory });

      // Save quotes to local storage
      saveQuotes();

      // Populate category filter with new categories
      populateCategories();

      // Clear input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';

      alert('New quote added successfully!');
  } else {
      alert('Please enter both quote text and category.');
  }
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.id = 'newQuoteText';
  newQuoteTextInput.type = 'text';
  newQuoteTextInput.placeholder = 'Enter a new quote';

  const newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.id = 'newQuoteCategory';
  newQuoteCategoryInput.type = 'text';
  newQuoteCategoryInput.placeholder = 'Enter quote category';

  const addQuoteButton = document.createElement('button');
  addQuoteButton.textContent = 'Add Quote';
  addQuoteButton.onclick = addQuote;

  formContainer.appendChild(newQuoteTextInput);
  formContainer.appendChild(newQuoteCategoryInput);
  formContainer.appendChild(addQuoteButton);

  document.body.appendChild(formContainer);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Load quotes from local storage when the page loads
loadQuotes();

// Populate the category filter with existing categories
populateCategories();

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for "Export Quotes" button
document.getElementById('exportButton').addEventListener('click', exportToJsonFile);

// Create and add the form for adding new quotes to the DOM
createAddQuoteForm();

// Sync quotes with server every 30 seconds
setInterval(syncQuotesWithServer, 30000);
