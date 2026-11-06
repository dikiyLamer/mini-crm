export function errorMessage(error: unknown): string {
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String(error.message)
      : String(error);
  if (/Invalid login credentials/i.test(message)) return 'Неверный email или пароль.';
  if (/Failed to fetch|NetworkError|fetch failed/i.test(message))
    return 'Не удалось связаться с сервером. Проверьте соединение и повторите попытку.';
  if (/permission denied|row-level security/i.test(message))
    return 'Недостаточно прав. Обновите данные или обратитесь к постановщику.';
  if (/rate limit/i.test(message))
    return 'Слишком много попыток. Подождите немного и попробуйте снова.';
  return message;
}
