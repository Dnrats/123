document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://rickandmortyapi.com/api/character';
    const characterList = document.getElementById('characterList');
    const searchBar = document.getElementById('searchBar');
    const filterButtons = document.querySelectorAll('.filter-button');
    const firstPageButton = document.getElementById('firstPage');
    const lastPageButton = document.getElementById('lastPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');
    
    let allCharacters = [];
    let filteredCharacters = [];
    let currentPage = 1;
    const charactersPerPage = 8;
    let totalPages = 1;
    let currentFilter = 'all';
    let searchQuery = '';

    // FETCH CHARACTERS

    async function fetchAllCharacters() {
        try {
            let response = await fetch(apiURL);
            let data = await response.json();
            allCharacters = data.results;
            while (data.info.next) {
                response = await fetch(data.info.next);
                data = await response.json();
                allCharacters = allCharacters.concat(data.results);
            }
            filteredCharacters = allCharacters;
            totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
            displayCharacters();
            displayPageNumbers();
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    }

    // SHOW CHARACTERS

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
            characterList.appendChild(characterCard);
        });
    }

    // PAGE NUMBERS AT THE BOTTOM

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

    // SEARCH

    function handleSearch() {
        searchQuery = searchBar.value.toLowerCase();
        applyFilters();
    }

    
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
    searchBar.addEventListener('input', handleSearch);

    // FILTERS

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentFilter = e.target.getAttribute('data-status');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            applyFilters();
        });
    });

    // FIRST & LAST PAGES

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

    fetchAllCharacters();
});
