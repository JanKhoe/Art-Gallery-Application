

function checkValid(){
  const subbtn = document.getElementById("subbtn");
  if (subbtn.closest('form').checkValidity){
    console.log("Should submit");
    subbtn.closest('form').submit();
  }
}




function onCreateArtwork(){
  console.log("done done done");

  const Poster = document.getElementById("Poster");
  const Title = document.getElementById("ArtTitle");
  const Medium = document.getElementById("Medium");
  const Year = document.getElementById("Year");
  const Category = document.getElementById("Category");
  const Description = document.getElementById("Description");

  const newArtWorkData = {
    "Poster": Poster.value,
    "Title": Title.value,
    "Year": Year.value,
    "Category": Category.value,
    "Medium": Medium.value,
    "Description": Description.value
  }

  let req = new XMLHttpRequest();
  req.open("POST", "/newArtwork");
  req.setRequestHeader("content-type", "application/json");
  req.send(JSON.stringify(newArtWorkData));
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      alert("New artwork created");
    }
    else if(this.readyState == 4 && this.status == 201){
      alert("Congrats you are now an artist!");
    }
    else if(this.readyState == 4 && this.status == 400){
      alert("ERROR: Artwork with the same name already exists!");
    }
  }
}