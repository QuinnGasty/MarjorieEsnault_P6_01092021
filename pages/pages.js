let userMedia = [];

const fetchMedia = async () => {
    await fetch("../photographers.json")
      .then((res) => res.json())
      .then((data) => (userMedia = data.media));
  
    console.log(userMedia);
  };

  fetchMedia();