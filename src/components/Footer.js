import React from 'react';
// Removed the 'Link' import which caused the warning
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

/**
 * A minimal, dark-themed footer component with centered social icons and copyright.
 */
const Footer = () => {
    // Get the current year dynamically
    const currentYear = new Date().getFullYear();

    // Define the list of social media icons and placeholder links
    const socialLinks = [
        { icon: FaFacebookF, label: "Facebook", href: "www.google.com" },
        { icon: FaTwitter, label: "Twitter", href: "/#" },
        { icon: FaGoogle, label: "Google", href: "/#" },
        { icon: FaInstagram, label: "Instagram", href: "/#" },
        { icon: FaLinkedinIn, label: "LinkedIn", href: "/#" },
        { icon: FaGithub, label: "GitHub", href: "/#" },
    ];

    return (
        <>
            <footer className="app-footer-minimal">
                
                {/* Top Section: Social Icons */}
                <div className="footer-social-section">
                    <div className="social-icons-list">
                        {socialLinks.map((item, index) => (
                            <a 
                                key={index} 
                                href={item.href} 
                                aria-label={item.label} 
                                className="social-icon-circle"
                            >
                                <item.icon />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom Section: Copyright */}
                <div className="footer-copyright-section">
                    <p className="footer-copyright-text">
                        © {currentYear} Copyright: Sss Autowork Garage.com
                    </p>
                </div>
            </footer>

            {/* --- Inline CSS for the Minimal Footer --- */}
            <style jsx>{`
                /* General dark background for the whole footer */
                .app-footer-minimal {
                    /* Dark Gray */
                    background-color: #3b424a; 
                    color: #ffffff; 
                    margin-top: 40px; 
                    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
                }
                
                /* Dark Mode compatibility (optional, since it's already dark) */
                body.dark-theme .app-footer-minimal {
                    background-color: #2c313a; /* Slightly adjusted dark color for contrast */
                }

                /* --- Social Icons Section --- */
                .footer-social-section {
                    padding: 30px 20px;
                    text-align: center;
                }

                .social-icons-list {
                    display: flex;
                    justify-content: center;
                    gap: 15px; /* Spacing between icons */
                }

                .social-icon-circle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                    color: #ffffff; /* White icon color */
                    text-decoration: none;
                    
                    /* Border to create the circle look */
                    border: 1px solid rgba(255, 255, 255, 0.6); 
                    border-radius: 50%;
                    transition: all 0.2s ease-in-out;
                }

                .social-icon-circle:hover {
                    /* Invert colors on hover */
                    background-color: #ffffff; 
                    color: #3b424a; /* Dark text on hover */
                    border-color: #ffffff;
                }

                /* --- Copyright Section --- */
                .footer-copyright-section {
                    /* Slightly darker band for the copyright area */
                    background-color: #2c313a; 
                    padding: 15px 20px;
                    text-align: center;
                }
                
                body.dark-theme .footer-copyright-section {
                    background-color: #22262e; /* Even darker in full dark mode */
                }

                .footer-copyright-text {
                    margin: 0;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.7);
                }

                /* --- Mobile Responsiveness --- */
                @media (max-width: 480px) {
                    .footer-social-section {
                        padding: 20px 10px;
                    }
                    .social-icon-circle {
                        width: 36px;
                        height: 36px;
                        font-size: 15px;
                    }
                }
            `}</style>
        </>
    );
};

export default Footer;