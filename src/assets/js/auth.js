import { validateNewUser,validateSignInUser } from '../js/validator.js'
import { themeHome } from '../views/themeHome.js';
import { userNotRegistered } from '../views/themeSignIn.js';
import { userAlreadyRegistered } from '../views/themeRegister.js';
import { themeDashboard } from '../views/themeDashboard.js';


export const registerUser = (txtName, txtEmail, txtPassword) => {

  if (validateNewUser(txtName, txtEmail, txtPassword)) {
    alert("El usuario fue creado exitosamente");
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(txtEmail, txtPassword)
    .then(function(){
    verify()
    var db = firebase.firestore();
    db.collection("users").add({
      name: txtName,
      email: txtEmail,
      password:txtPassword,
      
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
     
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  }) })
  promise.catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;    
    
   userAlreadyRegistered(errorCode)
   window.location.hash = '#/register';
  });
   
  
  }}



function verify (){
    let user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      console.log("enviando correo");
    // Email sent.
  }).catch(function(error) {
    console.log("error")
    // An error happened.
  });

 }



export const singInGoogle =() =>{
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
  .then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    let token = result.credential.accessToken;
    // The signed-in user info.
    let user = result.user;
    
    themeDashboard()
    window.location.hash = '#/preferences';
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

}




export const signInUser = (txtEmail,txtPassword) => {
  if (validateSignInUser(txtEmail,txtPassword)){
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(txtEmail, txtPassword)
    .then(function(){
      //themeDashboard()
      //window.location.hash ='#dashboard'
      
      let user = firebase.auth().currentUser;

      if (user) {
       themeDashboard();
        window.location.hash = '#/dashboard';
      } else {
        window.location.hash = '#/signin';
      }

   
    
    })
    promise.catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;    
      
     userNotRegistered(errorCode)
      
    });

}}

export const getUser = (email)=> {
  var db = firebase.firestore();
  db.collection("users").where("email", "==", email)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log("esta funcion obtiene el nombre del current user desde nuestra base de datos :3")
          firebase.auth().currentUser.email = doc.data().name;
          
      });
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
}  




export const observer = () => {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('user ok')
      
    } else {
     
      window.onhashchange ="";
      themeHome();
      //console.log('not current user')// No user is signed in.
    }
  });

 




/*  let user = firebase.auth().currentUser;

  if (user) {
  // User is signed in.
  } else {
    window.location.hash = '#/home';
  }*/

}