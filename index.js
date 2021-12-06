const app = document.getElementById("app");
const skipToContent = document.querySelector(".content-banner");
const photographersTags = document.querySelectorAll(".tags");
const phTag = sessionStorage.getItem("phTag");

let usersData = [];

const fetchUsers = async () => {
  await fetch("./photographers.json")
    .then((res) => res.json())
    .then((data) => {
      usersDisplay(data.photographers);
      usersData = [...data.photographers];
      
      if (phTag !== null) {
        filterPhotographByTag(phTag);
        sessionStorage.removeItem("phTag");
      }
    })    
    .catch((error) => console.error(error));
};

fetchUsers();

// Users display

const usersDisplay = (photographerList) => {
  photographerList.forEach((photographer) => {
    userTags = [...photographer.tags];

    const userTagsHTML = userTags.map((tag) => `<a href="#" rel=${tag} class="tags">#${tag}</a>`);

    app.innerHTML += `
    <div class="card">
      <div class="card-link">
        <a href="./pages/photographer.html?photographerID=${photographer.id}">
        <img class="id-user" src="./images/PhotographersID/${
          photographer.portrait
        }" alt="photo de ${photographer.name}" />
        <h2>${photographer.name}</h2>
        </a>
      </div>
        <h5 class="location">${photographer.city}, ${photographer.country}</h5>
        <p class="tagline">${photographer.tagline}</p>
        <small>${photographer.price}€/jour</small>
        <span class="user-tags">${userTagsHTML.join(" ")}</span>
    </div>
    `;
  });
};

// Skip to content

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    document.querySelector(".content-banner").style.display = "block";
  } else {
    document.querySelector(".content-banner").style.display = "none";
  }
});

// Sort by tag

photographersTags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const newTag = e.target.getAttribute("rel");
    filterPhotographByTag(newTag);
  });
});

function filterPhotographByTag(tag) {
  const newPhotographers = usersData.filter(user => user.tags.includes(tag));
  app.innerHTML = "";
  usersDisplay(newPhotographers);
};