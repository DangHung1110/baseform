import { BadRequestError } from "../handler/error.response.js";

export default class {
    constructor() {}

    UserValidate = async(req, res, next) => {
        try {
            const user = req.body;
            if( !user.fullname || !user.email || !user.password) {
                throw new BadRequestError("Nhap thieu thong tin");
            }

            if(user.fullname.length < 10 ){
                throw new BadRequestError("Name must be at least 10 character")
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const checkemail = emailRegex.test(user.email);
            if(!checkemail) {
                throw new BadRequestError("Email is invalid")
            }

            if(user.password.length < 6) {
                throw new BadRequestError("password must be at least 6 character")
            }
            next();
        }
        catch(err) {
            next(err)
        }
    }
}