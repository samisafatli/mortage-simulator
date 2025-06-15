# 🏡 **Mortgage Simulator - Home Loan Calculator**  

A simple and powerful mortgage/loan simulator built with **React Native (Expo)** and **TypeScript**. This application helps users calculate their **monthly mortgage payments** based on property price, interest rates, down payments, and loan duration.  

📊 **Supports both fixed-rate and decreasing balance loans.**  

---

## 🚀 **Features**
✅ Simulates mortgage loans with **fixed or decreasing payments**  
✅ Calculates **monthly installments** and **total loan cost**  
✅ Input fields for **property price, down payment, interest rate, and loan term**  
✅ Built with **React Native, Expo Router, and TypeScript**  
✅ (Coming soon) 📈 **Graphical visualization of loan amortization**  

---

## 📦 **Project Structure**
The project is organized as follows:

```
mortgage-simulator/
│── app/                     # Expo Router-based navigation
│   ├── (tabs)/              # Tab navigation screens
│   ├── home.tsx             # Main simulation screen
│   ├── details.tsx          # Loan breakdown screen
│── src/                     # Core application logic
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Loan calculation logic
│── assets/                  # Static assets (images, fonts)
│── tests/                   # Unit and integration tests
│── package.json             # Dependencies
│── tsconfig.json            # TypeScript configuration
│── README.md                # Documentation
```

---

## 📖 **How to Run the Project**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/YOUR-USERNAME/mortgage-simulator.git
cd mortgage-simulator
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start the Project**
```sh
npx expo start
```

You can open the project in:
- 📱 **Expo Go (for quick testing)**
- 📟 **Android Emulator**
- 🍏 **iOS Simulator**

---

## 📊 **Loan Calculation Formula**
The app calculates loan installments using **two different methods**:

### 📌 **Fixed-Rate Loan (Price System)**
This method keeps the monthly payment constant throughout the loan term.

Formula:
\[
A = P \times \frac{i(1+i)^n}{(1+i)^n - 1}
\]
Where:
- \(A\) = Monthly installment  
- \(P\) = Loan principal (property price - down payment)  
- \(i\) = Monthly interest rate (\% annual rate / 12)  
- \(n\) = Total number of payments (years × 12 months)  

### 📌 **Decreasing Balance Loan (SAC System)**
This method reduces the monthly payment over time.

First installment:
\[
A = \frac{P}{n} + (P - \text{paid}) \times i
\]
Where:
- \( P/n \) is the fixed monthly amortization  
- The interest applies only to the remaining balance  

---

## 🛠 **Tech Stack**
- **React Native (Expo)**
- **TypeScript**
- **Expo Router**
- **React Navigation**
- **Jest (for testing)**

---

## 🏗 **Planned Future Features**
- 📑 **Export loan details as a PDF**  
