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
// mettre à jour le bouton actif
function updateActiveButton(activeButton) {
    document.querySelectorAll('.button-style').forEach(button => {
        button.classList.remove('active'); // retirer classe 'active'
    });
    activeButton.classList.add('active'); // ajouter classe 'active'
}

// récupérer/remplir liste des photos selon la catégorie
async function getWorks(categoryId = '0') {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        const gallery = document.getElementsByClassName("gallery")[0];
        gallery.innerHTML = ""; // vider container

        // filtrer les données selon la catégorie
        const filterData = data.filter(work => categoryId === '0' || work.categoryId.toString() === categoryId);

        // créer et ajouter éléments pour chaque photo
        filterData.forEach(work => {
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", work.id);

            const img = document.createElement("img");
            img.setAttribute("src", work.imageUrl);
            img.setAttribute("alt", work.title);

            const figcaption = document.createElement("figcaption");
            figcaption.innerText = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    } catch (error) {
        console.log(error);
    }
}

// appeler les fonctions initiales
getWorks();
getFilters();
