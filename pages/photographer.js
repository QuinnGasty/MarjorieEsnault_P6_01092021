const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const photographerID = urlParams.get("photographerID");
const userName = document.getElementsByClassName("user-name");

let userData;

const getUser = async () => {
  await fetch("../photographers.json")
    .then((res) => res.json())
    .then(
      (data) =>
        (userData = data.photographers.filter((p) => p.id == photographerID))
    );

  console.log(userData);
};

const userDisplay = async () => {
  await getUser();

};

userDisplay();
