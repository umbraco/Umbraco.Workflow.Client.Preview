/**
 * Defaults to pageNumber = 1, totalPages = 0, perPage = 10
 * Pass a function to the constructor to use as the goToPage callback
 * goToPage manages setting the page number before executing the callback
 * */
export class Pagination {
  current = 1;
  totalItems = 0;

  #defaultTake = 10;
  #take = this.#defaultTake;

  get take(): number {
    return this.#take;
  }

  set take(value: number | undefined) {
    this.#take = value ?? this.#defaultTake;
  }

  change: (page: number) => void;

  constructor(cb: VoidFunction, perPage?: number) {
    this.take = perPage ?? this.#defaultTake;

    this.change = (page: number) => {
      if (this.current === page) return;

      this.current = page;
      cb();
    };
  }

  get skip() {
    return (this.current - 1) * this.take;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.take);
  }
}
