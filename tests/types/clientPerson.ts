export class ClientPerson {
    public therapy: Therapy;
    public state: State;
    public legalFirstName: string;
    public legalLastName: string;
    public email: string;
    public dateOfBirth: string;
    public phoneNumber: string;
    public shippingAddressLine1: string;
    public shippingAddressLine2: string;
    public shippingCity: string;
    public shippingZip: string;
    public billingAndShippingAddressIsTheSame: boolean;
    public sexAssignedAtBirth: SexAssignedAtBirth;
    public preferredPronouns: PreferredPronouns;

    constructor(builder: ClientPersonBuilder) {
        this.therapy = builder.getTherapy();
        this.state = builder.getState();
        this.legalFirstName = builder.getLegalFirstName();
        this.legalLastName = builder.getLegalLastName();
        this.email = builder.getEmail();
        this.dateOfBirth = builder.getDateOfBirth();
        this.phoneNumber = builder.getPhoneNumber();
        this.shippingAddressLine1 = builder.getShippingAddressLine1();
        this.shippingAddressLine2 = builder.getShippingAddressLine2();
        this.shippingCity = builder.getShippingCity();
        this.shippingZip = builder.getShippingZip();
        this.billingAndShippingAddressIsTheSame = builder.isBillingAndShippingAddressTheSame();
        this.sexAssignedAtBirth = builder.getSexAssignedAtBirth();
        this.preferredPronouns = builder.getPreferredPronouns();
    }
}


export class ClientPersonBuilder {
    private therapy!: Therapy; //Required to be set by the builder <<<<<<<<<<<<<<<<<<<<<<<<<
    private state: State = State.UT; // Default to Utah
    private legalFirstName: string = 'John'; // Default to a common name
    private legalLastName: string = 'Doe'; // Default to a common name
    private email: string = 'john.doe@example.com'; // Default to a placeholder email
    private dateOfBirth: string = '01/01/1980'; // Default to a common birthdate
    private phoneNumber: string = '(555) 123-4567'; // Default to a placeholder phone number
    private shippingAddressLine1: string = '123 Main St'; // Default to a common address
    private shippingAddressLine2: string = 'Apt  4B'; // Default to a common address line
    private shippingCity: string = 'Salt Lake City'; // Default to a common city
    private shippingZip: string = '84101'; // Default to a common ZIP code
    private billingAndShippingAddressIsTheSame: boolean = true; // Default to true
    private sexAssignedAtBirth: SexAssignedAtBirth = SexAssignedAtBirth.MALE; // Default to MALE
    private preferredPronouns: PreferredPronouns = PreferredPronouns.HE_HIM; // Default to HE_HIM


    setTherapy(therapy: Therapy): ClientPersonBuilder {
        this.therapy = therapy;
        return this;
    }

    setState(state: State): ClientPersonBuilder {
        this.state = state;
        return this;
    }

    setLegalFirstName(legalFirstName: string): ClientPersonBuilder {
        this.legalFirstName = legalFirstName;
        return this;
    }

    setLegalLastName(legalLastName: string): ClientPersonBuilder {
        this.legalLastName = legalLastName;
        return this;
    }

    setEmail(email: string): ClientPersonBuilder {
        this.email = email;
        return this;
    }

    setDateOfBirth(dateOfBirth: string): ClientPersonBuilder {
        this.dateOfBirth = dateOfBirth;
        return this;
    }

    setPhoneNumber(phoneNumber: string): ClientPersonBuilder {
        this.phoneNumber = phoneNumber;
        return this;
    }

    setShippingAddressLine1(shippingAddressLine1: string): ClientPersonBuilder {
        this.shippingAddressLine1 = shippingAddressLine1;
        return this;
    }

    setShippingAddressLine2(shippingAddressLine2: string): ClientPersonBuilder {
        this.shippingAddressLine2 = shippingAddressLine2;
        return this;
    }

    setShippingCity(shippingCity: string): ClientPersonBuilder {
        this.shippingCity = shippingCity;
        return this;
    }

    setShippingZip(shippingZip: string): ClientPersonBuilder {
        this.shippingZip = shippingZip;
        return this;
    }

    setBillingAndShippingAddressIsTheSame(billingAndShippingAddressIsTheSame: boolean): ClientPersonBuilder {
        this.billingAndShippingAddressIsTheSame = billingAndShippingAddressIsTheSame;
        return this;
    }

    setSexAssignedAtBirth(sexAssignedAtBirth: SexAssignedAtBirth): ClientPersonBuilder {
        this.sexAssignedAtBirth = sexAssignedAtBirth;
        return this;
    }

    setPreferredPronouns(preferredPronouns: PreferredPronouns): ClientPersonBuilder {
        this.preferredPronouns = preferredPronouns;
        return this;
    }

    getTherapy(): Therapy {
        return this.therapy;
    }

    getState(): State {
        return this.state;
    }

    getLegalFirstName(): string {
        return this.legalFirstName;
    }

    getLegalLastName(): string {
        return this.legalLastName;
    }

    getEmail(): string {
        return this.email;
    }

    getDateOfBirth(): string {
        return this.dateOfBirth;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getShippingAddressLine1(): string {
        return this.shippingAddressLine1;
    }

    getShippingAddressLine2(): string {
        return this.shippingAddressLine2;
    }

    getShippingCity(): string {
        return this.shippingCity;
    }

    getShippingZip(): string {
        return this.shippingZip;
    }

    isBillingAndShippingAddressTheSame(): boolean {
        return this.billingAndShippingAddressIsTheSame;
    }

    getSexAssignedAtBirth(): SexAssignedAtBirth {
        return this.sexAssignedAtBirth;
    }

    getPreferredPronouns(): PreferredPronouns {
        return this.preferredPronouns;
    }

    build(): ClientPerson {
        if (this.therapy === undefined) {
            throw new Error("Therapy must be set.");
        }
        return new ClientPerson(this);
    }
}

export default ClientPersonBuilder;

export enum Therapy {
    WEIGHT_LOSS,
    TRT,
    SLEEP
}

export enum State {
    UT,
    NV,
    CA
    // Add other options as needed
}

export const StateText = {
    [State.UT]: "Utah",
    [State.NV]: "Nevada",
    [State.CA]: "California"
};

export enum SexAssignedAtBirth {
    MALE,
    FEMALE
}

export const SexAssignedAtBirthText = {
    [SexAssignedAtBirth.MALE]: "Male",
    [SexAssignedAtBirth.FEMALE]: "Female"
};

export enum PreferredPronouns {
    HE_HIM,
    SHE_HER,
    THEY_THEM,
    OTHER
}

export const PreferredPronounsText = {
    [PreferredPronouns.HE_HIM]: "He/Him",
    [PreferredPronouns.SHE_HER]: "She/Her",
    [PreferredPronouns.THEY_THEM]: "they/them",
    [PreferredPronouns.OTHER]: "Other"
};

