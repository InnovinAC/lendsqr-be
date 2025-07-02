export interface ICreateUser {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
}

export interface ILogin  extends Pick<ICreateUser, 'email'|'password'> {}