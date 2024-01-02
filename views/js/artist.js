

const LRPosts = document.getElementById("LRPosts");
const isUserOnOwnProfile = document.getElementById("isOnOwnProfile");

function init(){

  console.log(LRPosts);
  console.log(isUserOnOwnProfile);
  
  onLikesClicked();
  onDisplayFeed();
}

function submitOnEnter(event){
  if(event.which == 13 && !event.shiftKey){
    event.preventDefault();

    createWorkShop();
  }
}

function createWorkShop(){
  const date = document.getElementById("dateofworkshop");
  console.log(typeof(date.value));
}

function onLikesClicked(){
  const Likes = document.getElementById("Likes");
  if(!Likes.classList.contains("active")){
    Likes.classList.add("active");
  }
  const Reviews = document.getElementById("Reviews")
  if(Reviews.classList.contains("active")){
    Reviews.classList.remove("active");
  }

  const Enrolled = document.getElementById("Enrolled");
  if(Enrolled.classList.contains("active")){
    Enrolled.classList.remove("active")
  }

  let req = new XMLHttpRequest();
  req.open("GET", "/likedPosts");
  
  req.send();
  req.onreadystatechange= function(){
    if(this.readyState==4 && this.status==200){
      while(LRPosts.hasChildNodes()){
        LRPosts.removeChild(LRPosts.firstChild);
      }
      const strongSubtitle = document.createElement("strong");
      strongSubtitle.innerHTML = "Liked Posts";
      LRPosts.appendChild(strongSubtitle);
      
      console.log(this.responseText);
      const parsedData = JSON.parse(this.responseText);
      
      if(isUserOnOwnProfile.getAttribute("somebool") == "true"){
        Object.keys(parsedData).forEach(elem => {
          const anchorWrapper = document.createElement("div");
          anchorWrapper.className = "anchorWrapper";
          const unlikebutton = document.createElement("button");
          unlikebutton.innerHTML = "&#10005;";
          unlikebutton.id = "UnlikeButton";
          unlikebutton.className = elem;
          unlikebutton.setAttribute("onclick", "onUnlikedClicked(this)")
          const anchor = document.createElement("a");
          anchor.href = "/artwork/"+ elem;
          anchor.innerHTML = parsedData[elem];
          anchor.className = "SearchResult";
          anchorWrapper.appendChild(anchor);
          anchorWrapper.appendChild(unlikebutton);
          LRPosts.appendChild(anchorWrapper);
        });
      }
      else{
        Object.keys(parsedData).forEach(elem => {
        
          const anchorWrapper = document.createElement("div");
          anchorWrapper.className = "anchorWrapper";
          const anchor = document.createElement("a");
          anchor.href = "/artwork/"+ elem;
          anchor.innerHTML = parsedData[elem];
          anchor.className = "SearchResult";
          anchorWrapper.appendChild(anchor);
          LRPosts.appendChild(anchorWrapper);
        });
      }
      
    }
  };

}

function onUnlikedClicked(self){
  console.log(self.className);
  let req = new XMLHttpRequest();
  req.open("PUT", "/artwork/"+self.className+"/unlike");
  req.send();
  req.onreadystatechange = function(){
    if (this.readyState== 4 && this.status == 200){
      const parent = self.parentNode
      while(parent.hasChildNodes()){
        parent.removeChild(parent.firstChild);
      }
    }
  }
}

function onReviewsClicked(){
  const Reviews = document.getElementById("Reviews");
  if(!Reviews.classList.contains("active")){
    Reviews.classList.add("active");
  }
  const Likes = document.getElementById("Likes")
  if(Likes.classList.contains("active")){
    Likes.classList.remove("active");
  }

  const Enrolled = document.getElementById("Enrolled");
  if(Enrolled.classList.contains("active")){
    Enrolled.classList.remove("active")
  }

  let req = new XMLHttpRequest();
  req.open("GET", "/reviews");
  
  req.send();

  req.onreadystatechange= function(){
    if(this.readyState==4 && this.status==200){
      while(LRPosts.hasChildNodes()){
        LRPosts.removeChild(LRPosts.firstChild);
      }
      const strongSubtitle = document.createElement("strong");
      strongSubtitle.innerHTML = "Your Reviews";
      LRPosts.appendChild(strongSubtitle);
      
      console.log(this.responseText);
      const parsedData = JSON.parse(this.responseText);
      if(isUserOnOwnProfile.getAttribute("somebool") == "true"){
        Object.keys(parsedData).forEach(elem => {
          console.log(elem);
          let artworkId = elem
          Object.keys(parsedData[elem]).forEach(elem => {
            const CommentBox = document.createElement("div");
            const anchorWrapper = document.createElement("div");
            anchorWrapper.className = "anchorWrapper"
            CommentBox.className = "CommentBox";
            
            const ArtTitle = document.createElement("a");
            ArtTitle.href = "/artwork/" + artworkId;
            ArtTitle.className = "ArtTitles";
            ArtTitle.innerHTML = parsedData[artworkId][elem].name;
            CommentBox.appendChild(ArtTitle);
            CommentBox.appendChild(document.createElement("br"));
  
            const reviewText = document.createElement("p");
            reviewText.innerHTML = parsedData[artworkId][elem].review;
            reviewText.className = "reviewText";

            const unlikebutton = document.createElement("button");
            unlikebutton.innerHTML = "&#10005;";
            unlikebutton.id = "UnlikeButton";
            unlikebutton.classList.add(artworkId);
            unlikebutton.setAttribute("onclick", "onrmvReview(this)");

            CommentBox.appendChild(reviewText);
            anchorWrapper.appendChild(CommentBox);
            anchorWrapper.appendChild(unlikebutton);
  
            LRPosts.appendChild(anchorWrapper);
          });
        });
      }
      else{
        Object.keys(parsedData).forEach(elem => {
          console.log(elem);
          let artworkId = elem
          Object.keys(parsedData[elem]).forEach(elem => {
            const CommentBox = document.createElement("div");
            CommentBox.className = "CommentBox";
            
            const ArtTitle = document.createElement("a");
            ArtTitle.href = "/artwork/" + artworkId;
            ArtTitle.className = "ArtTitles";
            ArtTitle.innerHTML = parsedData[artworkId][elem].name;
            CommentBox.appendChild(ArtTitle);
            CommentBox.appendChild(document.createElement("br"));
  
            const reviewText = document.createElement("p");
            reviewText.innerHTML = parsedData[artworkId][elem].review;
            reviewText.className = "reviewText";
            CommentBox.appendChild(reviewText);
  
            LRPosts.appendChild(CommentBox);
          });
        });
      }
      
    }
  };
}

function onEnrolledClicked(){
  const Likes = document.getElementById("Likes");
  if(Likes.classList.contains("active")){
    Likes.classList.remove("active");
  }
  const Reviews = document.getElementById("Reviews");
  if(Reviews.classList.contains("active")){
    Reviews.classList.remove("active");
  }

  const Enrolled = document.getElementById("Enrolled");
  if(!Enrolled.classList.contains("active")){
    Enrolled.classList.add("active")
  }

  let req = new XMLHttpRequest();
  req.open("GET", "/enrolled");
  
  req.send();

  req.onreadystatechange= function(){
    if(this.readyState==4 && this.status==200){
      while(LRPosts.hasChildNodes()){
        LRPosts.removeChild(LRPosts.firstChild);
      }
      const strongSubtitle = document.createElement("strong");
      strongSubtitle.innerHTML = "Your Enrolled Workshops";
      LRPosts.appendChild(strongSubtitle);
      
      console.log(this.responseText);
      const parsedData = JSON.parse(this.responseText);

      if(isUserOnOwnProfile.getAttribute("somebool") == "true"){
        Object.keys(parsedData).forEach(elem => {
          const anchorWrapper = document.createElement("div");
          anchorWrapper.className = "anchorWrapper";
          const unlikebutton = document.createElement("button");
          unlikebutton.innerHTML = "&#10005;";
          unlikebutton.id = "UnlikeButton";
          unlikebutton.className = parsedData[elem]["id"];
          unlikebutton.setAttribute("onclick", "onUnenrollClicked(this)")
          const anchor = document.createElement("a");
          anchor.href = "/workshop/"+ parsedData[elem]["id"];
          anchor.innerHTML = parsedData[elem].Title;
          anchor.className = "SearchResult";
          anchorWrapper.appendChild(anchor);
          anchorWrapper.appendChild(unlikebutton);
          LRPosts.appendChild(anchorWrapper);
        });
      }
      else{
        Object.keys(parsedData).forEach(elem => {

          const anchorWrapper = document.createElement("div");
          anchorWrapper.className = "anchorWrapper";
          const anchor = document.createElement("a");
          anchor.href = "/workshop/"+ parsedData[elem]["id"];
          anchor.innerHTML = parsedData[elem].Title;
          anchor.className = "SearchResult";
          anchorWrapper.appendChild(anchor);
          LRPosts.appendChild(anchorWrapper);
        });
      }
      
    }
  };
}

function onFollow(){
  
  let req = new XMLHttpRequest();
  req.open("PUT", "/follow");
  req.send();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      const followButton = document.getElementById("follow-button");
      const parent = followButton.parentElement
      const followingButton = document.createElement("button");
      followingButton.setAttribute("onclick", "onUnFollow()");
      followingButton.id = "following-button";
      followingButton.innerHTML = "Following";
      parent.insertBefore(followingButton, followButton);
      parent.removeChild(followButton);
      const DisplayFollowers = document.getElementById("DisplayFollowers");
      let followerCount = parseInt(DisplayFollowers.innerHTML.charAt(DisplayFollowers.innerHTML.length-1));
      console.log(followerCount);
      DisplayFollowers.innerHTML = "Followers: " + (followerCount + 1).toString();
    }
  }

}

function onUnFollow(){
  
  let req = new XMLHttpRequest();
  req.open("PUT", "/unfollow");
  req.send();
  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      const followingButton = document.getElementById("following-button");
      const parent = followingButton.parentElement
      const followButton = document.createElement("button");
      followButton.setAttribute("onclick", "onFollow()");
      followButton.id = "follow-button";
      followButton.innerHTML = "Follow +";
      parent.insertBefore(followButton, followingButton);
      parent.removeChild(followingButton);
      const DisplayFollowers = document.getElementById("DisplayFollowers");
      let followerCount = parseInt(DisplayFollowers.innerHTML.charAt(DisplayFollowers.innerHTML.length-1));
      console.log(followerCount);
      DisplayFollowers.innerHTML = "Followers: " + (followerCount - 1).toString();

    }
  }
}



function onLogOut(){
  console.log("logout clicked!");
  let req = new XMLHttpRequest();
  req.open("PUT", "/logout");
  req.send();
  req.onreadystatechange= function(){
    if(this.readyState == 4 && this.status == 200){
      alert("Logged Out!");
      window.location.href = "/";
    }
    else{
      console.log("404");
    }
  }
}

function onUpgrade(){
  let req = new XMLHttpRequest();
  
  req.open("PUT", "/upgrade");
  req.send();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      alert("Congrats! You are now an artist");
      window.location.reload();
    }
    else if (this.readyState == 4 && this.status==400){
      alert("You need at least one artwork to be an artist!");
      window.location.href = "/create?#";
    }
  }
}

function onDowngrade(){
  let req = new XMLHttpRequest();
  req.open("PUT", "/downgrade");
  req.send();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      alert("Congrats! You are now a Patron");
      window.location.reload();
    }
  }
}

function onDisplayFollowing(){
  const Following = document.getElementById("DisplayFollowing");
  if(!Following.classList.contains("active")){
    Following.classList.add("active");
  }
  
  const Feed = document.getElementById("DisplayFeed");
  if(Feed.classList.contains("active")){
    Feed.classList.remove("active");
  }

  const Followers = document.getElementById("DisplayFollowers");
  if(Followers != null && Followers.classList.contains("active")){
    Followers.classList.remove("active");
  }

  const FeedPosts = document.getElementById("Feed");

  while(FeedPosts.hasChildNodes()){
    FeedPosts.removeChild(FeedPosts.firstChild);
  }

  let req = new XMLHttpRequest();

  req.open("GET", "/getFollowing");
  req.send();

  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      console.log(req.responseText);
      let parsedData = JSON.parse(req.responseText);
      for(let i in parsedData){
        const anchorWrapper = document.createElement("div");
        anchorWrapper.className = "anchorWrapper";
        const anchor = document.createElement("a");
        anchor.href = "/artists/"+ parsedData[i]["userId"];
        anchor.innerHTML = parsedData[i]["userName"];
        anchor.className = "SearchResult";
        anchorWrapper.appendChild(anchor);
        FeedPosts.appendChild(anchorWrapper);
      }
    }
  }
}

function onDisplayFeed(){
  const Following = document.getElementById("DisplayFollowing");
  if(Following.classList.contains("active")){
    Following.classList.remove("active");
  }
  
  const Feed = document.getElementById("DisplayFeed");
  if(!Feed.classList.contains("active")){
    Feed.classList.add("active");
  }

  const Followers = document.getElementById("DisplayFollowers");
  if(Followers != null && Followers.classList.contains("active")){
    Followers.classList.remove("active");
  }

  const FeedPosts = document.getElementById("Feed");

  while(FeedPosts.hasChildNodes()){
    FeedPosts.removeChild(FeedPosts.firstChild);
  }

  req = new XMLHttpRequest();
  req.open("GET", "/getFeed");
  req.send();

  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      console.log(req.responseText);
      let parsedData = JSON.parse(req.responseText);
      for(let i in parsedData){
        if(parsedData[i]["PostType"] == 1){
          const anchorWrapper = document.createElement("div");
          anchorWrapper.className = "posts";
          const anchor = document.createElement("a");
          anchor.href = "/artwork/"+ parsedData[i]["id"];
          anchor.innerHTML = "(NEW artwork) <br>"+parsedData[i]["Title"] + "<br>By: " + parsedData[i]["Artist"];
          anchor.className = "SearchResult";
          anchorWrapper.appendChild(anchor);
          FeedPosts.appendChild(anchorWrapper);
        }
        else if(parsedData[i]["PostType"] == 2){
          const anchorWrapper = document.createElement("div");
          anchorWrapper.classname = "posts";
          const anchor = document.createElement("a");
          anchor.href = "/workshop/" + parsedData[i]["id"];
          anchor.innerHTML = "(NEW workshop) <br>" + parsedData[i]["Title"] + "<br>By: " + parsedData[i]["Artist"];
          anchor.className = "SearchResult";
          anchorWrapper.appendChild(anchor);
          FeedPosts.appendChild(anchorWrapper);
        }
      }
    }
  }

  
}

function onDisplayFollowers(){
  const Following = document.getElementById("DisplayFollowing");
  if(Following.classList.contains("active")){
    Following.classList.remove("active");
  }
  
  const Feed = document.getElementById("DisplayFeed");
  if(Feed.classList.contains("active")){
    Feed.classList.remove("active");
  }

  const Followers = document.getElementById("DisplayFollowers");
  if(!Followers.classList.contains("active")){
    Followers.classList.add("active");
  }

  const FeedPosts = document.getElementById("Feed");

  while(FeedPosts.hasChildNodes()){
    FeedPosts.removeChild(FeedPosts.firstChild);
  }

  req = new XMLHttpRequest();
  req.open("GET", "/getFollowers");
  req.send();

  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      console.log(req.responseText);
      let parsedData = JSON.parse(req.responseText);
      for(let i in parsedData){
        console.log(i)
        const anchorWrapper = document.createElement("div");
        anchorWrapper.className = "anchorWrapper";
        const anchor = document.createElement("a");
        anchor.href = "/artists/"+ parsedData[i]["userId"];
        anchor.innerHTML = parsedData[i]["userName"];
        anchor.className = "SearchResult";
        anchorWrapper.appendChild(anchor);
        FeedPosts.appendChild(anchorWrapper);
      }
    }
  }
}

function onrmvReview(self){
  let requestData = {};
  const anchorWrapper = self.parentElement;
  const CommentBox = anchorWrapper.children[0];
  console.log(CommentBox.children[2]);
  requestData["review"] = CommentBox.children[2].innerHTML;
  let req = new XMLHttpRequest();
  req.open("POST", "/artwork/" + self.className + "/unreview");
  req.setRequestHeader("content-type", "application/json");
  req.send(JSON.stringify(requestData));
  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      anchorWrapper.parentElement.removeChild(anchorWrapper);
    }
  }
}

function onUnenrollClicked(self){
  let req = new XMLHttpRequest();
  req.open("PUT", "/unenroll/"+self.className);
  req.setRequestHeader("content-type", "application/json");
  req.send();
  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      const parent = self.parentElement;
      parent.parentElement.removeChild(parent);
    }
  }
}