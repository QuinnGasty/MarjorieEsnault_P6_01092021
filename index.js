// https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Front-End+V2/P5+Javascript+%26+Accessibility/FishEyeData.json

const app = document.getElementById("app");
const skipToContent = document.querySelector(".content-banner");
const photographersTags = document.querySelectorAll(".tags");
let usersData = [];

const fetchUsers = async () => {
  await fetch("./photographers.json")
    .then((res) => res.json())
    .then((data) => {
      usersDisplay(data.photographers);
      usersData = [...data.photographers]
    });

  //console.log(usersData);
};

fetchUsers();

photographersTags.forEach(tag => {
  tag.addEventListener("click", (e) => {
    const newTag = (e.target.getAttribute("tag"));
    filterPhotographByTag(newTag)
  })
})

const usersDisplay = (photographerList) => {
  photographerList.forEach((photographer) => {
    userTags = [...photographer.tags];

    const userTagsHTML = userTags.map((tag) => `<a href="#">#${tag}</a>`);

    app.innerHTML += `
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
    `;
  });
};

/*window.addEventListener("scroll", () => {
  if (window.scrollY > 120) {
    console.log("120")
      skipToContent.style.top = 0;
      document.querySelector(".content-banner").style.display = "block";
  } else {
    console.log("-50")
      skipToContent.style.top = "-50px";
      document.querySelector(".content-banner").style.display = "none";
  }
})*/

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    document.querySelector(".content-banner").style.display = "block";
  } else {
    document.querySelector(".content-banner").style.display = "none";
    document.querySelector(".content-banner").focus(); // remove ?
  }
});

function filterPhotographByTag(tag) {
  const newPhotographers = usersData.filter()
}
