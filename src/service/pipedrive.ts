interface ContructorMethod {
  token: string;
  url: string;
  dealId?: number;
  personId?: number;
  from?: string;
  to: string;
  from_phone_number?: string;
}

interface RecebidaMethod {
  number: string;
}

class Pipedrive {
  private token: string;

  private url: string;

  private dealId?: number;

  private personId?: number;

  private from?: string;

  private to: string;

  private from_phone_number?: string;

  constructor({
    token,
    url,
    dealId,
    personId,
    from,
    to,
    from_phone_number,
  }: ContructorMethod) {
    this.token = token;
    this.url = url;
    this.dealId = dealId;
    this.personId = personId;
    this.from = from;
    this.to = to;
    this.from_phone_number = from_phone_number;
  }

  public returnUrl(): string {
    if (this.dealId) {
      return `https://${this.url}.pipedrive.com/deal/${this.dealId}`;
    }
    if (this.personId) {
      return `https://${this.url}.pipedrive.com/person/${this.personId}`;
    }
    return `https://cloudcomunicacao.pipedrive.com/leads`;
  }
}

export default Pipedrive;
