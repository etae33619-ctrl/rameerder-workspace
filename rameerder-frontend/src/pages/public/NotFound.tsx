// import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";

export function NotFound() {
  return (
    <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-brand-blue mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-brand-navy mb-2">Page not found</h2>
      <p className="text-brand-muted mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>Return to Home</Button>
      </Link>
    </Container>
  );
}