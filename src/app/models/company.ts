export class Company {
    id: number;
    center_name: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    constructor(id: number, center_name: string, address: string, city: string, postal_code: string, country: string){
        this.id = id;
        this.center_name = center_name;
        this.address = address;
        this.city = city;
        this.postal_code = postal_code;
        this.country = country;
    }
}