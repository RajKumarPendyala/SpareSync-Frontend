const isValidEmail = (emailv) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailv);
};

export default isValidEmail;
