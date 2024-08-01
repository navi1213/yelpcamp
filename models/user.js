const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

userSchema.plugin(passportLocalMongoose,{
    errorMessages: {
        UserExistsError:"そのユーザー名はすでに使われています。",
        AttemptTooSoonError:"アカウントはロックされています。後ほどお試しください。",
        TooManyAttemptsError:"ログイン試行回数の上限に達した為アカウントをロックしました。",
        NoSaltValueStoredError:"認証できません。saltが保存されていません。",
        IncorrectPasswordError:"パスワードまたはユーザー名が間違っています。",
        IncorrectUsernameError:"パスワードまたはユーザー名が間違っています。",
        MissingUsernameError:"ユーザー名がありません。",
        MissingPasswordError:"パスワードがありません。"
    }
});

module.exports = mongoose.model("User",userSchema);