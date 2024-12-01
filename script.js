async function loadExcelFile() {
    try {
        console.log('Chargement du fichier Excel...');

        // Charger le fichier Excel (assurez-vous qu'il est dans le même dossier)
        const response = await fetch('matricules.xlsx');
        if (!response.ok) {
            throw new Error('Fichier introuvable ou inaccessible.');
        }

        // Lire le fichier comme un tableau de bytes
        const arrayBuffer = await response.arrayBuffer();

        // Charger le fichier Excel avec XLSX
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

        console.log('Fichier Excel chargé avec succès.');

        // Obtenir la première feuille
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir la feuille en JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log('Données extraites :', jsonData);

        // Afficher les données dans la table
        displayData(jsonData);
    } catch (error) {
        console.error('Erreur :', error);
        alert('Une erreur est survenue lors du chargement du fichier Excel. Consultez la console pour plus d\'informations.');
    }
}

function displayData(data) {
    if (!data || data.length === 0) {
        alert('Aucune donnée trouvée dans le fichier Excel.');
        return;
    }

    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    // Effacer le contenu existant
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Ajouter les en-têtes à partir de la première ligne
    const headers = data[0];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Ajouter les lignes restantes dans le tableau
    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || ''; // Mettre une valeur vide si la cellule est nulle
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// Appeler la fonction pour charger le fichier Excel
loadExcelFile();
