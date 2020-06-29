class UserAddress {
  usuario: string;

  ramal: string;

  constructor({ usuario, ramal }: UserAddress) {
    this.usuario = usuario;
    this.ramal = ramal;
  }
}

export default UserAddress;
