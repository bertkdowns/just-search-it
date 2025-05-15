import { promise, set, z } from "zod"
import React from "react"
import { createContext, useContext, useMemo, useCallback, useState, useRef } from "react"
import { resolve } from "path"
import { Input } from "postcss"

type InputOption = string


export type InputRequestHandler<T extends z.ZodTypeAny> = (
  title: string,
  options: InputOption[],
  type: T
) => Promise<z.infer<T>>
type AnyInputRequestHandler = InputRequestHandler<z.ZodTypeAny>

const DefaultInputRequestHandler: AnyInputRequestHandler = (title, options, type) => {
  return new Promise((resolve, reject) => {
    reject(new Error("Input request handler not available"));
  });
}

const InputContext = createContext<React.Ref<AnyInputRequestHandler> | null>(null);


export type InputRequestEventHandler = (
  title: string,
  options: InputOption[],
  type: z.ZodTypeAny
) => void;
const InputRequestEventContext = createContext<React.Ref<InputRequestEventHandler | null> | null>(null);


export type InputResolveHandlers = {
  resolve: (value: z.infer<z.ZodTypeAny>) => void;
  reject: (reason?: any) => void;
}

const InputResolveContext = createContext<React.Ref<(value: string) => void> | null>(null);

export function useInputRequest() {
  const inputRequestRef = useContext(InputContext);

  const inputRequest: AnyInputRequestHandler = (
    title,
    options,
    type
  ) => {
    if (!inputRequestRef?.current) {
      console.error("Input request handler not available. Is a InputProvider wrapping this component?")
      return Promise.reject(new Error("Input request handler not available"));
    }
    inputRequestRef?.current(title, options, type);
  }

  return useCallback(inputRequest, []);
}


export function useOnInputRequest(handler: InputRequestEventHandler) {
  const inputRequestRef = useContext(InputRequestEventContext);
  if (!inputRequestRef) {
    console.error("Input request handler not available. Is a InputProvider wrapping this component?")
    return;
  }
  inputRequestRef.current = handler;
}

export function useResolveInputRequest() {
  const resolveRef = useContext(InputResolveContext);
  if (!resolveRef) {
    console.error("Input request handler not available. Is a InputProvider wrapping this component?")
    return;
  }
  function handleResolve(value: string) {
    if (!resolveRef?.current) {
      console.error("Input request handler not available. Has an input request been made?")
      return;
    }
    resolveRef.current(value);
  }
  return handleResolve;
}

export function InputProvider({ children }: { children: React.ReactNode }) {
  const inputRequestRef = useRef<AnyInputRequestHandler>(DefaultInputRequestHandler);
  const onInputRequestRef = useRef<InputRequestEventHandler>(null);
  const resolveRef = useRef<(value: string) => void>(null);


  // const [inputTitle,setInputTitle] = useState<string>("");
  // const [inputValue,setInputValue] = useState<string>("");
  // const [inputOptions,setInputOptions] = useState<InputOption[]>([]);


  const [inputType, setInputType] = useState<z.ZodTypeAny>(z.string());
  const [promiseCallback, setPromiseCallback] = useState<InputResolveHandlers | null>(null);

  const handleResolve = (value: string) => {
    const parsed_value = inputType.parse(value);
    if (promiseCallback) {
      promiseCallback.resolve(parsed_value);
    } else {
      console.error("No promise callback available");
    }
  }
  resolveRef.current = handleResolve;


  const handleInputRequest = <T extends z.ZodTypeAny>(
    title: string,
    options: InputOption[],
    type: T
  ): Promise<z.infer<T>> => {
    // Store the type, for later parsing
    setInputType(type);
    // Call the event handler on the input component, so it can show the input dialog
    onInputRequestRef.current?.(title, options, type);
    // Create a promise that will be resolved when the input is received
    const inputPromise = new Promise<z.infer<T>>((resolve, reject) => {
      setPromiseCallback({ resolve, reject });
    });
    return inputPromise;
  }

  inputRequestRef.current = handleInputRequest;
  return (
    <InputContext.Provider value={inputRequestRef}>
      <InputRequestEventContext.Provider value={onInputRequestRef}>
        <InputResolveContext.Provider value={resolveRef}>
          {children}
        </InputResolveContext.Provider>
      </InputRequestEventContext.Provider>
    </InputContext.Provider>
  )
}