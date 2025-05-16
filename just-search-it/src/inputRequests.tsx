import { promise, set, z } from "zod";
import React from "react";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useRef,
} from "react";
import { resolve } from "path";
import { Input } from "postcss";

export type InputOption = string;

export type InputRequest<T extends z.ZodTypeAny> = (
  title: string,
  options: InputOption[],
  type: T
) => Promise<z.infer<T>>;
export type AnyInputRequest = InputRequest<z.ZodTypeAny>;

export type InputRequestCallback = (
  title: string,
  options: InputOption[],
  type: z.ZodTypeAny
) => void;

export type InputResolveHandlers = {
  resolve: (value: z.infer<z.ZodTypeAny>) => void;
  reject: (reason?: any) => void;
};
export type InputResolveCallType = {
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
};

export function createInputSystem() {
  // Store the input type, so we can parse the result
  let inputType: z.ZodTypeAny | null = null;
  // Store the input request handler. This is set by the dialog component, and we call this
  // when we want to show the input dialog.
  let onInputRequest: InputRequestCallback | null = null;
  // Store the resolve and reject functions for the input request promise.
  // We can call these when the user submits the input or cancels the dialog.
  let resolvePromise: ((value: string) => void) | null = null;
  let rejectPromise: ((reason?: any) => void) | null = null;

  // Because the actual promises and the onInputRequest handler changes when the component re-renders,
  // We make these wrapper functions that can always access the latest values.
  const requestUserInput = <T extends z.ZodTypeAny>(
    title: string,
    options: InputOption[],
    type: T
  ): Promise<z.infer<T>> => {
    // Store the type, for later parsing
    inputType = type;
    // Call the event handler on the input component, so it can show the input dialog
    if (onInputRequest) {
      onInputRequest(title, options, type);
    } else {
      console.error("No input request handler available");
    }
    // Create a promise that will be resolved when the input is received
    const inputPromise = new Promise<z.infer<T>>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    return inputPromise;
  };

  const resolveInput = (value: string) => {
    if (!inputType) {
      console.error("No input type available");
      rejectInput("No input type available");
      return;
    }
    const parsed_value = inputType.parse(value);
    if (resolvePromise) {
      resolvePromise(parsed_value);
    } else {
      console.error("No promise callback available");
    }
  };

  const rejectInput = (reason: any) => {
    if (rejectPromise) {
      rejectPromise(reason);
    } else {
      console.error("No promise callback available");
    }
  };

  return {
    requestUserInput,
    useInputState: (
      handler: InputRequestCallback
    ): [
      resolveInput: (value: string) => void,
      rejectInput: (error: any) => void
     ] => {
      onInputRequest = handler;
      return [resolveInput, rejectInput] as const;
    },
  };
}
