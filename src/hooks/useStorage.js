import { useState } from "react";

export default function useStorage(itemKey, initialValue) {

    // const [state, setState] = useState(() => {
    //     const prevState = localStorage.getItem(itemKey);

    //     if (prevState) {
    //         return JSON.parse(prevState);
    //     } else {
    //         localStorage.setItem(itemKey, JSON.stringify(initialValue));
    //         return initialValue;
    //     }
    // });

    const [state, setState] = useState(() => {
        const prev = localStorage.getItem(itemKey);
        if (!prev) {
            localStorage.setItem(itemKey, JSON.stringify(initialValue));
            return initialValue;
        }

        try {
            return JSON.parse(prev);
        } catch {
            localStorage.setItem(itemKey, JSON.stringify(initialValue));
            return initialValue;
        }
    });


    //   const changeState = (newState) => {
    //     setState(newState);
    //     localStorage.setItem(itemKey, JSON.stringify(newState));
    //   };

    const changeState = (value) => {
        setState(prev => {
            const newState = typeof value === "function" ? value(prev) : value;
            localStorage.setItem(itemKey, JSON.stringify(newState));
            return newState;
        });
    };


    return [state, changeState];
}

