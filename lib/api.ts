import axios, { type AxiosResponse } from "axios";
import type { Note } from "@/types/note"; // Імпорт замість локального оголошення

export interface NormalizedNotesResponse {
  data: Note[];
  meta: {
    totalItems: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

function normalizeFetchResponse(
  resp: AxiosResponse<{
    notes?: Note[];
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  }>
): NormalizedNotesResponse {
  const {
    notes = [],
    total = notes.length,
    page = 1,
    perPage = notes.length,
    totalPages = 1,
  } = resp.data;

  return {
    data: notes,
    meta: { totalItems: total, page, perPage, totalPages },
  };
}

// Отримати список нотаток
export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<NormalizedNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;

  const query: Record<string, string | number> = { page, perPage };
  if (search) query.search = search;
  if (tag) query.tag = tag;

  const resp = await api.get<{
    notes?: Note[];
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  }>("/notes", { params: query });

  return normalizeFetchResponse(resp);
}

// Отримати одну нотатку по ID
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

// Створити нову нотатку
export async function createNote(
  payload: Pick<Note, "title" | "content" | "tag">
): Promise<Note> {
  const { data } = await api.post<{ note?: Note; data?: Note }>("/notes", payload);
  return data.note ?? data.data!;
}

// Видалити нотатку
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<{ note?: Note; data?: Note }>(`/notes/${id}`);
  return data.note ?? data.data!;
}
