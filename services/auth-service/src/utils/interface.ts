export interface INodemailerOptions {
    to: string;
    subject: string;
    text: string;
};

export interface IUserProps {
    id: number;
    name: string;
    email: string;
    password: string;
    isAuthenticated: boolean;
    isVerified: boolean;
    isCreator: boolean;
    isPaid: boolean;
  }