

function onEnroll(){
  const Enroll = document.getElementById("Enroll");
  let workshopId = window.location.href.split("/")
  console.log(workshopId[workshopId.length-1]);
  let req = new XMLHttpRequest();
  req.open("PUT", "/enroll/"+workshopId[workshopId.length-1]);
  req.send();
  req.onreadystatechange = function(){
    if(this.readyState== 4 && this.status== 200){
      const unEnroll = document.createElement("button");
      unEnroll.setAttribute("onclick", "onUnEnroll()");
      unEnroll.className = "SearchResult";
      unEnroll.innerHTML = "UnEnroll?";
      unEnroll.id = "Unenroll";
      const parent = Enroll.parentNode;
      parent.replaceChild(unEnroll, Enroll);
    }
  }
}

function onUnEnroll(){
  const UnEnroll = document.getElementById("Unenroll");
  let workshopId = window.location.href.split("/")
  console.log(workshopId[workshopId.length-1]);
  let req = new XMLHttpRequest();
  req.open("PUT", "/unenroll/"+workshopId[workshopId.length-1]);
  req.send();
  req.onreadystatechange = function(){
    if(this.readyState== 4 && this.status== 200){
      const Enroll = document.createElement("button");
      Enroll.setAttribute("onclick", "onEnroll()");
      Enroll.className = "SearchResult";
      Enroll.innerHTML = "Enroll?";
      Enroll.id = "Enroll";
      const parent = UnEnroll.parentNode;
      parent.replaceChild(Enroll, UnEnroll);
    }
  }
}