const validateName = name => /^[a-z]+$/i.test(name);

export default function findNameErrors({ first_name, last_name }) {
  if (first_name.trim().length < 2 || last_name.trim().length < 2) {
    return 'Your name and surname should be at least 2 letters long';
  }

  if (!validateName(first_name) || !validateName(last_name)) {
    return 'Only latin letters (A-Z) (a-z) are allowed for your name and surname';
  }

  return '';
}
