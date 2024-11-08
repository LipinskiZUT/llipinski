let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let rasterMap = document.getElementById("rasterMap");
let rasterContext = rasterMap.getContext("2d");
let dropAreas = [];
let elements=16;
Notification.requestPermission();

function extractAndDisplayCells(cellWidth,cellHeight) {
    document.querySelectorAll('.cell-image').forEach(img => img.remove());

    let imgElements=[];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            // Tworzenie nowego płótna do przechowywania każdej komórki
            let cellCanvas = document.createElement("canvas");
            cellCanvas.width = cellWidth;
            cellCanvas.height = cellHeight;
            let cellContext = cellCanvas.getContext("2d");

            // Kopiowanie fragmentu z głównego `canvas`
            cellContext.drawImage(
                rasterMap,
                col * cellWidth, // x startowy
                row * cellHeight, // y startowy
                cellWidth, // szerokość wycinanego fragmentu
                cellHeight, // wysokość wycinanego fragmentu
                0, // x na nowym płótnie
                0, // y na nowym płótnie
                cellWidth, // szerokość na nowym płótnie
                cellHeight // wysokość na nowym płótnie
            );

            // Tworzenie elementu <img> i ustawianie jego źródła na dane z płótna
            let imgElement = document.createElement("img");
            imgElement.src = cellCanvas.toDataURL();
            imgElement.classList.add('cell-image');
            imgElement.classList.add('draggable');
            imgElement.id=4*row+col;
            imgElement.setAttribute('draggable','true');
            imgElement.style.margin = "5px";

            imgElements.push(imgElement);
        }
    }

    shuffleArray(imgElements);
    imgElements.forEach(img=>{
        document.body.appendChild(img)
    });

    document.querySelectorAll('.draggable').forEach(img => {
        img.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('text/plain', event.target.id);
        });
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Losowy indeks
        [array[i], array[j]] = [array[j], array[i]]; // Zamiana miejscami
    }
}

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        // Ustawienia rozmiaru canvas
        rasterMap.width = 800;
        rasterMap.height = 600;
        rasterContext.drawImage(canvas, 0, 0, 800, 600);


        // Definiowanie szerokości i wysokości komórki
        let cellWidth = rasterMap.width / 4;
        let cellHeight = rasterMap.height / 4;


        // Przechodzimy po wszystkich komórkach i zapisujemy ich obszary
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                let x = col * cellWidth;
                let y = row * cellHeight;
                dropAreas.push({ x: x, y: y, width: cellWidth, height: cellHeight });
            }
        }
        extractAndDisplayCells(cellWidth,cellHeight);
        rasterContext.rect(0, 0, rasterMap.width, rasterMap.height);
        rasterContext.fillStyle = 'white';
        rasterContext.fill();

        // Rysowanie linii pionowych (siatka)
        for (let i = 1; i < 4; i++) {
            let x = i * cellWidth;
            rasterContext.beginPath();
            rasterContext.moveTo(x, 0);
            rasterContext.lineTo(x, rasterMap.height);
            rasterContext.stroke();
        }

        elements=16;

        // Rysowanie linii poziomych (siatka)
        for (let j = 1; j < 4; j++) {
            let y = j * cellHeight;
            rasterContext.beginPath();
            rasterContext.moveTo(0, y);
            rasterContext.lineTo(rasterMap.width, y);
            rasterContext.stroke();
        }

    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

rasterMap.addEventListener('dragover', function (event) {
    event.preventDefault(); // Pozwala na upuszczenie
});
rasterMap.addEventListener('drop', function (event) {
    event.preventDefault();

    // Pobierz ID przeciąganego elementu
    let imgId = event.dataTransfer.getData('text/plain');
    let img = document.getElementById(imgId);

    // Oblicz współrzędne na canvasie
    let rect = rasterMap.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let droppedInArea = false;
    for (let i = 0; i < dropAreas.length; i++) {
        let area = dropAreas[i];
        if (x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height) {
            if (i!=imgId)
            {
                break;
            }
            droppedInArea = true;
            // Rysuj obraz na canvasie
            rasterContext.drawImage(img, area.x, area.y, img.width, img.height);
            document.getElementById(i).remove();
            elements-=1;
            break;
        }
    }
    if (elements==0) {
        console.log("Hurra! ułożony obrazek!")
        const notification = new Notification("Hurra!", {
            body: "Udało się ułożyć poprawnie obrazek, super.",
            tag: "example-notification", // Opcjonalne tagowanie powiadomień
        });
    }
});