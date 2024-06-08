export interface IUserModel {
  username: string;
  email: string;

  password: string;
}

export interface IRegisterCred {
  username: string;
  email: string;
  password: string;
}

export interface ILoginCred {
  username: string;
  password: string;
}

export interface IUserError {
    success: boolean;
    message: string;
    statusCode: number;
}
