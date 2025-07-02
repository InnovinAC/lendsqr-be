import {z} from "zod";
const emailAndPassword = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, {message: "Password must be at least 8 characters long"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"})
        .regex(/[^A-Za-z0-9]/, {message: "Password must contain at least one special character"})
})
const authenticationSchema = {
    LOGIN: emailAndPassword,
    REGISTER: z.object({
        first_name: z.string().min(3, {message: "First name must be at least 3 characters"}),
        last_name: z.string().min(3, {message: "Last name must be at least 3 characters"}),
        phone_number: z.string()
    }).merge(emailAndPassword)
}

export default authenticationSchema;