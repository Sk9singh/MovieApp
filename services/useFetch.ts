import { useState, useEffect } from 'react';

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch=true) => {   // useFetch is a custom React hook that allows you to fetch data from an API or any asynchronous source
    const [data, setData] = useState<T | null>(null);                     // useState is a React hook that allows you to add state to functional components
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    
    const fetchData = async () => {                            
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
            
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
        } finally {
            setLoading(false);
        }
    } 

    const reset = () => {
       setData(null);
       setError(null);
       setLoading(false);
    }

    useEffect(() => {                                        //useEffect will run automatically when the component mounts
        if (autoFetch) {
            fetchData();
        }
    }, []);

    return { data, error, loading, refetch: fetchData, reset };     // return the data, error, loading state, fetchData function and reset function
 }

 export default useFetch;