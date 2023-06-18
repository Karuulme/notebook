const  status = require("./NTSTATUS.js");
const { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword } = require("firebase/auth");
const authentication = getAuth();

var signupAndLoginClass = {
    uid:null,
    email:null,
    email: status.success,
    password: status.success,
    success: status.success
};
function Signup(param) {
    //const name = param.name;
    const email = param.email;
    const password = param.password;
    const re_password = param.re_password;
    if (password != re_password) {
        success: status.unsuccessful;
        signupAndLoginClass.password = status.passwordEqual;
        signupAndLoginClass.success = status.unsuccessful;

        return signupAndLoginClass;
    }
    createUserWithEmailAndPassword(authentication,email,password)
    .then(userRecord => {
            signupAndLoginClass.email = status.success;
            signupAndLoginClass.password = status.success;
            signupAndLoginClass.success = status.success;
            return signupAndLoginClass;
        })
        .catch(error => {
            //console.error("Kullanıcı kaydedilirken bir hata oluştu:", error);
            if (error.message == 'The email address is improperly formatted.') {
                signupAndLoginClass.email = status.emailInvalid;
            } else if (error.message == "The email address is already in use by another account.") {
                signupAndLoginClass.email = status.emailUse;
            }
            if (error.message == "The password must be a string with at least 6 characters.") {
                signupAndLoginClass.password = status.passwordSome;
            }
            signupAndLoginClass.success = status.unsuccessful;
        });
    return signupAndLoginClass;
}
const Login = async (param) => {
    const email = param.email;
    const password = param.password;
    await signInWithEmailAndPassword(authentication,email, password)
    .then(userCredential => {
        signupAndLoginClass.uid=userCredential["user"]["uid"];
        signupAndLoginClass.email=userCredential["user"]["reloadUserInfo"]["email"];
        signupAndLoginClass.status=status.success;
    })
    .catch(error => {
        signupAndLoginClass.status=status.unsuccessful;
    });
    return signupAndLoginClass;
}

module.exports = {
    Signup,Login
};