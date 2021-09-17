// https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Front-End+V2/P5+Javascript+%26+Accessibility/FishEyeData.json

const app = document.getElementById("app");
let usersData = [];

const fetchUsers = async () => {
  await fetch("./photographers.json")
    .then((res) => res.json())
    .then((data) => (usersData = data.photographers));

  console.log(usersData);
};

const usersDisplay = async () => {
  await fetchUsers();

  usersData.forEach(photographer => {
    userTags = [...photographer.tags]

    const userTagsHTML = userTags.map(tag => `#${tag}`)

    app.innerHTML += 
    `
    <div class="card">
      <div class="card-link">
        <a href="./pages/photographer.html?photographerID=${photographer.id}">
        <img class="id-user" src=./images/PhotographersID/${
          photographer.portrait
        } alt="photo de ${photographer.name}" />
        <h2>${photographer.name}</h2>
        </a>
      </div>
        <h5 class="location">${photographer.city}, ${photographer.country}</h5>
        <p class="tagline">${photographer.tagline}</p>
        <small>${photographer.price}€/jour</small>
        <span class="user-tags">${userTagsHTML.join(" ")}</span>
    </div>
    `
  })
}

usersDisplay();
