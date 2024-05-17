type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type Address = {
  city: string;
  geo: {
    lat: string;
    lng: string;
    street: string;
    suite: string;
    zipcode: string;
  }
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: Address;
};

export type {
  User,
}
