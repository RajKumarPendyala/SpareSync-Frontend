const validatePassword = (Newpassword : any) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!Newpassword) {return 'Password is required.';}

    if (!regex.test(Newpassword)) {
        return 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    }

    return null;
};

export default validatePassword;
