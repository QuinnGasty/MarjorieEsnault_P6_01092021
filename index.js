// https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Front-End+V2/P5+Javascript+%26+Accessibility/FishEyeData.json

const app = document.getElementById("app")
let userData = [];
let userTags = [];

const fetchUser = async () => {
  await fetch("./photographers.json")
    .then((res) => res.json())
    .then((data) => (userData = data.photographers));

  console.log(userData);
};

const userDisplay = async () => {
  await fetchUser();

  app.innerHTML = userData
    .map(
      (user) =>
        `
        <div class="card">
            <img class="id-user" src=${user.portrait} alt="photo de ${user.name}">
            <h3>${user.name}</h3>
            <h5 class="location">${user.city}, ${user.country}</h5>
            <p class="tagline">${user.tagline}</p>
            <small>${user.price}€/jour</small>
            <bold>${user.tags}</bold>
        </div>
        `
    )
    .join("");
};

userDisplay();
