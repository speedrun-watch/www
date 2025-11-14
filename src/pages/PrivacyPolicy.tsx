import { Link } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-discord-darker text-white flex flex-col">
            {/* Header */}
            <header className="bg-discord-dark py-4 border-b border-gray-800">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <Bell className="w-6 h-6 text-discord-blurple" />
                        <span className="text-xl font-bold bg-gradient-to-r from-discord-blurple to-discord-fuchsia bg-clip-text text-transparent">
                            speedrun.watch
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1">
                <div className="container mx-auto py-8">
                    <Link to="/">
                        <Button
                            variant="ghost"
                            className="mb-6 hover:bg-discord-dark/50"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Button>
                    </Link>

                    <div className="max-w-4xl mx-auto bg-discord-dark rounded-lg p-8">
                        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                        <p className="text-gray-400 mb-8">Last Updated: November 14, 2025</p>

                        <div className="space-y-6 text-gray-300">
                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
                                <p>
                                    This Privacy Policy explains how speedrun.watch ("we", "us", or "the Bot") collects, uses, and protects information when you use our Discord bot. We are committed to protecting your privacy and handling your data responsibly.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>

                                <h3 className="text-xl font-semibold text-white mb-2 mt-4">2.1 Discord User Information</h3>
                                <p className="mb-2">When you interact with the Bot, we collect:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Your Discord User ID</li>
                                    <li>Your Discord username and discriminator</li>
                                    <li>Your Discord avatar (for display purposes in the dashboard)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-2 mt-4">2.2 Discord Server Information</h3>
                                <p className="mb-2">When the Bot is added to a server, we collect:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Server (Guild) ID</li>
                                    <li>Server name and icon</li>
                                    <li>Channel IDs where the Bot is configured</li>
                                    <li>Channel names</li>
                                    <li>User permissions (to determine admin/moderator access)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-2 mt-4">2.3 Configuration Data</h3>
                                <p className="mb-2">We store:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Game preferences (which games are linked to which channels)</li>
                                    <li>Notification settings (what types of notifications to send)</li>
                                    <li>User authentication tokens (encrypted)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-2 mt-4">2.4 Usage Information</h3>
                                <p className="mb-2">We may collect:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Bot commands executed</li>
                                    <li>Dashboard access logs</li>
                                    <li>Error logs and diagnostic information</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
                                <p className="mb-2">We use the collected information to:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Provide and maintain the Bot's core functionality</li>
                                    <li>Send speedrun notifications to configured Discord channels</li>
                                    <li>Authenticate users accessing the dashboard</li>
                                    <li>Allow server administrators to configure notification preferences</li>
                                    <li>Improve the Bot's performance and features</li>
                                    <li>Diagnose and fix technical issues</li>
                                    <li>Prevent abuse and ensure compliance with our Terms of Service</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">4. Data Sharing and Disclosure</h2>
                                <p className="mb-2">We do not sell, trade, or rent your personal information. We may share data only in the following circumstances:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
                                    <li><strong>Service Providers:</strong> With third-party services necessary for the Bot's operation (Discord API, speedrun.com API, hosting providers)</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                                    <li><strong>Server Members:</strong> Information you configure (like game preferences) is visible to other members with appropriate permissions in your Discord server</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">5. Third-Party Services</h2>
                                <p className="mb-2">The Bot integrates with:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li><strong>Discord:</strong> Subject to <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className="text-discord-blurple hover:underline">Discord's Privacy Policy</a></li>
                                    <li><strong>speedrun.com:</strong> We fetch public speedrun data from their API</li>
                                </ul>
                                <p className="mt-2">
                                    These services have their own privacy policies and we are not responsible for their privacy practices.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">6. Data Retention</h2>
                                <p>
                                    We retain your data for as long as:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>The Bot is installed in your Discord server</li>
                                    <li>You maintain an account on our dashboard</li>
                                    <li>Required for legitimate business purposes or legal obligations</li>
                                </ul>
                                <p className="mt-2">
                                    When the Bot is removed from a server, associated configuration data may be retained for a period of 30 days before being permanently deleted.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">7. Data Security</h2>
                                <p>
                                    We implement appropriate technical and organizational measures to protect your data, including:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Encryption of sensitive data in transit and at rest</li>
                                    <li>Secure authentication mechanisms</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Access controls and monitoring</li>
                                </ul>
                                <p className="mt-2">
                                    However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">8. Your Rights</h2>
                                <p className="mb-2">You have the right to:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li><strong>Access:</strong> Request a copy of the data we hold about you</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                                    <li><strong>Deletion:</strong> Request deletion of your data by removing the Bot from your server</li>
                                    <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                                    <li><strong>Objection:</strong> Object to certain data processing activities</li>
                                </ul>
                                <p className="mt-2">
                                    To exercise these rights, please contact us through our support channels.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">9. Children's Privacy</h2>
                                <p>
                                    The Bot is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">10. International Data Transfers</h2>
                                <p>
                                    Your data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">11. Changes to This Privacy Policy</h2>
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify users of significant changes by posting an announcement in servers where the Bot is installed or through our website. Your continued use of the Bot after changes constitutes acceptance of the updated policy.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">12. Contact Us</h2>
                                <p>
                                    If you have questions or concerns about this Privacy Policy or our data practices, please contact us through:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Our Discord support server</li>
                                    <li>The contact form on our website</li>
                                    <li>Email: contact@speedrun.watch</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
