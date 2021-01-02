function createUser(email, password, username) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
}

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