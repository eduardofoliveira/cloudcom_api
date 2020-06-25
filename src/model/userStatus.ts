class UserStatus {
  usuario: string;

  usuarioTerminal: string;

  userAgent: string;

  dominio: string;

  destino: string;

  tipo: string;

  estado: string;

  constructor({
    usuario,
    usuarioTerminal,
    userAgent,
    dominio,
    destino,
    tipo,
    estado,
  }: UserStatus) {
    this.usuario = usuario;
    this.usuarioTerminal = usuarioTerminal;
    this.userAgent = userAgent;
    this.dominio = dominio;
    this.destino = destino;
    this.tipo = tipo;
    this.estado = estado;
  }
}

export default UserStatus;
