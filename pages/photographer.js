const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const photographerID = urlParams.get("photographerID");
const userName = document.getElementById("user-name");
const userLocation = document.querySelector(".user-location");
const userTagline = document.querySelector(".user-tagline");
const userTags = document.querySelector(".user-tags");
const userID = document.querySelector(".user-id")

let userData = [];

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
/>`
};


getUser();
