export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black shadow-inner mt-auto">
      <div className="w-[90%] mx-auto py-5 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Kitchen Spurs. All rights reserved.
      </div>
    </footer>
  );
}
