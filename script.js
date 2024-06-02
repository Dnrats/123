document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://rickandmortyapi.com/api/character';
    const characterList = document.getElementById('characterList');
    const characterDetail = document.getElementById('characterDetail');
    const searchBar = document.getElementById('searchBar');
    const filterButtons = document.querySelectorAll('.filter-button');
    const firstPageButton = document.getElementById('firstPage');
    const lastPageButton = document.getElementById('lastPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');
    let characters = [];
    let currentPage = 1;
    let totalPages = 1;
    let currentFilter = 'all';
    let searchQuery = '';

    async function fetchCharacters(page = 1) {
        try {
            const response = await fetch(`${apiURL}?page=${page}`);
            const data = await response.json();
            characters = data.results;
            totalPages = data.info.pages;
            displayCharacters(characters);
            updatePagination();
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    }