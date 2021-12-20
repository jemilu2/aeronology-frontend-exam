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
                        data: (response as any).data,
                        error: undefined,
                    };
                    dispatch(addTodo((response as any).data))
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
    // in this case the momoized function returned will not change
    // at all since there are no inputs

    const reset = useCallback(() => {
        setResult({ data: null, loading: false, error: "" });
    }, []);
    // this is useful because we need to reset everything back to its original
    // state once we finish executing. This makes the function re-rentrant.
    // as in purer since we could run it multiple times and previous invocations
    // will not affect subsequent invocations.
    
    // the fact that it 
    // was previously executed will not affect subsequent invocations

    useEffect(() => () => {
        ref.current.isMounted = false;

        // I wonder why I'm setting is mounted false here - after the use
        // effect is executed. While I set it to true. in the declaration
        // of the useRef
    }, []);

    return [execute, { reset, ...result }];
}