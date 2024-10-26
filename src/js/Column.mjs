import { animateContainer, convertTo24Hour } from "./utils.mjs";
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
        const uniqueClients = Array.from(new Set(data.map(client => client['Linked Name'])));
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
        const dataByTime = new ExternalServices();
        console.log('selectedDate before getDataByTime called: ', this.selectedDate);
        console.log('handletimeClick time: ', time);
        dataByTime.getDataByTime(this.selectedDate, time)
            .then(newArray => {
                console.log('dataByTime in handleTimeClick: ', newArray);     //returns the array of json data  
                // return dataByTime; 
                this.renderColumnTwo(newArray, time);
            })
            .catch(error => {
                console.error('Error fetching data by time:', error);
            });
    }
     
    renderColumnTwo(data, time) {
        const dateButtonHTML = this.dateButtonTemplate();
        // const clientListHTML = this.clientListByTimeTemplate(data);
        const clientListHTML = this.multClientListByTimeTemplate(data);
        const timeButtonHTML = this.oneTimeTemplate(time);

        const columnTwoDOM = document.getElementById('time-of-day');
        columnTwoDOM.innerHTML = dateButtonHTML + timeButtonHTML + clientListHTML;
    
        animateContainer('time-of-day');
    }

    
    
} //end column class


