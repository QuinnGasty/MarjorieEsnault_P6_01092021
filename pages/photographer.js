const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const photographerID = urlParams.get("photographerID");
const userName = document.getElementById("user-name");
const userLocation = document.querySelector(".user-location");
const userTagline = document.querySelector(".user-tagline");
const userTags = document.querySelector(".user-tags");
const userID = document.querySelector(".user-id");
const userPics = document.querySelector(".user-medias")

let userData;
let userMedia;

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

  userMedia.forEach(media => {
    userPics.innerHTML += `
      <div class="media">
          <img
            src="../images/${media.photographerId}/${media.image}"
            alt=""
            class="media-img"
          />
        </div>
        <div class="media-infos">
          <small class="media-name">${media.title}</small>
          <p class="media-likes">
            ${media.likes} <span class="number-likes"><i class="fas fa-heart"></i></span>
          </p>
        </div>`
  });
}

mediaDisplay();
