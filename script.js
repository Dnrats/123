document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const apiURL = 'https://rickandmortyapi.com/api/character';
    const characterList = document.getElementById('characterList');
    const searchBar = document.getElementById('searchBar');
    const filterButtons = document.querySelectorAll('.filter-button');
    const firstPageButton = document.getElementById('firstPage');
    const lastPageButton = document.getElementById('lastPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const characterDetailsSection = document.getElementById('characterDetails');
    const mainSection = document.getElementById('mainSection');

    // Data variables
    let allCharacters = [];
    let filteredCharacters = [];
    let currentPage = 1;
    let charactersPerPage;
    let totalPages = 1;
    let currentFilter = 'all';
    let searchQuery = '';

// Adjust charactersPerPage based on screen size
if (window.matchMedia("(max-width: 768px)").matches) {
    charactersPerPage = 4; // For mobile devices
} else {
    charactersPerPage = 8; // For desktop
}


    // Function to fetch all characters from the API
    async function fetchAllCharacters() {
        try {
            // Fetch the initial characters
            let response = await fetch(apiURL);
            let data = await response.json();
            allCharacters = data.results;

            // Fetch additional characters if available
            while (data.info.next) {
                response = await fetch(data.info.next);
                data = await response.json();
                allCharacters = allCharacters.concat(data.results);
            }

            // Initialize filtered characters and display
            filteredCharacters = allCharacters;
            totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
            displayCharacters();
            displayPageNumbers();
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    }

    // Function to display characters in the list
    function displayCharacters() {
        characterList.innerHTML = '';
        const start = (currentPage - 1) * charactersPerPage;
        const end = start + charactersPerPage;
        const charactersToDisplay = filteredCharacters.slice(start, end);

        charactersToDisplay.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'character-card';
            characterCard.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <div class="character-info">
                    <h3>${character.name}</h3>
                    <p>Status: ${character.status}</p>
                </div>
            `;
            characterCard.addEventListener('click', () => {
                history.pushState({ id: character.id }, character.name, `?character=${character.id}`);
                fetchCharacterDetails(character.id);
            });
            characterList.appendChild(characterCard);
        });
    }

    // Function to fetch and display character details
    async function fetchCharacterDetails(id) {
        try {
            const response = await fetch(`${apiURL}/${id}`);
            const character = await response.json();
            displayCharacterDetails(character);
        } catch (error) {
            console.error('Error fetching character details:', error);
        }
    }

    // Function to display character details in the details section
    function displayCharacterDetails(character) {
        characterDetailsSection.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}">
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
            <p><strong>Location:</strong> ${character.location.name}</p>
            <button id="backButton" class="back-button">Back to List</button>
        `;
        mainSection.style.display = 'none';
        characterDetailsSection.style.display = 'block';

        document.getElementById('backButton').addEventListener('click', () => {
            history.pushState({}, 'Rick and Morty', '/');
            characterDetailsSection.style.display = 'none';
            mainSection.style.display = 'block';
        });
    }

    // Function to display pagination buttons
    function displayPageNumbers() {
        pageNumbersContainer.innerHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.className = 'pagination-button';
            if (i === currentPage) {
                pageNumber.classList.add('active');
            }
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                displayCharacters();
                displayPageNumbers();
            });
            pageNumbersContainer.appendChild(pageNumber);
        }
    }

    // Function to handle search input
    function handleSearch() {
        searchQuery = searchBar.value.toLowerCase();
        applyFilters();
    }

    // Function to apply filters based on search and status
    function applyFilters() {
        filteredCharacters = allCharacters.filter(character => {
            const matchesSearch = character.name.toLowerCase().includes(searchQuery);
            const matchesStatus = currentFilter === 'all' || character.status.toLowerCase() === currentFilter;
            return matchesSearch && matchesStatus;
        });
        totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
        currentPage = 1;
        displayCharacters();
        displayPageNumbers();
    }

    // Event listeners
    searchBar.addEventListener('input', handleSearch);

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentFilter = e.target.getAttribute('data-status');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilters();
        });
    });

    firstPageButton.addEventListener('click', () => {
        currentPage = 1;
        displayCharacters();
        displayPageNumbers();
    });

    lastPageButton.addEventListener('click', () => {
        currentPage = totalPages;
        displayCharacters();
        displayPageNumbers();
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.id) {
            fetchCharacterDetails(event.state.id);
        } else {
            characterDetailsSection.style.display = 'none';
            mainSection.style.display = 'block';
        }
    });

    // Initial fetch of all characters
    fetchAllCharacters();
});
