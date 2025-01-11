import { useState, useEffect } from "react";
import styles from "./App.module.css";

interface Item {
  text: string;
  completed: boolean;
  quantity: number;
}

function App() {
  const [items, setItems] = useState<Item[]>(() => {
    const savedItems = localStorage.getItem("shoppingList");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1); // Track quantity input
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (inputValue.trim() === "") {
      setErrorMessage("Please enter a valid item.");
    } else {
      const existingItemIndex = items.findIndex(item => item.text === inputValue);

      if (existingItemIndex !== -1) {
        // If the item already exists, update its quantity
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += quantity;
        setItems(updatedItems);
        setStatusMessage("Item quantity updated.");
      } else {
        // If the item doesn't exist, add a new item
        const newItem = { text: inputValue, completed: false, quantity };
        setItems([...items, newItem]);
        setStatusMessage("New item added.");
      }

      setInputValue("");
      setQuantity(1); // Reset quantity input
      setErrorMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const editItem = (index: number) => {
    setEditingIndex(index);
    setInputValue(items[index].text);
    setQuantity(items[index].quantity); // Set quantity for editing
  };

  const toggleComplete = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  const deleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    setStatusMessage("Item deleted.");
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`}>
      <h1 className={styles.header}>Shopping List</h1>

      <div className={styles.inputGroup}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add an item..."
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          placeholder="Quantity"
        />
        <button onClick={addItem}>
          {editingIndex !== null ? "Edit" : "Add"}
        </button>
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

      <div className={styles.filter}>
        <label>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
          Show completed items
        </label>
      </div>

      <ul className={styles.list}>
        {items.length === 0 && <p className={styles.emptyMessage}>List is empty</p>}

        {items
          .filter((item) => showCompleted || !item.completed)
          .map((item, index) => (
            <li
              key={index}
              className={`${styles.listItem} ${item.completed ? styles.completed : ""}`}
            >
              <span>{item.text} (x{item.quantity})</span>
              <button onClick={() => editItem(index)}>Edit</button>
              <button onClick={() => deleteItem(index)}>Delete</button>
              <button onClick={() => toggleComplete(index)}>
                {item.completed ? "Undo" : "Complete"}
              </button>
            </li>
          ))}
      </ul>

      <button className={styles.toggleTheme} onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

export default App;
