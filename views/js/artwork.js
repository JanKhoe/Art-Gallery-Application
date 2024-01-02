


const LikeCounter = document.getElementById("LikeCounter");
const TextArea = document.getElementById("WriteReview");


function init(){
  TextArea.addEventListener("keydown", submitOnEnter)
}

function submitOnEnter(event){
  if(event.which == 13 && !event.shiftKey){
    event.preventDefault();

    PostReview();
  }
}


function PostReview(){
  console.log(TextArea.value);
  

  let req = new XMLHttpRequest();
  req.open("POST", window.location + "/review");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({"Review": TextArea.value}));
  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      const parsedData = JSON.parse(this.responseText);
      console.log(parsedData);

      const SingleReview = document.createElement("div")
      SingleReview.className = "singleReview";
      
      const ReviewWrapper = document.createElement("div");
      ReviewWrapper.className = "ReviewWrapper " + parsedData["id"] + " " + parsedData["index"] + " filler " + "filler2" + " " + parsedData["ArtworkId"];
      const p = document.createElement("p");
      const u = document.createElement("u");
      u.innerHTML = parsedData["Name"];
      p.appendChild(u);
      const review = document.createElement("p");
      review.innerHTML = parsedData["Review"];
      SingleReview.appendChild(p);
      SingleReview.appendChild(review);
      ReviewWrapper.appendChild(SingleReview);
      
      const AllReviews = document.getElementById("Reviews");
      AllReviews.appendChild(ReviewWrapper);

      const unReviewBtn = document.createElement("button");
      unReviewBtn.className = "unReviewButton";
      unReviewBtn.innerHTML = "&#10005;";
      unReviewBtn.setAttribute("onclick", "rmvReview(this)");
      ReviewWrapper.appendChild(unReviewBtn);
      TextArea.value = "";
    }
  }
  




}

function onUnlikeClicked(){
  LikeCounter.innerHTML = parseInt(LikeCounter.innerHTML) - 1;
  const Heart = document.getElementById("heart-liked");
  const parent = Heart.parentElement
  const GreyHeart = document.createElement("a");
  GreyHeart.innerHTML = "&hearts;";
  GreyHeart.setAttribute("onclick", "onLikeClicked()");
  GreyHeart.id = "heart-grey";
  parent.replaceChild(GreyHeart, Heart);
  let req = new XMLHttpRequest();
  const url = window.location;
  req.open("PUT", url + "/unlike");
  req.send();
}

function onLikeClicked(){
  LikeCounter.innerHTML = parseInt(LikeCounter.innerHTML) + 1;
  const GreyHeart = document.getElementById("heart-grey");
  const parent = GreyHeart.parentElement
  const Heart = document.createElement("a");
  Heart.innerHTML = "&hearts;";
  Heart.setAttribute("onclick", "onUnlikeClicked()");
  Heart.id = "heart-liked";
  parent.replaceChild(Heart, GreyHeart);
  let req = new XMLHttpRequest();
  const url = window.location;
  req.open("PUT", url + "/like");
  req.send();
}


function rmvReview(self){
  console.log(self.parentElement.classList[1]);
  const parent = self.parentElement
  let requestData = {};
  let x = document.createElement("a");
  x.childNodes
  console.log(parent.childNodes[0].childNodes[1].innerHTML);
  requestData["review"] = parent.childNodes[0].childNodes[1].innerHTML;

  requestData["name"] = parent.classList[4];

  let req = new XMLHttpRequest();
  req.open("POST", "/artwork/" + parent.classList[5] + "/unreview");
  req.setRequestHeader("content-type", "application/json");
  req.send(JSON.stringify(requestData));

  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      parent.parentElement.removeChild(parent);
    }
    
  }

}