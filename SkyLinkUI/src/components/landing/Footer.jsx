const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-base text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} SkyLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
