// app.js
document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://rickandmortyapi.com/api/character';
    const characterList = document.getElementById('characterList');
    const searchBar = document.getElementById('searchBar');
    const filterButtons = document.querySelectorAll('.filter-button');
    let allCharacters = [];
    let currentFilter = 'all';
    let searchQuery = '';


    // FETCH CHARACTERS

    async function fetchCharacters() {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            allCharacters = data.results.slice(0, 8); // Limit to first 8 characters
            displayCharacters(allCharacters);
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    }

    // SHOW CHARACTERS

    function displayCharacters(characters) {
        characterList.innerHTML = '';
        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'character-card';
            characterCard.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h3>${character.name}</h3>
            `;
            characterList.appendChild(characterCard);
        });
    }

    // FILTER DEAD OR ALIVE

    function filterCharacters() {
        const filteredCharacters = allCharacters.filter(character => {
            const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = currentFilter === 'all' || character.status.toLowerCase() === currentFilter;
            return matchesSearch && matchesStatus;
        });
        displayCharacters(filteredCharacters);
    }

    // SEARCH BAR

    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterCharacters();
    });

    filterButtons.forEach(button => button.addEventListener('click', (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.status;
        filterCharacters();
    }));

    fetchCharacters();
});
