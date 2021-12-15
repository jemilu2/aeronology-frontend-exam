import { useCallback, useEffect, useRef, useState } from 'react';
import { equal } from '@wry/equality';
import { addTodoAsync } from './todoApi';
import { useAppDispatch } from '../../app/hooks';
import { addTodo } from './todoSlice';

export interface iResult {
    loading: boolean;
    called?: boolean;
    error: any;
    data: any;
    reset?: Function
}

export function useTodoMutation(): [Function, iResult] {
    const dispatch = useAppDispatch();
    const [result, setResult] = useState<iResult>({
        loading: false,
        error: "",
        data: null
    });

    const ref = useRef({
        result,
        mutationId: 0,
        isMounted: true,
    });

    const execute = useCallback((todo: any) => {
        console.log("execution started", new Date(), todo)
        if (!ref.current.result.loading) {
            setResult(ref.current.result = {
                loading: true,
                error: void 0,
                data: void 0,
                called: true,
            });
        }
        const mutationId = ++ref.current.mutationId;
        return addTodoAsync(todo as any)
            .then((response) => {
                if (ref.current.isMounted && !equal(ref.current.result, result)) {
                    const result = {
                        called: true,
                        loading: false,
                        data: response.data,
                        error: undefined,
                    };
                    dispatch(addTodo(response.data))
                    setResult(ref.current.result = result);
                }
            })
            .catch((error) => {
                if (
                    mutationId === ref.current.mutationId &&
                    ref.current.isMounted
                ) {
                    const result = {
                        loading: false,
                        error,
                        data: void 0,
                        called: true,
                    };

                    if (!equal(ref.current.result, result)) {
                        setResult(ref.current.result = result);
                    }
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reset = useCallback(() => {
        setResult({ data: null, loading: false, error: "" });
    }, []);

    useEffect(() => () => {
        ref.current.isMounted = false;
    }, []);

    return [execute, { reset, ...result }];
}