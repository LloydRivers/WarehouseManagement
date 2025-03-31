### **Roughing Out the Warehouse System in English**

---

## **1️⃣ The Warehouse Starts Empty**

- When I first set up my warehouse, it's completely empty.
- I need a way to **add products** to the system.

## **2️⃣ I Need to Source Products from Suppliers**

- I want to **buy products from multiple suppliers**.
- Some products are specific to one industry (e.g., **rubber for manufacturing**).
- Others are used across multiple industries (e.g., **concrete for both construction and manufacturing**).
- I should be able to:  
  ✅ Choose **which supplier to buy from** based on price, availability, or lead time.  
  ✅ See a **history of past orders** with each supplier.  
  ✅ Track **expected deliveries**.

🔹 **Key Decision:**  
✅ **Products should not track a single supplier directly**. Instead, a **Supplier Service** should manage relationships between products and suppliers.

---

## **3️⃣ I Sell Products to Customers**

- Customers place orders for **one or more products**.
- An order should:  
  ✅ Deduct stock from my warehouse.  
  ✅ Mark itself as **PENDING**, **PROCESSED**, **SHIPPED**, or **CANCELLED**.  
  ✅ Track which customer ordered what.  
  ✅ Generate an **invoice** (future feature?).

---

## **4️⃣ I Manage Stock Levels**

- I don’t want to **run out of stock**, so I need to:  
  ✅ Track stock levels for each product.  
  ✅ Get an **alert** when stock is low.  
  ✅ Automatically place a **purchase order** with a supplier when stock is below the threshold.

🔹 **Key Decision:**  
✅ **Inventory Service** will handle stock updates and low stock alerts.

---

## **5️⃣ I Want to See My Finances**

- I need to know:  
  ✅ How much I have **spent on purchases**.  
  ✅ How much revenue I have made from **sales**.  
  ✅ If I am making a **profit or a loss**.

🔹 **Key Decision:**  
✅ **Financial Service** will track transactions and generate reports.

---

## **6️⃣ Events That Need to Happen Automatically**

- When a **customer places an order**, stock should be updated.
- When **stock runs low**, a purchase order should be created.
- When a **supplier delivers inventory**, stock should be updated.

🔹 **Key Decision:**  
✅ **Event Bus (Pub/Sub)** will connect these services together.

---

## **High-Level System Flow**

1️⃣ **Warehouse starts empty**.  
2️⃣ **Admin adds products & suppliers**.  
3️⃣ **Products are stocked by ordering from suppliers**.  
4️⃣ **Customers place orders**.  
5️⃣ **Orders deduct stock**.  
6️⃣ **Low stock triggers new purchase orders**.  
7️⃣ **Deliveries restock the warehouse**.  
8️⃣ **Finances track all transactions**.

---
