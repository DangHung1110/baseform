import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.response.js";
export default class UserService {
    constructor(user, AuthUtils) {
        this.userModel = user;
        this.authUtils = AuthUtils
    }

    getAllUsers = async () => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const users = await this.userModel.find({}).skip(skip).limit(limit);
        return { users, page, limit }
    }

    getme = async (id) => {
        const user = await this.userModel.findOne({ _id: id })
        if (!user) {
            throw BadRequestError("user not found!")
        }
        return user;
    }

    addUser = async (data) => {
        const hasedPassword = await this.authUtils.hasedPassword(data.password);
        const emailExisting = await this.userModel.findOne({ email: data.email });
        if (emailExisting) {
            throw new BadRequestError("Email already exist!")
        }

        const newUser = new this.userModel({
            fullname: data.fullname,
            email: data.email,
            password: hasedPassword,
            role: "user"
        });

        await newUser.save();

        return newUser;
    }

    putUser = async (id, data) => {
        putUser = async (id, data) => {
            const user = await this.userModel.findOne({ _id: id });
            if (!user) {
                throw new NotFoundError("User not found!");
            }
            if (data.email && data.email !== user.email) {
                const emailExisting = await this.userModel.findOne({
                    email: data.email,
                    _id: { $ne: id },
                });
                if (emailExisting) {
                    throw new ConflictRequestError("This email already exists!");
                }
                user.email = data.email;
            }
            if (data.username && data.username !== user.username) {
                const usernameExisting = await this.userModel.findOne({
                    username: data.username,
                    _id: { $ne: id },
                });
                if (usernameExisting) {
                    throw new ConflictRequestError("This username already exists!");
                }
                user.username = data.username;
            }
            if (data.fullname) {
                user.fullname = data.fullname;
            }
            if (data.password) {
                user.password = await this.authUtil.hashPassword(data.password);
            }
            await user.save();
            return user;
        };
    }

    deleteUser = async (id, currentId) => {
        if (currentId === id) {
            throw new ConflictRequestError("Cannot delete your self!")
        }

        const user = await this.userModel.findOne({ _id: id });
        if (!user) {
            throw new NotFoundError("User not found!");
        }
        if (user.role === "Admin") {
            throw new ConflictRequestError("Cannot delete admin user!");
        }
        await this.userModel.deleteOne({ _id: id });
        return user;
    };
}
