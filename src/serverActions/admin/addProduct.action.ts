"use server";

export async function addProduct(state: any, formData: FormData) {
    try {
        const pName = formData.get("productName");
        const pPrice = formData.get("productPrice");
        const fCategories = formData.getAll("frameCategories");
        const fColors = formData.getAll("frameColors");
        const collections = formData.getAll("collections");
        const width = formData.get("width");
        const height = formData.get("height");

        // SECURITY: Ensure that the file is an image
        const productImage = formData.get("productImage") as File;
        const imgBuffer = await productImage
            .arrayBuffer()
            .then((buffer) => {
                return buffer;
            })
            .catch((err) => {
                return null;
            });

        // IMPORTANT: Validate the form data

        // LATER: Save the product to the database
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        console.log({
            pName,
            pPrice,
            fCategories,
            fColors,
            collections,
            width,
            height,
            productImage,
        });
    } catch (err) {}

    return state;
}
