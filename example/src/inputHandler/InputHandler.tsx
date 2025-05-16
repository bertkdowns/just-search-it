import { useOnInputRequest, useResolveInputRequest } from "just-search-it";
import { Dialog, DialogContent, DialogDescription } from "../components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function InputDialog(){
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [resolve, reject] = useResolveInputRequest();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useOnInputRequest((title, options, _type) => {
    setOpen(true);
    setContent("");
    setTitle(title);
    setOptions(options);
  })

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      reject("input cancelled");
    }
  }, [setOpen, reject]);

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if(!open){
          return;
        }
        if (event.key === "Escape") {
          setOpen(false);
          reject("input cancelled");
        } else if (event.key === "Enter") {
          setOpen(false);
          resolve(content);
        }
      }
      
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [content, open, resolve, reject]);
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Choose from the below options:</DialogDescription>
        <input value={content} onChange={(e) => setContent(e.target.value)}></input>
        <div>
          {options.filter((option) => option.includes(content)).map((option, index) => {
            return (
              <div key={index} className="p-2">
                {option}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}