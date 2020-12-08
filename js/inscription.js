let submitButton = document.getElementById('submitButton')
let firstName = document.getElementById('firstName')
let lastName = document.getElementById('lastName')
let email = document.getElementById('email')
let password = document.getElementById('password')
let confirmPassword = document.getElementById('confirmPassword')
let inputs = document.getElementsByTagName('input')

function validPass(p1, p2){
  if(p1 == p2){
    return true;
  }
  else{
    return false;
  }
}

function addToDataBase(){
  
}

submitButton.addEventListener('click', function () {
  if(!(validPass(password.value, confirmPassword.value))){
    alert('Les mdp sont différents.')
  }
  for(elem of inputs){
    if(elem.value === ''){
      alert('le champ : ' + elem.id + ' n\'a pas été rempli !')
    }
  }

})
