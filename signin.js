/**
 * Signs an existing user into firebase. 
 *
 * @param {string} email The new user's email.
 * @param {string} password The user's password.
 * @return {Promise<UserCredential>}
 */

function signInUser(email, password) {
    console.log(firebase)

    return firebase.auth()
        .signInWithEmailAndPassword(email, password)
}