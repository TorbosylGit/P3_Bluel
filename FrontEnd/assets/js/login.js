// sélectionner éléments DOM
const email = document.getElementById('email');
const password = document.getElementById('password');
const btn = document.getElementById('btnSubmit');
const errorDiv = document.getElementById('errorDiv');

// styles élément erreur
errorDiv.style.display = 'none';
errorDiv.style.color = 'red';
errorDiv.style.marginTop = '10px';

// vérifier champs vides
function checkFields() {
    if (email.value.trim() === "" || password.value.trim() === "") {
        displayError("Veuillez remplir tous les champs");
        return false;
    }
    return true;
}

// valider format email
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// afficher message d'erreur
function displayError(message) {
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
}

// effacer messages d'erreur
function clearErrors() {
    errorDiv.innerText = '';
    errorDiv.style.display = 'none';
}

// préparer et envoyer données de connexion
async function sendLogin() {
    clearErrors();

    if (!checkFields()) {
        return;
    }

    if (!validateEmail(email.value)) {
        displayError("Email incorrect");
        return;
    }

    const loginData = {
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            displayError("Erreur: " + (errorData.message || "Email ou mot de passe incorrect"));
        } else {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = "./index.html";
        }
    } catch (error) {
        console.error("Erreur de connexion:", error);
        displayError("Une erreur est survenue. Veuillez réessayer.");
    }
}

// écouter événement clic sur bouton submit
btn.addEventListener('click', function (e) {
    e.preventDefault();
    sendLogin();
});
