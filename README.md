# 🛒 Shopping Cart App

A modern, full-featured shopping cart web application built with React, Redux Toolkit, and Vite. This project demonstrates best practices in state management, API integration, authentication, and responsive UI design.

## Features

- User authentication (login, register, demo accounts)
- Product listing with search, filter, and pagination
- Product detail pages with image gallery and stock status
- Add to cart, update quantity, and remove items
- Persistent cart (localStorage)
- Admin-only product addition
- Protected routes for authenticated and admin users
- Loading spinners and error handling
- Responsive, modular UI with CSS Modules
- Code-splitting and lazy loading for fast performance

## Tech Stack

- **Frontend:** React, React Router, Redux Toolkit, Vite
- **State Management:** Redux Toolkit (Slices, Thunks)
- **API:** DummyJSON (mock REST API)
- **Styling:** CSS Modules
- **Icons:** Lucide React

## Getting Started

1. **Clone the repository:**
	 ```bash
	 git clone <your-repo-url>
	 cd shopping-cart
	 ```
2. **Install dependencies:**
	 ```bash
	 npm install
	 ```
3. **Run the development server:**
	 ```bash
	 npm run dev
	 ```
4. **Open in your browser:**
	 Visit [http://localhost:5173](http://localhost:5173)

## Demo Credentials

- **Admin:**
	- Username: `admin`
	- Password: `admin123`
- **Client:**
	- Username: `client`
	- Password: `client123`

## Project Structure

```
shopping-cart/
	src/
		components/
		hooks/
		Pages/
		redux/
		routes/
		services/
		utils/
	public/
	index.html
	package.json
	vite.config.js
```

## Key Files

- `src/App.jsx` — Main app layout and routing
- `src/redux/` — Redux slices for auth, products, cart
- `src/services/api.js` — Centralized API logic
- `src/Pages/` — All main pages (Login, Register, ProductList, etc.)
- `src/components/` — Reusable UI components

## Customization
- Update API endpoints in `src/utils/constants.js` if needed
- Add more product categories or validation rules as required

## License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ by ellurunanda
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
