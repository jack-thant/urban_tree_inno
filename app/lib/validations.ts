import { z } from "zod";

export const plantTreeFormSchema = z.object({
    numberOfTrees: z.number(
        { required_error: "Please input a valid number."}
    ).gt(0).int().nonnegative().safe(),
    trunkSize: z.number(
        { required_error: "Please input a valid number."}
    ).gt(0).nonnegative().safe(),
    treeSpecies: z.string(),
    treeCondition: z.string(),
})