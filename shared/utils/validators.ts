export const getPasswordStrength = (password: string) => {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters long" },
    { regex: /[A-Z]/, text: "One uppercase letter (A-Z)" },
    { regex: /[a-z]/, text: "One lowercase letter (a-z)" },
    { regex: /[0-9]/, text: "One number (0-9)" },
    { regex: /[!@#$%^&*(),.?'":{}|<>]/, text: "At least one special character (!@#$%^&*(),.?'\":{}|<> )" }
  ];

  const results = requirements.map(req => ({ met: req.regex.test(password), text: req.text }));

  return {
    results,
    score: results.filter(req => req.met).length,
    isValid: results.every(req => req.met)
  };
};

export const isValidPasswordCheck = (password: string, passwordCheck: string) => {
  return password === passwordCheck;
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
