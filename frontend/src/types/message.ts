export type Message = {
  id: number;
  content: string;
  created_at: string;
  updated_at?: string;
}

export type CreateMessageRequest = {
  content: string;
}



