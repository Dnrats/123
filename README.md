# Rick and Morty Character Viewer

This project is a single-page application (SPA) designed to display characters from the Rick and Morty TV show. It fetches character data from the official Rick and Morty API and provides several features for viewing, filtering, and searching characters.

## Features

- **Character Display**: Shows a list of characters from the Rick and Morty TV show.
- **Filters**: Ability to filter characters by their status (alive, dead, or all).
- **Search**: Search bar to find characters by name.
- **Pagination**: Displays eight characters per page.
- **Dynamic Content Loading**: All interactions (filtering, searching, pagination) happen without reloading the page.
- **Character Details**: Clicking on a character icon opens a detailed view of the character without reloading the page.

## Technologies Used

- HTML
- CSS
- JavaScript
- [Rick and Morty API](https://rickandmortyapi.com/)

## Installation

To run this project locally:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/rick-and-morty-character-viewer.git
    ```
2. Navigate to the project directory:
    ```sh
    cd rick-and-morty-character-viewer
    ```
3. Open `index.html` in your preferred web browser.

## Usage

- **Viewing Characters**: By default, the application loads and displays the first eight characters.
- **Filtering Characters**:
  - Use the filter buttons to switch between showing all characters, only alive characters, or only dead characters.
- **Searching Characters**:
  - Use the search bar to type in a character's name. The displayed characters will update to match the search query.
- **Pagination**:
  - Navigate between pages to view more characters. Each page shows eight characters.
- **Character Details**:
  - Click on a character's icon to view more details about that character. The details are displayed without reloading the page.

## API Reference

The project uses the [Rick and Morty API](https://rickandmortyapi.com/documentation) to fetch character data.

## Project Structure

```plaintext
.
├── index.html
├── style.css
├── script.js
└── README.md
