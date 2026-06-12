/**
 * Converts a match time string (e.g. "15:00 UTC-4") to UTC-6 display string.
 * Returns "HH:MM" in UTC-6.
 */
export function convertToUTC6(timeStr: string): string {
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s+UTC([+-]\d+)$/)
  if (!m) return timeStr.split(' ')[0] ?? timeStr

  const localH = parseInt(m[1])
  const localMin = parseInt(m[2])
  const offset = parseInt(m[3]) // e.g. -4, -6, -7

  // Total minutes in local time
  const localMinutes = localH * 60 + localMin

  // Convert to UTC: utc = local - offset  (UTC-4 means local = UTC - 4, so UTC = local + 4)
  const utcMinutes = localMinutes - offset * 60

  // Convert to UTC-6
  let utc6Minutes = utcMinutes + (-6) * 60

  // Normalize to [0, 1440) in case of midnight crossing
  utc6Minutes = ((utc6Minutes % 1440) + 1440) % 1440

  const h = Math.floor(utc6Minutes / 60)
  const min = utc6Minutes % 60

  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}
