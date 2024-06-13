/* script révisé pour la soutenance */
/* 2024.1306.1040 */

// Récupérer/remplir liste des photos selon la catégorie
async function getWorks(categoryId = '0') {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = ""; // Vider container

        // Filtrer les données selon la catégorie
        const filterData = data.filter(work => categoryId === '0' || work.categoryId.toString() === categoryId);

        // Créer et ajouter éléments pour chaque photo
        filterData.forEach(work => {
            const figure = document.createElement("figure");
            figure.dataset.id = work.id;

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const figcaption = document.createElement("figcaption");
            figcaption.innerText = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des photos :", error);
    }
}

// Récupérer/remplir liste déroulante des catégories
async function getFilters() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        const container = document.getElementById("category-buttons");

        container.innerHTML = ''; // Vider le container

        // Bouton "Tous"
        const allButton = document.createElement("button");
        allButton.className = 'button-style active';
        allButton.innerText = "Tous";
        allButton.addEventListener("click", () => {
            getWorks('0');
            updateActiveButton(allButton);
        });
        container.appendChild(allButton);

        // Bouton pour chaque catégorie
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
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}

// Mettre à jour le bouton actif
function updateActiveButton(activeButton) {
    document.querySelectorAll('.button-style').forEach(button => {
        button.classList.remove('active'); // Retirer classe 'active'
    });
    activeButton.classList.add('active'); // Ajouter classe 'active'
}

// Appeler les fonctions initiales pour charger les travaux et les catégories
document.addEventListener("DOMContentLoaded", () => {
    getWorks();
    getFilters();
});
// vérifier connexion utilisateur
function checkUserConnection() {
    console.log('vérifier connexion utilisateur');
    return localStorage.getItem('token') !== null; // présence token
}

// gérer bannière connexion
function manageConnectionBanner(isConnected) {
    console.log('gérer bannière connexion', isConnected);
    const header = document.querySelector("header");
    let bandeau = document.getElementById("bandeau-connexion");

    if (isConnected) {
        if (!bandeau) {
            bandeau = document.createElement('div');
            bandeau.id = 'bandeau-connexion';
            bandeau.innerHTML = '<ul><li><a id="editModeLink" href="#"><i class="fa-regular fa-pen-to-square"></i> mode édition</a></li></ul>';
            header.insertAdjacentElement("beforebegin", bandeau);
            document.getElementById("editModeLink").addEventListener("click", toggleModal);
        }

        // ajouter lien "modifier"
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
        if (bandeau) bandeau.remove();

        const editProjectLink = document.getElementById("editProjectLink");
        if (editProjectLink) editProjectLink.remove();

        const titleContainer = document.querySelector('.title-container');
        if (titleContainer) {
            const projectTitle = titleContainer.querySelector('h2');
            titleContainer.parentNode.insertBefore(projectTitle, titleContainer);
            titleContainer.remove();
        }
    }
}

// charger catégories
async function getFilters() {
    console.log('charger catégories');
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        const container = document.getElementById("category-buttons");

        container.innerHTML = ''; // vider container

        // bouton "tous"
        const allButton = document.createElement("button");
        allButton.className = 'button-style active';
        allButton.innerText = "Tous";
        allButton.addEventListener("click", () => {
            console.log('bouton tous cliqué');
            getWorks('0');
            updateActiveButton(allButton);
        });
        container.appendChild(allButton);

        // boutons catégories
        data.forEach((item) => {
            const button = document.createElement("button");
            button.className = 'button-style';
            button.innerText = item.name;
            button.addEventListener("click", () => {
                console.log('bouton catégorie cliqué', item.name);
                getWorks(item.id.toString());
                updateActiveButton(button);
            });
            container.appendChild(button);
        });
    } catch (error) {
        console.error("erreur chargement catégories :", error);
    }
}

// mettre à jour bouton actif
function updateActiveButton(activeButton) {
    console.log('mise à jour bouton actif');
    document.querySelectorAll('.button-style').forEach(button => {
        button.classList.remove('active'); // retirer classe 'active'
    });
    activeButton.classList.add('active'); // ajouter classe 'active'
}

// charger travaux
async function getWorks(categoryId = '0') {
    console.log('charger travaux', categoryId);
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = ""; // vider container

        // filtrer par catégorie
        const filterData = data.filter(work => categoryId === '0' || work.categoryId.toString() === categoryId);

        // ajouter éléments
        filterData.forEach(work => {
            const figure = document.createElement("figure");
            figure.dataset.id = work.id;

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const figcaption = document.createElement("figcaption");
            figcaption.innerText = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    } catch (error) {
        console.error("erreur chargement travaux :", error);
    }
}

// afficher/fermer modale
function toggleModal(event) {
    event.preventDefault();
    console.log('toggle modale');
    let modal = document.querySelector('.modale');
    if (modal) modal.remove(); // retirer modale

    const modalHTML = `
        <div class="modale">
            <div class="modale-galerie">
                <span class="close-modal"><i class="fa-solid fa-xmark"></i></span>
                <h2>galerie photo</h2>
                <div class="modale-projets"></div>
                <button class="add-photo-btn">ajouter une photo</button>
            </div>
        </div>`;
    const main = document.querySelector('main');
    main.insertAdjacentHTML("afterbegin", modalHTML);
    modal = document.querySelector('.modale');
    modal.classList.add('modale-show'); // afficher modale
    setupModalEvents(); // événements fermeture modale
    loadWorksIntoModal(); // charger travaux
    const addButton = document.querySelector('.add-photo-btn');
    if (addButton) addButton.addEventListener('click', addPhoto);
}

// événements modale
function setupModalEvents() {
    const modal = document.querySelector('.modale');

    // clic fond fermer modale
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            console.log('fermer modale fond');
            modal.remove(); // retirer modale
        }
    });

    attachCloseButtonEvent(modal); // écouter bouton "X"
    attachAddPhotoButtonEvent(modal); // écouter "ajouter une photo"
    attachBackButtonEvent(modal); // écouter "modal-back"
}

function attachCloseButtonEvent(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.removeEventListener('click', closeModale);
        closeBtn.addEventListener('click', closeModale);
    }
}

function closeModale() {
    console.log('fermer modale X');
    const modal = document.querySelector('.modale');
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

// restaurer vue galerie
function restoreGalleryView() {
    console.log('restaurer vue galerie');
    let modal = document.querySelector('.modale');
    modal.innerHTML = `
        <div class="modale-galerie">
            <span class="close-modal"><i class="fa-solid fa-xmark"></i></span>
            <h2>galerie photo</h2>
            <div class="modale-projets"></div>
            <button class="add-photo-btn">ajouter une photo</button>
        </div>`;
    setupModalEvents(); // réinitialiser écouteurs
    loadWorksIntoModal(); // charger travaux
}

// charger travaux modale
async function loadWorksIntoModal() {
    console.log('charger travaux modale');
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        const modalProjectsContainer = document.querySelector('.modale-projets');
        modalProjectsContainer.innerHTML = ''; // vider container

        // ajouter éléments
        works.forEach(work => {
            const workItem = document.createElement('div');
            workItem.className = 'work-item';
            workItem.dataset.id = work.id;

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const trashIcon = document.createElement("i");
            trashIcon.className = 'fa-solid fa-trash-can';
            trashIcon.addEventListener('click', () => {
                console.log('supprimer travail cliqué', work.id);
                deleteWork(work.id); // gérer suppression
            });

            workItem.appendChild(img);
            workItem.appendChild(trashIcon);
            modalProjectsContainer.appendChild(workItem);
        });
    } catch (error) {
        console.error("erreur chargement travaux :", error);
    }
}

// supprimer travaux
function deleteWork(workId) {
    const token = localStorage.getItem('token'); // token auth
    console.log('supprimer travail', workId);

    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` // token auth
        }
    })
    .then(response => {
        if (response.ok) {
            const workItemModal = document.querySelector(`.modale-projets [data-id="${workId}"]`);
            if (workItemModal) workItemModal.remove(); // retirer modale

            const workItemGallery = document.querySelector(`.gallery [data-id="${workId}"]`);
            if (workItemGallery) workItemGallery.remove(); // retirer galerie
        } else {
            response.json().then(data => {
                alert(`erreur : ${data.message || "impossible de supprimer cette photo."}`);
            });
        }
    })
    .catch(error => {
        console.error('erreur suppression :', error);
        alert('erreur connexion ou serveur lors de la suppression.');
    });
}

// ajouter nouveau projet
function addPhoto() {
    console.log('ajout photo cliqué');
    let modal = document.querySelector('.modale');
    modal.innerHTML = `
        <div class="modale-addPhoto">
            <span class="modal-back"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="close-modal"><i class="fa-solid fa-xmark"></i></span>
            <h2>ajout photo</h2>
            <form id="addPhotoForm">
                <div class="containerFile">
                    <span><i class="fa-regular fa-image"></i></span>
                    <label for="file">+ ajouter photo</label>
                    <input type="file" id="file" name="image" required>
                    <p>jpg, png : 4 mo max</p>
                </div>
                <label for="title">titre</label>
                <input type="text" id="title" name="title" required>
                <label for="category">catégorie</label>
                <select name="category" id="category" required></select>
                <button type="submit" class="button">valider</button>
            </form>
        </div>
    `;
    loadCategoriesIntoSelect(); // charger catégories

    setupModalEvents(); // écouteurs fermer et retour
    setupFormSubmitListener(); // écouteur soumettre formulaire
    setupImagePreview(); // aperçu image
    setupRealTimeValidation(); // validation temps réel
}

// charger catégories select
function loadCategoriesIntoSelect() {
    console.log('charger catégories select');
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('category');
            if (select) {
                select.innerHTML = ''; // effacer options existantes
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('erreur chargement catégories :', error);
        });
}

// écoute soumission formulaire
function setupFormSubmitListener() {
    const form = document.getElementById('addPhotoForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // empêcher soumission standard
        console.log('soumission formulaire ajout photo');
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
        alert("le fichier doit être une image de type jpg ou png.");
        return false;
    }
    if (file.size > 4194304) { // plus de 4 mo
        alert("la taille du fichier ne doit pas dépasser 4 mo.");
        return false;
    }
    return true;
}

// envoyer image serveur
function uploadImage(formData) {
    const token = localStorage.getItem('token'); // token auth
    console.log('envoyer image serveur');

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'erreur réseau');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('succès ajout image', data);
        const newWorkElement = addWorkToGallery(data);
        addWorkToModal(data);
        newWorkElement.scrollIntoView({ behavior: 'smooth', block: 'end' }); // faire défiler jusqu'à la nouvelle photo
        restoreGalleryView(); // restaurer vue galerie après ajout
    })
    .catch((error) => {
        console.error('erreur ajout photo :', error);
        alert('erreur lors de l\'ajout de la photo : ' + error.message);
    });
}

// ajouter travail galerie
function addWorkToGallery(work) {
    console.log('ajouter travail galerie', work);
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const figure = document.createElement("figure");
        figure.dataset.id = work.id;

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
        return figure;
    }
}

// ajouter travail modale
function addWorkToModal(work) {
    console.log('ajouter travail modale', work);
    const modalProjectsContainer = document.querySelector('.modale-projets');
    if (modalProjectsContainer) {
        const workItem = document.createElement('div');
        workItem.className = 'work-item';
        workItem.dataset.id = work.id;

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const trashIcon = document.createElement("i");
        trashIcon.className = 'fa-solid fa-trash-can';
        trashIcon.addEventListener('click', () => {
            console.log('supprimer travail modale cliqué', work.id);
            deleteWork(work.id); // gérer suppression
        });

        workItem.appendChild(img);
        workItem.appendChild(trashIcon);
        modalProjectsContainer.appendChild(workItem);
    }
}

// validation temps réel
function setupRealTimeValidation() {
    const form = document.getElementById('addPhotoForm');
    const inputs = form.querySelectorAll('input, select');
    const submitButton = form.querySelector('button[type="submit"]');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            console.log('validation temps réel');
            if (validateForm(form)) {
                submitButton.style.backgroundColor = '#1D6154';
            } else {
                submitButton.style.backgroundColor = '#A7A7A7';
            }
        });
    });
}

// prévisualisation image
function setupImagePreview() {
    const fileInput = document.querySelector('.modale-addPhoto input[type="file"]');
    const containerFile = document.querySelector('.modale-addPhoto .containerFile');

    fileInput.addEventListener('change', function(event) {
        console.log('prévisualisation image');
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                containerFile.innerHTML = `<img src="${e.target.result}" alt="aperçu photo">`;
                containerFile.appendChild(fileInput); // ajouter input de nouveau
            };
            reader.readAsDataURL(file);
        } else {
            alert('veuillez sélectionner une image de type jpg ou png.');
        }
    });
}

// initialisation
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM chargé');
    const isUserConnected = checkUserConnection();

    // gérer bannière connexion
    manageConnectionBanner(isUserConnected);

    // charger travaux et catégories
    getWorks();
    getFilters();
});
