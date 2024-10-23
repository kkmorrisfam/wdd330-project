import { isSameDate } from "./utils.mjs";


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

//get the selected date from calendar, pass in parameter, so it can be done elsewhere
//compare selected date with api date, create array with matching values
//create new array with filtered value of time slot, for each time an event occurs
//dynamically create html for column with selected date and time slots into lists