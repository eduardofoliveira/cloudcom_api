class ChamadaBasix {
  calllogkey: string;

  callid: string;

  inicio: Date;

  termino: Date;

  tipo: string;

  endereco: string;

  ddr: string;

  username: string;

  domain: string;

  path: string;

  fileName: string;

  bucket: string;

  constructor({
    calllogkey,
    callid,
    inicio,
    termino,
    tipo,
    endereco,
    ddr,
    username,
    domain,
    path,
    fileName,
    bucket,
  }: Omit<ChamadaBasix, 'formatEndereco'>) {
    this.calllogkey = calllogkey;
    this.callid = callid;
    this.inicio = inicio;
    this.termino = termino;
    this.tipo = tipo;
    this.endereco = this.formatEndereco(endereco);
    this.ddr = ddr;
    this.username = username;
    this.domain = domain;
    this.path = path;
    this.fileName = fileName;
    this.bucket = bucket;
  }

  formatEndereco(endereco: string): string {
    if (/^\d{4,5}55\d{10,11}$/.test(endereco)) {
      const enderecos = endereco.match(/^\d{4,5}55(\d{10,11})$/);
      if (enderecos && enderecos?.length > 1) {
        return enderecos[1];
      }
    }
    return endereco;
  }
}

export default ChamadaBasix;
