export function friendlyAuthError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/invalid-email":
      return "Please enter a valid email.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    default:
      return error.message || "Something went wrong.";
  }
}