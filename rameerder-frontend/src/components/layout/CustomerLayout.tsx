// import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}