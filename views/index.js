// Fetch and display a random joke
async function fetchRandomJoke() {
  try {
    const categories = await fetch('/jokebook/categories').then(res => res.json());
    const categoryNames = categories.categories.map(cat => cat.name);
    const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];

    const jokes = await fetch(`/jokebook/joke/${randomCategory}`).then(res => res.json());
    const randomJoke = jokes.jokes[Math.floor(Math.random() * jokes.jokes.length)];
    document.getElementById('random-joke').textContent = `${randomJoke.setup} - ${randomJoke.delivery}`;
  } catch (error) {
    document.getElementById('random-joke').textContent = 'Failed to load a random joke.';
    console.error(error);
  }
}

// Toggle visibility of the category list
function toggleCategoryList() {
  const categoryListContainer = document.getElementById("category-list-container");
  const backButton = document.getElementById("category-back-button");

  const isHidden = categoryListContainer.style.display === "none";

  // Show or hide the category list and back button
  categoryListContainer.style.display = isHidden ? "block" : "none";
  backButton.style.display = isHidden ? "inline-block" : "none";

  // Fetch categories when expanding the list
  if (isHidden) {
    fetchCategories();
  }
}

// Hide category list and reset to initial view
function hideCategories() {
  const categoryListContainer = document.getElementById("category-list-container");
  const backButton = document.getElementById("category-back-button");
  const categoryTitle = document.getElementById("category-section-title");

  const isDisplayingJokes = categoryTitle.textContent.startsWith("Jokes in");

  if (isDisplayingJokes) {
    categoryTitle.textContent = "Categories";
    fetchCategories();
  } else {
    categoryListContainer.style.display = "none";
    backButton.style.display = "none";
    categoryTitle.textContent = "Categories";
  }
}

// Fetch and display all categories
async function fetchCategories() {
  try {
    const response = await fetch('/jokebook/categories');
    const data = await response.json();
    const categoryList = document.getElementById('category-list');

    categoryList.innerHTML = '';
    data.categories.forEach(category => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = category.name;
      button.onclick = () => fetchJokesByCategory(category.name);
      li.appendChild(button);
      categoryList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
}

// Fetch and display jokes by category
async function fetchJokesByCategory(categoryName) {
  try {
    const response = await fetch(`/jokebook/joke/${categoryName}`);
    const data = await response.json();
    const categoryList = document.getElementById('category-list');
    const categoryTitle = document.getElementById('category-section-title');
    const backButton = document.getElementById("category-back-button");

    categoryTitle.textContent = `Jokes in ${categoryName}`;
    backButton.style.display = "inline-block"; // Show back button
    categoryList.innerHTML = ''; // Clear previous content

    data.jokes.forEach(joke => {
      const li = document.createElement('li');
      li.textContent = `${joke.setup} - ${joke.delivery}`;
      categoryList.appendChild(li);
    });
    
    document.getElementById("category-list-container").style.display = "block";
  } catch (error) {
    console.error(`Failed to fetch jokes for category '${categoryName}':`, error);
  }
}

// Search jokes by category input field
async function searchJokesByCategory() {
  const categoryInput = document.getElementById('category-search-input').value.trim();
  if (!categoryInput) return;

  try {
    // Check if category exists in the local database
    const response = await fetch(`/jokebook/search/${categoryInput}`);
    const data = await response.json();

    if (response.ok && data.message.includes("already exists")) {
      fetchJokesByCategory(categoryInput);
    } else {
      // If category doesn't exist, ask user if they want to add 
      const addExternalJokes = confirm(`Category '${categoryInput}' not found. Would you like to add the category and some jokes to it to the jokebook?`);

      if (addExternalJokes) {
        // Fetch jokes and add to relational database
        await addCategoryFromAPI(categoryInput);
        fetchJokesByCategory(categoryInput); // Display the new category and jokes
      }
    }
  } catch (error) {
    console.error(`Failed to search or add category '${categoryInput}':`, error);
  }
}

// Fetch jokes from the external API and add them to the database
async function addCategoryFromExternalAPI(category) {
  try {
    const response = await fetch(`/jokebook/search/${category}`);
    const data = await response.json();

    if (response.ok) {
      alert(`Category '${category}' and jokes were successfully added.`);
    } else {
      alert(data.message || `Failed to add category '${category}' from the external source.`);
    }
  } catch (error) {
    console.error("Failed to add category from external API:", error);
  }
}

// Add a new joke and refresh jokes for the specified category
async function addNewJoke(event) {
  event.preventDefault();

  const category = document.getElementById('joke-category').value.trim();
  const setup = document.getElementById('joke-setup').value.trim();
  const delivery = document.getElementById('joke-delivery').value.trim();

  if (!category || !setup || !delivery) {
    alert("All fields are required to add a new joke.");
    return;
  }

  // Send a POST request to add a new joke
  try {
    const response = await fetch('/jokebook/joke/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, setup, delivery })
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Failed to add joke: ${errorData.error}`);
      return;
    }

    // Refresh the jokes list for the specified category
    await fetchJokesByCategory(category);
    document.getElementById('add-joke-form').reset();
  } catch (error) {
    console.error("Failed to add new joke:", error);
  }
}

fetchRandomJoke();
fetchCategories();