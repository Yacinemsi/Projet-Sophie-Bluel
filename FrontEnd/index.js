const gallery = document.getElementById("gallery");

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    // Boucle sur les données pour générer un élément HTML pour chaque objet de travail
    const worksElements = data.map((work) => {
      const element = document.createElement("div");
      // Attribuer à la div la catégorie concerner
      element.setAttribute("data-categoryId", work.categoryId);
      element.innerHTML = `<figure>
      <img crossorigin="anonymous" src="${work.imageUrl}" alt="${work.title}" />
      <figcaption>${work.title}</figcaption>
    </figure>`;

      return element;
    });

    // Remplace le contenu de l'élément conteneur de travaux par les éléments générés
    gallery.innerHTML = "";
    worksElements.forEach((element) => gallery.appendChild(element));
  });

// Création de la div parent "filtre"
const filtre = document.createElement("div");
filtre.setAttribute("id", "filtre");

// Afficher les éléments des différentes catégories au click

function toggleCategory(categoryId) {
  let elements = document.querySelectorAll(
    "[data-categoryId='" + categoryId + "']"
  );
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "block";
  }
  let elementsOthers = document.querySelectorAll(
    "[data-categoryId]:not([data-categoryId='" + categoryId + "'])"
  );
  for (let i = 0; i < elementsOthers.length; i++) {
    elementsOthers[i].style.display = "none";
  }
}

// Création des catégories
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      let div = document.createElement("div");
      div.id = item.name;
      div.innerHTML = `${item.name}`;
      div.setAttribute("class", "all-ctg");
      filtre.appendChild(div);
    });

    // Au clique du filtre Objets, j'affiche tout les éléments de la catégorie Objets
    const ctgObjets = document.getElementById("Objets");
    ctgObjets.onclick = function () {
      toggleCategory(1);
    };

    // Au clique du filtre Appartement, j'affiche tout les éléments de la catégorie Appartements
    const ctgAppartement = document.getElementById("Appartements");
    ctgAppartement.onclick = function () {
      toggleCategory(2);
    };

    // Au clique du filtre Hotels et Restaurant, j'affiche tout les éléments de la catégorie Hotels et Restaurants
    const ctgHotelRestau = document.getElementById("Hotels & restaurants");
    ctgHotelRestau.onclick = function () {
      toggleCategory(3);
    };
  });

gallery.parentNode.insertBefore(filtre, gallery);

const ctgTous = document.createElement("div");
ctgTous.setAttribute("id", "Tous");
ctgTous.setAttribute("class", "all-ctg");
ctgTous.innerHTML = "Tous";
filtre.appendChild(ctgTous);

// Au clique du filtre "Tous" afficher tout les éléments
ctgTous.onclick = function () {
  let elements = document.querySelectorAll(
    "[data-categoryId='1'],[data-categoryId='2'],[data-categoryId='3']"
  );
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "block";
  }
};

// Modification de la page html en mode admin
window.addEventListener("load", function () {
  const token = localStorage.getItem("token");

  if (token) {
    // L'utilisateur est connecté, mise à jour de la page en conséquence
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "block";
    const bandeauNoir = document.createElement("div");
    bandeauNoir.id = "bandeau-noir";

    // On ajoute le bandeau noir dans le header mais en première position
    const header = document.querySelector("header");
    document.body.insertBefore(bandeauNoir, header);

    // mettre en display none la section des filtres
    filtre.style.display = "none";
    bandeauNoir.style.backgroundColor = "black";
    bandeauNoir.style.width = "100vw";
    bandeauNoir.style.marginLeft = "-362.5px";
    bandeauNoir.style.height = "30px";
    //bandeauNoir.style.display = "flex";
    //bandeauNoir.style.justifyContent = "center";
    //bandeauNoir.style.alignItems = "center";
    // création des icones à mettre dans le bandeau noir
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M1.50733 1.22446H8.27287C8.53637 1.22446 8.74949 1.01134 8.74949 0.747851C8.74949 0.484359 8.53637 0.27124 8.27287 0.27124H1.50733C0.67423 0.27124 0 0.949345 0 1.77857V14.4649C0 15.298 0.678105 15.9723 1.50733 15.9723H14.1898C15.0229 15.9723 15.6971 15.2942 15.6971 14.4649V7.97451C15.6971 7.71101 15.484 7.4979 15.2205 7.4979C14.957 7.4979 14.7439 7.71101 14.7439 7.97451V14.4649C14.7439 14.7711 14.4921 15.0229 14.1859 15.0229H1.50733C1.20121 15.0229 0.949346 14.7711 0.949346 14.4649V1.78244C0.949346 1.47633 1.20121 1.22446 1.50733 1.22446Z"
    );
    path.setAttribute("fill", "white");
    svg.appendChild(path);
    bandeauNoir.appendChild(svg);
    svg.style.position = "absolute";
    svg.style.left = "37%";
    svg.style.top = "7px";
    // Créaction des bouton modifier pour par la suite afficher la modal
    const editButton = document.createElement("button");
    editButton.class = "edit_button";
  } else {
    // L'utilisateur n'est pas connecté, mise à jour de la page en conséquence
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
  }
});
function logout() {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
}

// Au click de logout, déconnecter l'utilisateur
document.getElementById("logout").addEventListener("click", () => {
  logout();
});
