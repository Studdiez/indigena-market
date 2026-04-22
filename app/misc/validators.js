
exports.emailvalidation = (instring) => {
    if(!instring.charAt(0).match(/[a-zA-Z0-9]/))
    {
        return [false, "should starts with alpha numeric character!"]
    }
    if(instring.match("^[a-zA-Z0-9-_@.]*$") == null)
    {
        return [false, "should not contain space,symbols except '-' '_' "]
    }

    if(instring.length < 8)
    {
        return [false, "length should be minimum 8"]
    }
    return [true, "OK"]
}


exports.pwdvalidation = (instring) => {
    if(instring.match("^[a-zA-Z0-9-_@#$*&]*$") == null)
    {
        return [false, "should not contain space,symbols except '@-#$&_' "]
    }

    if(instring.length < 8)
    {
        return [false, "length should be minimum 8"]
    }
    return [true, "OK"]
}

