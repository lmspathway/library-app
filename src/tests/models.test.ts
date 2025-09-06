/**
 * Jest tests for Library functionality.
 */
import { Library } from '../models/Library';
import { Book } from '../models/Book';

describe('Library', () => {
  test('adds and lists books', () => {
    const lib = new Library();
    lib.addBook(new Book(1, 'A', 'Author', 2020));
    expect(lib.listBooks()).toHaveLength(1);
  });
  
  test('removes books', () => {
    const lib = new Library();
    lib.addBook(new Book(1, 'A', 'Author', 2020));
    expect(lib.removeBook(1)).toBe(true);
    expect(lib.listBooks()).toHaveLength(0);
  });

  test('throws when adding duplicate id', () => {
    const lib = new Library();
    lib.addBook(new Book(1, 'A', 'Author', 2020));
    expect(() => lib.addBook(new Book(1, 'B', 'Other', 2021))).toThrow();
  });

  test('recursive search finds correct books', () => {
    const lib = new Library([
      new Book(1, 'Foo Bar', 'Alice', 2010),
      new Book(2, 'Baz', 'Bob', 2011),
    ]);
    const res = lib.searchRecursive('foo');
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
  });

  test('saveAsync resolves with message', async () => {
    const lib = new Library([new Book(1, 'X', 'Y', 2000)]);
    const msg = await lib.saveAsync();
    expect(msg).toContain('Saved');
  });
});
