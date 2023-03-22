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
      element.setAttribute("data-imageId", work.id);

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
    let categories = data;
    data.forEach((item) => {
      let div = document.createElement("div");
      div.id = item.name;
      div.innerHTML = `${item.name}`;
      div.setAttribute("class", "all-ctg");
      filtre.appendChild(div);
    });
    localStorage.setItem("categories", JSON.stringify(categories));

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
    // modifier la bandeau noir en en-tête
    const bandeauNoir = document.createElement("div");
    bandeauNoir.id = "bandeau-noir";
    bandeauNoir.classList.add("bandeau-noir-class");

    // On ajoute le bandeau noir dans le header mais en première position
    const header = document.querySelector("header");
    document.body.insertBefore(bandeauNoir, header);

    // mettre en display none la section des filtres
    filtre.style.display = "none";

    // création des icones à mettre dans le bandeau noir
    const divSVG = document.createElement("div");
    divSVG.innerHTML = `<svg width="19" height="19" viewBox="0 0 19 19" fill="red" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.90827 5.6194L7.0677 7.45996C6.3896 8.13807 5.70762 8.81617 5.03339 9.50203C4.87452 9.66477 4.7544 9.88177 4.7079 10.0949C4.46378 11.2147 4.22741 12.3346 3.99104 13.4544L3.8593 14.0744C3.7973 14.3766 3.87867 14.6789 4.08404 14.8842C4.24291 15.0431 4.46378 15.1322 4.69627 15.1322C4.76214 15.1322 4.82802 15.1245 4.89389 15.1129L5.57587 14.9695C6.66084 14.7409 7.74968 14.5084 8.83465 14.2836C9.08652 14.2294 9.29963 14.117 9.48175 13.9349C12.5274 10.8854 15.5731 7.8397 18.6187 4.79792C18.8435 4.57318 18.9675 4.30581 18.9985 3.97645C19.0023 3.9222 18.9985 3.86795 18.9868 3.81758C18.9675 3.74008 18.952 3.65871 18.9326 3.58121C18.89 3.38359 18.8435 3.15885 18.7505 2.94185C18.1809 1.63989 17.2354 0.709921 15.9412 0.186812C15.6816 0.0821901 15.4065 0.0473162 15.1662 0.0163172L15.1003 0.00856739C14.7516 -0.0340563 14.4339 0.0821901 14.1587 0.361182C12.415 2.11263 10.6597 3.86795 8.90827 5.6194ZM14.9725 0.942414C14.9802 0.942414 14.9841 0.942414 14.9918 0.942414L15.0577 0.950164C15.2592 0.973413 15.4452 0.996662 15.5924 1.05866C16.6464 1.4849 17.4214 2.24437 17.8903 3.31384C17.9445 3.43784 17.9794 3.59671 18.0142 3.76333C18.0259 3.82533 18.0414 3.88732 18.053 3.94932C18.0375 4.01907 18.0104 4.06557 17.9561 4.11594C14.9066 7.15772 11.8609 10.2073 8.81527 13.2529C8.7649 13.3033 8.7184 13.3265 8.64865 13.342C7.55981 13.5707 6.47484 13.7993 5.386 14.0279L4.81252 14.148L4.92102 13.6404C5.15738 12.5244 5.39375 11.4046 5.63399 10.2886C5.64174 10.2538 5.67274 10.1995 5.70762 10.1608C6.38185 9.47878 7.05608 8.80067 7.73418 8.12644L9.57475 6.28588C11.3301 4.53055 13.0854 2.77523 14.8368 1.01604C14.9105 0.954039 14.9453 0.942414 14.9725 0.942414Z" fill="white"/>
    <path d="M1.50733 4.22446H8.27287C8.53637 4.22446 8.74949 4.01134 8.74949 3.74785C8.74949 3.48436 8.53637 3.27124 8.27287 3.27124H1.50733C0.67423 3.27124 0 3.94934 0 4.77857V17.4649C0 18.298 0.678105 18.9723 1.50733 18.9723H14.1898C15.0229 18.9723 15.6972 18.2942 15.6972 17.4649V10.9745C15.6972 10.711 15.484 10.4979 15.2205 10.4979C14.957 10.4979 14.7439 10.711 14.7439 10.9745V17.4649C14.7439 17.7711 14.4921 18.0229 14.1859 18.0229H1.50733C1.20121 18.0229 0.949346 17.7711 0.949346 17.4649V4.78244C0.949346 4.47633 1.20121 4.22446 1.50733 4.22446Z" fill="white"/>
    </svg>`;
    bandeauNoir.appendChild(divSVG);

    // Cloner le svg pour le mettre à côté du titre "Mes projets"
    const divSVG2 = document.createElement("div");
    divSVG2.innerHTML = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.90827 5.6194L7.0677 7.45996C6.3896 8.13807 5.70762 8.81617 5.03339 9.50203C4.87452 9.66477 4.7544 9.88177 4.7079 10.0949C4.46378 11.2147 4.22741 12.3346 3.99104 13.4544L3.8593 14.0744C3.7973 14.3766 3.87867 14.6789 4.08404 14.8842C4.24291 15.0431 4.46378 15.1322 4.69627 15.1322C4.76214 15.1322 4.82802 15.1245 4.89389 15.1129L5.57587 14.9695C6.66084 14.7409 7.74968 14.5084 8.83465 14.2836C9.08652 14.2294 9.29963 14.117 9.48175 13.9349C12.5274 10.8854 15.5731 7.8397 18.6187 4.79792C18.8435 4.57318 18.9675 4.30581 18.9985 3.97645C19.0023 3.9222 18.9985 3.86795 18.9868 3.81758C18.9675 3.74008 18.952 3.65871 18.9326 3.58121C18.89 3.38359 18.8435 3.15885 18.7505 2.94185C18.1809 1.63989 17.2354 0.709921 15.9412 0.186812C15.6816 0.0821901 15.4065 0.0473162 15.1662 0.0163172L15.1003 0.00856739C14.7516 -0.0340563 14.4339 0.0821901 14.1587 0.361182C12.415 2.11263 10.6597 3.86795 8.90827 5.6194ZM14.9725 0.942414C14.9802 0.942414 14.9841 0.942414 14.9918 0.942414L15.0577 0.950164C15.2592 0.973413 15.4452 0.996662 15.5924 1.05866C16.6464 1.4849 17.4214 2.24437 17.8903 3.31384C17.9445 3.43784 17.9794 3.59671 18.0142 3.76333C18.0259 3.82533 18.0414 3.88732 18.053 3.94932C18.0375 4.01907 18.0104 4.06557 17.9561 4.11594C14.9066 7.15772 11.8609 10.2073 8.81527 13.2529C8.7649 13.3033 8.7184 13.3265 8.64865 13.342C7.55981 13.5707 6.47484 13.7993 5.386 14.0279L4.81252 14.148L4.92102 13.6404C5.15738 12.5244 5.39375 11.4046 5.63399 10.2886C5.64174 10.2538 5.67274 10.1995 5.70762 10.1608C6.38185 9.47878 7.05608 8.80067 7.73418 8.12644L9.57475 6.28588C11.3301 4.53055 13.0854 2.77523 14.8368 1.01604C14.9105 0.954039 14.9453 0.942414 14.9725 0.942414Z" fill="black"/>
    <path d="M1.50733 4.22446H8.27287C8.53637 4.22446 8.74949 4.01134 8.74949 3.74785C8.74949 3.48436 8.53637 3.27124 8.27287 3.27124H1.50733C0.67423 3.27124 0 3.94934 0 4.77857V17.4649C0 18.298 0.678105 18.9723 1.50733 18.9723H14.1898C15.0229 18.9723 15.6972 18.2942 15.6972 17.4649V10.9745C15.6972 10.711 15.484 10.4979 15.2205 10.4979C14.957 10.4979 14.7439 10.711 14.7439 10.9745V17.4649C14.7439 17.7711 14.4921 18.0229 14.1859 18.0229H1.50733C1.20121 18.0229 0.949346 17.7711 0.949346 17.4649V4.78244C0.949346 4.47633 1.20121 4.22446 1.50733 4.22446Z" fill="black"/>
    </svg>`;
    const h2Portfolio = document.querySelector("#portfolio h2");
    h2Portfolio.style.display = "flex";
    h2Portfolio.style.justifyContent = "center";
    h2Portfolio.style.alignItems = "center";
    h2Portfolio.appendChild(divSVG2);
    divSVG2.style.marginLeft = "20px";

    // ajout du bouton "modifier" à coter du titre "Mes projets"
    const modifier = document.createElement("button");

    modifier.setAttribute("class", "editer");
    modifier.innerText = "modifier";
    h2Portfolio.appendChild(modifier);
    modifier.style.fontSize = "14px";
    modifier.style.backgroundColor = "transparent";
    modifier.style.border = "none";
    modifier.style.cursor = "pointer";
    modifier.style.fontFamily = "Syne";

    // Création de "mode édite" et "publier les changement" à ajouter dans le bandeau noir
    const modeEdit = document.createElement("p");
    modeEdit.innerText = `Mode édition`;
    modeEdit.style.color = "white";
    bandeauNoir.appendChild(modeEdit);

    //cloner le bouton modifier pour le mettre dans le bandeau noir
    const publier = modifier.cloneNode(true);
    bandeauNoir.appendChild(publier);
    publier.style.backgroundColor = "white";
    publier.innerText = "publier les changements";
    publier.style.padding = "15px";
    publier.style.borderRadius = "30px";
    publier.style.marginLeft = "15px";

    // Création de la modal

    // Créer l'élément de div pour la modale
    const modalDiv = document.createElement("div");
    modalDiv.setAttribute("class", "modal");

    // Créer l'élément div pour le contenu de la modale
    const modalContentDiv = document.createElement("div");
    modalContentDiv.id = "modal-content";

    // Créer l'élément span pour fermer la modale
    const closeSpan = document.createElement("span");
    closeSpan.id = "close";
    closeSpan.classList.add("close-span-class");
    closeSpan.innerHTML = "&times;";

    // Créer l'élément p pour le titre de la modale
    const titleP = document.createElement("p");
    titleP.innerHTML = "Galerie photos";
    titleP.classList.add("title-galerie-photo");

    // Créer l'élément div pour les images de la galerie
    const galleryDiv = document.createElement("div");
    galleryDiv.id = "gallery-image";

    // Créer l'élément div pour les boutons sous la modale
    const btnUnderModalDiv = document.createElement("div");
    btnUnderModalDiv.id = "btn_under-modal";

    // Créer le bouton "Ajouter une photo"
    const addPhotoButton = document.createElement("button");
    addPhotoButton.id = "ajt_photo";
    addPhotoButton.innerHTML = "Ajouter une photo";

    // Au click sur le bouton "Ajouter une photo", on cache la modale et on fait apparaitre la modal pour ajouter une photo
    addPhotoButton.addEventListener("click", () => {
      modalContentDiv.style.display = "none";
      modalAddImage.style.display = "block";
    });

    // Créer le bouton "Supprimer la galerie"
    const deleteButton = document.createElement("button");
    deleteButton.id = "delete_button";
    deleteButton.innerHTML = "Supprimer la galerie";

    // Ajouter les éléments au DOM
    btnUnderModalDiv.appendChild(addPhotoButton);
    btnUnderModalDiv.appendChild(deleteButton);

    modalContentDiv.appendChild(closeSpan);
    modalContentDiv.appendChild(titleP);
    modalContentDiv.appendChild(galleryDiv);
    modalContentDiv.appendChild(btnUnderModalDiv);

    modalDiv.appendChild(modalContentDiv);

    // Ajouter la modale au corps de la page
    const portfolio = document.getElementById("portfolio");
    portfolio.appendChild(modalDiv);

    // La suite sera d'afficher la modal au clic des bouton modifier et publier les changements
    const editer = document.querySelectorAll(".editer");
    for (var i = 0; i < editer.length; i++) {
      editer[i].addEventListener("click", () => {
        modalDiv.style.display = "block";
      });
    }

    // Fermeture de la modal en cliquant en dehors de la modal
    window.addEventListener("click", function (event) {
      if (event.target == modalDiv) {
        modalDiv.style.display = "none";
      }
    });

    //Fermeture de la modal en cliquant sur la croix
    closeSpan.addEventListener("click", () => {
      modalDiv.style.display = "none";
    });

    // Insertion des images dans la modal via fetch
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((image) => {
          const divImage = document.createElement("div");
          divImage.setAttribute("class", "div-image");
          divImage.style.marginBottom = "20px";
          divImage.style.position = "relative";
          const img = document.createElement("img");
          img.src = image.imageUrl;
          img.crossOrigin = "anonymous";
          img.style.maxWidth = "100px";
          img.style.maxHeight = "100px";
          img.style.marginLeft = "10px";

          // stocke l'identifiant unique de l'image
          img.setAttribute("data-imageId", image.id);

          // ajoute les images à la modal
          divImage.appendChild(img);
          galleryDiv.appendChild(divImage);

          // ajouter "editer" en dessous des images
          const editerUnderImage = document.createElement("p");
          editerUnderImage.innerText = "éditer";
          editerUnderImage.style.marginLeft = "10px";
          divImage.appendChild(editerUnderImage);

          // ajout des icon trash sur les images et supprimer l'image quand l'icon est cliqué
          const divTrash = document.createElement("div");

          divTrash.setAttribute("class", "trash");
          divTrash.innerHTML = `<svg
              width="13"
              height="13"
              viewBox="0 0 9 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.6 1.8V0.9C6.6 0.402944 6.19704 0 5.7 0H3.3C2.80294 0 2.4 0.402944 2.4 0.9V1.8H0V2.4H0.6V8.1C0.6 8.59704 1.00294 9 1.5 9H7.5C7.99704 9 8.4 8.59704 8.4 8.1V2.4H9V1.8H6.6ZM3 0.9C3 0.734316 3.13432 0.6 3.3 0.6H5.7C5.86568 0.6 6 0.734316 6 0.9V1.8H3V0.9ZM4.2 4.2V7.2H4.8V4.2H4.2ZM2.4 7.2V5.4H3V7.2H2.4ZM6 5.4V7.2H6.6V5.4H6Z"
                fill="white"
              />
            </svg>`;

          // Ajout des style pour trash via la feuille css
          divTrash.classList.add("trash");
          // suppression des images au click des poubelles

          divTrash.addEventListener("click", () => {
            const confirmDelete = window.confirm(
              "Êtes-vous sûr de vouloir supprimer cette image ?"
            );

            if (confirmDelete) {
              // Envoyer une requête DELETE à l'API pour supprimer l'image correspondante
              const imageId = image.id;

              fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              })
                .then((response) => {
                  if (response.status === 204) {
                    // Supprimer la div parente de l'image
                    divTrash.parentNode.remove();
                    const element = document.querySelector(
                      `[data-imageId="${image.id}"]`
                    );
                    console.log(element);
                    element.remove();

                    console.log(
                      `L'image avec l'ID ${imageId} a été supprimée avec succès.`
                    );
                  }
                })
                .catch((error) => console.error(error));
            }
          });
          divImage.appendChild(divTrash);
        });
      })
      .catch((error) => console.error(error));

    // Ajout de la modal pour ajouter une image
    const modalAddImage = document.createElement("div");
    modalAddImage.id = "modal-add-image";
    modalDiv.appendChild(modalAddImage);

    // Ajout des éléments de la modal pour ajouter une image
    const divArrowClose = document.createElement("div");
    divArrowClose.classList.add("div-arrow-close");
    modalAddImage.appendChild(divArrowClose);
    // Ajout de la flèche et de la croix pour fermer la modal
    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    arrow.innerHTML = `<svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.3459 6.91164H2.14392L7.58919 1.48731C7.84495 1.23155 7.84495 0.817527 7.58919 0.562423C7.33343 0.306666 6.91941 0.306666 6.6643 0.562423L0.188882 7.03724C-0.0629605 7.28908 -0.0629605 7.71028 0.188882 7.96213L6.66436 14.4376C6.92011 14.6934 7.33414 14.6934 7.58924 14.4376C7.845 14.1818 7.845 13.7678 7.58924 13.5127L2.14392 8.21979H20.3459C20.7069 8.21979 20.9999 7.92673 20.9999 7.56571C20.9999 7.2047 20.7069 6.91164 20.3459 6.91164Z" fill="black"/>
    </svg>
    `;
    // Effet de retour sur la modal précedente au clique de la flèche
    arrow.addEventListener("click", () => {
      modalAddImage.style.display = "none";
      modalContentDiv.style.display = "block";
    });
    divArrowClose.appendChild(arrow);

    // Ajout de la croix pour fermer la modal image
    const closeSpanImage = document.createElement("div");
    closeSpanImage.classList.add("close-span-image");
    closeSpanImage.innerHTML = "&times;";
    divArrowClose.appendChild(closeSpanImage);
    closeSpanImage.addEventListener("click", () => {
      modalDiv.style.display = "none";
    });

    // Ajout du titre de la modal
    const modalImageTitle = document.createElement("p");
    modalImageTitle.innerText = "Ajout photo";
    modalImageTitle.classList.add("modal-image-title");
    modalAddImage.appendChild(modalImageTitle);

    // Ajout du formulaire pour ajouter une image
    const divUnderTitle = document.createElement("div");
    divUnderTitle.id = "div-under-title";
    modalAddImage.appendChild(divUnderTitle);
    const rectangleAddImage = document.createElement("div");
    rectangleAddImage.id = "rectangle-add-image";
    divUnderTitle.appendChild(rectangleAddImage);

    const svgAddImage = document.createElement("div");
    svgAddImage.id = "svg-add-image";
    svgAddImage.innerHTML = `<svg width="58" height="46" viewBox="0 0 58 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M57 0H1C0.448 0 0 0.447 0 1V45C0 45.553 0.448 46 1 46H57C57.552 46 58 45.553 58 45V1C58 0.447 57.552 0 57 0ZM56 44H2V2H56V44Z" fill="#B9C5CC"/>
    <path d="M16 22.138C19.071 22.138 21.569 19.64 21.569 16.57C21.569 13.498 19.071 11 16 11C12.929 11 10.431 13.498 10.431 16.569C10.431 19.64 12.929 22.138 16 22.138ZM16 13C17.968 13 19.569 14.602 19.569 16.569C19.569 18.536 17.968 20.138 16 20.138C14.032 20.138 12.431 18.537 12.431 16.57C12.431 14.603 14.032 13 16 13Z" fill="#B9C5CC"/>
    <path d="M7.00004 40C7.23404 40 7.47004 39.918 7.66004 39.751L23.973 25.389L34.275 35.69C34.666 36.081 35.298 36.081 35.689 35.69C36.08 35.299 36.08 34.667 35.689 34.276L30.882 29.469L40.063 19.415L51.324 29.738C51.731 30.111 52.364 30.083 52.737 29.676C53.11 29.269 53.083 28.636 52.675 28.263L40.675 17.263C40.479 17.084 40.218 16.995 39.955 17.001C39.69 17.013 39.44 17.13 39.261 17.326L29.467 28.053L24.724 23.31C24.35 22.937 23.752 22.918 23.356 23.266L6.33904 38.249C5.92404 38.614 5.88404 39.246 6.24904 39.661C6.44704 39.886 6.72304 40 7.00004 40Z" fill="#B9C5CC"/>
    </svg>
    `;
    rectangleAddImage.appendChild(svgAddImage);

    // Ajout du bouton pour ajouter une image
    const buttonAddImage = document.createElement("button");
    buttonAddImage.id = "button-add-image";
    buttonAddImage.innerText = "+ Ajouter photo";
    rectangleAddImage.appendChild(buttonAddImage);

    // Création de l'input file
    const inputAddImage = document.createElement("input");
    inputAddImage.id = "input-add-image";
    inputAddImage.type = "file";
    inputAddImage.accept = "image/png, image/jpeg";
    inputAddImage.style.display = "none";
    rectangleAddImage.appendChild(inputAddImage);

    // Ecouteur d'événement pour l'ajout d'une image
    buttonAddImage.addEventListener("click", () => {
      inputAddImage.click();
    });

    // Ecouteur d'événement pour la sélection d'un fichier
    inputAddImage.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024; // Convertir en Mo

      // Vérification de la taille et du type de l'image
      if (
        fileSize <= 4 &&
        (file.type === "image/png" || file.type === "image/jpeg")
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          // Création de l'élément img
          const img = document.createElement("img");
          img.src = reader.result;
          img.id = "img-added";
          img.style.width = "30%";
          img.style.height = "100%";

          // Suppression de l'élément svg
          svgAddImage.remove();
          textAddImage.remove();
          buttonAddImage.remove();
          // Ajout de l'image
          rectangleAddImage.appendChild(img);
        };
      } else {
        alert(
          "Le fichier doit être au format .png ou .jpeg et faire au maximum 4Mo."
        );
      }
    });

    // Ajout du texte de la condition pour ajouter une image
    const textAddImage = document.createElement("p");
    textAddImage.id = "text-add-image";
    textAddImage.innerText = "jpg, png : 4mo max";
    rectangleAddImage.appendChild(textAddImage);

    // Ajout des composant sous le rectangle bleu

    // Ajout de "titre" au dessus du champs de saisi de titre
    const addTitle = document.createElement("p");
    addTitle.style.marginTop = "40px";
    addTitle.style.marginBottom = "10px";
    addTitle.innerText = "Titre";
    divUnderTitle.appendChild(addTitle);

    // Ajout du champ de saisie du Titre
    const titleForm = document.createElement("form");
    divUnderTitle.appendChild(titleForm);
    const titleInput = document.createElement("input");
    titleInput.id = "title-input";
    titleInput.type = "text";
    titleInput.placeholder = "";
    titleInput.name = "title";
    titleForm.appendChild(titleInput);

    // Ajout de "catégorie" au dessus du champ de selection de catégorie
    const addCategory = document.createElement("p");
    addCategory.style.marginTop = "40px";
    addCategory.style.marginBottom = "10px";
    addCategory.innerText = "Catégorie";
    divUnderTitle.appendChild(addCategory);

    // Ajout du formulaire de sélection de catégorie
    const categoryForm = document.createElement("form");
    categoryForm.id = "category-form";
    divUnderTitle.appendChild(categoryForm);

    const categorySelect = document.createElement("select");
    categorySelect.id = "category-select";
    categorySelect.name = "category";
    categoryForm.appendChild(categorySelect);

    let categories = JSON.parse(localStorage.getItem("categories"));
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.name;
      categorySelect.appendChild(option);
    });

    // Ajout du boutton validé pour envoyer la photo à l'API
    const divButtonValidate = document.createElement("div");
    divButtonValidate.id = "div-button-validate";
    modalAddImage.appendChild(divButtonValidate);
    const buttonValidate = document.createElement("button");
    buttonValidate.id = "button-validate";
    buttonValidate.innerText = "Valider";
    divButtonValidate.appendChild(buttonValidate);

    // Ecouteur d'événement pour la validation de l'ajout d'une image
    buttonValidate.addEventListener("click", async () => {
      // Récupération du titre, de la catégorie et de l'image
      const title = document.getElementById("title-input").value;
      const category = document.getElementById("category-select").value;
      const image = document.getElementById("input-add-image");

      // Vérification de la présence d'une image et d'un titre
      if (image && title) {
        // Récupération du token
        const token = localStorage.getItem("token");
        console.log(token);

        // Création du formData
        const formData = new FormData();
        formData.append("title", title);
        //const blob = new Blob([image.files[0]], { type: "text/xml" });
        formData.append("image", image.files[0]);
        formData.append("category", category);

        // Envoi de la requête
        fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            //"Content-type": "multipart/form-data",
          },
          body: formData,
        })
          .then((response) => {
            console.log(response);
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Erreur lors de l'envoi de la photo");
            }
          })
          .then((data) => {
            console.log(data);
            // Fermeture de la modale
            modalAddImage.style.display = "none";
            // Suppression des éléments de la modale
            rectangleAddImage.remove();
            divUnderTitle.remove();
            divButtonValidate.remove();
            // Suppression de l'image
            image.remove();
            // Ajout de l'élément svg
            rectangleAddImage.appendChild(svgAddImage);
            rectangleAddImage.appendChild(textAddImage);
            rectangleAddImage.appendChild(buttonAddImage);
            // Suppression du titre et de la catégorie
            titleInput.value = "";
            categorySelect.value = "";
            // Affichage de la photo
            displayImage(data.data.link);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert("Veuillez ajouter une image et un titre.");
      }
    });
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
