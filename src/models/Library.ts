import { Book } from './Book';

export class Library {
    private books: Book[] = [];
  
    constructor(initialBooks: Book[] = []) {
      this.books = initialBooks.slice();
    }
  
    addBook(book: Book): void {
      if (this.books.some((b) => b.id === book.id)) {
        throw new Error(`Book with id ${book.id} already exists.`);
      }
      this.books.push(book);
    }
  
    removeBook(id: number): boolean {
      const before = this.books.length;
      this.books = this.books.filter((b) => b.id !== id);
      return this.books.length < before;
    }
  
    listBooks(): Book[] {
      return this.books.slice();
    }
  
    searchRecursive(query: string): Book[] {
      const normalized = query.trim().toLowerCase();
      const results: Book[] = [];
  
      const recurse = (arr: Book[], idx: number) => {
        if (idx >= arr.length) return;
        const b = arr[idx];
        if (b.title.toLowerCase().includes(normalized) || b.author.toLowerCase().includes(normalized)) {
          results.push(b);
        }
        recurse(arr, idx + 1);
      };
  
      recurse(this.books, 0);
      return results;
    }
  
    async saveAsync(): Promise<string> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`Saved ${this.books.length} books at ${new Date().toISOString()}`);
        }, 1000);
      });
    }
  }