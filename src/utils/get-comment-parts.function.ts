export function getCommentParts(value?: string | null): {
  comment?: string;
  errorMessage?: string;
} {
  if (!value) {
    return {
      comment: undefined,
      errorMessage: undefined,
    };
  }

  const commentParts = (value || "").split(" [");
  const comment = commentParts[0];

  let errorMessage: string | undefined;
  if (commentParts[1]) {
    errorMessage = commentParts[1].slice(0, commentParts[1].lastIndexOf("]"));
  }

  return {
    comment,
    errorMessage,
  };
}
