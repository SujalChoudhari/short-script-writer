import React from 'react';

function Footer() {
    return (
        <footer className=" text-white w-full py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold">Short Script Writer</h2>
                    <p className="text-sm mt-2">Create short 30-sec scripts for Reels and TikTok<br /> based on trending topics</p>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                    <p className="text-sm mb-2 md:mb-0 md:mr-4">Developed by Sujal Choudhari</p>
                    <a href="https://github.com/SujalChoudhari/short-script-writer" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        ⭐ on GitHub
                    </a>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4">
                <p className="text-center text-xs text-gray-500">© {new Date().getFullYear()} Sujal Choudhari. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
