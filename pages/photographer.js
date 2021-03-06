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
const medLikes = document.querySelectorAll(".media-likes");

// Sort Media
const dropdown = document.querySelector(".dropdown");
const dropContent = document.querySelector(".dropdown-content");

// Lightbox
let currentMedia = document.querySelector(".current-media");
const focusLightbox = document.getElementsByClassName("focus-lightbox");
const lightbox = document.getElementById("modal-lightbox");

// Modal = Form
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const contactID = document.querySelector(".contact-id");
const modalSubmitClose = document.querySelector("#btn-submit-close");
const formData = document.querySelectorAll(".formData");
const form = document.getElementById("contactform");
const focusModal = document.getElementsByClassName("focus-modal");
const nameInput = document.getElementById("first");
const familyNameInput = document.getElementById("last");
const emailInput = document.getElementById("email");
const textInput = document.getElementById("message");

// VAR
let userData;
let userMedia;
let likeArray = [];
let total = 0;
let dropSort = "";
let option = "";
let currentMediaIndex = 0;
let firstDisplay = true;
let triMedia;
let tri = false;
let firstFocusModal = focusModal[0];
let lastFocusModal = focusModal[focusModal.length - 1];
let firstFocusLightbox = focusLightbox[0];
let lastFocusLightbox = focusLightbox[focusLightbox.length - 1];

// ------- fetch JSON - Users info --------

const getUser = async () => {
  await fetch("../photographers.json")
    .then((res) => res.json())
    .then(
      (data) =>
        (userData = data.photographers.filter((p) => p.id == photographerID))
    )
    .catch((error) => console.error(error));

  const userTagsHTML = userData[0].tags.map(
    (tag) => `#<a href="../index.html" class="user-tag">${tag}</a>`
  );

  contactID.textContent += userData[0].name;
  userName.textContent += userData[0].name;
  userLocation.textContent += userData[0].city;
  userTagline.textContent += userData[0].tagline;
  userPrice.textContent += `${userData[0].price}??? / jour`;
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
    })
    .catch((error) => console.error(error));
};

getMedia();

const mediaDisplay = (arrayofMedia) => {
  userPics.innerHTML = "";
  likeArray = [];
  if (dropSort === "") {
    userMedia.sort((a, b) => (a.likes < b.likes ? 1 : -1));
  }
  arrayofMedia.forEach((media, index) => {
    userPics.innerHTML += `
    <div class="media-content">
      <div class="media">
          ${mediaFactory(media)}
        </div>
        <div class="media-infos">
          <small class="media-name">${media.title}</small>
          <div aria-label="likes" class="media-likes">
            <span class="nbLikes">${
              media.likes
            }</span> <span class="number-likes"><i id="${index}full" class="fas fa-heart heart" role="button" tabindex="0" aria-label="like" onclick="decrementLike('${index}', event)"></i><i id="${index}empty" class="far fa-heart heart" role="button" tabindex="0" aria-label="like" onclick="incrementLike('${index}', event)"></i></span>
          </div>
        </div>
      </div>`;

    likeArray.push(media.likes);
  });

  if (firstDisplay) {
    addLikes(likeArray);
    firstDisplay = false;
  }

  sortMedia();
  openLightbox();
  keyboardLikes();
};

// Filter list

const sortMedia = () => {
  const autoSort = document.querySelector(".auto-sort");
  const filterList = document.querySelectorAll(".inactive");

  const newUserMedia = [...userMedia];
  filterList.forEach((element) => {
    element.addEventListener("click", (e) => {
      dropSort = e.currentTarget.textContent;
      option = autoSort.textContent;

      if (dropSort === "Date") {
        newUserMedia.sort((a, b) => (a.date < b.date ? 1 : -1));
        element.textContent = option;
        autoSort.textContent = dropSort;
        triMedia = [...newUserMedia];
      }

      if (dropSort === "Titre") {
        newUserMedia.sort((a, b) => (a.title > b.title ? 1 : -1));
        element.textContent = option;
        autoSort.textContent = dropSort;
        triMedia = [...newUserMedia];
      }

      if (dropSort === "Popularit??") {
        newUserMedia.sort((a, b) => (a.likes < b.likes ? 1 : -1));
        element.textContent = option;
        autoSort.textContent = dropSort;
        triMedia = [...newUserMedia];
      }

      mediaDisplay(newUserMedia);
      sortMedia();
      addLikes(likeArray);
      tri = true;
    });
  });
};

/*dropdown.addEventListener("click", () => {
  dropContent.style.display = "block";
});

const keyboardSort = () => {
  dropdown.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      dropContent.style.display = "block";
    } else if (e.key === "esc" || e.key === "Escape") {
      dropContent.style.display = "none";
    }
  });
};

keyboardSort();*/

// Media Likes

const addLikes = (tl) => {
  total = tl.reduce((total, like) => total + like, 0);
  userLikes.innerHTML = `${total} <i class="fas fa-heart"></i>`;
};

const incrementLike = (id, event) => {
  event.preventDefault();
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
  event.preventDefault();
  let nbLike = likeArray[id];
  nbLike = nbLike - 1;

  const nbLikes = document.querySelectorAll(".nbLikes");
  nbLikes[id].textContent = nbLike;

  likeArray[id] = nbLike;
  addLikes(likeArray);

  event.currentTarget.style.display = "none";

  document.querySelectorAll(".far.fa-heart")[id].style.display = "initial";
};

const keyboardLikes = () => {
  const hearts = document.querySelectorAll(".heart");

  hearts.forEach((heart) => {
    heart.addEventListener("keyup", (e) => {
      if (e.key === "Enter" && e.currentTarget.id == e.currentTarget.id.slice(0, -5) + "empty") {
        console.log("Hello")
        incrementLike(e.currentTarget.id.slice(0, -5), e);
      } else if (e.key === "Enter" && e.currentTarget.id == e.currentTarget.id.slice(0, -4) + "full") {
        decrementLike(e.currentTarget.id.slice(0, -4), e)
        console.log("Bonjour")
      }
    });
  })
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
    return `<a class="lightbox" href="../images/${med.photographerId}/${med.video}"><video class="video" controls>
    <source src="../images/${med.photographerId}/${med.video}" type="video/mp4">
    </video></a>`;
  }
}

function mediaFactoryLightbox(med) {
  if (med.hasOwnProperty("image")) {
    return `<img
    src="../images/${med.photographerId}/${med.image}"
    alt="image ${med.title}"
    class="media-img"
    />`;
  } else if (med.hasOwnProperty("video")) {
    return `<video controls>
    <source src="../images/${med.photographerId}/${med.video}" type="video/mp4">
    </video>`;
  }
}

// Lightbox
let usMedia = "";

const openLightbox = () => {
  const lightboxLinks = document.querySelectorAll(".lightbox");
  const lightbox = document.getElementById("modal-lightbox");
  const lightboxClose = document.querySelector(".close");

  lightboxLinks.forEach((link, index) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      currentMedia.innerHTML = "";

      if (tri) {
        usMedia = triMedia[index];
      } else {
        usMedia = userMedia[index];
      }
      console.log(triMedia);

      currentMedia.innerHTML = mediaFactoryLightbox(usMedia);
      document.querySelector(".title-media").textContent = usMedia.title;

      lightbox.classList.add("show");
      main.style.display = "none";
      currentMediaIndex = index;
    });
  });

  lightboxClose.addEventListener("click", function () {
    lightbox.classList.remove("show");
    main.style.display = "initial";
  });
};

const nextMedia = () => {
  currentMediaIndex++;
  if (currentMediaIndex === userMedia.length) {
    currentMediaIndex = 0;
  }

  let uMedia = [];

  if (tri) {
    uMedia = triMedia[currentMediaIndex];
  } else {
    uMedia = userMedia[currentMediaIndex];
  }

  currentMedia.innerHTML = mediaFactoryLightbox(uMedia);
  document.querySelector(".title-media").textContent = uMedia.title;
};

const previousMedia = () => {
  currentMediaIndex--;
  if (currentMediaIndex < 0) {
    currentMediaIndex = userMedia.length - 1;
  }

  let uMedia = [];

  if (tri) {
    uMedia = triMedia[currentMediaIndex];
  } else {
    uMedia = userMedia[currentMediaIndex];
  }

  currentMedia.innerHTML = mediaFactoryLightbox(uMedia);
  document.querySelector(".title-media").textContent = uMedia.title;
};

const keyboardLightbox = () => {
  const lightbox = document.getElementById("modal-lightbox");

  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape" || e.key === "esc") {
      lightbox.classList.remove("show");
      main.style.display = "initial";
    } else if (e.key === "ArrowLeft") {
      previousMedia();
    } else if (e.key === "ArrowRight") {
      nextMedia();
    }
  });
};

keyboardLightbox();

const trapLightbox = (e) => {
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusLightbox) {
        e.preventDefault();
        lastFocusLightbox.focus();
      }
    } else {
      if (document.activeElement === lastFocusLightbox) {
        e.preventDefault();
        firstFocusLightbox.focus();
      }
    }
  }
};

lightbox.addEventListener("keydown", trapLightbox);

// Modal form display

modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

function launchModal() {
  modalbg.style.display = "block";
  main.style.display = "none";
  firstFocusModal.focus();
}

modalSubmitClose.addEventListener("click", (e) => {
  e.preventDefault();
  modalbg.style.display = "none";
  main.style.display = "initial";
});

const trapModal = (e) => {
  if (e.key === "Escape" || e.key === "esc") {
    modalbg.style.display = "none";
    main.style.display = "initial";
  }
};

modalbg.addEventListener("keydown", trapModal);

// ----- Form validation -----

// Name and Surname

let validName = (validSurname = validMail = validMessage = false);

const validText = (inputid, info) => {
  let msg;
  let valid = false;
  if (inputid.value.trim().length < 2) {
    msg = "Le champ doit contenir au moins 2 caract??res";
  } else if (/[0-9]/.test(inputid.value)) {
    msg = "Ce champ ne peut pas contenir de valeur num??rique";
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(inputid.value)) {
    msg = "Ce champ ne peut pas contenir de caract??res sp??ciaux";
  } else {
    msg = "";
    valid = true;
    console.log("Pr??nom/Nom: " + inputid.value);
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
    console.log("Email: " + inputEmail.value);
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
    msg = "Votre message doit contenir au moins 10 caract??res";
  } else {
    msg = "";
    valid = true;
    console.log("Message: " + inputMessage.value);
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
    infofirst.textContent = "Veuillez renseigner un pr??nom";
  }

  if (!validSurname) {
    infolast.textContent = "Veuillez renseigner un nom";
  }

  if (!validMail) {
    infoemail.textContent = "Veuillez renseigner un email";
  }

  if (!validMessage) {
    infomessage.textContent = "Ce champ ne peut ??tre vide";
  }

  if (validName && validSurname && validMail && validMessage) {
    modalbg.style.display = "none";
    main.style.display = "initial";
    resetForm();
  }
};

// Form validation reset

function resetForm() {
  form.reset();
  document.querySelectorAll("small").forEach((s) => (s.textContent = ""));
  validName = validSurname = validMail = validMessage = false;
}
