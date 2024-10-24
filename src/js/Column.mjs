// import { isSameDate } from "./utils.mjs";

//probably won't use this, but leave it for structure
function renderColumnTemplate() {
    return `<div class="container column day">
            <!-- <div class="day"></div> -->
                <div class="button selectedDay">selected date goes here</div>
                <ul class="time-group">
                    <li class="button">filtered time slot</li>
                    <li class="button">filtered time slot</li>
                    <li class="button">filtered time slot</li>
                </ul>
                </div>
            </div>
        </div>`
}

//get the selected date from calendar, pass in parameter, so it can be used elsewhere
export default class Column {
    constructor(data, date) {
        this.selectedDate = date;
        this.dataSource = data;
    }

    getUniqueTimes() {
        return this.dataSource.reduce((timesArray, item) => {
          if (!timesArray.includes(item.Time)) {
            timesArray.push(item.Time); // Add only if the time is not already in the timesArray
          }
          return timesArray;
        }, []); // Start with an empty array
      }

    dateButtonTemplate() {
        return `<div class="button selectedDay">${this.selectedDate}</div>`;
    }

    timeListTemplate() {
        const timesList = this.getUniqueTimes();
        return `
        <ul class="time-group">
        ${timesList.map(time=>`<li class="button">${time}</li>`).join('')}
        </ul>`;
    }
    
    renderColumnOne() {
        console.log('renderColumnOne, dataSource: ', this.dataSource);
        console.log('renderColumnOne, selectedDate: ', this.selectedDate);
        const dateButtonHTML = this.dateButtonTemplate();
        const timeListHTML = this.timeListTemplate();
        const columnOneDOM = document.getElementById('column-day');
        columnOneDOM.innerHTML = dateButtonHTML + timeListHTML;

    }
}
//compare selected date with api date, create array with matching values
//create new array with filtered value of time slot, for each time an event occurs
//dynamically create html for column with selected date and time slots into lists