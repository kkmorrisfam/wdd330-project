import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export function darkMode() {
        const darkModeToggle = document.querySelector('#dark-toggle');

    //check for saved preferences, or use light 
    const currentTheme = getLocalStorage('theme') || 'light';
    if (currentTheme==='dark') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', ()=> {
        document.body.classList.toggle('dark-mode');

        //save preferences in local storage
        const theme = document.body.classList.contains('dark-mode')?'dark':'light';
        setLocalStorage('theme', theme);
    });
}