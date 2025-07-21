const isValidEmail = (emailv : any) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailv);
};

export default isValidEmail;
