// https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Front-End+V2/P5+Javascript+%26+Accessibility/FishEyeData.json

const app = document.getElementById("app");
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
          <div class="card-link">
            <a href="./pages/${user.page}">
            <img class="id-user" src=${user.portrait} alt="photo de ${
          user.name
        }" />
            <h2>${user.name}</h2>
            </a>
          </div>
            <h5 class="location">${user.city}, ${user.country}</h5>
            <p class="tagline">${user.tagline}</p>
            <small>${user.price}€/jour</small>
            <bold>${user.tags.join(" ")}</bold>
        </div>
        `
    )
    .join("");
};

userDisplay();
