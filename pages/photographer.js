// ---------- DOM elements ----------

// User URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const photographerID = urlParams.get("photographerID");

// User informations
const userName = document.getElementById("user-name");
const userLocation = document.querySelector(".user-location");
const userTagline = document.querySelector(".user-tagline");
const userTags = document.querySelector(".user-tags");
const userID = document.querySelector(".user-id");
const userPics = document.querySelector(".user-medias");

// Media likes
const userPrice = document.querySelector(".price");
const userLikes = document.querySelector(".total-likes");

// Sort Media
const autoSort = document.querySelector(".auto-sort");

// Media lightbox
const lightboxLinks = document.querySelectorAll(".lightbox");
const lightbox = document.getElementById("modal-lightbox");
const lightboxClose = document.querySelector(".close");

// Modal = Form
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const contactID = document.querySelector(".contact-id");
const modalSubmitClose = document.querySelector("#btn-submit-close");
const formData = document.querySelectorAll(".formData");
const form = document.getElementById("contactform");

// VAR
let userData;
let userMedia;
let likeArray = [];
let total = 0;
let dropSort = "";
let option = "";
let currentMediaIndex;
let firstDisplay = true;

// ------- fetch JSON - Users info --------

const getUser = async () => {
  await fetch("../photographers.json")
    .then((res) => res.json())
    .then(
      (data) =>
        (userData = data.photographers.filter((p) => p.id == photographerID))
    );

  const userTagsHTML = userData[0].tags.map(
    (tag) => `#<span class="user-tag">${tag}</span>`
  );

  contactID.textContent += userData[0].name;
  userName.textContent += userData[0].name;
  userLocation.textContent += userData[0].city;
  userTagline.textContent += userData[0].tagline;
  userPrice.textContent += `${userData[0].price}€ / jour`;
  userTags.innerHTML = `${userTagsHTML.join(" ")}`;

  userID.innerHTML += `<img
    src="../images/PhotographersID/${userData[0].portrait}"
    alt="${userData[0].name}"
    width="200px"
    class="user-pic"
    />`;

  const tagUser = document.querySelectorAll(".user-tag");

  tagUser.forEach((tag) => {
    tag.addEventListener("click", (e) => {
      const myTag = e.currentTarget.textContent;
      sessionStorage.setItem("phTag", myTag);

      window.location = "../index.html";
    });
  });
};

getUser();

// -------- fetch JSON - Users media ---------

const getMedia = async () => {
  await fetch("../photographers.json")
    .then((res) => res.json())
    .then((data2) => {
      userMedia = data2.media.filter((m) => m.photographerId == photographerID);
      mediaDisplay(userMedia);
    });
};

getMedia();

const mediaDisplay = (arrayofMedia) => {
  userPics.innerHTML = "";
  likeArray = [];
  if (dropSort === "") {
    userMedia.sort((a, b) => (a.likes < b.likes ? 1 : -1))
  }
  arrayofMedia.forEach((media, index) => {
    userPics.innerHTML += `
    <div class="media-content">
      <div class="media">
          ${mediaFactory(media)}
        </div>
        <div class="media-infos">
          <small class="media-name">${media.title}</small>
          <p aria-label="likes" class="media-likes">
            <span class="nbLikes">${
              media.likes
            }</span> <span class="number-likes"><i class="fas fa-heart" onclick="decrementLike('${index}', event)"></i><i class="far fa-heart" onclick="incrementLike('${index}', event)"></i></span>
          </p>
        </div>
      </div>`;

    likeArray.push(media.likes);
  });

  if (firstDisplay) {
    addLikes(likeArray);
    firstDisplay = false;
  }

  sortMedia();
};

// Lightbox

lightboxLinks.forEach((link, index) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const lightboxMedia = lightbox.querySelector(".modal-content img");

    lightboxMedia.src = this.href;

    lightbox.classList.add("show");
  });
});

lightboxClose.addEventListener("click", function () {
  lightbox.classList.remove("show");
});

const filterList = document.querySelectorAll(".inactive");

const sortMedia = () => {
  const newUserMedia = [...userMedia];
  filterList.forEach((element) => {
    element.addEventListener("click", (e) => {
      dropSort = e.currentTarget.textContent;
      option = autoSort.textContent;
      
      if (dropSort === "Date") {
        newUserMedia.sort((a, b) => (a.date < b.date ? 1 : -1));
        element.textContent = option;
        autoSort.textContent = dropSort;
      }

      if (dropSort === "Titre") {
        newUserMedia.sort((a, b) => (a.title > b.title ? 1 : -1));
        element.textContent = option;
        autoSort.textContent = dropSort;
      }

      if (dropSort === "Popularité") {
        newUserMedia.sort((a, b) => (a.likes < b.likes ? 1 : -1));
        element.textContent = option;
        autoSort.textContent = dropSort;
      }
      mediaDisplay(newUserMedia);
      sortMedia()
      addLikes(likeArray)
      console.log(dropSort)
    });
  });
};

const nextMedia = () => {};

const previousMedia = () => {};

// Media Likes

const addLikes = (tl) => {
  total = tl.reduce((total, like) => total + like, 0);
  userLikes.innerHTML = `${total} <i class="fas fa-heart"></i>`;
};

const incrementLike = (id, event) => {
  let nbLike = likeArray[id];
  nbLike = nbLike + 1;

  const nbLikes = document.querySelectorAll(".nbLikes");
  nbLikes[id].textContent = nbLike;

  likeArray[id] = nbLike;
  addLikes(likeArray);

  event.currentTarget.style.display = "none";

  document.querySelectorAll(".fas.fa-heart")[id].style.display = "initial";
};

const decrementLike = (id, event) => {
  let nbLike = likeArray[id];
  nbLike = nbLike - 1;

  const nbLikes = document.querySelectorAll(".nbLikes");
  nbLikes[id].textContent = nbLike;

  likeArray[id] = nbLike;
  addLikes(likeArray);

  event.currentTarget.style.display = "none";

  document.querySelectorAll(".far.fa-heart")[id].style.display = "initial";
};

// Users media - Factory Method

function mediaFactory(med) {
  if (med.hasOwnProperty("image")) {
    return `<a class="lightbox" href="../images/${med.photographerId}/${med.image}">
    <img
    src="../images/${med.photographerId}/${med.image}"
    alt="image ${med.title}"
    class="media-img"
    /></a>`;
  } else if (med.hasOwnProperty("video")) {
    return `<a class="lightbox" href="../images/${med.photographerId}/${med.video}"><video controls>
    <source src="../images/${med.photographerId}/${med.video}" type="video/mp4">
    </video></a>`;
  }
}
// Modal form display

modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

function launchModal() {
  modalbg.style.display = "block";
  document.querySelector(".modal-body").style.display = "block";
}

modalSubmitClose.addEventListener("click", () => {
  modalbg.style.display = "none";
});

// ----- Form validation -----

// Name and Surname

let validName = (validSurname = validMail = validMessage = false);

const validText = (inputid, info) => {
  let msg;
  let valid = false;
  if (inputid.value.trim().length < 2) {
    msg = "Le champ doit contenir au moins 2 caractères";
  } else if (/[0-9]/.test(inputid.value)) {
    msg = "Ce champ ne peut pas contenir de valeur numérique";
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(inputid.value)) {
    msg = "Ce champ ne peut pas contenir de caractères spéciaux";
  } else {
    msg = "";
    valid = true;
  }
  info.textContent = msg;
  return valid;
};

form.first.addEventListener("change", () => {
  validName = validText(first, infofirst);
});

form.last.addEventListener("change", () => {
  validSurname = validText(last, infolast);
});

// Email

const validEmail = (inputEmail, info) => {
  let msg;
  let valid = false;
  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(inputEmail.value)) {
    msg = "";
    valid = true;
  } else {
    msg = "Adresse non valide";
  }
  info.textContent = msg;
  return valid;
};

form.email.addEventListener("change", () => {
  validMail = validEmail(email, infoemail);
});

// Message

const validContact = (inputMessage, info) => {
  let msg;
  let valid = false;
  if (inputMessage.value.trim().length < 10) {
    msg = "Votre message doit contenir au moins 10 caractères";
  } else {
    msg = "";
    valid = true;
  }
  info.textContent = msg;
  return valid;
};

form.message.addEventListener("change", () => {
  validMessage = validContact(message, infomessage);
});

// Complete form

const validate = (event) => {
  event.preventDefault();

  if (!validName) {
    infofirst.textContent = "Veuillez renseigner un prénom";
  }

  if (!validSurname) {
    infolast.textContent = "Veuillez renseigner un nom";
  }

  if (!validMail) {
    infoemail.textContent = "Veuillez renseigner un email";
  }

  if (!validMessage) {
    infomessage.textContent = "Ce champ ne peut être vide";
  }

  if (validName && validSurname && validMail && validMessage) {
    modalbg.style.display = "none";
    document.querySelector(".btn-mobile").style.display = "block";
    resetForm();
  }
};

// Form validation reset

function resetForm() {
  form.reset();
  document.querySelectorAll("small").forEach((s) => (s.textContent = ""));
  validName = validSurname = validMail = validMessage = false;
}
