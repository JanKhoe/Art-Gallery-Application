
const SearchResults = document.getElementById("SearchResults");
let parsedData;
let art = 0;
let pageNumber = 1;

let Pageindicator;

function init(){
  getSearchResults();
}

function getSearchResults(){
  console.log("Start Search");

  const ArtTitle = document.getElementById("ArtTitle");
  const Artist = document.getElementById("Artist");
  const Category = document.getElementById("Category");
  const Medium = document.getElementById("Medium");

  const SearchQueryData = [];

  if(ArtTitle.value != ""){
    SearchQueryData.push({
      "Title": {"$regex": ".*" + ArtTitle.value + ".*", "$options": "i"}
    });
  }
  if(Artist.value != ""){
    SearchQueryData.push({
      "Artist": {"$regex": ".*" + Artist.value + ".*", "$options": "i"}
    });
  }

  if(Category.value != ""){
    SearchQueryData.push({
      "Category": {"$regex": ".*" + Category.value + ".*", "$options": "i"}
    });
  }
  
  if(Medium.value != ""){
    SearchQueryData.push({
      "Medium": {"$regex": ".*" + Medium.value + ".*", "$options": "i"}
    })
  }

  let req = new XMLHttpRequest();

  //This is a POST request because I need to be able to send a body
  req.open("POST", "/artworks");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(SearchQueryData));

  req.onreadystatechange = function(){
    
    if(this.readyState == 4 && this.status == 200){
      pageNumber = 1;

      while(SearchResults.children.length > 0){
        SearchResults.removeChild(SearchResults.firstChild);
      }

      console.log("data: " + this.responseText);
			console.log("typeof: " + typeof this.responseText);
      
      console.log(typeof(this.responseText));
      parsedData = JSON.parse(this.responseText);
      console.log(parsedData.length);
      
      for(art = 0; art < 10 && art < parsedData.length; art++){

        if ( art > parsedData.length){
          break;
        }
        const anchorWrapper = document.createElement("div");
        anchorWrapper.className = "anchorWrapper";
        const anchor = document.createElement("a");
        anchor.href = "/artwork/"+parsedData[art]["_id"].toString();
        anchor.innerHTML = parsedData[art]["Title"];
        anchor.className = "SearchResult";
        anchorWrapper.appendChild(anchor);
        SearchResults.appendChild(anchorWrapper);
      }

      SearchResults.appendChild(document.createElement("br"));

      if(parsedData.length > 10){
        const LeftBtn = document.createElement("button");
        const RightBtn = document.createElement("button");

        LeftBtn.className = "paginationBtn";
        RightBtn.className = "paginationBtn";
        RightBtn.setAttribute("onclick", "onRightButtonClicked()");
        LeftBtn.setAttribute("onclick", "onLeftButtonClicked()");

        const iconsHolder = document.createElement("div");
        iconsHolder.id = "iconHolder";

        const RightIcon = document.createElement("i");
        RightIcon.className = "rightArrow";
        const LeftIcon = document.createElement("i");
        LeftIcon.className = "leftArrow";

        Pageindicator = document.createElement("p");
        Pageindicator.className = "pageNumber";
        Pageindicator.innerHTML = pageNumber;

        LeftBtn.appendChild(LeftIcon);
        RightBtn.appendChild(RightIcon);

        iconsHolder.appendChild(LeftBtn);
        iconsHolder.appendChild(Pageindicator);
        iconsHolder.appendChild(RightBtn);
        

        SearchResults.appendChild(iconsHolder);
      }


    }
  }
  
}


function onRightButtonClicked(){
  if(pageNumber <  Math.ceil(parsedData.length/10)){
    console.log("right button clicked");
    pageNumber ++;

    while(SearchResults.children.length > 0){
      SearchResults.removeChild(SearchResults.firstChild);
    }

    
    for(art = (pageNumber-1)*10; art < (pageNumber*10) && art < parsedData.length; art++){
      const anchorWrapper = document.createElement("div");
      anchorWrapper.className = "anchorWrapper";
      const anchor = document.createElement("a");
      anchor.href = "/artwork/"+parsedData[art]["_id"].toString();
      anchor.innerHTML = parsedData[art]["Title"];
      anchor.className = "SearchResult";
      anchorWrapper.appendChild(anchor);
      SearchResults.appendChild(anchorWrapper);
    }

    SearchResults.appendChild(document.createElement("br"));

    if(parsedData.length > 10){
      const LeftBtn = document.createElement("button");
      const RightBtn = document.createElement("button");

      LeftBtn.className = "paginationBtn";
      RightBtn.className = "paginationBtn";
      RightBtn.setAttribute("onclick", "onRightButtonClicked()");
      LeftBtn.setAttribute("onclick", "onLeftButtonClicked()");

      const iconsHolder = document.createElement("div");
      iconsHolder.id = "iconHolder";

      const RightIcon = document.createElement("i");
      RightIcon.className = "rightArrow";
      const LeftIcon = document.createElement("i");
      LeftIcon.className = "leftArrow";

      Pageindicator = document.createElement("p");
      Pageindicator.className = "pageNumber";
      Pageindicator.innerHTML = pageNumber;

      LeftBtn.appendChild(LeftIcon);
      RightBtn.appendChild(RightIcon);

      iconsHolder.appendChild(LeftBtn);
      iconsHolder.appendChild(Pageindicator);
      iconsHolder.appendChild(RightBtn);
      

      SearchResults.appendChild(iconsHolder);
    }
  }
}

function onLeftButtonClicked(){ 
  if(pageNumber > 1){
    console.log("Left button clicked");
    pageNumber--;

    while(SearchResults.children.length > 0){
      SearchResults.removeChild(SearchResults.firstChild);
    }
    
    for(art = (pageNumber-1)*10; art < (pageNumber*10) && art < parsedData.length; art++){
      const anchorWrapper = document.createElement("div");
      anchorWrapper.className = "anchorWrapper";
      const anchor = document.createElement("a");
      anchor.href = "/artwork/"+parsedData[art]["_id"].toString();
      anchor.innerHTML = parsedData[art]["Title"];
      anchor.className = "SearchResult";
      anchorWrapper.appendChild(anchor);
      SearchResults.appendChild(anchorWrapper);
    }

    SearchResults.appendChild(document.createElement("br"));

    if(parsedData.length > 10){
      const LeftBtn = document.createElement("button");
      const RightBtn = document.createElement("button");

      LeftBtn.className = "paginationBtn";
      RightBtn.className = "paginationBtn";
      RightBtn.setAttribute("onclick", "onRightButtonClicked()");
      LeftBtn.setAttribute("onclick", "onLeftButtonClicked()");

      const iconsHolder = document.createElement("div");
      iconsHolder.id = "iconHolder";

      const RightIcon = document.createElement("i");
      RightIcon.className = "rightArrow";
      const LeftIcon = document.createElement("i");
      LeftIcon.className = "leftArrow";

      Pageindicator = document.createElement("p");
      Pageindicator.className = "pageNumber";
      Pageindicator.innerHTML = pageNumber;

      LeftBtn.appendChild(LeftIcon);
      RightBtn.appendChild(RightIcon);

      iconsHolder.appendChild(LeftBtn);
      iconsHolder.appendChild(Pageindicator);
      iconsHolder.appendChild(RightBtn);
      

      SearchResults.appendChild(iconsHolder);
    }
    
  }
  
  
}