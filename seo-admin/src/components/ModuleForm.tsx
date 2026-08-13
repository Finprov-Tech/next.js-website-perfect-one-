"use client";

import { useState } from "react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { FieldSchema } from "@/lib/moduleSchemas";
import { cn } from "@/lib/utils";

type Values = Record<string, string | number | boolean | File | null>;

function pickInitialValues(fields: FieldSchema[], data: Record<string, unknown>): Values {
  const values: Values = {};
  for (const f of fields) {
    if (f.type === "boolean") {
      values[f.name] = data[f.name] == null && f.name === "is_active" ? true : Boolean(data[f.name]);
    } else {
      values[f.name] = (data[f.name] as string | number | null) ?? (f.type === "number" ? 0 : "");
    }
  }
  return values;
}

export function ModuleForm({
  endpoint,
  id,
  fields,
  initialData,
  parentField,
  parentId,
  canDelete = false,
}: {
  endpoint: string;
  id?: number | string;
  fields: FieldSchema[];
  initialData: Record<string, unknown>;
  parentField?: string;
  parentId?: number;
  canDelete?: boolean;
}) {
  const [values, setValues] = useState<Values>(() => pickInitialValues(fields, initialData));
  const [initial] = useState<Values>(() => pickInitialValues(fields, initialData));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const creating = id == null;
  const dirty = creating || fields.some((f) => values[f.name] !== initial[f.name]);

  function setField(name: string, value: string | number | boolean | File | null) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (status !== "idle") setStatus("idle");
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMessage(null);

    const hasImageField = fields.some((f) => f.type === "image");
    let body: BodyInit;
    let headers: Record<string, string> | undefined;

    if (hasImageField) {
      const fd = new FormData();
      for (const f of fields) {
        const v = values[f.name];
        if (f.type === "image") {
          if (v instanceof File) fd.append(f.name, v);
          else if (v === null) fd.append(f.name, "");
          // unchanged existing image (still a URL string) — omit, don't re-send
        } else {
          fd.append(f.name, String(v ?? ""));
        }
      }
      if (creating && parentField && parentId != null) fd.append(parentField, String(parentId));
      body = fd;
    } else {
      body = JSON.stringify(creating && parentField && parentId != null ? { ...values, [parentField]: parentId } : values);
      headers = { "Content-Type": "application/json" };
    }

    try {
      const res = await fetch(creating ? `/api/proxy/${endpoint}` : `/api/proxy/${endpoint}/${id}`, {
        method: creating ? "POST" : "PATCH", body, headers,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(typeof data === "object" && data ? summarizeErrors(data) : "Save failed.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      if (creating) window.location.reload();
    } catch {
      setErrorMessage("Couldn't reach the server.");
      setStatus("error");
    }
  }

  async function handleDelete() {
    if (id == null || !window.confirm("Delete this item? This cannot be undone.")) return;
    setStatus("saving");
    const res = await fetch(`/api/proxy/${endpoint}/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
    else {
      setErrorMessage("Delete failed.");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <Field key={field.name} field={field} value={values[field.name]} onChange={(v) => setField(field.name, v)} />
      ))}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || status === "saving"}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-colors",
            dirty ? "bg-cta text-white hover:bg-cta-hover" : "bg-border text-text-body/50",
          )}
        >
          {status === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {canDelete && id != null && (
          <button type="button" onClick={handleDelete} className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10">
            Delete
          </button>
        )}
        {status === "saved" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
            <TriangleAlert className="h-3.5 w-3.5" /> {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
}

function summarizeErrors(errors: Record<string, unknown>): string {
  const first = Object.entries(errors)[0];
  if (!first) return "Save failed.";
  const [field, messages] = first;
  const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
  return `${field}: ${text}`;
}

/** Same thresholds/behavior as the old admin's seo_counters.js: red when
 * empty or over the max, amber when under the min, green in range. */
export function CharCounter({ length, min, max }: { length: number; min: number; max: number }) {
  const tone = length === 0 || length > max ? "text-destructive" : length < min ? "text-gold" : "text-emerald";
  return (
    <p className={cn("mt-1 text-[11px] font-medium", tone)}>
      {length} characters (recommended {min}–{max})
    </p>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: string | number | boolean | File | null | undefined;
  onChange: (value: string | number | boolean | File | null) => void;
}) {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div>
      {field.type !== "boolean" && (
        <label className="mb-1 block text-xs font-semibold text-text-body/70">{field.label}</label>
      )}
      {field.type === "richtext" && <RichTextEditor value={stringValue} onChange={onChange} />}
      {field.type === "textarea" && (
        <>
          <textarea
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
          />
          {field.counter && <CharCounter length={stringValue.length} min={field.counter.min} max={field.counter.max} />}
        </>
      )}
      {field.type === "text" && (
        <>
          <input
            type="text"
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
          />
          {field.counter && <CharCounter length={stringValue.length} min={field.counter.min} max={field.counter.max} />}
        </>
      )}
      {field.type === "boolean" && (
        <label className="flex items-center gap-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-cta"
          />
          {field.label}
        </label>
      )}
      {field.type === "number" && (
        <input
          type="number"
          min={0}
          max={field.name === "rating" ? 5 : undefined}
          value={typeof value === "number" ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
        />
      )}
      {field.type === "select" && (
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {field.type === "image" && (
        <div className="flex items-center gap-3">
          {typeof value === "string" && value && (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="h-12 w-12 rounded-lg border border-border object-cover" />
              <button type="button" onClick={() => onChange(null)} className="text-xs font-semibold text-destructive hover:underline">
                Remove
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            className="text-xs text-text-body"
          />
        </div>
      )}
    </div>
  );
}
