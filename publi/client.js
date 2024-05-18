document.addEventListener('DOMContentLoaded', () => {
    refreshFileList();
});

function addRow(name) {
    const table = document.getElementById('table_list_MD');
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);

    const fileName = name.slice(0, -3);
    cell1.textContent = fileName;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('d');
    deleteButton.textContent = 'Borrar';
    deleteButton.onclick = function() {
        deleteFile(name);
    };
    cell2.appendChild(deleteButton);

    const viewButton = document.createElement('button');
    viewButton.classList.add('v');
    viewButton.textContent = 'Visualizar';
    viewButton.onclick = function() {
        viewFile(name);
    };
    cell2.appendChild(viewButton);
}

function deleteFile(name) {
    fetch('http://localhost:3000/deleteFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: name })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Refrescar la lista de archivos después de borrar
        refreshFileList();
    })
    .catch(error => {
        console.error('Error al borrar el archivo:', error);
    });
}

function viewFile(name) {
    fetch('http://localhost:3000/viewFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: name })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('htmlCode').innerHTML = data.text;
        //console.log('enviado a fetch:', data.text);
    })
    .catch(error => {
        console.error('Error al visualizar el archivo:', error);
    });
}

// Obtener y mostrar la lista de archivos
function refreshFileList() {
    fetch('http://localhost:3000/files')
        .then(response => response.json())
        .then(data => {
            // Limpiar las filas existentes, excluyendo el encabezado
            const table = document.getElementById('table_list_MD');
            const rowCount = table.rows.length;
            for (let i = rowCount - 1; i > 0; i--) {
                table.deleteRow(i);
            }
            // Agregar una fila para cada archivo en la lista
            data.files.forEach(file => {
                addRow(file);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de archivos:', error);
        });
}

// Evento click del botón "Guardar"
document.getElementById('saveButton').addEventListener('click', function() {
    var title = document.getElementById('title').value.trim();
    var markupText = document.getElementById('markupText').value.trim();

    if (title === "") {
        alert("Por favor, ingresa un título para el archivo.");
        return;
    }

    fetch('http://localhost:3000/saveFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, markdownText: markupText })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Obtener la lista actualizada de archivos
        refreshFileList();
        // Limpiar los campos después de guardar el archivo
        document.getElementById('title').value = "";
        document.getElementById('markupText').value = "";
    })
    .catch(error => {
        console.error('Error al guardar el archivo:', error);
    });
});