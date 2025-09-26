export default function Footer() {
  return (
    <footer className="bg-yellow-100 text-center py-4 border-t">
      <p className="text-gray-700 text-sm">
        © {new Date().getFullYear()} CarRent. All rights reserved.
      </p>
    </footer>
  );
}
