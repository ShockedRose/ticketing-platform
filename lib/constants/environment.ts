export const environment = {
    PAGUELOFACIL_BASE_URL: process.env.PAGUELOFACIL_BASE_URL as string,
    PAGUELOFACIL_CCLW: process.env.PAGUELOFACIL_CCLW as string,
    PAGUELOFACIL_TOKEN: process.env.PAGUELOFACIL_TOKEN as string,
    PAGUELOFACIL_RETURN_URL: process.env.PAGUELOFACIL_RETURN_URL ?? "" as string,
    PAGUELOFACIL_EXPIRES_IN: process.env.PAGUELOFACIL_EXPIRES_IN ?? "3600" as string,

    DATABASE_URL: process.env.DATABASE_URL as string,

    ATTENDEE_FORM_FIELDS: (process.env.ATTENDEE_FORM_FIELDS && JSON.parse(process.env.ATTENDEE_FORM_FIELDS)) ?? {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        jobTitle: "",
        companyName: "",
        companyUrl: "",
        workAddress: "",
        workPhone: "",
        emergencyContact: "",
        githubHandle: "",
        industry: "",
        organizationRepresents: "",
        organizationType: "",
        primaryRole: "",
        firstTimeKcd: "",
        shirtSize: "",
        dietaryNeeds: "",
        disabilityAccommodation: "",
        personOfColor: "",
        genderIdentity: "",
        ageRange: "",
        cncfConsent: false,
        sponsorCommunicationsOptIn: false,
    }
} as const;


export type Env = typeof environment;


