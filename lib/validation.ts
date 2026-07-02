export function validateName(name: string) {
  return name.trim().length >= 2;
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateExperience(experience: string) {
  return experience.trim().length >= 10;
}