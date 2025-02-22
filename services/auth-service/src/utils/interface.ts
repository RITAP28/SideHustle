export interface INodemailerOptions {
    to: string;
    subject: string;
    text: string;
};

export interface IUserProps {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
  }