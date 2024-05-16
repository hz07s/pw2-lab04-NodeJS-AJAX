document.addEventListener('DOMContentLoaded', () => {
    refreshFileList();
});

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