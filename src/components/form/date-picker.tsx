import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { Hook, DateOption } from "flatpickr/dist/types/options";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const picker = flatpickr(inputRef.current, {
      mode,
      monthSelectorType: "static",
      dateFormat: "d-m-Y",
      defaultDate,
      onChange,
    });

    return () => {
      picker.destroy();
    };
  }, [mode, onChange, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className="
  h-11 w-full rounded-lg border px-4 py-2.5 text-sm
  bg-white text-gray-900 placeholder:text-gray-500
  border-gray-300 shadow-theme-xs
  focus:outline-none focus:ring-3 focus:ring-brand-500/20 focus:border-brand-400

  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/40
  dark:border-gray-700 dark:focus:border-brand-800
"

        />
      </div>
    </div>
  );
}
