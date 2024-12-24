import { useState } from "react";
import "../css/AddItemPage.css"; 

function AddItemPage() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("Lost");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {  
        alert("File size should not exceed 5MB.");
        return;
      }
      setImage(file); 
    }
  };

  // Convert the image file to Base64 and remove prefix
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];  
        resolve(base64String);  
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || !description || !location || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const imageBase64 = await toBase64(image);  

    const data = {
      itemName,
      description,
      location,
      status,
      category: "Pending", 
      image: imageBase64,  
    };
    

    setIsSubmitting(true);

    try {
      const response = await fetch("https://uot2hfc9sg.execute-api.us-east-1.amazonaws.com/dev/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Item added successfully!");
        resetForm(); 
      } else {
        alert(result.message || "Failed to add item.");
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("There was an error submitting the item.");
    }

    setIsSubmitting(false);
  };

  const resetForm = () => {
    setItemName("");
    setDescription("");
    setLocation("");
    setImage(null);
    setStatus("Lost");
  };

  return (
    <div className="add-item-page">
      <div className="hero">
        <h1>Report Item</h1>
      </div>

      <div className="divider">
        <form onSubmit={handleSubmit} className="add-item-form">
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where was the item found/lost?"
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemPage;
