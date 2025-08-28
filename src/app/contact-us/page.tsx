export default function ContactPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-28 mb-10">
            <h1 className="font-amandine text-3xl font-bold text-center text-black mb-4">
                Contact Us
            </h1>
            <p className="text-center text-gray-600 mb-8">
                We'd love to hear from you! Please fill out the form below, and we'll get
                back to you as soon as possible.
            </p>
            <form action="/api/contact" method="POST" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
}