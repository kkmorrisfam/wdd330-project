export function addHeaderFooter() {
    const headerHTML = `
    <header>
        <h1 class="title">Abacus Law Calendar App</h1>
        <button class="toggle-button" id="dark-toggle" aria-label="dark light toggle button">Dark/Light Mode</button>
    </header>`;

    const footerHTML = `
    <footer>
        <p>&copy; 2024, 2026 | Kerri Morris | Abacus Law Calendar App</p>
    </footer>`;

    // Insert the header at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Insert the footer at the end of the body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}
    