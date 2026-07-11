export const CURRENT_USER = {
  name: 'Marco Figueroa',
  status: 'Cuenta verificada',
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function getFirstName(name: string) {
  return name.split(' ')[0]
}
