import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET(request) {
    try {
        await connectDB();

        // Get all product variants with their attributes
        const variants = await ProductVariantModel.find({ deletedAt: null }).lean();

        // Aggregate all unique attribute keys and their possible values
        const attributesMap = new Map();

        variants.forEach(variant => {
            if (variant.attributes) {
                // Convert Map to object if needed
                const attrs = variant.attributes instanceof Map 
                    ? Object.fromEntries(variant.attributes) 
                    : variant.attributes;

                Object.entries(attrs).forEach(([key, value]) => {
                    if (!attributesMap.has(key)) {
                        attributesMap.set(key, new Set());
                    }
                    attributesMap.get(key).add(value);
                });
            }
        });

        // Convert to array format for frontend
        const attributes = Array.from(attributesMap.entries()).map(([key, values]) => ({
            key,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            values: Array.from(values).sort()
        }));

        return response(true, 200, 'Attributes found.', attributes);

    } catch (error) {
        return catchError(error);
    }
}
