import { ZodError } from "zod";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues.map((err) => err.message);
      return res
        .status(500)
        .json({ error: "Invalid Request", errors: errorMessage });
    }

    res.status(500).json({ error: "Internal Server Error!" });
  }
};
