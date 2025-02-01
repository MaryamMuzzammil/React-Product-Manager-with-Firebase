import './Product.css'
import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "./loader";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from '../Firebase/config';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";


const ProductList = () => {
    const [products, setProducts] = useState([]);

    const getProductData = async () => {
        try {
            const res = await getDocs(collection(db, 'products'));
            const productArray = res.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productArray);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProductData();
    }, []);
   
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "products", id));
            setProducts(products.filter((product) => product.id !== id));
            toast.success("Product successfully deleted");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };
    return (
        <>
            <Link className="addbtn" to="/createproducts">Add Products</Link>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.discription}</td>
                            <td>{item.price}</td>
                            <td>
                                <button className="action_btn" onClick={() => handleDelete(item.id)} style={{ background: "red" }}>Delete</button>
                                <Link
                                    className="action_btn"
                                    to={`/createproducts/${item.id}`}
                                     // Pass item.id to the handler
                                    style={{ background: "rgb(255, 255, 11)" }}
                                >Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
export default ProductList;