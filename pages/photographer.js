const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const photographerID = urlParams.get("photographerID");

let userData;

const getUser = async () => {
  await fetch("../photographers.json")
    .then((res) => res.json())
    .then((data) => (userData = data.photographers.filter(
      p => p.id == photographerID
    )));

  console.log(userData);
};

getUser();