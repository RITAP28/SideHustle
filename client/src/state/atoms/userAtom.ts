import { atom, selector } from "recoil";

export const usernameAtom = atom<string>({
    key: 'usernameAtom',
    default: ''
});

export const emailAtom = atom<string>({
    key: 'emailAtom',
    default: ''
});

export const idAtom = atom<string>({
    key: 'idAtom',
    default: ''
});

const user = {
    id: '',
    name: '',
    email: ''
};

export const userAtom = atom({
    key: 'userAtom',
    default: user
})

export const userInfoState = selector({
    key: 'userSelector',
    get: ({ get }) => {
        const username = get(usernameAtom);
        const email = get(emailAtom);
        const id = get(idAtom);

        return { username, email, id }
    }
});

export const userSelector = selector({
    key: 'userSelectorr',
    get: ({ get }) => {
        return get(userAtom);
    }
});

// export const userSelector = selector({
//     key: 'userSelector',
//     get: ({ get }) => {
//         return get(userAtom);
//     }
// });