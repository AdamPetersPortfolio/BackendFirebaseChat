// import firebase from 'firebase.js'
function signInUser(email, password) {
    console.log(firebase)

    return firebase.auth()
        .signInWithEmailAndPassword(email, password)
}