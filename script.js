document.addEventListener('DOMContentLoaded', function() {
    const ovalContainer = document.getElementById('oval-container');
    const picturePopup = document.getElementById('picture-popup');

    // Function to create and position dates
    function createDates(numDates) {
        for (let i = 0; i < numDates; i++) {
            const date = document.createElement('div');
            date.className = 'date';
            date.textContent = 'Date ' + (i + 1);
            
            // Random positioning using Perlin noise
            const angle = (i / numDates) * 2 * Math.PI;
            const radius = 40 + 30 * noise.perlin2(Math.cos(angle), Math.sin(angle));
            const x = ovalContainer.offsetWidth / 2 + radius * Math.cos(angle);
            const y = ovalContainer.offsetHeight / 2 + radius * Math.sin(angle);

            date.style.left = x + 'px';
            date.style.top = y + 'px';

            // Hover effect to show picture popup
            date.addEventListener('mouseenter', function(event) {
                const picture = document.createElement('img');
                picture.src = 'path/to/your/picture.jpg';
                picture.style.position = 'absolute';
                picture.style.width = '100px'; // Adjust dimensions as needed
                picture.style.height = 'auto';
                picture.style.left = event.clientX + 'px';
                picture.style.top = event.clientY + 'px';
                
                picturePopup.innerHTML = ''; // Clear previous picture
                picturePopup.appendChild(picture);
            });

            ovalContainer.appendChild(date);
        }
    }

    // Adjust number of dates and call the function
    const numberOfDates = 10; // Adjust as needed
    createDates(numberOfDates);
});
