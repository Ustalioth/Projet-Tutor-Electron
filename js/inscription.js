$(document).ready(function () {
  $('#submitButton').click(function () {
    var firstName = $('#firstName').val()
    var lastName = $('#lastName').val()
    var email = $('#email').val()
    var password = $('#password').val()
    var confirmPassword = $('#confirmPassword').val()
    if (
      firstName == '' ||
      lastName == '' ||
      email == '' ||
      password == '' ||
      confirmPassword == ''
    ) {
      alert('Please fill all fields !')
    } else if (password.length < 8) {
      alert('Password should at least 8 character in length !')
    } else if (!password.match(confirmPassword)) {
      alert("Your passwords don't match !")
    }
  })
})
