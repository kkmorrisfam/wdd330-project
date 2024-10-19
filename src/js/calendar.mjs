export default class Calendar {
    constructor() {
        this.displayDOM = document.querySelector(".display");
        this.previousDOM = document.querySelector(".left");
        this.nextDOM = document.querySelector(".right");
        this.days = document.querySelector(".days");
        this.selected = document.querySelector(".selected");
        this.date = new Date();
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();

        this.init();
    }
  
    init() {
        this.displayCalendar();
        this.displaySelected();
        this.handlePrevious();
        this.handleNext();
    }
  
    displayCalendar() {
        const firstDay = new Date(this.year, this.month, 1);
        const firstDayIndex = firstDay.getDay();
        const lastDay = new Date(this.year, this.month + 1, 0);
        const numberOfDays = lastDay.getDate();
    
        let stringDate = this.date.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        });
    
        this.displayDOM.innerHTML = `${stringDate}`;
        this.days.innerHTML = ""; // Clear previous days
    
        // Display empty divs for the days of the previous month
        for (let x = 1; x <= firstDayIndex; x++) {
            let div = document.createElement("div");
            div.innerHTML = "";
            this.days.appendChild(div);
        }
  
        // Display the actual days of the current month
        for (let i = 1; i <= numberOfDays; i++) {
            let div = document.createElement("div");
            let currentDate = new Date(this.year, this.month, i);
            div.dataset.date = currentDate.toDateString();
            div.innerHTML = i;
            this.days.appendChild(div);
  
            if (
            currentDate.getFullYear() === new Date().getFullYear() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getDate() === new Date().getDate()
            ) {
            div.classList.add("current-date");
            }
        }
    }
  
    displaySelected() {
        const dayElementsDOM = document.querySelectorAll(".days div");
        let previouslySelected = null;  //to keep track of the previously selected element        

        dayElementsDOM.forEach((day) => {
            // console.log("day: " + day);
            day.addEventListener("click", (event) => {
                const selectedDate = event.target.dataset.date;                
                //remove the outline from the previously selected date, if there is one
                if (previouslySelected) {
                    previouslySelected.classList.remove("selected-outline");
                }
                //add the outline to the currently selected date
                event.target.classList.add("selected-outline");
                //update the selected date display                
                // console.log("selectedDate: "+selectedDate);
                this.selected.innerHTML = `Selected Date: ${selectedDate}`;
                //udpate the previously selected element
                previouslySelected = event.target;
            });
        });
    }
  
    handlePrevious() {
        this.previousDOM.addEventListener("click", () => {
            this.days.innerHTML = "";
            this.selected.innerHTML = "";
            this.month--;
    
            if (this.month < 0) {
            this.month = 11;
            this.year--;
            }
    
            this.date.setMonth(this.month);
            this.displayCalendar();
            this.displaySelected();
        });
    }
  
    handleNext() {
        this.nextDOM.addEventListener("click", () => {
            this.days.innerHTML = "";
            this.selected.innerHTML = "";
            this.month++;
    
            if (this.month > 11) {
            this.month = 0;
            this.year++;
            }
    
            this.date.setMonth(this.month);
            this.displayCalendar();
            this.displaySelected();
        });
    }
  }
  