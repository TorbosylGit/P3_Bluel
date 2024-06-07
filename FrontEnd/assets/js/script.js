/* script révisé pour la soutenance */
/* 2024.0706.1703 */

// récupérer/remplir liste des catégories
async function getFilters() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        const container = document.getElementById("category-buttons");

        if (!checkUserConnection()) {
            container.innerHTML = ''; // vider le container

            // bouton "Tous"
            const allButton = document.createElement("button");
            allButton.className = 'button-style';
            allButton.innerText = "Tous";
            allButton.addEventListener("click", () => {
                getWorks('0');
                updateActiveButton(allButton);
            });
            container.appendChild(allButton);

            // bouton pour chaque catégorie
            data.forEach((item) => {
                const button = document.createElement("button");
                button.className = 'button-style';
                button.innerText = item.name;
                button.addEventListener("click", () => {
                    getWorks(item.id.toString());
                    updateActiveButton(button);
                });
                container.appendChild(button);
            });
        } else {
            container.style.display = 'none'; // cacher container
        }
    } catch (error) {
        console.log("Erreur lors de la récupération des catégories :", error);
    }
}
