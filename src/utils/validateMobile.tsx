const validateMobile = (mobile : any) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
};

export default validateMobile;
