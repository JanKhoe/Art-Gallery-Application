


const DateAndTime = document.getElementById("dateofworkshop");
const Title = document.getElementById("Title");
const Description = document.getElementById("WriteReview");

function onCreateNewWorkshop(self){
  
  const workshopData ={
    "Title": Title.value,
    "Date": DateAndTime.value,
    "Description": Description.value
  }

  let req = new XMLHttpRequest();
  req.open("POST", "/newWorkshop");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(workshopData));
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      alert("New workshop created!");
    }
    if(this.readyState == 4 && this.status == 400){
      alert("ERROR: Workshop with the same name already created!");
    }
  }

  return false;
}