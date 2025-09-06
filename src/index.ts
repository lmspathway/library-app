import readline from 'readline';
import { Library } from './models/Library';
import { Book } from './models/Book';

const initial = [
  new Book(1, 'Clean Code', 'Robert C. Martin', 2008),
  new Book(2, 'The Pragmatic Programmer', 'Dave Thomas', 1999),
  new Book(3, 'You Don\'t Know JS', 'Kyle Simpson', 2015),
];

const library = new Library(initial);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer));
  });
}

function showHelp() {
  console.log('\nLibrary CLI - commands:');
  console.log('  list                 - list all books');
  console.log('  add                  - add a new book');
  console.log('  remove <id>          - remove a book by id');
  console.log('  search <query>       - search books by title or author');
  console.log('  save                 - simulate async save');
  console.log('  help                 - show this help');
  console.log('  exit                 - quit the program\n');
}

function printBooksRecursive(books: Book[], idx = 0): void {
  if (idx >= books.length) return;
  const b = books[idx];
  console.log(`  [${b.id}] ${b.title} — ${b.author} (${b.year})`);
  printBooksRecursive(books, idx + 1);
}

async function handleAdd() {
  try {
    const idStr = await question('Enter numeric id: ');
    const id = Number(idStr.trim());
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid id.');

    const title = (await question('Enter title: ')).trim();
    if (!title) throw new Error('Title cannot be empty.');

    const author = (await question('Enter author: ')).trim();
    if (!author) throw new Error('Author cannot be empty.');

    const yearStr = (await question('Enter year: ')).trim();
    const year = Number(yearStr);
    if (!Number.isInteger(year) || year <= 0) throw new Error('Invalid year.');

    const book = new Book(id, title, author, year);
    library.addBook(book);
    console.log('Book added successfully.');
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error adding book: ${err.message}`);
    }
  }
}

async function main() {
  console.log('Welcome to the TypeScript Book Library!');
  showHelp();

  while (true) {
    const raw = (await question('> ')).trim();
    const [cmd, ...rest] = raw.split(/\s+/);

    if (!cmd) continue;

    if (cmd === 'help') {
      showHelp();
    } else if (cmd === 'list') {
      const books = library.listBooks();
      if (books.length === 0) console.log('No books in library.');
      else printBooksRecursive(books);
    } else if (cmd === 'add') {
      await handleAdd();
    } else if (cmd === 'remove') {
      const id = Number(rest[0]);
      if (!Number.isInteger(id)) {
        console.log('Provide a numeric id.');
      } else {
        console.log(library.removeBook(id) ? 'Book removed.' : 'Book not found.');
      }
    } else if (cmd === 'search') {
      const query = rest.join(' ');
      const results = library.searchRecursive(query);
      if (results.length === 0) console.log('No matches.');
      else printBooksRecursive(results);
    } else if (cmd === 'save') {
      console.log(await library.saveAsync());
    } else if (cmd === 'exit') {
      console.log('Goodbye!');
      break;
    } else {
      console.log('Unknown command. Type \"help\" for commands.');
    }
  }

  rl.close();
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    rl.close();
  });
}