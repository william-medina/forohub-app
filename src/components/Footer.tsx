
function Footer() {
    return (
        <div className="bg-gray-900 text-white py-6 mt-14">
            <div className="container mx-auto flex items-center justify-center gap-1 sm-500:gap-2 text-center text-teal-400">
              
                <img className='w-5 h-5 sm-500:w-6 sm-500:h-6 invert-[80%]' src="/icons/laptop-code.svg" alt="Laptop Code Icon" />

                <p className="text-base sm-500:text-lg font-semibold text-gray-300">
                    Developed by <span className="text-teal-400">William Medina</span>
                </p>
            </div>
        </div>
    );
}

export default Footer;
