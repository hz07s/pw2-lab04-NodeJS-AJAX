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