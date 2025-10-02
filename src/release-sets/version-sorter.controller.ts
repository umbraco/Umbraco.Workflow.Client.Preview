interface SortableEntity {
  variant?: string | null;
  releaseDate?: string | null;
}

export class WorkflowVersionSorterController {
  groupByCulture<T extends SortableEntity>(
    arr: Array<T>,
    defaultCulture: string
  ) {
    const grouped: Record<string, Array<T>> = arr.reduce((acc, item) => {
      const variant = item.variant ?? defaultCulture;

      if (!acc[variant]) {
        acc[variant] = [];
      }
      acc[variant].push(item);
      return acc;
    }, {});
    
    return grouped;
  }

  sortVersions<T extends SortableEntity>(
    versions: Array<T>,
    defaultCulture: string,
    groupOnly = false
  ): Record<string, Array<T>> {
    const grouped = this.groupByCulture(versions, defaultCulture);

    if (groupOnly) {
      return grouped;
    }

    // Sort keys: defaultCulture first, others alphabetically, 'invariant' last
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (a === defaultCulture) return -1;
      if (b === defaultCulture) return 1;
      return a.localeCompare(b);
    });

    // Sort grouped items by releaseDate, placing items without releaseDate last
    sortedKeys.forEach((key) => {
      grouped[key].sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return a.releaseDate.localeCompare(b.releaseDate);
      });
    });

    // Create a new sorted object
    const sortedResult = {};
    sortedKeys.forEach((key) => {
      sortedResult[key] = grouped[key];
    });

    return sortedResult;
  }
}
