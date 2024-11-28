import { z } from 'zod';


export const AddProjectRequestBodySchema = z.object({
    name: z.string().min(1,'project name is requied.'),
    description: z.string().optional()
});