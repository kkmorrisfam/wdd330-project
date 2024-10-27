import { animateContainer, convertTo24Hour, getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

//get the selected date from calendar, pass in parameter, so it can be used elsewhere
export default class Column {
    constructor(data, date) {
        this.selectedDate = date;
        this.dataSource = data;
        this.timeDataSource = [];
    }

    getUniqueTimes() {
        return this.dataSource
          .reduce((timesArray, item) => {
            if (!timesArray.includes(item.Time) && item.Time !== '') {
              timesArray.push(item.Time); // Add only if the time is not already in the timesArray
            }
            this.timeDataSource = timesArray;
            return timesArray;
          }, [])
          .sort((a, b) => convertTo24Hour(a).localeCompare(convertTo24Hour(b))); // Sort by 24-hour format
      }

    dateButtonTemplate() {
        return `<div class="button selectedDay">${this.selectedDate}</div>`;
    }

    timeListTemplate() {
        const timesList = this.getUniqueTimes();   
        
        return `
        <ul class="time-group">
        ${timesList.map(time=>`<li class="button time" data-time="${time}">${time}</li>`).join('')}
        </ul>`;
    }

    oneTimeTemplate(time) {
        return `<div class="button time">${time}</div>`;
    }
        
    //this function shows a client only once, even if they have multiple matters
    clientListByTimeTemplate(data) {
        console.log('clientListByTimeTemplate - data: ', data);
        // const uniqueClients = Array.from(new Set(data.map(client => client['Linked Name'])));
        const uniqueClients = Array.from(
            new Set(data
                .filter(client => client['Linked Name']) // Filter out if there's no Linked Name
                .map(client => client['Linked Name'])) // Map to Linked Name
        );
        
        console.log('uniqueClients: ', uniqueClients);
        return `
        <ul class="client-list">                
            ${uniqueClients.map(client => `<li class="button client-name">${client}</li>`).join('')}
        </ul>`;
    }

    //this function lists multiple clients with different matters
    multClientListByTimeTemplate(data) {
        console.log('clientListByTimeTemplate - data: ', data);
        //const uniqueClients = Array.from(new Set(data.map(client => client['Linked Name'])));
        // console.log('uniqueClients: ', uniqueClients);
        return `
        <ul class="client-list">                
            ${data.map(client => `<li class="button client-name">${client['Linked Matter']}</li>`).join('')}
        </ul>`;
    }

    renderColumnOne() {        
        const dateButtonHTML = this.dateButtonTemplate();
        const timeListHTML = this.timeListTemplate();
        
        const columnOneDOM = document.getElementById('column-day');
        
        columnOneDOM.innerHTML = dateButtonHTML + timeListHTML;
        this.attachTimeListeners();
            // Add the animation class
            columnOneDOM.classList.add('column-animate');
    
            // Remove the animation class after animation completes
            setTimeout(() => columnOneDOM.classList.remove('column-animate'), 800);
        // animateContainer('toggle-footer'); //not working here????
        console.log('inside renderColumnOne: ', this.selectedDate, this.dataSource, this.timeDataSource);
        

    }

   
    attachTimeListeners() {
        console.log('begin attachTimeListeners');
        const timeButtonsDOM = document.querySelectorAll('.button.time');
        timeButtonsDOM.forEach(button => {
            button.addEventListener('click', ()=> {
                const time = button.dataset.time;                
                console.log('attachTimeListeners time: ', time);
                this.handleTimeClick(time);
                // this.renderColumnTwo(time);
            });
        });
    }

    handleTimeClick(time) {
        console.log('inside handleTimeClick');

        // Validate that selectedDate and time are defined
        if (!this.selectedDate) {
            console.error('Error: selectedDate is undefined.');
            return;
        }
        
        if (!time) {
            console.error('Error: time is undefined or null.');
            return;
        }
        const dataByTime = new ExternalServices();
        console.log('selectedDate before getDataByTime called: ', this.selectedDate);
        console.log('handletimeClick time: ', time);
        dataByTime.getDataByTime(this.selectedDate, time)        
            .then(newArray => {
                // Check if newArray is an array and has data
                if (!Array.isArray(newArray) || newArray.length === 0) {
                    console.warn('Warning: No data found for the selected date and time.');
                    return;
                }
                console.log('dataByTime in handleTimeClick: ', newArray);     //returns the array of json data  
                // return dataByTime; 
                this.renderColumnTwo(newArray, time);
            })
            .catch(error => {
                console.error('Error fetching data by time:', error);
            });
    }
     
    renderColumnTwo(data, time) {
        try {
            // Check valid data and time values
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.warn('Warning: No data provided or data is not an array');
                return;
            }
            
            if (!time) {
                console.warn('Warning: Time is undefined or null');
                return;
            }
    
            // Check 'toggle-footer' exists as a sibling to 'column-day'
            let toggleFooterDOM = document.getElementById('toggle-footer');
            if (!toggleFooterDOM) {
                console.warn('Element "toggle-footer" not found. Creating a new container.');
    
                toggleFooterDOM = document.createElement('div');
                toggleFooterDOM.id = 'toggle-footer';
                toggleFooterDOM.className = 'container';
    
                // Insert 'toggle-footer' next to 'column-day' if it exists
                const columnDayDOM = document.getElementById('column-day');
                if (columnDayDOM) {
                    columnDayDOM.insertAdjacentElement('afterend', toggleFooterDOM);
                } else {
                    console.warn('Element "column-day" not found in the DOM.');
                    document.body.appendChild(toggleFooterDOM); // Fallback to body if placement fails
                }
            }
    
            // Clear out any existing content in 'toggle-footer' before rendering
            toggleFooterDOM.innerHTML = ''; 
    
            // Create 'time-of-day' div inside 'toggle-footer' for column content
            const columnTwoDOM = document.createElement('div');
            columnTwoDOM.id = 'time-of-day';
            columnTwoDOM.className = 'column';
    
            const dateButtonHTML = this.dateButtonTemplate();        
            const timeButtonHTML = this.oneTimeTemplate(time);
    
            const columnTwoPreference = getLocalStorage('client-toggle') || 'by-client';
            const clientListHTML = columnTwoPreference === 'by-client'
                ? this.clientListByTimeTemplate(data)
                : this.multClientListByTimeTemplate(data);
    
            // Validate generated client list HTML
            if (!clientListHTML) {
                throw new Error('Failed to generate client list HTML');
            }
    
            // Populate 'time-of-day' with date, time, and client list
            columnTwoDOM.innerHTML = dateButtonHTML + timeButtonHTML + clientListHTML;
            
            // Append 'time-of-day' column content to 'toggle-footer'
            toggleFooterDOM.appendChild(columnTwoDOM);
    
            // Create and append 'column-footer' as a sibling inside 'toggle-footer'
            const footerDOM = document.createElement('div');
            footerDOM.className = 'column-footer';
            footerDOM.innerHTML = this.renderFooter();
            toggleFooterDOM.appendChild(footerDOM);
    
            animateContainer('time-of-day'); // Animate content load in 'time-of-day'
            this.attachToggleListener(data, time); // Attach toggle listener
        } 
        catch (error) {
            console.error('Error in rendering Column Two:', error);    
        }
    }
    

    renderFooter() {
        try{
            const viewPreference = getLocalStorage('client-toggle') || 'by-client';
            return `
            <footer class="column-footer">
                <button id="toggle-client-view" class="toggle-button">
                    ${viewPreference === 'by-client' ? 'View by Matter' : 'View by Client'}
                </button>
            </footer>`;        
        } 
        catch (error) {
            console.error('Error rendering footer in Column Two', error);
        }
    }


    attachToggleListener(data, time) {
        const toggleButton = document.getElementById('toggle-client-view');
        toggleButton.addEventListener('click', () => {
            // Toggle between 'by-client' and 'by-matter'
            const currentPreference = getLocalStorage('client-toggle') || 'by-client';
            const newPreference = currentPreference === 'by-client' ? 'by-matter' : 'by-client';
            
            // Update local storage
            setLocalStorage('client-toggle', newPreference);
            
            // Update button label and re-render the client list
            toggleButton.innerText = newPreference === 'by-client' ? 'View by Matter' : 'View by Client';
            const columnTwoDOM = document.getElementById('toggle-footer');
            columnTwoDOM.innerHTML = ''; // Clear current content
            this.renderColumnTwo(data, time); // Re-render with updated view
        });
    }    
    
} //end column class


