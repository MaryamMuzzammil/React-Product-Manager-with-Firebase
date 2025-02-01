import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../Firebase/config";
import { setDoc, getDocs, collection, doc, getDoc, updateDoc } from "firebase/firestore";

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        discription: "",  // Fixed spelling mistake
        price: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    
    const productCollectionRef = collection(db, "products");

    useEffect(() => {
        const getProductByID = async () => {
            if (params.id) {
                const docRef = doc(db, "products", params.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    toast.error("Product not found!");
                    navigate("/products");
                }
            }
        };

        getProductByID();
    }, [params.id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.discription || !formData.price) {
            toast.error("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            if (params.id) {
                // Update existing product
                const docRef = doc(db, "products", params.id);
                await updateDoc(docRef, formData);
                toast.success("Product updated successfully!");
            } else {
                // Fetch all products to determine the last used ID
                const querySnapshot = await getDocs(productCollectionRef);
                let maxId = 0;

                querySnapshot.forEach((doc) => {
                    const docId = parseInt(doc.id);
                    if (!isNaN(docId) && docId > maxId) {
                        maxId = docId;
                    }
                });

                const newId = (maxId + 1).toString(); // Next ID

                // Add new product with numeric ID
                await setDoc(doc(db, "products", newId), formData);
                toast.success("Product added successfully!");
            }
            navigate("/products");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2>{params.id ? "Edit Product" : "Create Product"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        onChange={handleInputChange}
                        name="name"
                        value={formData.name}
                    />
                    <label>Description</label>
                    <input
                        type="text"
                        onChange={handleInputChange}
                        name="discription"
                        value={formData.discription}
                    />
                    <label>Price</label>
                    <input
                        type="text"
                        onChange={handleInputChange}
                        name="price"
                        value={formData.price}
                    />
                </div>
                <div>
                    <input
                        type="submit"
                        value={loading ? "Submitting..." : "Submit"}
                        disabled={loading}
                    />
                </div>
            </form>
        </>
    );
};

export default CreateProduct;
