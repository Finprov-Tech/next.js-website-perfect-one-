"use client";

import { useState } from "react";
import { ModuleForm } from "@/components/ModuleForm";
import type { ModuleSchema } from "@/lib/moduleSchemas";

type ModuleData = Record<string, unknown> & { id: number | string };

/** Recursive: a "card" is a schema + one data row. If the schema declares
 * itemsKey/itemSchema (e.g. Credentials -> items, Quiz -> questions ->
 * options), each item in data[itemsKey] renders as its own nested card —
 * this is what lets Quiz's two levels of nesting "just work" without a
 * special case. */
export function ModuleCard({ schema, data, nested = false }: { schema: ModuleSchema; data: ModuleData; nested?: boolean; parentId?: number }) {
  const items = schema.itemsKey ? (data[schema.itemsKey] as ModuleData[] | undefined) : undefined;

  return (
    <div className={nested ? "rounded-xl border border-border/70 bg-bg-light/40 p-4" : "rounded-2xl border border-border bg-card p-5 shadow-sm"}>
      <h3 className={nested ? "mb-3 text-sm font-bold text-navy" : "mb-4 text-base font-bold text-navy"}>{schema.title}</h3>
      <ModuleForm endpoint={schema.endpoint} id={data.id} fields={schema.fields} initialData={data} canDelete={schema.canDelete} />

      {items && schema.itemSchema && (
        <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
          <SelectableModuleItems schema={schema.itemSchema} items={items} parentId={Number(data.id)} nested />
        </div>
      )}
    </div>
  );
}

function itemLabel(item: ModuleData, schema: ModuleSchema, index: number): string {
  const preferredFields = ["title", "name", "text", "question_text", "label", "heading", "year_label", "slug"];
  for (const field of preferredFields) {
    const value = item[field];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return `${schema.title} ${index + 1}`;
}

export function SelectableModuleItems({
  schema,
  items,
  parentId,
  nested = false,
}: {
  schema: ModuleSchema;
  items: ModuleData[];
  parentId: number;
  nested?: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string>(() => String(items[0]?.id ?? ""));
  const selected = items.find((item) => String(item.id) === selectedId) ?? items[0];

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-text-body/70">Select {schema.title.toLowerCase()} to edit</label>
          <select
            value={String(selected?.id ?? "")}
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-navy focus:border-cta focus:outline-none"
          >
            {items.map((item, index) => (
              <option key={item.id} value={String(item.id)}>
                {itemLabel(item, schema, index)}
              </option>
            ))}
          </select>
        </div>
      )}

      {selected && <ModuleCard key={selected.id} schema={schema} data={selected} nested={nested} parentId={parentId} />}

      {schema.canCreate && schema.parentField && (
        <details className="rounded-xl border border-dashed border-cta/40 bg-card p-4">
          <summary className="cursor-pointer text-sm font-bold text-cta">Add {schema.title.toLowerCase()}</summary>
          <div className="mt-4">
            <ModuleForm endpoint={schema.endpoint} fields={schema.fields} initialData={{}} parentField={schema.parentField} parentId={parentId} />
          </div>
        </details>
      )}
    </div>
  );
}
