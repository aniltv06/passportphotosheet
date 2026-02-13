export interface EditorState {
  zoom: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  panX: number;
  panY: number;
  backgroundColor: string;
}

export class UndoRedoManager {
  private history: EditorState[] = [];
  private currentIndex: number = -1;
  private maxHistory: number = 50;

  saveState(state: EditorState): void {
    // Remove any states after current index
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new state
    this.history.push({ ...state });
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo(): EditorState | null {
    if (!this.canUndo()) return null;
    
    this.currentIndex--;
    return { ...this.history[this.currentIndex] };
  }

  redo(): EditorState | null {
    if (!this.canRedo()) return null;
    
    this.currentIndex++;
    return { ...this.history[this.currentIndex] };
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  getCurrentState(): EditorState | null {
    if (this.currentIndex < 0) return null;
    return { ...this.history[this.currentIndex] };
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  getHistoryInfo(): { current: number; total: number } {
    return {
      current: this.currentIndex + 1,
      total: this.history.length,
    };
  }
}
