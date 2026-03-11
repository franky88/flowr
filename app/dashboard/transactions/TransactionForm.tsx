"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useArithmeticInput } from "@/hooks/useArithmeticInput";
import { useCategorySuggestion } from "@/hooks/useCategorySuggestion";
import { Sparkles, X } from "lucide-react";
import { useMemo } from "react";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      "Amount must be greater than 0",
    ),
  account: z.string().min(1, "Account is required"),
  category: z.string().min(1, "Category is required"),
  note: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof schema>;

function toInputDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

type FlatCat = { id: string; name: string; level: number };

export default function TransactionForm({
  mode,
  accounts,
  categoriesForSelect,
  defaultValues,
  onSubmit,
  submitLabel,
  serverError,
}: {
  mode: "create" | "edit";
  accounts: Account[];
  categoriesForSelect: FlatCat[];
  defaultValues?: Partial<TransactionFormValues> & { date?: string | Date };
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
  submitLabel?: string;
  serverError: string | undefined;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: defaultValues?.date ? toInputDate(defaultValues.date) : "",
      type: defaultValues?.type ?? "expense",
      amount: defaultValues?.amount ?? "",
      account: defaultValues?.account ?? "",
      category: defaultValues?.category ?? "",
      note: defaultValues?.note ?? "",
    },
  });

  const noteValue = watch("note") ?? "";
  const typeValue = watch("type") ?? "expense";
  const categoryValue = watch("category") ?? "";

  const {
    suggestedId,
    loading: suggestLoading,
    dismiss,
  } = useCategorySuggestion(
    noteValue,
    typeValue,
    categoriesForSelect,
    categoryValue,
  );

  const suggestedCategory = useMemo(() => {
    if (!suggestedId) return null;
    const stack: string[] = [];
    for (const cat of categoriesForSelect) {
      stack.splice(cat.level);
      stack.push(cat.name);
      if (cat.id === suggestedId) {
        return { id: cat.id, name: stack.join(" > ") };
      }
    }
    return null;
  }, [suggestedId, categoriesForSelect]);

  console.log("Categories for select:", categoriesForSelect);

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        if (mode === "create") reset();
      })}
      noValidate
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Date</FieldLabel>
          <FieldContent>
            <Input type="date" {...register("date")} />
            <FieldError errors={[errors.date]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Type</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.type]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Amount</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="amount"
            render={({ field }) => {
              const { display, handleChange, handleBlur, handleKeyDown } =
                useArithmeticInput(field.onChange, field.value);
              return (
                <Input
                  inputMode="decimal"
                  placeholder="0.00 or 100+50*2"
                  value={display}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
              );
            }}
          />
          <FieldError errors={[errors.amount]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Account</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="account"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.account]} />
          </FieldContent>
        </Field>

        {/* <Field>
          <FieldLabel>Category</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesForSelect.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {"— ".repeat(c.level)}
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.category]} />
          </FieldContent>
        </Field> */}
        <Field>
          <FieldLabel>Category</FieldLabel>
          <FieldContent>
            {/* Suggestion chip */}
            {suggestedCategory && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  backgroundColor:
                    "color-mix(in oklch, var(--primary) 10%, transparent)",
                  border:
                    "1px solid color-mix(in oklch, var(--primary) 20%, transparent)",
                }}
              >
                <Sparkles className="w-3 h-3 text-primary shrink-0" />
                <span className="text-foreground">
                  Suggested:{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary hover:underline"
                    onClick={() => {
                      setValue("category", suggestedCategory.id);
                      dismiss();
                    }}
                  >
                    {suggestedCategory.name}
                  </button>
                </span>
                <button
                  type="button"
                  onClick={dismiss}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {suggestLoading && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 animate-pulse text-primary" />
                Suggesting category…
              </p>
            )}

            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    dismiss();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesForSelect.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {"— ".repeat(c.level)}
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.category]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Note</FieldLabel>
        <FieldContent>
          <Textarea placeholder="Optional..." {...register("note")} />
          <FieldError errors={[errors.note]} />
        </FieldContent>
      </Field>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {submitLabel ??
          (mode === "edit" ? "Update transaction" : "Add transaction")}
      </Button>
    </form>
  );
}
