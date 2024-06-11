import { atom, selector } from "recoil";

const getInitialNameState = () => {
    const storedState = localStorage.getItem("username");
    return storedState === "";
};

const getInitialEmailState = () => {
    const storedState = localStorage.getItem("email");
    return storedState === ""
}

export const userNameState = atom({
    key: 'userNameState',
    default: getInitialNameState()
});

export const emailState = atom({
    key: 'emailState',
    default: getInitialEmailState()
});

export const userSelector = selector({
    key: 'userSelector',
    get: ({ get }) => {
        const name = get(userNameState);
        const email = get(emailState);

        return { name, email };
    }
});