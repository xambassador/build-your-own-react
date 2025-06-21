export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  description: string;
  tags: string[];
}

export interface Filter {
  status: "all" | "active" | "completed";
  priority: "all" | "low" | "medium" | "high";
  search: string;
}

export interface ThemeSettings {
  mode: "light" | "dark";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
}
