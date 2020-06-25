class User {
  id: number;

  username: string;

  domain: string;

  token: string;

  urlPipedrive: string;

  email: string;

  password: string;

  active: number;

  active_pipedrive: number;

  constructor({
    id,
    username,
    domain,
    token,
    urlPipedrive,
    email,
    password,
    active,
    active_pipedrive,
  }: User) {
    this.id = id;
    this.username = username;
    this.domain = domain;
    this.token = token;
    this.urlPipedrive = urlPipedrive;
    this.email = email;
    this.password = password;
    this.active = active;
    this.active_pipedrive = active_pipedrive;
  }
}

export default User;
