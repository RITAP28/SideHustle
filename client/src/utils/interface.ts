enum Plan {
    free = "Free",
    premium = "Premium"
}

enum Role {
    user = "USER",
    admin = "ADMIN",
    creator = "CREATOR"
}

export interface IUserProps {
    id: number;
    name: string;
    email: string;
    role: Role;
    isAuthenticated: boolean;
    isVerified: boolean;
    isCreator: boolean;
    isPaid: boolean;
    plan: Plan;
}