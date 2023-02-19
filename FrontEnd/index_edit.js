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

const editer = document.querySelectorAll(".editer");
const modal = document.querySelector(".modal");

for (var i = 0; i < editer.length; i++) {
  editer[i].addEventListener("click", function () {
    document.querySelector(".modal").style.display = "block";
  });
}

// Mettre la "x" de fermeture de la modal dans une constante et au clic de celle ci la fermer
const close = document.querySelector("#close");

window.addEventListener("click", function (event) {
  const modal = document.querySelector(".modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

close.addEventListener("click", function () {
  modal.style.display = "none";
});

// dessous, la partie qui permet de Supprimer une image de la gallerie

const divGallery = document.getElementById("gallery-image");

// stocke les images sélectionnées
let selectedImages = [];

// fonction pour sélectionner une image
function selectImage(event) {
  const image = event.target;
  if (image.classList.contains("selected")) {
    image.classList.remove("selected");
    image.style.border = "none";
    const imageId = image.getAttribute("data-imageId");
    const index = selectedImages.indexOf(imageId);
    selectedImages.splice(index, 1);
  } else {
    image.classList.add("selected");
    image.style.border = "2px solid green";
    const imageId = image.getAttribute("data-imageId");
    selectedImages.push(imageId);
  }
}

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.imageUrl;
      img.crossOrigin = "anonymous";
      img.style.maxWidth = "100px";
      img.style.maxHeight = "100px";
      img.style.marginLeft = "20px";
      img.style.marginBottom = "20px";
      // stocke l'identifiant unique de l'image
      img.setAttribute("data-imageId", image.id);

      // ajoute un gestionnaire d'événements de clic pour sélectionner l'image
      img.addEventListener("click", selectImage);

      // ajoute les images à la modal
      divGallery.appendChild(img);

      // ajoute les images à la page
      const allImages = document.querySelectorAll(
        `[data-imageId="${image.id}"]`
      );
      allImages.forEach((img) => {
        img.addEventListener("click", selectImage);
      });
    });
  })
  .catch((error) => console.error(error));

// gestionnaire d'événements de clic pour le bouton "supprimer"
const deleteButton = document.getElementById("delete_button");
deleteButton.addEventListener("click", function () {
  // envoie une requête DELETE à l'API pour chaque image sélectionnée
  selectedImages.forEach((imageId) => {
    fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // retire l'image de la page si elle a été supprimée avec succès de l'API
          const image = document.querySelector(`[data-imageId="${imageId}"]`);
          image.remove();

          // retire toutes les images de la page qui ont l'ID de l'image supprimée
          const allImages = document.querySelectorAll(
            `[data-imageId="${imageId}"]`
          );
          allImages.forEach((img) => {
            img.remove();
          });
        } else {
          console.error(`Failed to delete image ${imageId}`);
        }
      })
      .catch((error) => console.error(error));
  });

  // vide le tableau des images sélectionnées
  selectedImages = [];
});
