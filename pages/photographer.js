// DOM elements

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const photographerID = urlParams.get("photographerID");
const userName = document.getElementById("user-name");
const userLocation = document.querySelector(".user-location");
const userTagline = document.querySelector(".user-tagline");
const userTags = document.querySelector(".user-tags");
const userID = document.querySelector(".user-id");
const userPics = document.querySelector(".user-medias");
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalSubmitClose = document.querySelector("#btn-submit-close");
const formData = document.querySelectorAll(".formData");
const form = document.getElementById("contactform");

let userData;
let userMedia;

// fetch JSON - Users info

const getUser = async () => {
  await fetch("../photographers.json")
    .then((res) => res.json())
    .then(
      (data) =>
        (userData = data.photographers.filter((p) => p.id == photographerID))
    );
  console.log(userData);

  userName.textContent += userData[0].name;
  userLocation.textContent += userData[0].city;
  userTagline.textContent += userData[0].tagline;
  userTags.textContent += "#" + userData[0].tags.join(" #");

  userID.innerHTML += `<img
    src="../images/PhotographersID/${userData[0].portrait}"
    alt="photo de Ellie Rose Wilkens"
    width="200px"
    class="user-pic"
    />`;
};

getUser();

// fetch JSON - Users media

const getMedia = async () => {
  await fetch("../photographers.json")
    .then((res) => res.json())
    .then(
      (data2) =>
        (userMedia = data2.media.filter(
          (m) => m.photographerId == photographerID
        ))
    );
  console.log(userMedia);
};

getMedia();

const mediaDisplay = async () => {
  await getMedia();

  userMedia.forEach((media) => {
    userPics.innerHTML += `
    <div class="media-content">
      <div class="media">
          ${mediaFactory(media)}
        </div>
        <div class="media-infos">
          <small class="media-name">${media.title}</small>
          <p class="media-likes">
            ${media.likes} <span class="number-likes"><i class="fas fa-heart"></i></span>
          </p>
        </div>
      </div>`;
  });
};

// Users media - Factory Method

function mediaFactory(med) {
  if(med.hasOwnProperty("image")) {
    return `<img
    src="../images/${med.photographerId}/${med.image}"
    alt=""
    class="media-img"
    />`
  } else if(med.hasOwnProperty("video")) {
    return `<video controls>
    <source src="../images/${med.photographerId}/${med.video}" type="video/mp4">
    </video>`
  }
}

mediaDisplay();

// modal display

modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

function launchModal() {
  modalbg.style.display = "block";
  document.querySelector(".modal-body").style.display = "block";
  document.querySelector(".btn-mobile").style.display = "none";
}

modalSubmitClose.addEventListener("click", () => {
  modalbg.style.display = "none";
  document.querySelector(".btn-mobile").style.display = "block";
})

// ----- Form validation -----

// Name and Surname

let validName = validSurname = validMail = validMessage = false;

const validText = (inputid, info) => {
  let msg;
  let valid = false;
  if (inputid.value.trim().length < 2) {
    msg = 'Le champ doit contenir au moins 2 caractères';
  } else if (/[0-9]/.test(inputid.value)) {
    msg = 'Ce champ ne peut pas contenir de valeur numérique';
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(inputid.value)) {
    msg = 'Ce champ ne peut pas contenir de caractères spéciaux'
  } else {
    msg = '';
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
    msg = '';
    valid = true;
  } else {
    msg = 'Adresse non valide'
  }
  info.textContent = msg;
  return valid;
};

form.email.addEventListener("change", () => {
  validMail = validEmail(email, infoemail);
})

// Message

const validContact = (inputMessage, info) => {
  let msg;
  let valid = false;
  if (inputMessage.value.trim().length < 10) {
    msg = 'Votre message doit contenir au moins 10 caractères'
  } else {
    msg = '';
    valid = true;
  }
  info.textContent = msg;
  return valid;
};

form.message.addEventListener("change", () => {
  validMessage = validContact(message, infomessage)
})