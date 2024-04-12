interface DateTimeOptions {
  weekday: string
  timeZone: string
  locale: string
}

export function getCurrentDayName(): string {
  const now = new Date()

  // Define options using the interface
  const options: DateTimeOptions = {
    weekday: 'long',
    timeZone: 'Europe/Kiev',
    locale: 'uk-UA',
  }

  // Format the current date according to the specified options
  const dayName = new Intl.DateTimeFormat(options.locale, options as any)
    .formatToParts(now)
    .find(part => part.type === 'weekday')?.value

  // Capitalize the first letter
  const capitalizedDayName = dayName ? dayName.charAt(0).toUpperCase() + dayName.slice(1) : ''

  return capitalizedDayName
}
