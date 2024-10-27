renderColumnTwo(data, time) {
    try {
        // Ensure valid data and time values
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn('Warning: No data provided or data is not an array');
            return;
        }
        
        if (!time) {
            console.warn('Warning: Time is undefined or null');
            return;
        }

        // Ensure 'toggle-footer' exists as a sibling to 'column-day'
        // let toggleFooterDOM = document.getElementById('toggle-footer');        
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