export async function fetchNotes({ tag }: { tag: string }) {
  const url = tag === "all" ? `/api/notes` : `/api/notes?tag=${tag}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Не зміг отримати нотатки");
  }

  return res.json();
}
