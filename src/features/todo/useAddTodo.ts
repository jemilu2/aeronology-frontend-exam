/**
 * A custom hook that 
 * 1. 
 * 
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {  
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
 */

import { useEffect, useState } from "react";
import { makeCrudRequest as addTodoAsync } from "./todoApi";
import { iTodo } from "./todoSlice";

export interface iUseTodoResponse {
    status: "loading" | "success" | "error";
    data: iTodo | null
}

export function useAddTodo() {
    console.log("called useAddTodo")
    const [todo, setTodo] = useState<iTodo | null>(null);
    const [state, setState] = useState<any>({ status: "loading", data: null });

    useEffect(() => {
        const addTodo = async () => {
            try {
                if (!todo) return {};
                await addTodoAsync(todo);
                setState({ status: "success", data: todo })
            } catch {
                setState({ ...state, status: "error" })
            }
        }
        if (todo) {
            addTodo()
        }
    }, [state, todo]);
    return [state, setTodo];
}