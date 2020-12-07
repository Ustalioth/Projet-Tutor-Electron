// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

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
  