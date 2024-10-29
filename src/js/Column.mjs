import { animateContainer, convertTo24Hour, setLocalStorage, getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";


//get the selected date from calendar, pass in parameter, so it can be used elsewhere
export default class Column {
    constructor(data, date) {
        this.selectedDate = date;
        this.dataSource = data;
        this.timeDataSource = [];
    }

    getUniqueTimes() {
        // console.log('getUniqueTimes, date: ', this.selectedDate);
        return this.dataSource
          .reduce((timesArray, item) => {
            if (!timesArray.includes(item.Time) && item.Time !== '') {
              timesArray.push(item.Time); // Add only if the time is not already in the timesArray
            }
            this.timeDataSource = timesArray;
            return timesArray;
          }, [])
          //assures times are in a chronological order AM to PM, converts to 24 hrs, then back
          .sort((a, b) => convertTo24Hour(a).localeCompare(convertTo24Hour(b))); 
    }

    //not working yet as intended
    initialColumnOneTemplate() {
        const calendarColumnDOM = document.getElementById("calendar-column");
        const dayColumnDOM = document.createElement("div");
        dayColumnDOM.classList.add("container");
        dayColumnDOM.classList.add("column");
        // dayColumnDOM.classList.add("test");
        dayColumnDOM.id = "column-day";
        calendarColumnDOM.insertAdjacentElement("afterend", dayColumnDOM);
    }

    //not working yet as intended
    initialColumnTwoTemplate() {
        const dayColumnDOM = document.getElementById("column-day");
        const oneTimeColumnDOM = document.createElement("div");
        dayColumnDOM.classList.add("container");
        dayColumnDOM.classList.add("column");        
        dayColumnDOM.id = "time-of-day";
        calendarColumnDOM.insertAdjacentElement("afterend", dayColumnDOM);
    }

    singleClientListTemplate(data) {
        return `
        <ul class="matter-list">
            ${data.map((item, index) => `
                <li class="button matter-item" data-matter="${item['Case Number']}" id="matter-${index}">
                    ${item['Linked Matter']}
                </li>
            `).join('')}
        </ul>`;
    }

    dateButtonTemplate() {
        return `<div class="title-button selectedDay">${this.selectedDate}</div>`;
    }

    timeListTemplate() {
        const timesList = this.getUniqueTimes();           
        return `
        <ul class="time-group">
        ${timesList.map(time=>`<li class="button time" data-time="${time}">${time}</li>`).join('')}
        </ul>`;
    }

    oneTimeTemplate(time) {
        return `<div class="title-button time">${time}</div>`;
    }
        
    clientListByTimeTemplate(data) {
        // console.log('clientListByTimeTemplate - data: ', data);
        const uniqueClients = Array.from(new Set(data.map(client => client['Linked Name'])));
        // console.log('uniqueClients: ', uniqueClients);
        return `
        <ul class="client-list">                
            ${uniqueClients.map((client, index) => `<li class="button client-name" data-client="${client}" id="client-${index}" >${client}</li>`).join('')}
        </ul>`;
    }

    // this function lists multiple clients with different matters
    multClientListByTimeTemplate(data) {        
        // console.log('data in muliClientListByTime: ', data);
        return `
        <ul class="client-list">                
             ${data.map((client, index)=> 
                `<li class="button client-name" data-matter="${client['Case Number']}" id="matter-${index}">${client['Linked Matter']}</li>`).join('')}

        </ul>`;
    }

    renderColumnOne() {        
    //this code currrently creates multiple columns if muliple dates are clicked.
    //TODO: fix
        // this.initialColumnOneTemplate();
        // const calendarColumnDOM = document.getElementById("calendar-column");
        // const dayColumnDOM = document.createElement("div");
        // dayColumnDOM.classList.add("container");
        // dayColumnDOM.classList.add("column");
        // dayColumnDOM.classList.add("test");
        // dayColumnDOM.id = "column-day";
        // console.log('dayColumnDOM', dayColumnDOM);
        // calendarColumnDOM.insertAdjacentElement("afterend", dayColumnDOM);
        const dateButtonHTML = this.dateButtonTemplate();
        const timeListHTML = this.timeListTemplate();
        const columnOneDOM = document.getElementById('column-day');
        
        columnOneDOM.innerHTML = dateButtonHTML + timeListHTML;
        this.attachTimeListeners();
            // Add the animation class
            columnOneDOM.classList.add('column-animate');
    
            // Remove the animation class after animation completes
            setTimeout(() => columnOneDOM.classList.remove('column-animate'), 800);
        
        // console.log('inside renderColumnOne: ', this.selectedDate, this.dataSource, this.timeDataSource);
    }

    attachTimeListeners() {
        // console.log('begin attachTimeListeners');
        const timeButtonsDOM = document.querySelectorAll('.button.time');
        timeButtonsDOM.forEach(button => {
            button.addEventListener('click', ()=> {
                const time = button.dataset.time;                
                // console.log('attachTimeListeners time: ', time);
                this.handleTimeClick(time);
                // this.renderColumnTwo(time);
            });
        });
    }

    handleTimeClick(time) {        
        const dataByTime = new ExternalServices();        
        //request filtered date from the api
        dataByTime.getDataByTime(this.selectedDate, time)
            .then(newArray => {
                // console.log('dataByTime in handleTimeClick: ', newArray);     //returns the array of json data  
                // return dataByTime; 
                this.renderColumnTwo(newArray, time);
            })
            .catch(error => {
                console.error('Error fetching data by time:', error);
            });
    }
     
    renderColumnTwo(data, time) {
        // this.initialColumnTwoTemplate();  //fix for later.
        const dateButtonHTML = this.dateButtonTemplate();
        const timeButtonHTML = this.oneTimeTemplate(time);
        // const clientListHTML = this.clientListByTimeTemplate(data);

        // console.log('inside renderColumnTwo: data:', data);
        // Choose template based on local storage preference
        const viewPreference = getLocalStorage('client-toggle') || 'by-client';
        const clientListHTML = viewPreference === 'by-client' 
        ? this.clientListByTimeTemplate(data) 
        : this.multClientListByTimeTemplate(data);

        const columnTwoDOM = document.getElementById('time-of-day');
        
        columnTwoDOM.innerHTML = dateButtonHTML + timeButtonHTML + clientListHTML + this.renderColumnFooter();
    
        animateContainer('time-of-day');
        this.attachToggleListener(data, time);

        //Attach event listeners to client or matter buttons    
        const clientButtons = columnTwoDOM.querySelectorAll('.button.client-name');
            clientButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const client = event.target.dataset.client || event.target.dataset.matter;
                // console.log("clientButtons in ColumnTwoDOM: ", client);
                this.handleClientMatterClick(client, data);
                
            });
        });
    }    

    renderColumnThree(client, filteredData) {
      //check for existing column, remove if present so there's only one column three
        let columnThreeDOM = document.getElementById('client-details');
      if (columnThreeDOM) {
        columnThreeDOM.remove() 
      }  

      columnThreeDOM = document.createElement('div');
      columnThreeDOM.id = 'client-details';
      columnThreeDOM.className = 'container column';

      //client is either client name or case number
      //TODO: add abililty to show client name also in header if client=case number
      const clientHeader = `<div class="title-button selectedClient"> ${client}</div>`;
      const matterlistHTML = this.singleClientListTemplate(filteredData);
      //create column Three
      columnThreeDOM.innerHTML = clientHeader + matterlistHTML;

      //insert into DOM
      const columnTwoDOM = document.getElementById('time-of-day');
      if (columnTwoDOM) {
        columnTwoDOM.insertAdjacentElement("afterend", columnThreeDOM);
      }

      //add event listeners to each matter butto to expand for further details
      const matterButtons = columnThreeDOM.querySelectorAll('.matter-item');
      matterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            //set variable to the value of the target at data-matter
            const matterId = event.target.dataset.matter;
            //where data.matter matches: the clicked button equals the filteredData item
            const singleMatter = filteredData.find(item=>item['Case Number'] === matterId)
            if (singleMatter) {
                //if the clicked event matches, then display HTML template with filtered data
                this.renderMatterDetailsTemplate(singleMatter, event.target);
            } else {
                console.warn(`No data found for Case Number: ${matterId}`);
            }
            
            // const matterDetailsHTML = this.renderMatterDetailsTemplate(matter);
            // this.event.target.innerHTML = matterDetailsHTML;
        });
      });
    }

    renderColumnFooter() {
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

    renderMatterDetailsTemplate(matter, targetElement) {
        //placeholder to place a form based on JSON data
        //TODO: finish form
        // console.log('matter: ', matter);
        
        const formHTML = 
        `<div class="matter-details"
            <label>Client: </label><input type="text" name="clientName" value="${matter['Linked Name']}" disabled><br>
            <label>Case Number: </label><input type="text" name="caseNumber" value="${matter['Case Number']}" disabled><br>
            <label>What: </label> <input type="text" name="what" value="${matter.What}"><br>
            <label>Who: </label> <input type="text" name="who" value="${matter.Who}"><br>
            <label>Status: </label> <input type="text" name="status" value="${matter.Status}"><br>
            
            <label>Note: </label> <textarea rows="4" cols="50" name="status">${matter.Note}</textarea><br>
            <label>Duration: </label> <input type="text" name="duration" value="${matter.Duration}"><br>
        </div>`

        targetElement.innerHTML = formHTML;
    }

    attachToggleListener(data, time) {
        // console.log('inside attachToggleListener, data: ', data);
        const toggleButton = document.getElementById('toggle-client-view');
        toggleButton.addEventListener('click', () => {
            // Toggle between 'by-client' and 'by-matter'
            const currentPreference = getLocalStorage('client-toggle') || 'by-client';
            const newPreference = currentPreference === 'by-client' ? 'by-matter' : 'by-client';
            
            // Update local storage
            setLocalStorage('client-toggle', newPreference);
            
            // Update button label and re-render the client list
            toggleButton.innerText = newPreference === 'by-client' ? 'View by Matter' : 'View by Client';
            const columnTwoDOM = document.getElementById('time-of-day');
            columnTwoDOM.innerHTML = ''; // Clear current content
            this.renderColumnTwo(data, time); // Re-render with updated view
        });
    }

    handleClientMatterClick(client, data) {
        //Filter data to get all items to match selected
        const filteredData = data.filter(item=> 
            item['Linked Name']===client || item['Case Number'] === client
            
        );
        // console.log('handleClientMatterClick client:', client);
        this.renderColumnThree(client, filteredData);
    }
    
} //end column class

