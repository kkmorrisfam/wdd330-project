import Calendar from "./Calendar.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, setLocalStorage, clearContainer } from "./utils.mjs";
import Column from "./Column.mjs";
import { addHeaderFooter } from "./headerFooter.mjs";
import { darkMode } from "./darkMode.mjs";

// const binId = process.env.PARCEL_BIN_ID;
// const apiKey = process.env.PARCEL_API_MASTER_KEY;
// const baseURL=process.env.PARCEL_URL;

//load calendar on screen load
document.addEventListener('DOMContentLoaded', ()=> {
    const calendar = new Calendar();
    addHeaderFooter();
    darkMode();
    
    //get local storage if there is anything there.
    const storedDataByDay = getLocalStorage('filtered-by-day') || null;
    
    // console.log('storedDataByDate: ', storedDataByDay);
    // if (storedDataByDay === undefined || storedDataByDay === null) storedDataByDay = [];
    
    //if there's a date in local storage, then load the first column with that date
    if (storedDataByDay && storedDataByDay.length > 0){
        const selectedDate = storedDataByDay[0]?.When || calendar.getSelectedDate();
        // console.log('Loaded data from Local Storage:', storedDataByDay);
        const column = new Column(storedDataByDay, selectedDate);
        column.renderColumnOne();
        }
        
    
    document.querySelector('.days').addEventListener('click', () => {
        const selectedDate = calendar.getSelectedDate();  // Get the selected date
        //clear client list column: TODO, refactor to add eventListener for column two in this file?
        clearContainer('time-of-day');
        if (selectedDate) {
            // console.log('Selected date in intial click event:', selectedDate);  // Log it when a date is clicked
            //get new updated data with click.  Is here where I want this?           
            const myfilteredData = new ExternalServices();            
            myfilteredData.getFilteredDataByDay(selectedDate)            
            .then(filteredData=> {
                // console.log('Filtered Data in index: ', filteredData);
                setLocalStorage('filtered-by-day', filteredData);
                const columnOne = new Column(filteredData, selectedDate);
                // console.log('selectedDate after creating columnOne: ', selectedDate);
                columnOne.renderColumnOne();
            });
        }
    });
});  //end of eventListener on initial load

