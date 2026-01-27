import { RangePicker } from './components/RangePicker'

function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 p-4">
            <div className="max-w-2xl w-full">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                        Timezone-Safe Range Picker
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Hand-rolled calendar grid with DST-safe logic and full ARIA support.
                    </p>
                </header>

                <section className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center">
                    <div className="w-full max-w-sm">
                        <label className="block text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mb-3 ml-1">
                            Select Booking Window
                        </label>
                        <RangePicker
                            constraints={{
                                minDurationMinutes: 30,
                                maxDurationMinutes: 10080 // 1 week
                            }}
                        />
                    </div>

                </section>

            </div>
        </div>
    )
}

export default App
