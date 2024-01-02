
const Username = document.getElementById("username");
const Password = document.getElementById("password");

function onSignUp(){

  const signUpData = {
    "Username": Username.value,
    "Password": Password.value
  };

  if(signUpData.Username == "" || signUpData.Password == ""){
    alert("Please fill out all values!");
    return;
  }


  console.log("SIGNUP CLICKED");
  let req = new XMLHttpRequest();
  
  req.open("POST", "/signup");
  req.onreadystatechange= function(){
    if(this.readyState==4 && this.status==200){
      alert("User Created Successfully. You are now logged in");
      window.location.href = "/";
    }
    if(this.readyState==4 && this.status==400){
      alert("Username already exists! If this is your account Sign in instead with your password");
    }
  }
  console.log(signUpData);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(signUpData))
}

function onSignIn(){

  const signInData = {
    "Username": Username.value,
    "Password": Password.value
  };

  if(signInData.Username == "" || signInData.Password == ""){
    alert("Please fill out all values!");
    return;
  }

  let req = new XMLHttpRequest();
  
  req.open("POST", "/signin");
  req.onreadystatechange= function(){
    if(this.readyState==4 && this.status==200){
      alert("Logged In!");
      window.location.href = "/";
    }
    else if(this.readyState == 4 && this.status==400){
      alert("Username or Password Incorrect!");
    }
  }
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(signInData));
}