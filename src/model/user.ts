class User {
  id: number;

  username: string;

  domain: string;

  token: string;

  urlPipedrive: string;

  email: string;

  password: string;

  constructor({
    id,
    username,
    domain,
    token,
    urlPipedrive,
    email,
    password,
  }: User) {
    this.id = id;
    this.username = username;
    this.domain = domain;
    this.token = token;
    this.urlPipedrive = urlPipedrive;
    this.email = email;
    this.password = password;
  }
}

export default User;
