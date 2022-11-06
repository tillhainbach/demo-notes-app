export function onError(error: any) {
  const message =
    !(error instanceof Error) && error.message
      ? error.message
      : error.toString();

  alert(message);
}
