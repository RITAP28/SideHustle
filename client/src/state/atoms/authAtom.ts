import { atom, selector } from "recoil";

const getInitialAuthenticatedState = () => {
    const storedState = localStorage.getItem("isAuthenticated");
    return storedState === "true";
};

export const checkAuth = atom({
    key: 'isAuthenticated',
    default: getInitialAuthenticatedState()
});

export const authStateSelector = selector({
    key: "authStateSelector",
    get: ({ get }) => {
        return get(checkAuth);
    }
});