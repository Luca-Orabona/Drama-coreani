import { useSearchParams } from "react-router-dom";

const useFilterParams = () => {

    const [params, setParams] = useSearchParams();

    const getParam = (...keys) => {
        return keys.map(k => params.get(k) || "");
    };

    const setParam = (key, value) => {
        const newParams = new URLSearchParams(params);

        value ? newParams.set(key, value) : newParams.delete(key);

        setParams(newParams, { replace: true });
    }

    return { getParam, setParam, paramsString: params.toString() }
};

export default useFilterParams;