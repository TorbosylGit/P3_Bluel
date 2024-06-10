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

document.addEventListener("DOMContentLoaded", function() {
    const isUserConnected = checkUserConnection();

    // gérer l'affichage du bandeau de connexion
    manageConnectionBanner(isUserConnected);
    adjustLoginLogoutText(isUserConnected);
    setupLogoutHandler();
});

// vérifier la connexion de l'utilisateur
function checkUserConnection() {
    return localStorage.getItem('token') !== null; // présence d'un token
}

// gérer le bandeau de connexion
function manageConnectionBanner(isConnected) {
    const header = document.querySelector("header");
    let bandeau = document.getElementById("bandeau-connexion");

    if (isConnected) {
        if (!bandeau) {
            bandeau = document.createElement('div');
            bandeau.id = 'bandeau-connexion';
            bandeau.innerHTML = '<ul><li><a id="editModeLink" href="#"><i class="fa-regular fa-pen-to-square"></i> Mode édition</a></li></ul>';
            header.insertAdjacentElement("beforebegin", bandeau);
            document.getElementById("editModeLink").addEventListener("click", toggleModal);
        }

        // ajouter dynamiquement le lien "modifier" à côté du titre "Mes Projets"
        const projectTitle = document.querySelector("#portfolio h2");
        if (projectTitle && !document.querySelector('.title-container')) {
            const titleContainer = document.createElement('div');
            titleContainer.className = 'title-container';

            const editProjectLink = document.createElement('a');
            editProjectLink.id = "editProjectLink";
            editProjectLink.href = "#";
            editProjectLink.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
            editProjectLink.addEventListener("click", toggleModal);

            projectTitle.parentNode.insertBefore(titleContainer, projectTitle);
            titleContainer.appendChild(projectTitle);
            titleContainer.appendChild(editProjectLink);
        }
    } else {
        if (bandeau) {
            bandeau.parentNode.removeChild(bandeau);
        }

        const editProjectLink = document.getElementById("editProjectLink");
        if (editProjectLink) {
            editProjectLink.parentNode.removeChild(editProjectLink);
        }

        const titleContainer = document.querySelector('.title-container');
        if (titleContainer) {
            const projectTitle = titleContainer.querySelector('h2');
            titleContainer.parentNode.insertBefore(projectTitle, titleContainer);
            titleContainer.parentNode.removeChild(titleContainer);
        }
    }
}
// afficher/fermer la modale
function toggleModal(event) {
    event.preventDefault();
    let modal = document.querySelector('.modale');
    if (modal) {
        modal.remove(); // retirer modale
    }
    const modalHTML = `
        <div class="modale">
            <div class="modale-galerie">
                <span class="close-modal"><i class="fa-solid fa-xmark"></i></span>
                <h2>Galerie photo</h2>
                <div class="modale-projets"></div>
                <button class="add-photo-btn">Ajouter une photo</button>
            </div>
        </div>`;
    const main = document.querySelector('main');
    main.insertAdjacentHTML("afterbegin", modalHTML);
    modal = document.querySelector('.modale');
    modal.classList.add('modale-show'); // afficher modale
    setupModalEvents(); // événements pour fermer modale
    loadWorksIntoModal(); // charger images/travaux
    const addButton = document.querySelector('.add-photo-btn');
    if (addButton) {
        addButton.addEventListener('click', addPhoto);
    }
}
// gérer les événements de la modale
function setupModalEvents() {
    const modal = document.querySelector('.modale');

    // clic sur le fond de la modale pour fermer
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.remove(); // retirer modale
        }
    });

    attachCloseButtonEvent(modal); // attacher écouter au bouton "X"
    attachAddPhotoButtonEvent(modal); // attacher écouteur sur "Ajouter une photo"
    attachBackButtonEvent(modal); // attacher écouteur sur "modal-back"
}

function attachCloseButtonEvent(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.removeEventListener('click', closeModale);
        closeBtn.addEventListener('click', closeModale);
    }
}

function closeModale() {
    const modal = document.querySelector('.modale');
    modal.style.display = 'none';
    modal.remove();
}

function attachAddPhotoButtonEvent(modal) {
    const addPhotoBtn = modal.querySelector('.add-photo-btn');
    if (addPhotoBtn) {
        addPhotoBtn.removeEventListener('click', addPhoto);
        addPhotoBtn.addEventListener('click', addPhoto);
    }
}

function attachBackButtonEvent(modal) {
    const backButton = modal.querySelector('.modal-back');
    if (backButton) {
        backButton.removeEventListener('click', restoreGalleryView);
        backButton.addEventListener('click', restoreGalleryView);
    }
}
// restaurer la vue galerie
function restoreGalleryView() {
    let modal = document.querySelector('.modale');
    modal.innerHTML = `
        <div class="modale-galerie">
            <span class="close-modal"><i class="fa-solid fa-xmark"></i></span>
            <h2>Galerie photo</h2>
            <div class="modale-projets"></div>
            <button class="add-photo-btn">Ajouter une photo</button>
        </div>`;
    setupModalEvents(); // réinitialiser écouteurs
    loadWorksIntoModal(); // charger travaux
}

// ajuster texte du lien de connexion/déconnexion
function adjustLoginLogoutText(isConnected) {
    const loginLogoutLink = document.querySelector("#loginItem a");
    loginLogoutLink.innerText = isConnected ? "Logout" : "Login";
    loginLogoutLink.href = isConnected ? "#" : "login.html";
}

// configurer gestionnaire de déconnexion
function setupLogoutHandler() {
    const loginLogoutLink = document.querySelector("#loginItem a");
    loginLogoutLink.addEventListener("click", function(event) {
        if (this.innerText.toLowerCase() === "logout") {
            event.preventDefault();
            localStorage.removeItem('token'); // retirer token
            alert("Vous êtes maintenant déconnecté.");
            window.location.href = "index.html"; // rediriger
        }
    });
}
// charger travaux dans la modale
async function loadWorksIntoModal() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        const modalProjectsContainer = document.querySelector('.modale-projets');
        modalProjectsContainer.innerHTML = ''; // vider container

        // créer et ajouter éléments pour chaque photo
        works.forEach(work => {
            const workItem = document.createElement('div');
            workItem.className = 'work-item';
            workItem.setAttribute('data-id', work.id);

            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;

            const trashIcon = document.createElement('i');
            trashIcon.className = 'fa-solid fa-trash-can';
            trashIcon.addEventListener('click', () => {
                deleteWork(work.id); // gérer suppression
            });

            workItem.appendChild(img);
            workItem.appendChild(trashIcon);
            modalProjectsContainer.appendChild(workItem);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des photos :", error);
    }
}
// supprimer travaux de la modale et galerie principale
function deleteWork(workId) {
    const token = localStorage.getItem('token'); // token pour auth

    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` // token pour auth
        }
    })
    .then(response => {
        if (response.ok) {
            const workItemModal = document.querySelector(`.modale-projets [data-id="${workId}"]`);
            if (workItemModal) {
                workItemModal.remove(); // retirer de la modale
            }

            const workItemGallery = document.querySelector(`.gallery [data-id="${workId}"]`);
            if (workItemGallery) {
                workItemGallery.remove(); // retirer de la galerie
            }
        } else {
            response.json().then(data => {
                alert(`Erreur : ${data.message || "Impossible de supprimer cette photo."}`);
            });
        }
    })
    .catch(error => {
        console.error('Erreur de suppression : ', error);
        alert('Problème de connexion ou erreur serveur lors de la tentative de suppression.');
    });
}
// ajouter nouveau projet via formulaire de la modale
function addPhoto() {
    let modal = document.querySelector('.modale');
    modal.innerHTML = `
        <div class="modale-addPhoto">
            <span class="modal-back"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="close-modal"><i class="fa-solid fa-xmark"></i></span>
            <h2>Ajout photo</h2>
            <form>
                <div class="containerFile">
                    <span><i class="fa-regular fa-image"></i></span>
                    <label for="file">+ Ajouter photo</label>
                    <input type="file" id="file" name="image">
                    <p>jpg, png : 4 mo max</p>
                </div>
                <label for="title">Titre</label>
                <input type="text" id="title" name="title" required>
                <label for="category">Catégorie</label>
                <select name="category" id="category" required></select>
                <button type="submit" class="button">Valider</button>
            </form>
        </div>
    `;
    loadCategoriesIntoSelect(); // charger catégories dans select

    setupModalEvents(); // écouteurs pour fermer et retour
    setupFormSubmitListener(); // écouteur pour soumettre le formulaire
    setupImagePreview(); // aperçu de l'image
    setupRealTimeValidation(); // validation en temps réel
}

// charger catégories dans select
function loadCategoriesIntoSelect() {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('category');
            select.innerHTML = ''; // effacer options existantes
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur du chargement des categories : ', error);
        });
}

// écouter soumission formulaire
function setupFormSubmitListener() {
    const form = document.querySelector('.modale-addPhoto form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // empêcher soumission standard
        if (validateForm(this)) {
            const formData = new FormData(this);
            uploadImage(formData);
        }
    });
}

// validation formulaire
function validateForm(form) {
    const title = form.querySelector('#title').value.trim();
    const fileInput = form.querySelector('#file');

    const file = fileInput.files[0];
    const category = form.querySelector('#category').value;

    if (!title || !file || !category) {
        return false;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert("Le fichier doit être une image de type JPG ou PNG.");
        return false;
    }
    if (file.size > 4194304) { // plus de 4 Mo
        alert("La taille du fichier ne doit pas dépasser 4 Mo.");
        return false;
    }
    return true;
}
// envoyer image au back-end
function uploadImage(formData) {
    const token = localStorage.getItem('token'); // token pour auth

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        refreshGallery(); // rafraîchir galerie
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
// rafraîchir galerie
function refreshGallery() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // vider galerie
    fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        works.forEach(work => {
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", work.id);
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            const figcaption = document.createElement("figcaption");
            figcaption.innerText = work.title;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    })
    .catch(error => console.log('Erreur lors du chargement des photos:', error));
}
// validation live du formulaire addPhoto
function setupRealTimeValidation() {
    const form = document.querySelector('.modale-addPhoto form');
    const inputs = form.querySelectorAll('input, select');
    const submitButton = form.querySelector('button[type="submit"]');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (validateForm(form)) {
                submitButton.style.backgroundColor = '#1D6154';
            } else {
                submitButton.style.backgroundColor = '#A7A7A7';
            }
        });
    });
}
