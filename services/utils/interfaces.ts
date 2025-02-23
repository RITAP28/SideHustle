enum Role {
    ADMIN,
    USER,
    CREATOR
}

enum Plan {
    Free,
    Premium
}

enum Status {
    INPROGRESS,
    ENDED
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: Role;
    password: string;
    isAuthenticated: boolean;
    isVerified: boolean;
    isCreator: boolean;
    isPaid: boolean;
    plan: Plan;
}