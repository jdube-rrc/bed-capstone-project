import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { generateSwaggerSpec } from "./swaggerOptions";

const setupSwagger = (app: Express): void => {
    const specs = generateSwaggerSpec();
    // swaggerUi.serve and swaggerUi.setup have types that don't align cleanly with
    // Express' overloaded `use` signatures in some TypeScript versions. Cast to `any`
    // to avoid the overload mismatch while still registering the middleware.
    app.use('/api-docs', (swaggerUi.serve as any), (swaggerUi.setup(specs) as any));
};

export default setupSwagger;
