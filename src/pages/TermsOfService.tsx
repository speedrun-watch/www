import { Link } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const TermsOfService = () => {
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
                        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                        <p className="text-gray-400 mb-8">Last Updated: November 14, 2025</p>

                        <div className="space-y-6 text-gray-300">
                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                                <p>
                                    By using speedrun.watch (the "Bot"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Bot.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
                                <p>
                                    speedrun.watch is a Discord bot that provides automated notifications about speedruns from speedrun.com. The Bot allows users to:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Link Discord channels to specific games</li>
                                    <li>Receive notifications for new speedrun submissions</li>
                                    <li>Track world records and top placements</li>
                                    <li>Configure notification preferences</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">3. User Responsibilities</h2>
                                <p className="mb-2">You agree to:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Use the Bot in compliance with Discord's Terms of Service and Community Guidelines</li>
                                    <li>Not attempt to disrupt, damage, or interfere with the Bot's functionality</li>
                                    <li>Not use the Bot for any illegal or unauthorized purposes</li>
                                    <li>Only configure the Bot in Discord servers where you have appropriate permissions</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">4. Bot Permissions</h2>
                                <p>
                                    The Bot requires the following Discord permissions to function properly:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Read Messages - to understand configuration commands</li>
                                    <li>Send Messages - to post speedrun notifications</li>
                                    <li>Embed Links - to format notifications with rich content</li>
                                    <li>Read Message History - to verify channel access</li>
                                </ul>
                                <p className="mt-2">
                                    These permissions are necessary for the Bot's core functionality and will not be used for any other purposes.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">5. Data Usage</h2>
                                <p>
                                    The Bot collects and stores minimal data necessary to provide its services, including:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Discord server IDs and channel IDs where the Bot is installed</li>
                                    <li>Game and notification preferences configured by server administrators</li>
                                </ul>
                                <p className="mt-2">
                                    For more information about data handling, please see our <Link to="/privacy-policy" className="text-discord-blurple hover:underline">Privacy Policy</Link>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">6. Service Availability</h2>
                                <p>
                                    We strive to maintain high availability of the Bot, but we do not guarantee uninterrupted service. The Bot may be temporarily unavailable due to:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Scheduled maintenance</li>
                                    <li>Technical issues or outages</li>
                                    <li>Updates or improvements to the service</li>
                                    <li>Issues with third-party services (Discord, speedrun.com)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
                                <p>
                                    The Bot is provided "as is" without any warranties, express or implied. We are not liable for:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Any damages arising from the use or inability to use the Bot</li>
                                    <li>Accuracy or completeness of speedrun data from third-party sources</li>
                                    <li>Missed notifications or delayed updates</li>
                                    <li>Any actions taken based on information provided by the Bot</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">8. Changes to Terms</h2>
                                <p>
                                    We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the Bot after changes constitutes acceptance of the modified terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">9. Termination</h2>
                                <p>
                                    We reserve the right to terminate or suspend access to the Bot at any time, without prior notice, for any reason, including breach of these Terms of Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">10. Third-Party Services</h2>
                                <p>
                                    The Bot integrates with third-party services including Discord and speedrun.com. Your use of the Bot is also subject to the terms and policies of these services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-3">11. Contact</h2>
                                <p>
                                    If you have questions about these Terms of Service, please contact us through our Discord support server or via the contact information provided on our website.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsOfService;
