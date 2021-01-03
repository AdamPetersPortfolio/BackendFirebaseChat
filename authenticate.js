
/**
 * Creates a new user in firebase. 
 *
 * @param {string} email The new user's email.
 * @param {string} password The user's password.
 * @return {Promise<UserCredential>}
 */
function createUser(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
}

/**
 * Pushes the user's information (firstname, lastname, username) 
 * into the database where the key is their unique user id. 
 *
 * @param {string} fname The new user's firstname.
 * @param {string} lname The user's last name.
 * @param {string} username The user's username.
 * @return {Promise<any>}
 */
function pushUserToDatabase(fname, lname, username) {
    let user = firebase.auth().currentUser;
    let uid = user.uid;
    return firebase.database().ref("Users").child(uid).set({
        FirstName: fname,
        LastName: lname,
        DisplayName: username,
        FavoriteArtists: '0', 
        Conversations: '0'
    });
}