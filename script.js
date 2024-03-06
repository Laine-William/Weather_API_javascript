/**
 * Fonction asynchrone fetchData qui permet de récupérer les données météo de l'API OpenMeteo
 */
async function fetchData () {

    // Gère la récupération des données à partir de l'API
    try {

        // Récupère les données depuis l'API
        const response = await fetch('http://127.0.0.1:3000', {
        
            method: 'GET',
            
            headers: {
            
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        })

        // Vérifie si la réponse est "OK"(code 200)
        const responseData = await response.json ();

        // Vérifie si les données sont un objet JSON valide et non nul
        if (typeof responseData === 'object' && responseData !== null) {

            //console.log (responseData);

            // Récupère l'élément table-body
            const tableBody = document.querySelector ('#table-body');

            let index = 0;

            // Parcours les données récupérées pour les afficher dans le tableau
            for (const rowData of Object.values (responseData)) {
            
                // Crée une nouvelle ligne
                const row = document.createElement ('tr');
            
                // Ajoute les données dans la ligne du tableau
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${rowData.hour}</td>
                    <td>${rowData.time}</td>
                    <td>${rowData.wind_speed_10m}</td>
                    <td>${rowData.wind_direction_10m}</td>
                    <td>${rowData.wind_gusts_10m}</td>
                    <td>${rowData.beaufort}</td>
                `;

                // Ajoute la ligne au tableau
                tableBody.appendChild (row);
                
                index++;
            }
        // Affiche un message si les données ne sont pas valides
        } else {

            console.error ('Wrong data format');
        }
    // Attrape l'erreur de récupération des données
    } catch (error) {

        console.error ('Data recovery error:', error);
    }
}

// Appel de la fonction fetchData () lors du chargement de la page
fetchData ();