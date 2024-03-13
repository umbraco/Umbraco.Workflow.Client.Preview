import { SortDirection } from "@umbraco-workflow/enums";

export class Sorter {
  sortBy: string;
  sortDirections: Record<string, SortDirection> = {};
  callback: VoidFunction;

  constructor(
    callback: VoidFunction,
    sortBy = "completedDate",
    sortDirection = SortDirection.ASC
  ) {
    this.sortBy = sortBy;
    this.sortDirections[this.sortBy] = sortDirection;

    this.callback = callback;
  }

  setDirection(sortDirection: SortDirection) {
    this.sortDirections[this.sortBy] = sortDirection;
  }

  setSortBy(sortBy: string) {
    this.sortBy = sortBy;
  }

  update(sortBy: string) {
    this.sortBy = sortBy;

    this.sortDirections[sortBy] =
      this.sortDirections[sortBy] === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    this.callback();
  }

  get sortDirectionString(): string {
    return this.sortDirections[this.sortBy] === SortDirection.ASC
      ? "asc"
      : "desc";
  }
}
